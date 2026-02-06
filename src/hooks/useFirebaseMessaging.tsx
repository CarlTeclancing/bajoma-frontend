import { useEffect, useCallback, useRef, useState } from 'react';
import { FirebaseMessagingService } from '../utils/firebase-messaging.utils';
import type { FirebaseMessage } from '../utils/firebase-messaging.utils';
import axios from 'axios';
import { BACKEND_URL } from '../global';

interface UseFirebaseMessagingProps {
  currentUserId: number | null;
  selectedUserId: number | null;
}


export const useFirebaseMessaging = ({ currentUserId, selectedUserId }: UseFirebaseMessagingProps) => {
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>({});
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  const typingTimeoutRef = useRef<any>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const unsubscribeTypingRef = useRef<(() => void) | null>(null);
  const unsubscribeUnreadRef = useRef<(() => void) | null>(null);
  const unsubscribeOnlineRef = useRef<(() => void) | null>(null);
  // Set/remove online status for current user
  useEffect(() => {
    if (currentUserId) {
      FirebaseMessagingService.setUserOnline(currentUserId);
    }
    return () => {
      if (currentUserId) {
        FirebaseMessagingService.setUserOffline(currentUserId);
      }
    };
  }, [currentUserId]);

  // Listen to online users
  useEffect(() => {
    if (unsubscribeOnlineRef.current) {
      unsubscribeOnlineRef.current();
    }
    unsubscribeOnlineRef.current = FirebaseMessagingService.listenToOnlineUsers((onlineSet) => {
      setOnlineUsers(new Set(onlineSet));
    });
    return () => {
      if (unsubscribeOnlineRef.current) {
        unsubscribeOnlineRef.current();
        unsubscribeOnlineRef.current = null;
      }
    };
  }, []);

  // Listen to messages in real-time
  useEffect(() => {
    if (!currentUserId || !selectedUserId) {
      setMessages([]);
      return;
    }

    // Clean up previous listener
    if (unsubscribeMessagesRef.current) {
      unsubscribeMessagesRef.current();
    }

    // Set up new listener with error handling
    try {
      unsubscribeMessagesRef.current = FirebaseMessagingService.listenToMessages(
        currentUserId,
        selectedUserId,
        (newMessages) => {
          setMessages(newMessages);
        },
        100 // Load last 100 messages
      );

      // Mark messages as read when conversation is opened
      markMessagesAsRead();
    } catch (error) {
      console.warn('Firebase messaging listener failed (rules may be restrictive):', error);
      console.log('Loading messages from backend instead...');
      // Fallback: load messages from backend API instead of Firebase
      loadMessagesFromBackend();
    }

    return () => {
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
        unsubscribeMessagesRef.current = null;
      }
    };
  }, [currentUserId, selectedUserId]);

  // Listen to typing status in real-time
  useEffect(() => {
    if (!currentUserId || !selectedUserId) {
      setIsOtherUserTyping(false);
      return;
    }

    // Clean up previous listener
    if (unsubscribeTypingRef.current) {
      unsubscribeTypingRef.current();
    }

    // Set up new listener with error handling
    try {
      unsubscribeTypingRef.current = FirebaseMessagingService.listenToTyping(
        currentUserId,
        selectedUserId,
        currentUserId,
        (isTyping) => {
          setIsOtherUserTyping(isTyping);
          
          // Auto-clear typing indicator after 3 seconds
          if (isTyping) {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setIsOtherUserTyping(false);
            }, 3000);
          }
        }
      );
    } catch (error) {
      console.warn('Firebase typing listener failed:', error);
      // Typing indicators will not work, but messaging will continue
    }

    return () => {
      if (unsubscribeTypingRef.current) {
        unsubscribeTypingRef.current();
        unsubscribeTypingRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentUserId, selectedUserId]);

  // Listen to all conversations for unread counts
  useEffect(() => {
    if (!currentUserId) return;

    // Clean up previous listener
    if (unsubscribeUnreadRef.current) {
      unsubscribeUnreadRef.current();
    }

    // Set up new listener with error handling
    try {
      unsubscribeUnreadRef.current = FirebaseMessagingService.listenToUnreadCounts(
        currentUserId,
        (counts) => {
          setUnreadCounts(counts);
        }
      );
    } catch (error) {
      console.warn('Firebase unread counts listener failed:', error);
      // Unread counts will not work in real-time, but messaging will continue
    }

    return () => {
      if (unsubscribeUnreadRef.current) {
        unsubscribeUnreadRef.current();
        unsubscribeUnreadRef.current = null;
      }
    };
  }, [currentUserId]);

  // Fallback: Load messages from backend when Firebase is not accessible
  const loadMessagesFromBackend = useCallback(async () => {
    if (!currentUserId || !selectedUserId) return;
    
    try {
      console.log('Loading messages from backend API...');
      const response = await axios.get(`${BACKEND_URL}/firebase-messages/conversation/${selectedUserId}`);
      if (response.data && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
        console.log('Messages loaded from backend:', response.data.messages.length);
      }
    } catch (error: any) {
      console.error('Failed to load messages from backend:', error);
    }
  }, [currentUserId, selectedUserId]);

  // Update typing status
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!currentUserId || !selectedUserId) return;

    try {
      await FirebaseMessagingService.setTypingStatus(
        currentUserId,
        selectedUserId,
        currentUserId,
        isTyping
      );
    } catch (error: any) {
      console.warn('Firebase typing status update failed (rules may be restrictive):', error);
      // Continue without typing indicators
    }
  }, [currentUserId, selectedUserId]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    if (!currentUserId || !selectedUserId) return;

    try {
      // Try to update in Firebase directly
      await FirebaseMessagingService.markMessagesAsRead(
        currentUserId,
        selectedUserId,
        currentUserId
      );
      console.log('Messages marked as read in Firebase');
    } catch (firebaseError: any) {
      console.warn('Firebase mark as read failed:', firebaseError);
    }

    try {
      // Always notify backend regardless of Firebase status
      await axios.put(`${BACKEND_URL}/firebase-messages/read/${selectedUserId}`);
      console.log('Messages marked as read in backend');
    } catch (backendError: any) {
      console.error('Backend mark as read failed:', backendError);
    }
  }, [currentUserId, selectedUserId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!currentUserId || !selectedUserId || !content.trim()) {
      console.warn('Cannot send message: missing required data', {
        currentUserId,
        selectedUserId,
        content: content?.trim()
      });
      return false;
    }

    setIsSending(true);
    try {
      console.log('Sending message:', {
        to: selectedUserId,
        content: content.trim(),
        from: currentUserId
      });
      
      const response = await axios.post(`${BACKEND_URL}/firebase-messages`, {
        to: selectedUserId,
        content: content.trim(),
        title: ''
      });
      
      console.log('Message sent successfully:', response.data);
      
      // If Firebase is not connected, show a warning but still allow messaging
      if (response.data.firebaseStatus === 'disconnected') {
        console.warn('Firebase Realtime Database is unavailable. Messages are saved to database but real-time updates may not work.');
      }
      
      // Clear typing indicator (only if Firebase is working)
      if (response.data.firebaseStatus === 'connected') {
        await updateTypingStatus(false);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error sending message:', {
        error,
        response: error?.response?.data,
        status: error?.response?.status
      });
      return false;
    } finally {
      setIsSending(false);
    }
  }, [currentUserId, selectedUserId, updateTypingStatus]);

  return {
    messages,
    isOtherUserTyping,
    unreadCounts,
    isSending,
    updateTypingStatus,
    sendMessage,
    markMessagesAsRead,
    onlineUsers
  };
};
