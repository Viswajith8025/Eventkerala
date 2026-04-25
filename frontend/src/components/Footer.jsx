import React from 'react';
import { Calendar, Globe, Share2, Send, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-emerald-950 text-white pt-32 pb-10 overflow-hidden">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter / CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-24 border-b border-white/5 items-center">
            <div className="space-y-6">
                <h3 className="text-5xl font-display leading-tight italic">Stay sync'd with <br /> <span className="text-gold-500 not-italic font-bold">God's own.</span></h3>
                <p className="text-white/40 text-lg font-medium leading-relaxed max-w-md">Join 12,000+ culturists receiving weekly heritage alerts and exclusive ritual early-access.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-gold-500/50 transition-colors" 
                />
                <button className="px-10 py-5 bg-gold-500 text-emerald-950 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-xl">Subscribe</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-24">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-heritage-gradient p-1.5 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <img src="/logo.svg" alt="LiveKeralam Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-display font-bold tracking-tighter">Live<span className="text-gold-500 italic">Keralam</span></span>
            </Link>
            <p className="text-white/40 leading-relaxed font-medium italic text-sm">
              From the deep Western Ghats to the Malabar coast, we preserve the digital legacy of Kerala's soul.
            </p>
            <div className="flex gap-4">
              {[Globe, Share2, Send, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition-all duration-500 group">
                    <Icon className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                  </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-8">Navigation</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><Link to="/" className="hover:text-gold-500 transition-colors">Legendary Traditions</Link></li>
              <li><Link to="/places" className="hover:text-gold-500 transition-colors">Sacred Sanctuaries</Link></li>
              <li><Link to="/about" className="hover:text-gold-500 transition-colors">The Foundation</Link></li>
              <li><Link to="/contact" className="hover:text-gold-500 transition-colors">Whisper to Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-8">Sacred Threads</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><a href="#" className="hover:text-gold-500 transition-colors">Temple Festivals</a></li>
              <li><a href="#" className="hover:text-gold-500 transition-colors">Sacred Rituals</a></li>
              <li><a href="#" className="hover:text-gold-500 transition-colors">Ancient Art Forms</a></li>
              <li><a href="#" className="hover:text-gold-500 transition-colors">Heritage Sites</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-8">Global Base</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <MapPin className="w-4 h-4 text-gold-500" />
                </div>
                <span className="text-sm text-white/60 font-medium">Kozhikode, Kerala,<br />India 673001</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Phone className="w-4 h-4 text-gold-500" />
                </div>
                <span className="text-sm text-white/60 font-medium">+91 9400 852 147</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-white/20">
          <p>© 2026 LiveKeralam Heritage Engine. Built for the future of tradition.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-gold-500 transition-all">Privacy Logic</a>
            <a href="#" className="hover:text-gold-500 transition-all">Heritage Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
