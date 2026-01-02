"use client";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 dark:bg-emerald-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-200 dark:bg-teal-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <div className="animate-fade-in-up">
            <h1 className="nepali-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900 dark:text-white">
              कृषि सहयोगी
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 gradient-text">
              AI-Powered Farming Marketplace
            </h2>
          </div>

          {/* Subtitle */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
              <span className="nepali-text">किसानहरूलाई सशक्त बनाउँदै</span>
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Connect farmers with buyers, get AI-powered disease detection, and receive smart seasonal recommendations
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: '0.4s' }}>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover-lift">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 text-lg font-semibold rounded-full shadow-md hover:shadow-xl border-2 border-emerald-500 transition-all duration-300 hover:scale-105">
              Learn More
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 sm:px-8 lg:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Empowering farmers with modern technology and AI-driven insights
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Feature 1: Yield */}
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-emerald-900/20 hover:shadow-2xl transition-all duration-300 hover-lift border border-emerald-100 dark:border-emerald-800 text-center">
              <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden bg-white/50">
                <img
                  src="/assets/images/Yield.png"
                  alt="Yield Prediction"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Yield Prediction
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Predict your crop yields accurately using AI. Plan harvests, estimate income, and make informed farming decisions.
              </p>
            </div>

            {/* Feature 2: Crop */}
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-800 dark:to-violet-900/20 hover:shadow-2xl transition-all duration-300 hover-lift border border-violet-100 dark:border-violet-800 text-center">
              <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden bg-white/50">
                <img
                  src="/assets/images/Crop.png"
                  alt="Crop Recommendation"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Crop Recommendation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Get smart crop suggestions based on season, soil type, weather, and market demand to maximize profits.
              </p>
            </div>

            {/* Feature 3: Disease */}
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-red-900/20 hover:shadow-2xl transition-all duration-300 hover-lift border border-red-100 dark:border-red-800 text-center">
              <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden bg-white/50">
                <img
                  src="/assets/images/Disease.png"
                  alt="Disease Detection"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Disease Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Instantly identify crop diseases with AI image analysis. Get treatment solutions and protect your harvest.
              </p>
            </div>

            {/* Feature 4: Farmer */}
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-blue-900/20 hover:shadow-2xl transition-all duration-300 hover-lift border border-blue-100 dark:border-blue-800 text-center">
              <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden bg-white/50">
                <img
                  src="/assets/images/Farmer.png"
                  alt="Farmer Network"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Farmer Network
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Connect with fellow farmers, share experiences, learn best practices, and build a strong farming community.
              </p>
            </div>

            {/* Feature 5: Plantation */}
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-amber-900/20 hover:shadow-2xl transition-all duration-300 hover-lift border border-amber-100 dark:border-amber-800 text-center">
              <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden bg-white/50">
                <img
                  src="/assets/images/Plantation.png"
                  alt="Plantation Guide"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Plantation Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Step-by-step planting instructions, optimal spacing, watering schedules, and care tips for successful farming.
              </p>
            </div>

            {/* Feature 6: Marketplace */}
            <div className="group p-10 rounded-2xl bg-gradient-to-br from-teal-50 to-green-50 dark:from-gray-800 dark:to-teal-900/20 hover:shadow-2xl transition-all duration-300 hover-lift border border-teal-100 dark:border-teal-800 text-center">
              <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden bg-white/50">
                <img
                  src="/assets/images/Marketplace.png"
                  alt="Marketplace"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Marketplace
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Buy and sell agricultural products directly. Fair prices, quality produce, and seamless transactions for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-800 dark:to-green-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span className="nepali-text">सुरु गर्नुहोस्</span>
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Join thousands of farmers already using our platform to grow their business
          </p>
          <button className="px-10 py-5 bg-white text-emerald-600 text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 dark:bg-black text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            © 2026 कृषि सहयोगी - Krishi Sahayogi. All rights reserved.
          </p>
          <p className="text-xs mt-2 nepali-text">
            किसानहरूका लागि, किसानहरूद्वारा
          </p>
        </div>
      </footer>
    </main>
  );
}
