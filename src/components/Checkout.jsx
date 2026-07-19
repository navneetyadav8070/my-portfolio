import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FaLock, FaCreditCard, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

// Your Razorpay Key ID (Test Mode)
const RAZORPAY_KEY_ID = "rzp_test_TFXHxHcLMW7T9l";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [error, setError] = useState('');

  const serviceId = searchParams.get('service') || 'custom';
  const serviceName = searchParams.get('name') || 'Custom Project';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login?redirect=checkout');
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 🔥 FIXED: Better script loading
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      // Timeout after 20 seconds
      const timeout = setTimeout(() => {
        script.remove();
        resolve(false);
      }, 20000);

      script.onload = () => {
        clearTimeout(timeout);
        if (window.Razorpay) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const calculateAmount = () => {
    const total = parseInt(totalAmount);
    if (!total || total <= 0) return 0;
    
    if (paymentType === 'half') {
      return Math.round(total / 2);
    }
    return total;
  };

  const handlePayment = async () => {
    if (!totalAmount || parseInt(totalAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!paymentType) {
      setError('Please select payment option (50% or Full)');
      return;
    }

    setError('');
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      setError('Payment gateway loading failed. Please check your internet and try again.');
      setLoading(false);
      return;
    }

    const total = parseInt(totalAmount);
    const payAmount = calculateAmount();
    const isHalfPayment = paymentType === 'half';
    const remainingAmount = isHalfPayment ? total - payAmount : 0;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: payAmount * 100,
      currency: "INR",
      name: "Navneet Yadav - Freelance Developer",
      description: `${isHalfPayment ? '50% Advance' : 'Full Payment'} - ${serviceName}`,
      image: "",
      prefill: {
        name: user?.displayName || '',
        email: user?.email || '',
        contact: user?.phoneNumber || ''
      },
      theme: { color: "#00ff88" },
      notes: {
        service: serviceName,
        totalAmount: total.toString(),
        paymentType: paymentType,
        remainingAmount: remainingAmount.toString()
      },
      handler: async function(response) {
        const details = {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          amount: payAmount,
          totalAmount: total,
          remainingAmount: remainingAmount,
          paymentType: paymentType,
          serviceName: serviceName,
          serviceId: serviceId,
          clientEmail: user.email,
          clientName: user.displayName || user.email,
          date: new Date().toISOString()
        };

        // Save to Firestore
        try {
          await addDoc(collection(db, 'projects'), {
            clientEmail: user.email,
            clientName: user.displayName || user.email,
            projectName: serviceName,
            serviceType: serviceId,
            totalAmount: total,
            paidAmount: payAmount,
            remainingAmount: remainingAmount,
            paymentType: paymentType,
            status: isHalfPayment ? 'advance_paid' : 'fully_paid',
            progress: isHalfPayment ? 10 : 50,
            paymentId: response.razorpay_payment_id,
            paymentDate: serverTimestamp(),
            milestones: [
              { title: 'Project Setup', completed: true },
              { title: 'Development', completed: false },
              { title: 'Testing', completed: false },
              { title: 'Deployment', completed: false }
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Error saving project:', err);
        }

        setPaymentDetails(details);
        setPaymentSuccess(true);
        setLoading(false);
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay open error:', err);
      setError('Failed to open payment window. Please try again.');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('INR', '₹');
  };

  // Success Page
  if (paymentSuccess && paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
        <div className="glass rounded-3xl p-8 sm:p-10 border border-accent/20 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
            <p className="text-gray-400">Your project has been created successfully.</p>
          </div>

          <div className="glass rounded-2xl p-5 border border-accent/10 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment ID</span>
              <span className="text-white font-mono text-xs">{paymentDetails.paymentId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Service</span>
              <span className="text-white">{paymentDetails.serviceName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-white font-bold">{formatCurrency(paymentDetails.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Paid</span>
              <span className="text-accent font-bold">{formatCurrency(paymentDetails.amount)}</span>
            </div>
            {paymentDetails.remainingAmount > 0 && (
              <div className="flex justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-gray-400">Remaining</span>
                <span className="text-yellow-400 font-bold">{formatCurrency(paymentDetails.remainingAmount)}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link to="/dashboard" className="block w-full py-4 bg-accent text-dark font-bold rounded-2xl hover:bg-accent-hover transition-all text-center">
              Go to My Projects →
            </Link>
            <button onClick={() => window.print()} className="block w-full py-3 glass text-white font-medium rounded-2xl border border-white/10 hover:border-accent/30 transition-all text-center">
              📄 Print / Save Receipt
            </button>
            <Link to="/" className="block w-full py-3 text-gray-400 hover:text-white transition-all text-center text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Page
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 sm:p-10 border border-accent/10 max-w-md w-full">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
          <FaArrowLeft size={14} /> Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 rounded-full mb-4">
            <FaLock className="text-accent text-xs" />
            <span className="text-accent text-xs font-medium">Secure Payment</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>

        <div className="glass rounded-2xl p-4 border border-accent/10 mb-6">
          <p className="text-xs text-gray-500 uppercase mb-1">Selected Service</p>
          <p className="text-white font-bold text-lg">{serviceName}</p>
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-400 mb-2">
            Enter Agreed Amount <span className="text-accent">(Discussed via call/email)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
            <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Enter total project amount"
              className="w-full pl-10 pr-4 py-4 bg-dark text-white text-lg font-bold rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all" />
          </div>
        </div>

        {totalAmount && parseInt(totalAmount) > 0 && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-3">Choose Payment Option</label>
            <div className="space-y-3">
              <button onClick={() => setPaymentType('half')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentType === 'half' ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-accent/30 glass'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentType === 'half' ? 'border-accent bg-accent' : 'border-gray-500'}`}>
                  {paymentType === 'half' && <FaCheckCircle className="text-dark text-xs" />}
                </div>
                <div>
                  <p className="text-white font-semibold">Pay 50% Advance</p>
                  <p className="text-accent font-bold">{formatCurrency(Math.round(parseInt(totalAmount) / 2))}</p>
                  <p className="text-gray-500 text-xs">Remaining {formatCurrency(Math.round(parseInt(totalAmount) / 2))} after demo</p>
                </div>
              </button>

              <button onClick={() => setPaymentType('full')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentType === 'full' ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-accent/30 glass'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentType === 'full' ? 'border-accent bg-accent' : 'border-gray-500'}`}>
                  {paymentType === 'full' && <FaCheckCircle className="text-dark text-xs" />}
                </div>
                <div>
                  <p className="text-white font-semibold">Pay Full Amount</p>
                  <p className="text-accent font-bold">{formatCurrency(parseInt(totalAmount))}</p>
                  <p className="text-gray-500 text-xs">One-time payment, no balance</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <FaShieldAlt className="text-accent" />
          <span>100% secure payment • Full refund if not satisfied</span>
        </div>

        <button onClick={handlePayment} disabled={loading || !totalAmount || !paymentType}
          className="w-full flex items-center justify-center gap-3 py-4 bg-accent text-dark font-bold rounded-2xl hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shadow-xl shadow-accent/20 text-lg">
          {loading ? (
            <div className="w-6 h-6 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
          ) : (
            <>
              <FaCreditCard />
              {paymentType === 'half' 
                ? `Pay 50% - ${formatCurrency(calculateAmount())}`
                : paymentType === 'full'
                ? `Pay Full - ${formatCurrency(calculateAmount())}`
                : 'Select payment option above'}
            </>
          )}
        </button>

        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-gray-500 text-xs text-center mb-3">Need help with the amount?</p>
          <div className="flex gap-3">
            <a href="tel:+918826999747" className="flex-1 flex items-center justify-center gap-2 py-2.5 glass rounded-xl text-sm text-gray-400 hover:text-white transition-all">
              <FaPhone size={12} /> Call
            </a>
            <a href="mailto:Navneetyadav8070@gmail.com" className="flex-1 flex items-center justify-center gap-2 py-2.5 glass rounded-xl text-sm text-gray-400 hover:text-white transition-all">
              <FaEnvelope size={12} /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;