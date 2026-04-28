import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../services/api';
import toast from 'react-hot-toast';

const SupportChat = ({ user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const socketRef = useRef();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    fetchMessages();
    setupSocket();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/support/me');
      setMessages(response.data.data);
    } catch (err) {
      console.error('Support fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const token = localStorage.getItem('token');
    socketRef.current = io(API_URL.replace('/api/v1', ''), {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', { userId: user._id, type: 'support' });
    });

    socketRef.current.on('receive_message', (message) => {
      if (message.room === 'support') {
        setMessages((prev) => [...prev, message]);
      }
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post('/messages', {
        content: newMessage,
        senderName: user.name,
        room: 'support',
        recipientId: 'admin' // Reserved keyword for admin on backend logic
      });
      
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to deliver message to the chronicles');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg h-[80vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-emerald-900/10">
        
        {/* Header */}
        <div className="bg-emerald-900 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
              <ShieldCheck className="text-gold-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-display text-xl">Chronicle <span className="text-gold-500 italic">Support</span></h3>
              <p className="text-[10px] text-emerald-100/60 font-black uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Secure Heritage Line
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FDFDFF] scroll-smooth">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <MessageSquare className="w-16 h-16 text-emerald-900" />
              <p className="text-xs font-black uppercase tracking-widest text-emerald-900">Initiating Connection...</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender === user._id;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-[2rem] shadow-sm ${
                    isMe 
                      ? 'bg-emerald-900 text-white rounded-tr-none' 
                      : 'bg-white border border-emerald-900/5 text-emerald-950 rounded-tl-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    <div className={`flex items-center gap-1.5 mt-2 opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-emerald-900/5 flex gap-4 items-center">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write to the guardians..."
            className="flex-1 bg-emerald-900/[0.03] border-none rounded-2xl px-6 py-4 text-sm font-bold text-emerald-950 placeholder:text-emerald-900/30 focus:ring-2 focus:ring-gold-500/20 transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="p-4 bg-gold-500 text-emerald-950 rounded-2xl hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportChat;
