import { FaGlobe, FaMobile, FaRobot, FaShoppingCart, FaCode, FaSearch, FaHandshake, FaCreditCard, FaLaptopCode, FaCheckCircle, FaRocket, FaArrowRight, FaLock, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { 
    id: "website",
    icon: <FaGlobe />, 
    title: "Custom Websites", 
    description: "Hand-coded, responsive websites tailored to your business. Fast loading, SEO-optimized, mobile-friendly, and scalable.",
    features: ["5-10 Pages", "Responsive Design", "SEO Setup", "Contact Form", "Admin Panel"],
    originalPrice: "₹25,000 - ₹50,000",
    discountPrice: "₹15,000 - ₹45,000",
    discount: "10% OFF",
    duration: "1-3 weeks",
    popular: false
  },
  { 
    id: "ecommerce",
    icon: <FaShoppingCart />, 
    title: "E-Commerce Solutions", 
    description: "Full-featured online stores with payment gateway, product management, cart, checkout & admin dashboard.",
    features: ["Unlimited Products", "Payment Gateway", "Order Management", "Inventory System", "Admin Dashboard"],
    originalPrice: "₹50,000 - ₹1,50,000",
    discountPrice: "₹35,000 - ₹1,35,000",
    discount: "15% OFF",
    duration: "3-8 weeks",
    popular: true
  },
  { 
    id: "webapp",
    icon: <FaCode />, 
    title: "Web Applications", 
    description: "Complex custom web apps with React/Node.js, database, auth, real-time features & API integrations.",
    features: ["User Authentication", "Database Design", "API Development", "Real-time Features", "Cloud Deployment"],
    originalPrice: "₹70,000 - ₹3,00,000",
    discountPrice: "₹50,000 - ₹2,70,000",
    discount: "10% OFF",
    duration: "4-12 weeks",
    popular: false
  },
  { 
    id: "ai",
    icon: <FaRobot />, 
    title: "AI Integration & Chatbots", 
    description: "Integrate ChatGPT/Claude AI, build smart chatbots & AI-powered automation tools.",
    features: ["OpenAI/Claude API", "Custom Chatbot", "RAG Implementation", "Prompt Engineering", "AI Automation"],
    originalPrice: "₹35,000 - ₹1,00,000",
    discountPrice: "₹25,000 - ₹90,000",
    discount: "10% OFF",
    duration: "2-6 weeks",
    popular: false
  },
  { 
    id: "android",
    icon: <FaMobile />, 
    title: "Android App Development", 
    description: "Native Android apps with Material Design, Firebase backend & Play Store deployment.",
    features: ["Native Android", "Firebase Backend", "Push Notifications", "Material Design", "Play Store Launch"],
    originalPrice: "₹55,000 - ₹2,00,000",
    discountPrice: "₹40,000 - ₹1,80,000",
    discount: "15% OFF",
    duration: "4-10 weeks",
    popular: false
  },
  { 
    id: "seo",
    icon: <FaSearch />, 
    title: "Digital Marketing & SEO", 
    description: "Complete digital marketing: SEO, Google Ads, Meta Ads, keyword research & analytics.",
    features: ["SEO Optimization", "Google Ads", "Meta Ads", "Keyword Research", "Monthly Reports"],
    originalPrice: "₹15,000 - ₹30,000/mo",
    discountPrice: "₹10,000 - ₹28,000/mo",
    discount: "7% OFF",
    duration: "Monthly retainer",
    popular: false
  }
];

const PAYMENT_STEPS = [
  {
    step: "01",
    icon: <FaHandshake />,
    title: "Discuss & Get Quote",
    description: "We discuss your requirements via call/email. I'll provide a custom quote. Final amount will be discussed personally.",
    time: "Free Consultation"
  },
  {
    step: "02",
    icon: <FaCreditCard />,
    title: "Choose Payment Option",
    description: "Enter the agreed amount. Choose to pay 50% advance or full payment. Secure payment via Razorpay.",
    time: "2 Minutes",
    highlight: true
  },
  {
    step: "03",
    icon: <FaLaptopCode />,
    title: "Development & Demo",
    description: "I'll build your project with regular updates. Live demo provided for your review and feedback.",
    time: "As per timeline"
  },
  {
    step: "04",
    icon: <FaCheckCircle />,
    title: "Review & Approve",
    description: "Test everything on demo. Request changes if needed until you're 100% satisfied.",
    time: "Until Satisfied"
  },
  {
    step: "05",
    icon: <FaRocket />,
    title: "Final Payment & Launch",
    description: "Pay remaining balance. Get complete source code, deployment, and post-launch support.",
    time: "Project Complete",
    highlight: true
  }
];

