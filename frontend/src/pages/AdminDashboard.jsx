import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../services/api';
import { io } from 'socket.io-client';

// Sub-components
        import AdminHeader from '../components/admin/AdminHeader';
        import AdminEventTable from '../components/admin/AdminEventTable';
        import AdminPlaceTable from '../components/admin/AdminPlaceTable';
        import AdminMessaging from '../components/admin/AdminMessaging';
        import EventFormModal from '../components/admin/EventFormModal';
        import PlaceFormModal from '../components/admin/PlaceFormModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [activeMessageSubTab, setActiveMessageSubTab] = useState('chats');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', district: '', date: '', 
    location: '', image: '', latitude: '', longitude: ''
  });

  const [placeFormData, setPlaceFormData] = useState({
    name: '', district: '', description: '', image: '', category: 'other'
  });

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/admin'); 
      setEvents(response.data.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      if (activeTab === 'events') setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/places');
      setPlaces(response.data.data);
    } catch (err) {
      console.error('Place fetch error:', err);
    } finally {
      if (activeTab === 'places') setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      setMessages(response.data.data);
    } catch (err) {
      console.error('Messages fetch error:', err);
    } finally {
      if (activeTab === 'messages' && activeMessageSubTab === 'chats') setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      setContactMessages(response.data.data || []);
    } catch (err) {
      console.error('Contact fetch error:', err);
    } finally {
      if (activeTab === 'messages' && activeMessageSubTab === 'inquiries') setLoading(false);
    }
  };

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    socketRef.current = io(API_URL.replace('/api/v1', ''));

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', { userId: 'admin', eventId: 'global' });
      socketRef.current.emit('admin_join');
    });

    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [data, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      socketRef.current.emit('join_room', selectedEventId);
    }
  }, [selectedEventId]);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchAllEvents();
    } else if (activeTab === 'places') {
      fetchPlaces();
    } else if (activeTab === 'messages') {
      if (activeMessageSubTab === 'chats') {
        fetchMessages();
      } else {
        fetchContactMessages();
      }
    }
  }, [activeTab, activeMessageSubTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedEventId]);

  const activeEventUsers = useMemo(() => {
    if (!selectedEventId) return [];
    const eventMessages = messages.filter(m => m.event?._id === selectedEventId || m.event === selectedEventId);
    const usersMap = new Map();
    
    eventMessages.forEach(m => {
      const isUser = !m.senderName.toLowerCase().includes('admin');
      const userId = isUser ? m.sender : m.recipient;
      
      if (userId && !usersMap.has(userId)) {
        usersMap.set(userId, {
          id: userId,
          name: isUser ? m.senderName : 'User',
          lastMessage: m
        });
      }
    });
    return Array.from(usersMap.values()).sort((a,b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
  }, [messages, selectedEventId]);

  const eventThreads = Array.from(new Set(messages
    .filter(m => m.event?._id || m.event)
    .map(m => m.event?._id || m.event)
  )).map(eventId => {
    const threadMessages = messages.filter(m => (m.event?._id || m.event) === eventId);
    return {
      eventId,
      eventTitle: threadMessages[0].event?.title || 'Event Channel',
      lastMessage: threadMessages[0],
      unreadCount: 0 
    };
  });

  const handleStatusUpdate = async (id, status) => {
     try {
       await api.put(`/events/${id}`, { status });
       setEvents(events.map(ev => ev._id === id ? { ...ev, status } : ev));
     } catch {
       alert('Failed to update status.');
     }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
     try {
       await api.delete(`/events/${id}`);
       setEvents(events.filter(ev => ev._id !== id));
     } catch {
       alert('Failed to delete event.');
     }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert('Please upload an image first');
    try {
      const response = await api.post('/events', { ...formData, status: 'approved' });
      setEvents([response.data.data, ...events]);
      setShowAddModal(false);
      setFormData({ title: '', description: '', district: '', date: '', location: '', image: '', latitude: '', longitude: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event.');
    }
  };

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    if (!placeFormData.image) return alert('Please upload an image first');
    try {
      const response = await api.post('/places', placeFormData);
      setPlaces([response.data.data, ...places]);
      setShowAddPlaceModal(false);
      setPlaceFormData({ name: '', district: '', description: '', image: '', category: 'other' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create place.');
    }
  };

  const handleDeletePlace = async (id) => {
     if (!window.confirm('Are you sure?')) return;
     try {
       await api.delete(`/places/${id}`);
       setPlaces(places.filter(p => p._id !== id));
     } catch {
       alert('Failed to delete place.');
     }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    try {
      await api.post('/messages', {
        event: selectedEventId,
        content: replyMessage,
        senderName: 'LiveKeralam Admin',
        recipientId: selectedUserId
      });
      setReplyMessage('');
    } catch (err) {
      alert('Failed to send reply');
    }
  };

  const handleReplyContact = async (id, reply) => {
     try {
       await api.put(`/contact/${id}/reply`, { reply });
       fetchContactMessages();
     } catch {
       alert('Failed to send reply.');
     }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminHeader 
          activeTab={activeTab} setActiveTab={setActiveTab}
          activeMessageSubTab={activeMessageSubTab} setActiveMessageSubTab={setActiveMessageSubTab}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onAddClick={() => activeTab === 'events' ? setShowAddModal(true) : setShowAddPlaceModal(true)}
        />

        <EventFormModal 
          show={showAddModal} onClose={() => setShowAddModal(false)}
          formData={formData} setFormData={setFormData} onSubmit={handleCreateEvent}
        />

        <PlaceFormModal 
          show={showAddPlaceModal} onClose={() => setShowAddPlaceModal(false)}
          formData={placeFormData} setFormData={setPlaceFormData} onSubmit={handleCreatePlace}
        />

        {activeTab === 'events' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
            <AdminEventTable events={filteredEvents} onStatusUpdate={handleStatusUpdate} onDelete={handleDeleteEvent} />
          </div>
        )}

        {activeTab === 'places' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
            <AdminPlaceTable places={places} searchTerm={searchTerm} onDelete={handleDeletePlace} />
          </div>
        )}

        {activeTab === 'messages' && (
          <AdminMessaging 
            messages={messages} contactMessages={contactMessages}
            activeMessageSubTab={activeMessageSubTab} searchTerm={searchTerm}
            selectedEventId={selectedEventId} setSelectedEventId={setSelectedEventId}
            selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId}
            replyMessage={replyMessage} setReplyMessage={setReplyMessage}
            onSendMessage={handleSendMessage} onReplyContact={handleReplyContact}
            eventThreads={eventThreads} activeEventUsers={activeEventUsers}
            messagesEndRef={messagesEndRef} loading={loading}
          />
        )}
        
        {((activeTab === 'events' && filteredEvents.length === 0) || 
          (activeTab === 'places' && places.length === 0) || 
          (activeTab === 'messages' && activeMessageSubTab === 'chats' && messages.length === 0) || 
          (activeTab === 'messages' && activeMessageSubTab === 'inquiries' && contactMessages.length === 0)) && !loading && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-gray-200" />
            <p className="text-gray-400 font-bold font-display text-xl">No {activeTab} discovered matching your search.</p>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="text-emerald-900 font-black text-xs uppercase tracking-widest border-b-2 border-emerald-100">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
