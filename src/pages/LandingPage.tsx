export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">Charge Flow</div>
            <div className="flex gap-4">
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</a>
              <a href="/signup" className="text-gray-700 hover:text-blue-600 transition-colors">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[500px] flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Charge Flow
          </h1>
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold mb-6">
            Power Your Recharge Business
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Complete B2B recharge platform with multi-level distribution, real-time analytics, and seamless API integration. Empower your business with cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl border border-blue-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Charge Flow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Deployment</h3>
              <p className="text-gray-700">Get your recharge business live in minutes with our pre-built infrastructure and APIs.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Analytics</h3>
              <p className="text-gray-700">Monitor transactions, commissions, and business metrics with comprehensive dashboards.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-700">Enterprise-grade security with 2FA, encryption, and comprehensive compliance support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Recharge Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using Charge Flow to scale their operations.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Charge Flow</h4>
              <p className="text-sm">Empowering recharge businesses worldwide.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Charge Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}