import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const TESTIMONIALS = [
  { name: "Rajesh Kumar", role: "CEO, TechStart India", text: "Navneet delivered an exceptional e-commerce platform for our business. The website is fast, beautiful, and our sales increased by 40%. Highly recommended!", rating: 5 },
  { name: "Priya Sharma", role: "Founder, Digital Solutions", text: "Working with Navneet was a pleasure. He understood our requirements perfectly and delivered a complex web app on time. Great communication throughout.", rating: 5 },
  { name: "Amit Patel", role: "Marketing Director", text: "The Telegram automation bot Navneet built for us saved countless hours of manual work. His AI integration expertise is top-notch. Will hire again!", rating: 5 },
];

const Testimonials = () => (
  <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    <div className="max-w-7xl mx-auto relative">
      <div className="fade-in-section">
        <div className="text-center mb-16">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">What Clients Say</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Don't take my word for it — hear from my clients</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all">
              <FaQuoteLeft className="text-accent/30 text-3xl mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-sm" />)}
              </div>
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;