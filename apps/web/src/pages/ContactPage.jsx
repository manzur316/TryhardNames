import React, { useState } from 'react';
import SeoHead from '@/seo/SeoHead.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Mail, MessageSquare, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill out all fields.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await apiServerClient.fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <>
    <SeoHead
      title="Contact TryhardNames – Support & Feedback"
      description="Reach the TryhardNames team for tool feedback, partnerships, or general questions about our free gaming generators."
      path="/contact"
    />
    <div className="bg-gradient-dark text-dark-300 font-sans selection:bg-accent-cyan/30 py-20 px-4 flex-grow flex flex-col">
      <div className="container mx-auto max-w-5xl">
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-dark-50 tracking-tight">
            Get in <span className="text-accent-cyan">Touch</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hi? Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-dark-800 border border-dark-700 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-accent-cyan" />
              </div>
              <h3 className="text-xl font-bold text-dark-50 mb-2">Email Us</h3>
              <p className="text-dark-300 mb-4">For general inquiries and support.</p>
              <a href="mailto:support@tryhardnames.com" className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors">
                support@tryhardnames.com
              </a>
            </div>

            <div className="bg-dark-800 border border-dark-700 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-accent-cyan" />
              </div>
              <h3 className="text-xl font-bold text-dark-50 mb-2">Community</h3>
              <p className="text-dark-300 mb-4">Join our Discord to chat with other gamers.</p>
              <a href="#" className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors">
                Join Discord Server
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-dark-800 border border-dark-700 p-8 md:p-10 rounded-2xl">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-accent-green" />
                </div>
                <h3 className="text-2xl font-bold text-dark-50">Message Sent!</h3>
                <p className="text-dark-300 max-w-md">
                  Thanks for reaching out. We've received your message and will get back to you shortly.
                </p>
                <Button 
                  onClick={() => setStatus('idle')}
                  variant="outline" 
                  className="mt-8 border-dark-700 text-dark-300 hover:bg-dark-700 hover:text-dark-50"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-dark-300">Your Name</label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="bg-dark-700 border-dark-700 text-dark-50 placeholder:text-dark-400 focus-visible:ring-accent-cyan focus-visible:border-accent-cyan"
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-dark-300">Email Address</label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="bg-dark-700 border-dark-700 text-dark-50 placeholder:text-dark-400 focus-visible:ring-accent-cyan focus-visible:border-accent-cyan"
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-dark-300">Subject</label>
                  <Input 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="bg-dark-700 border-dark-700 text-dark-50 placeholder:text-dark-400 focus-visible:ring-accent-cyan focus-visible:border-accent-cyan"
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-dark-300">Message</label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="min-h-[150px] bg-dark-700 border-dark-700 text-dark-50 placeholder:text-dark-400 focus-visible:ring-accent-cyan focus-visible:border-accent-cyan resize-y"
                    disabled={status === 'loading'}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-cyan-purple text-white hover:opacity-90 font-bold h-12 rounded-xl transition-all duration-300"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;