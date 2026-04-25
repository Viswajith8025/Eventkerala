/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Home, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Could send to logging service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, retryCount: this.state.retryCount + 1 });
    // Force re-render of children
    this.forceUpdate();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F6F1] flex items-center justify-center px-6 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,95,62,0.3)_0%,transparent_70%)]"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl ring-1 ring-emerald-900/10 p-12 md:p-16 text-center space-y-8 relative overflow-hidden"
          >
            {/* Decorative Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-gold-500 to-emerald-600"></div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto border-4 border-red-50 shadow-lg"
            >
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </motion.div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-4xl font-display font-medium text-emerald-950 tracking-tight">
                Our Heritage Experts <br/>
                <span className="text-gold-600 italic">{'{are on it}'}</span>
              </h1>
              <p className="text-emerald-900/60 font-medium leading-relaxed max-w-sm mx-auto">
                An unexpected interruption occurred on your journey. Let's get you back exploring.
              </p>
            </div>

            {/* Error details (development only) */}
            {import.meta.env.DEV && this.state.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-100 rounded-[1.5rem] p-4 text-left overflow-hidden"
              >
                <p className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </motion.div>
            )}

            {/* Recovery Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleRetry}
                className="flex-1 bg-heritage-gradient text-gold-500 px-8 py-5 rounded-2xl font-black text-xs tracking-widest uppercase hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleGoHome}
                className="flex-1 bg-emerald-900 text-white px-8 py-5 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-emerald-950 transition-all flex items-center justify-center gap-3"
              >
                <Home className="w-4 h-4" />
                Return Home
              </motion.button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-3 pt-4 text-emerald-900/30">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">
                100% Secure Heritage Experience
              </span>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
