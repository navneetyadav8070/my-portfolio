import { useState } from 'react';
import { FaEnvelope, FaPhone, FaGithub, FaMapMarkerAlt, FaPaperPlane, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CONTACT_INFO = {
  email: "Navneetyadav8070@gmail.com",
  phone: "+91 8826999747",
  github: "https://github.com/navneetyadav8070",
  linkedin: "https://linkedin.com/in/navneetyadav",
  location: "Greater Noida, India",
  title: "Let's Work Together",
  subtitle: "Have a project in mind? I'd love to hear about it."
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Portfolio Contact: ${formData.subject}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <div className="fade-in-section">
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{CONTACT_INFO.title}</h2>
            <p className="text-gray-400 max-w-md mx-auto">{CONTACT_INFO.subtitle}</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent/50" />
              <div className="w-2 h-2 bg-accent rounded-full" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-accent/50" />
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Contact Info</h3>
                
                <div className="space-y-3">
                  <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <FaEnvelope size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-white font-medium">{CONTACT_INFO.email}</p>
                    </div>
                  </a>

                  <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <FaPhone size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-white font-medium">{CONTACT_INFO.phone}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-white font-medium">{CONTACT_INFO.location}</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-xs text-gray-500 mb-3">Find me on</p>
                  <div className="flex gap-2">
                    <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-accent transition-all">
                      <FaGithub size={16} />
                    </a>
                    <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#0A66C2] transition-all">
                      <FaLinkedin size={16} />
                    </a>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-accent transition-all">
                      <FaEnvelope size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="glass rounded-2xl p-4 border border-accent/10 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">Available for freelance & full-time</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Send a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                        placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                        placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                      placeholder="Project inquiry" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                      className="w-full px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all resize-none"
                      placeholder="Tell me about your project..." />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent text-dark font-bold rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 border-none cursor-pointer"
                  >
                    {isSubmitted ? (
                      <>✓ Message Sent!</>
                    ) : (
                      <><FaPaperPlane /> Send Message</>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;