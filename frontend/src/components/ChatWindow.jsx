import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const ChatWindow = ({ eventId, eventTitle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch message history
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/messages/${eventId}`);
        setMessages(response.data.data);
      } catch {
        console.error('Error fetching chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // Initialize Socket with Auth Token
    socketRef.current = io(API_URL.replace('/api/v1', ''), {
      auth: { token }
    });

    // Join isolated room
    socketRef.current.emit('join_room', {
      eventId,
      userId: user.id
    });

    socketRef.current.on('receive_message', (data) => {
      // Only append if it belongs to this event and user thread
      if (data.eventId === eventId && (data.sender === user.id || data.recipient === user.id)) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !token) return;

    const messageData = {
      eventId,
      content: newMessage,
      senderName: user.name || 'Anonymous',
      senderId: user.id,
      createdAt: new Date()
    };

    // Emit real-time
    socketRef.current.emit('send_message', messageData);

    // Save to DB
    try {
      await api.post('/messages', {
        event: eventId,
        content: newMessage,
        senderName: user.name || 'Anonymous'
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }

    setNewMessage('');
  };

  if (!token) {
    return (
      <div className="bg-gray-50 rounded-3xl p-8 text-center border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">Please login to join the discussion.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-emerald-950 text-white border-b border-white/5">
        <h3 className="text-lg font-bold font-display flex items-center gap-2">
          Organised Chat: <span className="text-gold-500 italic">{eventTitle}</span>
        </h3>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-black">Community Discussion Chamber</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-bg scroll-smooth">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
               <Loader2 className="animate-spin text-emerald-900 w-5 h-5" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-10">
            <p className="bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-900/40">
              No messages in this chronicle yet
            </p>
          </div>
        ) : (
          messages.reduce((acc, msg, index) => {
            const messageDate = new Date(msg.createdAt).toLocaleDateString();
            const prevMessageDate = index > 0 ? new Date(messages[index - 1].createdAt).toLocaleDateString() : null;
            
            if (messageDate !== prevMessageDate) {
              const today = new Date().toLocaleDateString();
              const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
              let displayDate = messageDate;
              if (messageDate === today) displayDate = 'TODAY';
              else if (messageDate === yesterday) displayDate = 'YESTERDAY';

              acc.push(
                <div key={`date-${messageDate}`} className="flex justify-center my-6">
                  <span className="bg-[#d1d7db] text-[#54656f] text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
                    {displayDate}
                  </span>
                </div>
              );
            }

            const isMe = msg.senderName === user.name;
            const isAdmin = msg.senderName.toLowerCase().includes('admin');

            acc.push(
              <div
                key={msg._id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-1`}
              >
                {!isMe && (
                  <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ml-1 ${isAdmin ? 'text-gold-600' : 'text-emerald-900/40'}`}>
                    {msg.senderName} {isAdmin && '• OFFICIAL'}
                  </span>
                )}
                <div className={`bubble ${isMe ? 'bubble-out' : (isAdmin ? 'bubble-in bubble-admin' : 'bubble-in')}`}>
                  <div className="text-sm leading-relaxed pr-10">
                    {msg.content}
                  </div>
                  <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className={`text-[9px] font-medium opacity-50 ${isMe ? 'text-white' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    {isMe && (
                      <div className="flex -space-x-1 opacity-70">
                        <svg viewBox="0 0 16 11" width="14" height="11" fill="currentColor" className="text-blue-400">
                          <path d="M11.053 1.514L5.432 7.135 2.431 4.134 1.514 5.051l3.918 3.918 6.538-6.537zM14.54 1.514l-6.538 6.538.917.917 6.538-6.538z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
            return acc;
          }, [])
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#f0f2f5] border-t border-gray-200">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Share your heritage experience..."
              className="w-full bg-white border-transparent rounded-xl px-6 py-4 text-sm font-medium focus:ring-0 transition-all shadow-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-14 h-14 bg-emerald-900 text-gold-500 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-emerald-900/20 shrink-0"
          >
            <Send className="w-6 h-6 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
