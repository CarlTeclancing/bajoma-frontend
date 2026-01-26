import React from 'react'
import DashboardLayout from '../../components/general/DashboardLayout'
import axios from 'axios';
import { BACKEND_URL } from '../../global';

const Messages = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [messageText, setMessageText] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetchUsers();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  React.useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/users`);
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/messages`);
      const allMessages = Array.isArray(response.data.content) ? response.data.content : [];
      
      // Filter messages between current user and selected user
      if (currentUser && selectedUser) {
        const conversation = allMessages.filter((msg: any) => 
          (msg.from === currentUser.id && msg.to === selectedUser.id) ||
          (msg.from === selectedUser.id && msg.to === currentUser.id)
        );
        setMessages(conversation);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser || !currentUser) {
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/messages`, {
        from: currentUser.id,
        to: selectedUser.id,
        title: '',
        content: messageText,
        status: 'ACTIF'
      });
      setMessageText('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <DashboardLayout>
      <h1 className='font-bold text-2xl'>Messages</h1>
      <p>Chat with users</p>
      
      <div className="flex gap-0 mt-6 h-[calc(100vh-200px)] border border-gray-200 rounded-lg overflow-hidden">
        {/* Users List - Chat Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className='text-lg font-bold mb-3'>Conversations</h2>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#78C726]"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#78C726]"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No users found</p>
            ) : (
              <div>
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50 ${
                      selectedUser?.id === user.id ? 'bg-[#E6F2D9]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedUser?.id === user.id ? 'bg-[#78C726] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <i className='bi bi-person text-xl'></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {user.role && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 flex-shrink-0">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#78C726] rounded-full flex items-center justify-center text-white">
                  <i className='bi bi-person text-lg'></i>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
                  <i className='bi bi-circle-fill text-[6px] mr-1'></i>
                  Online
                </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <i className='bi bi-chat-text text-5xl mb-3 text-gray-300'></i>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMyMessage = msg.from === currentUser?.id;
                    return (
                      <div key={msg.id || index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-2 ${
                            isMyMessage 
                              ? 'bg-[#78C726] text-white rounded-br-none' 
                              : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                          }`}>
                            <p className="text-sm break-words">{msg.content}</p>
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 px-2 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#78C726] text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-[#78C726] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6ab31f] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <i className='bi bi-send'></i>
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <i className='bi bi-chat-dots text-6xl text-gray-300'></i>
                <h3 className='text-xl font-bold mt-4 mb-2 text-gray-600'>Select a conversation</h3>
                <p className='text-gray-500'>Choose a user from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Messages
