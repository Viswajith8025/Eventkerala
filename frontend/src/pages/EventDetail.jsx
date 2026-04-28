import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Share2, Heart, Loader2, ArrowRight } from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import ChatWindow from '../components/ChatWindow';
import HeartButton from '../components/HeartButton';
import { encodeJourney } from '../utils/shareUtils';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDirections = () => {
    const query = encodeURIComponent(`${event.title} ${event.location} Kerala`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this heritage event in ${event.district}: ${event.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.data);
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
    <div className="min-h-screen flex items-center justify-center bg-emerald-950">
      <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FDFDFF]">
      <h1 className="text-4xl font-display font-medium text-emerald-950 mb-6">{error || 'Event not found'}</h1>
      <Link to="/" className="text-gold-600 font-black text-xs tracking-widest uppercase flex items-center gap-3">
        <ArrowLeft className="w-4 h-4" /> Back to Explorations
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20">
      <Helmet>
        <title>{event.title} | LiveKeralam</title>
        <meta name="description" content={event.description.substring(0, 160)} />
        <meta property="og:title" content={`${event.title} at ${event.location}`} />
        <meta property="og:description" content={event.description.substring(0, 160)} />
        <meta property="og:image" content={getImageUrl(event.image)} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-3 text-emerald-900/40 hover:text-emerald-950 font-black text-xs tracking-widest uppercase mb-12 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Explorations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden shadow-3xl shadow-emerald-950/10 border-8 border-white">
              <img
                src={getImageUrl(event.image)}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-8 right-8 flex gap-4 z-30">
                <HeartButton item={event} type="event" className="shadow-2xl scale-125" />
                <button
                  onClick={handleShare}
                  className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white hover:bg-white transition-all shadow-2xl flex items-center justify-center hover:text-emerald-950"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <span className="px-6 py-2 bg-emerald-900/5 text-emerald-900 rounded-2xl text-xs font-black uppercase tracking-[0.3em]">
                  {event.district}
                </span>
                <div className="h-px w-8 bg-emerald-950/10"></div>
                <span className="text-gold-600 font-display text-lg italic">Heritage Essential</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-medium text-emerald-950 leading-[0.85] tracking-tighter">
                {event.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-emerald-950/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-900 shadow-inner">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-900/30 font-black uppercase tracking-widest mb-1">Occurence</p>
                    <p className="text-xl font-bold text-emerald-950">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-900 shadow-inner">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-900/30 font-black uppercase tracking-widest mb-1">Sanctuary</p>
                    <p className="text-xl font-bold text-emerald-950">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-emerald max-w-none">
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-3xl font-display font-medium text-emerald-950 tracking-tighter">Event <span className="text-gold-600 italic">Chronicle</span></h3>
                    <div className="h-px flex-grow bg-emerald-950/5"></div>
                </div>
                <p className="text-xl text-emerald-900/60 leading-[1.8] font-light italic">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Explorer Card & Chat */}
          <div className="space-y-12">
            <div className="bg-emerald-950 p-12 rounded-[4rem] shadow-3xl shadow-emerald-950/40 space-y-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-all duration-1000"></div>
              
              <div className="space-y-3 relative z-10">
                <p className="text-xs text-gold-500/50 font-black uppercase tracking-[0.5em]">Entrance Details</p>
                {event.bookingLink ? (
                  <h2 className="text-5xl font-display font-medium text-gold-500 leading-tight">
                    Official <br /><span className="text-3xl text-white italic">Booking Open.</span>
                  </h2>
                ) : (
                  <h2 className="text-6xl font-display font-medium text-gold-500 leading-none">
                    Free <br /><span className="text-3xl text-white italic">Access.</span>
                  </h2>
                )}
              </div>

              <div className="space-y-4 relative z-10">
                {event.bookingLink && (
                  <button
                    onClick={() => window.open(event.bookingLink, '_blank')}
                    className="w-full py-8 bg-gold-500 text-emerald-950 rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                  >
                    Book Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                )}
                
                <button
                  onClick={handleDirections}
                  className={`w-full py-8 ${event.bookingLink ? 'bg-white/5 border border-white/10 text-white' : 'bg-gold-600 text-emerald-950'} rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase hover:bg-white hover:text-emerald-950 hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 group`}
                >
                  Navigate Now <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <p className="text-[9px] text-white/30 text-center font-bold tracking-widest uppercase italic">
                   {event.bookingLink ? 'Reservations via Official Partner Portal' : 'No Reservation Required for Local Traditions'}
                </p>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Community Verified</span>
                 </div>
                 <p className="text-xs text-white/40 leading-relaxed font-medium">
                   {event.bookingLink 
                     ? 'Ticketing is managed by the respected event organizers. Ensure you carry your confirmation for entry.'
                     : 'This heritage event is open to all seekers of culture. Please respect local customs and sacred traditions during your visit.'}
                 </p>
              </div>
            </div>

            {event.chatEnabled && (
              <ChatWindow eventId={event._id} eventTitle={event.title} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