const Services = () => {
  const navigate = useNavigate();

  const handleSelectService = (service) => {
    navigate(`/checkout?service=${service.id}&name=${encodeURIComponent(service.title)}`);
  };

  return (
    <section id="services" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 hex-bg opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="fade-in-section">
          
          {/* ========== HEADER ========== */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-accent/10 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-accent text-xs uppercase tracking-widest">Services & Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              What I <span className="gradient-text">Offer</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Professional development services with limited-time discounts. 
              Final price discussed personally based on your requirements.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent/50" />
              <div className="w-2 h-2 bg-accent rounded-full" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent/50" />
            </div>
          </div>

          {/* ========== SERVICES GRID ========== */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-20">
            {SERVICES.map((service, i) => (
              <div key={i} className={`glass rounded-2xl p-5 sm:p-6 border transition-all duration-300 group flex flex-col relative overflow-hidden ${
                service.popular ? 'border-accent/30 shadow-xl shadow-accent/10 bg-accent/[0.02]' : 'border-white/5 hover:border-accent/30'
              }`}>
                
                {/* Badges */}
                <div className="absolute top-0 right-0 flex flex-col gap-1">
                  {service.popular && (
                    <div className="bg-gradient-to-r from-accent to-green-400 text-dark text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl">
                      🔥 MOST POPULAR
                    </div>
                  )}
                  <div className={`${service.popular ? 'mt-1' : ''} bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl flex items-center gap-1`}>
                    <FaTag size={10} />
                    {service.discount}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl sm:text-2xl mb-4 group-hover:bg-accent group-hover:text-dark transition-all duration-300">
                  {service.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{service.title}</h3>
                
                {/* Description */}
                <p className="text-gray-400 text-xs sm:text-sm mb-4 flex-grow">{service.description}</p>

                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-accent text-[10px]">✓</span> {feature}
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t border-white/5 pt-4 mt-auto space-y-3">
                  {/* Original Price (Strikethrough) */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs line-through">{service.originalPrice}</span>
                    <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {service.discount}
                    </span>
                  </div>
                  
                  {/* Discounted Price */}
                  <div>
                    <p className="text-accent font-bold text-lg sm:text-xl">{service.discountPrice}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">*Final price discussed personally</p>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration}
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleSelectService(service)}
                    className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-dark font-semibold py-3 px-4 rounded-xl transition-all text-sm active:scale-95 shadow-lg shadow-accent/10"
                  >
                    Select & Proceed
                    <FaArrowRight size={12} />
                  </button>
                  
                  <p className="text-gray-600 text-[10px] text-center">
                    Price finalized after discussion
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ========== DISCOUNT BANNER ========== */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-4 glass rounded-2xl border border-accent/20 bg-accent/[0.02]">
              <span className="text-2xl">🎉</span>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Limited Time Offer!</p>
                <p className="text-gray-400 text-xs">
                  Get <span className="text-accent font-semibold">7-15% discount</span> on all services. 
                  <span className="hidden sm:inline"> Contact now to lock your price!</span>
                </p>
              </div>
            </div>
          </div>

          {/* ========== HOW IT WORKS ========== */}
          <div className="mb-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-accent/10 mb-6">
                <FaCheckCircle className="text-accent text-xs" />
                <span className="text-accent text-xs uppercase tracking-widest">Simple Process</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Discuss → Agree on price → Pay 50% or Full → Get your project delivered
              </p>
            </div>

            <div className="glass rounded-3xl p-6 sm:p-10 border border-accent/10 max-w-3xl mx-auto">
              <div className="space-y-5">
                {PAYMENT_STEPS.map((step, i) => (
                  <div key={i} className="relative">
                    {i < PAYMENT_STEPS.length - 1 && (
                      <div className="absolute left-[27px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-accent/30 to-accent/10 sm:left-[35px]" />
                    )}
                    
                    <div className={`flex gap-4 sm:gap-5 items-start ${step.highlight ? 'glass rounded-2xl p-4 sm:p-5 border-2 border-accent/30 bg-accent/[0.03]' : 'p-2'}`}>
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-base ${
                        step.highlight 
                          ? 'bg-accent text-dark shadow-lg shadow-accent/20' 
                          : 'bg-dark-card text-accent border-2 border-accent/20'
                      }`}>
                        {step.icon}
                      </div>
                      
                      <div className="flex-grow pt-0.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            step.highlight ? 'bg-accent/20 text-accent' : 'bg-white/5 text-gray-500'
                          }`}>
                            {step.step}
                          </span>
                          <span className="text-[10px] text-gray-600">{step.time}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold mb-1 text-white">{step.title}</h4>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== GUARANTEE ========== */}
          <div className="text-center mt-10">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-4 glass rounded-2xl border border-accent/10">
              <span className="text-2xl">🛡️</span>
              <span className="text-gray-400 text-sm text-center">
                <span className="text-accent font-semibold">100% Satisfaction Guarantee</span>
                <span className="hidden sm:inline"> • </span>
                <br className="sm:hidden" />
                Pay after discussing price • 50% or Full payment • Full refund if not satisfied
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;