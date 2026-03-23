import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Share2, Heart, Loader2 } from 'lucide-react';
import api from '../services/api';
import ChatWindow from '../components/ChatWindow';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Need to add a specific get event by ID route if it doesn't exist, 
        // but for now we can filter from all events or assume the backend has /events/:id
        const response = await api.get(`/events`); // This is inefficient but safe for now
        const found = response.data.data.find(e => e._id === id);
        if (found) {
          setEvent(found);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
      <Link to="/" className="text-indigo-600 font-bold flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Explorations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6 flex gap-3">
                <button className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white transition-all">
                  <Heart className="w-5 h-5 text-red-500" />
                </button>
                <button className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white transition-all">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
                  {event.district}
                </span>
                <span className="text-gray-400 font-medium">•</span>
                <span className="text-gray-500 font-bold">Approved Event</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 font-display tracking-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                    <p className="text-sm font-black text-gray-900">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-sm font-black text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-indigo max-w-none">
                <h3 className="text-2xl font-black text-gray-900 font-display mb-4">About Event</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Chat */}
          <div className="space-y-8">
            <ChatWindow eventId={event._id} eventTitle={event.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
