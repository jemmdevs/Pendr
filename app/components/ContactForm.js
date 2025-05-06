'use client';

import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle } from 'lucide-react';

// Define emailjs service information outside component to prevent recreation on each render
const SERVICE_ID = 'service_j5q6azh';
const TEMPLATE_ID = 'template_gkt7fwu';
const PUBLIC_KEY = 'waONZgvG5drpYE06F';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef();
  const isInitialized = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Initialize EmailJS only once when component mounts
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
    // No cleanup function needed as we're just marking initialization
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      setIsSubmitted(true);
      setFormData({ from_name: '', reply_to: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h3 className="text-xl font-semibold mb-4">Contact Me</h3>
      
      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center text-green-700">
          <CheckCircle className="mr-2" size={20} />
          <p>Thank you for your message! I'll get back to you soon.</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="from_name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#3A4A5E] border border-[#4A5568] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="reply_to" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="reply_to"
              name="reply_to"
              value={formData.reply_to}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#3A4A5E] border border-[#4A5568] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 bg-[#3A4A5E] border border-[#4A5568] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              placeholder="Your message here..."
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
