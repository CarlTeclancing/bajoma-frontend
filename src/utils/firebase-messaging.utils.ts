import { database, ref, onValue, off, set, remove, query, orderByChild, limitToLast, onDisconnect } from '../config/firebase.config';

export interface FirebaseMessage {
  id: string;
  from: number;
  to: number;
  content: string;
  timestamp: number;
  read?: boolean;
  readAt?: number;
  delivered?: boolean;
  createdAt: string;
  senderName?: string;
  senderImage?: string;
}

export interface TypingStatus {
  userId: number;
  timestamp: number;
}

export class FirebaseMessagingService {
  /**
   * Set user as online in Firebase presence
   */
  static setUserOnline(userId: number) {
    const userRef = ref(database, `onlineUsers/${userId}`);
    set(userRef, true);
    // Remove on disconnect (Web SDK v9)
    onDisconnect(userRef).remove();
  }

  /**
   * Set user as offline in Firebase presence
   */
  static setUserOffline(userId: number) {
    const userRef = ref(database, `onlineUsers/${userId}`);
    remove(userRef);
  }

  /**
   * Listen to online status of all users
   */
  static listenToOnlineUsers(callback: (onlineUserIds: Set<number>) => void): () => void {
    const onlineRef = ref(database, 'onlineUsers');
    const unsubscribe = onValue(onlineRef, (snapshot: any) => {
      const onlineUserIds = new Set<number>();
      snapshot.forEach((child: any) => {
        const userId = parseInt(child.key, 10);
        if (!isNaN(userId)) onlineUserIds.add(userId);
      });
      callback(onlineUserIds);
    });
    return () => off(onlineRef, 'value', unsubscribe);
  }

  /**
   * Check if a user is online (one-time)
   */
  static async isUserOnline(userId: number): Promise<boolean> {
    const userRef = ref(database, `onlineUsers/${userId}`);
    return new Promise((resolve) => {
      onValue(userRef, (snapshot: any) => {
        resolve(!!snapshot.val());
      }, { onlyOnce: true });
    });
  }
  /**
   * Get conversation ID between two users
   */
  static getConversationId(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('_');
  }

  /**
   * Listen to messages in a conversation
   */
  static listenToMessages(
    userId1: number,
    userId2: number,
    callback: (messages: FirebaseMessage[]) => void,
    limit: number = 50
  ): () => void {
    const conversationId = this.getConversationId(userId1, userId2);
    const messagesRef = ref(database, `messages/${conversationId}`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(limit));

    const unsubscribe = onValue(messagesQuery, (snapshot: any) => {
      const messages: FirebaseMessage[] = [];
      snapshot.forEach((childSnapshot: any) => {
        messages.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val()
        });
      });
      messages.sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });

    return () => {
      off(messagesRef, 'value', unsubscribe);
    };
  }

  /**
   * Listen to typing status
   */
  static listenToTyping(
    userId1: number,
    userId2: number,
    currentUserId: number,
    callback: (isTyping: boolean) => void
  ): () => void {
    const conversationId = this.getConversationId(userId1, userId2);
    const otherUserId = userId1 === currentUserId ? userId2 : userId1;
    const typingRef = ref(database, `typing/${conversationId}/${otherUserId}`);

    const unsubscribe = onValue(typingRef, (snapshot: any) => {
      const typingData = snapshot.val();
      callback(!!typingData);
    });

    return () => {
      off(typingRef, 'value', unsubscribe);
    };
  }

  /**
   * Update typing status
   */
  static async setTypingStatus(
    userId1: number,
    userId2: number,
    currentUserId: number,
    isTyping: boolean
  ): Promise<void> {
    const conversationId = this.getConversationId(userId1, userId2);
    const typingRef = ref(database, `typing/${conversationId}/${currentUserId}`);

    if (isTyping) {
      await set(typingRef, {
        userId: currentUserId,
        timestamp: Date.now()
      });
    } else {
      await remove(typingRef);
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(
    userId1: number,
    userId2: number,
    currentUserId: number
  ): Promise<void> {
    const conversationId = this.getConversationId(userId1, userId2);
    const messagesRef = ref(database, `messages/${conversationId}`);
    
    const snapshot = await new Promise<any>((resolve) => {
      onValue(messagesRef, (snap: any) => {
        resolve(snap);
      }, { onlyOnce: true });
    });

    const updates: { [key: string]: any } = {};
    const readTimestamp = Date.now();

    snapshot.forEach((childSnapshot: any) => {
      const message = childSnapshot.val();
      if (message.to === currentUserId && !message.read) {
        updates[`${childSnapshot.key}/read`] = true;
        updates[`${childSnapshot.key}/readAt`] = readTimestamp;
        updates[`${childSnapshot.key}/delivered`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      // Update each path individually since update() is not available
      const updatePromises = Object.entries(updates).map(([path, value]) => {
        const updateRef = ref(database, `messages/${conversationId}/${path}`);
        return set(updateRef, value);
      });
      await Promise.all(updatePromises);
    }
  }

  /**
   * Listen to all conversations for unread counts
   */
  static listenToUnreadCounts(
    currentUserId: number,
    callback: (unreadCounts: { [userId: number]: number }) => void
  ): () => void {
    const messagesRef = ref(database, 'messages');

    const unsubscribe = onValue(messagesRef, (snapshot: any) => {
      const unreadCounts: { [userId: number]: number } = {};

      snapshot.forEach((conversationSnapshot: any) => {
        conversationSnapshot.forEach((messageSnapshot: any) => {
          const message = messageSnapshot.val();
          if (message.to === currentUserId && !message.read) {
            const fromUser = message.from;
            unreadCounts[fromUser] = (unreadCounts[fromUser] || 0) + 1;
          }
        });
      });

      callback(unreadCounts);
    });

    return () => {
      off(messagesRef, 'value', unsubscribe);
    };
  }

  /**
   * Get conversation metadata (last message, unread count)
   */
  static async getConversationMetadata(
    userId1: number,
    userId2: number,
    currentUserId: number
  ): Promise<{
    lastMessage: FirebaseMessage | null;
    unreadCount: number;
  }> {
    const conversationId = this.getConversationId(userId1, userId2);
    const messagesRef = ref(database, `messages/${conversationId}`);

    const snapshot = await new Promise<any>((resolve) => {
      onValue(messagesRef, (snap: any) => {
        resolve(snap);
      }, { onlyOnce: true });
    });

    let lastMessage: FirebaseMessage | null = null;
    let unreadCount = 0;
    let lastTimestamp = 0;

    snapshot.forEach((messageSnapshot: any) => {
      const message = messageSnapshot.val();
      
      if (message.to === currentUserId && !message.read) {
        unreadCount++;
      }

      if (message.timestamp > lastTimestamp) {
        lastTimestamp = message.timestamp;
        lastMessage = {
          id: messageSnapshot.key,
          ...message
        };
      }
    });

    return { lastMessage, unreadCount };
  }
}
