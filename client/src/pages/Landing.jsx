import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Search,
  Send,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Search,
      title: 'API-Powered Buyer Discovery',
      description: 'Connect directly to real-time search engine APIs (SerpAPI) to find legitimate international wholesale buyers and importers.'
    },
    {
      icon: FileCheck,
      title: 'No CSV Upload Required',
      description: 'Eliminate tedious static CSV file uploads. Search live markets by niche and country and import verified buyers instantly.'
    },
    {
      icon: Globe2,
      title: 'Global Country Targeting',
      description: 'Filter verified trade prospects across the US, UK, Germany, UAE, Canada, Australia, France, Netherlands, and major trade hubs.'
    },
    {
      icon: Sparkles,
      title: 'Personalized AI Outreach',
      description: 'Leverage Google Gemini AI to compose tailored, high-converting B2B export proposals for every selected buyer.'
    },
    {
      icon: Send,
      title: 'Direct SMTP Delivery',
      description: 'Send emails with catalog attachments directly from your company domain via secure Nodemailer SMTP integration.'
    },
    {
      icon: TrendingUp,
      title: 'Outreach History & Analytics',
      description: 'Track sent emails, delivery statuses, search queries, and export performance metrics in real-time.'
    }
  ];

  const workflowSteps = [
    { number: '01', title: 'Search', desc: 'Enter your export niche and select target country' },
    { number: '02', title: 'Discover', desc: 'Backend API extracts company websites and contact emails' },
    { number: '03', title: 'Select', desc: 'Pick target buyer companies to populate outreach desk' },
    { number: '04', title: 'Personalize', desc: 'Auto-replace {{company}} and generate AI sales pitches' },
    { number: '05', title: 'Outreach', desc: 'Send emails with catalog attachments and track stats' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500 selection:text-white font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">Global Trade Desk</span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">Buyer Discovery & Outreach</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/30"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 -z-10"></div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-8">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Real-Time Search API & Nodemailer SMTP Integration</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Find International Buyers. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Reach Them Directly.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Discover potential international buyers using real-time search APIs and send personalized B2B outreach without uploading CSV files.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/find-buyers"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center group"
            >
              Find Buyers Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-base transition-all flex items-center justify-center"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Engineered for Modern Exporters & Manufacturers
            </h2>
            <p className="text-slate-400 text-sm">
              Discover international trade prospects, eliminate CSV friction, and automate personalized B2B outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple 5-Step Workflow */}
      <section className="py-20 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              5-Step Seamless Discovery & Outreach Workflow
            </h2>
            <p className="text-slate-400 text-sm">From initial market query to delivered email outreach in minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative">
                <span className="text-3xl font-black text-blue-500/30 mb-3 block">{step.number}</span>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-indigo-950 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Start Discovering International Buyers Today</h2>
          <p className="text-blue-200 text-sm max-w-xl mx-auto mb-8">
            Access real-time business search APIs and expand your international trade footprint.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-900 font-bold text-base hover:bg-blue-50 transition-all shadow-lg"
          >
            Create Exporter Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 International Buyer Discovery & Outreach Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
