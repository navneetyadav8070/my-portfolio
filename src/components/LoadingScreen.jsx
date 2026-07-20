// FIXED: internal 2s timer hata diya.
// Pehle ye component khud ko 2s baad null kar deta tha, aur agar Firebase auth
// 2s se zyada leta to poora blank dark screen dikh jaata tha.
// Ab ye sirf UI dikhata hai — kab dikhana hai ye App.jsx (auth loading) decide karta hai.

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-dark flex items-center justify-center transition-opacity duration-500">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-accent/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-accent/20 rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="gradient-text">Navneet Yadav</span>
        </h1>
        <p className="text-gray-400 animate-pulse">Loading amazing things...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
