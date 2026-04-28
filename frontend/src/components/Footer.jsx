import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Share2, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] text-white pt-32 pb-16 overflow-hidden selection:bg-gold-500 selection:text-emerald-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top Branding & Statement Section */}
        <div className="mb-20">
          <div className="space-y-12">
            <Link to="/" className="inline-flex items-center gap-5 group">
              <div className="w-16 h-16 bg-heritage-gradient rounded-[2rem] flex items-center justify-center p-3 ring-1 ring-white/10 group-hover:ring-gold-500/50 transition-all duration-700 shadow-2xl">
                <img src="/logo.svg" alt="LiveKeralam" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-display font-bold tracking-tighter">Live<span className="text-gold-500 italic">Keralam</span></span>
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20">Cultural Preservation Engine</span>
              </div>
            </Link>

            <h3 className="text-5xl md:text-7xl font-display leading-[1.1] font-medium max-w-3xl">
              Mapping the <span className="text-gold-500 italic">unseen</span> heritage of Kerala.
            </h3>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 py-20 border-y border-white/5">
          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Discovery</h5>
            <ul className="space-y-4">
              <li><Link to="/#events" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Sacred Rituals</Link></li>
              <li><Link to="/places" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Heritage Sites</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Cultural Map</Link></li>
              <li><Link to="/register" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Join the Tribe</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Identity</h5>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Heritage Vault</Link></li>
              <li><Link to="/wishlist" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Saved Legends</Link></li>
              <li><Link to="/contact" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Submit Stories</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Our Ethos</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Legal</h5>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-sm font-medium text-white/50 hover:text-gold-500 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Contact</h5>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-gold-500/30 transition-all">
                <div className="flex items-center gap-3 mb-1">
                  <MapPin className="w-3 h-3 text-gold-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Location</span>
                </div>
                <p className="text-xs font-bold text-white/70">Kozhikode, Kerala</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-gold-500/30 transition-all">
                <div className="flex items-center gap-3 mb-1">
                  <Mail className="w-3 h-3 text-gold-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Email</span>
                </div>
                <p className="text-xs font-bold text-white/70">heritage@livekeralam.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Social</h5>
            <div className="flex gap-4">
              {[Globe, Share2].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold-500 hover:border-gold-500/50 transition-all group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:items-start gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              © {currentYear} LIVEKERALAM • PRESERVING THE INTANGIBLE
            </p>
            <p className="text-[11px] font-bold text-white/40 flex items-center gap-2">
              Crafted with architectural precision by 
              <a 
                href="https://viswajith-ten.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-white border-b border-gold-500/30 hover:border-white transition-all pb-0.5"
              >
                VISWAJITH
              </a>
            </p>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#080808] bg-white/10 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover grayscale" alt="Guardian" />
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gold-500/50">
               Joined by <span className="text-white">1.2k+ Guardians</span>
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
