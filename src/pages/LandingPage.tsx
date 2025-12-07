import { useState } from 'react';
import { Menu, X, ArrowRight, Check, Star, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import RoleShowcase from '@/components/RoleShowcase';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Charge Flow</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#roles" className="text-gray-700 hover:text-blue-600 transition">User Roles</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition">Benefits</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
              <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 py-2">Features</a>
              <a href="#roles" className="block text-gray-700 hover:text-blue-600 py-2">User Roles</a>
              <a href="#benefits" className="block text-gray-700 hover:text-blue-600 py-2">Benefits</a>
              <a href="#testimonials" className="block text-gray-700 hover:text-blue-600 py-2">Testimonials</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 py-2">Contact</a>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
                <span className="text-blue-700 text-sm font-semibold">🚀 Next Gen B2B Recharge Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Power Your Recharge Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Charge Flow</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The most reliable B2B recharge platform for mobile, DTH, and digital payments. Trusted by thousands of businesses to deliver seamless transactions, real-time monitoring, and maximum profitability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                  Get Early Access <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button variant="outline" className="px-8 py-6 text-lg rounded-lg border-2 border-gray-300 hover:bg-gray-50">
                  Book a Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Check size={20} className="text-green-500" />
                  <span className="text-gray-700">99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={20} className="text-green-500" />
                  <span className="text-gray-700">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={20} className="text-green-500" />
                  <span className="text-gray-700">Zero Setup Fee</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/images/hero-fintech-dashboard.png" 
                  alt="Charge Flow Dashboard" 
                  className="w-full rounded-2xl shadow-2xl border border-gray-200"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features Built for Growth</h2>
            <p className="text-xl text-gray-600">Everything you need to scale your recharge business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="mb-6">
                <img 
                  src="/images/feature-integration.png" 
                  alt="API Integration" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless API Integration</h3>
              <p className="text-gray-600 mb-4">Connect your systems in minutes with our robust API. Full documentation and SDKs for all major platforms.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Real-time synchronization
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Webhook support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Rate limit: 10K/minute
                </li>
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="mb-6">
                <img 
                  src="/images/feature-security.png" 
                  alt="Security" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600 mb-4">Bank-level encryption and compliance. Your data is protected with military-grade security standards.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  End-to-end encryption
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  PCI-DSS Compliant
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  2FA & KYC Verification
                </li>
              </ul>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="mb-6">
                <img 
                  src="/images/feature-analytics.png" 
                  alt="Analytics" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">Comprehensive reports and insights. Track revenue, commissions, and performance in real-time.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Real-time dashboards
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Custom reports
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Export to PDF/CSV
                </li>
              </ul>
            </Card>

            {/* Feature 4 */}
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="mb-6 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Wallet System</h3>
              <p className="text-gray-600 mb-4">Flexible wallet management with instant settlements. Multiple payment methods for easy top-ups.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Multiple operators
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Instant settlement
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Auto-recharge feature
                </li>
              </ul>
            </Card>

            {/* Feature 5 */}
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="mb-6 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Operator Support</h3>
              <p className="text-gray-600 mb-4">Access all major telecom and DTH operators. Expand your service offerings instantly.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  50+ operators
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Dynamic pricing
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Instant activation
                </li>
              </ul>
            </Card>

            {/* Feature 6 */}
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="mb-6 h-40 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Expert Support</h3>
              <p className="text-gray-600 mb-4">Dedicated support team ready to help. Multiple channels for quick issue resolution.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Live chat support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  Email & phone
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  &lt;2 min response time
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Showcase Section */}
      <div id="roles">
        <RoleShowcase />
      </div>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Charge Flow?</h2>
            <p className="text-xl text-gray-600">Proven solutions for businesses of all sizes</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/images/feature-business-collaboration.png" 
                alt="Business Growth" 
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Check size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Higher Profit Margins</h3>
                  <p className="text-gray-600 mt-2">Competitive commissions and flexible pricing models. Maximize your earnings on every transaction.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Check size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Faster Settlements</h3>
                  <p className="text-gray-600 mt-2">Same-day settlements without any hidden charges. Direct bank transfers to your account.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Check size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Minimal Downtime</h3>
                  <p className="text-gray-600 mt-2">99.9% uptime guarantee with redundant systems. Never lose a transaction due to technical issues.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Check size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">White Label Solution</h3>
                  <p className="text-gray-600 mt-2">Customize and brand as your own. Run your business under your own identity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">See what our customers have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                title: 'Founder, Digital Recharge Hub',
                testimonial: 'Charge Flow transformed our business. We increased transaction volume by 300% in just 6 months. The API integration was seamless.',
                image: '👨‍💼'
              },
              {
                name: 'Priya Sharma',
                title: 'CEO, TeleCom Solutions',
                testimonial: 'The best platform we have worked with. Real-time analytics, instant settlements, and the support team is incredibly responsive.',
                image: '👩‍💼'
              },
              {
                name: 'Amit Patel',
                title: 'Managing Director, PayFlow Networks',
                testimonial: 'Charge Flow offers the perfect balance of features and ease of use. Our customers love the instant activation and reliable service.',
                image: '👨‍💼'
              },
              {
                name: 'Sneha Desai',
                title: 'Director, Digital Payments',
                testimonial: 'Outstanding support and reliability. They handle our entire recharge infrastructure. Highly recommended for any growing business.',
                image: '👩‍💼'
              },
              {
                name: 'Vikram Singh',
                title: 'Founder, Mobile Services India',
                testimonial: 'The dashboard is incredibly intuitive. Our team learned it in minutes. The commission structure is the best in the industry.',
                image: '👨‍💼'
              },
              {
                name: 'Divya Menon',
                title: 'COO, CloudPay Solutions',
                testimonial: 'Scalability is amazing. We handle thousands of transactions daily without any issues. Charge Flow just works.',
                image: '👩‍💼'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&quot;{testimonial.testimonial}&quot;</p>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-xl text-gray-600">Join thousands of successful businesses using Charge Flow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Your name"
                    required
                    className="w-full border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    required
                    className="w-full border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us about your requirements..."
                    rows={4}
                    required
                    className="w-full border-gray-300"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-lg">
                  Send Message
                </Button>
                {formSubmitted && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-lg text-sm">
                    ✓ Thank you! We'll be in touch within 24 hours.
                  </div>
                )}
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Mail size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600 mt-1">support@chargeflow.io</p>
                  <p className="text-gray-600">sales@chargeflow.io</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Phone size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Phone</h4>
                  <p className="text-gray-600 mt-1">+91-1800-CHARGE-1 (1800-24273-1)</p>
                  <p className="text-gray-600">Available 24/7</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <MapPin size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Office</h4>
                  <p className="text-gray-600 mt-1">123 Tech Park, Innovation Avenue</p>
                  <p className="text-gray-600">Bangalore, India 560001</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-600 hover:text-blue-700">API Documentation</a></li>
                  <li><a href="#" className="text-blue-600 hover:text-blue-700">Pricing Plans</a></li>
                  <li><a href="#" className="text-blue-600 hover:text-blue-700">Success Stories</a></li>
                  <li><a href="#" className="text-blue-600 hover:text-blue-700">Blog & Updates</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful businesses using Charge Flow today.</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg font-semibold shadow-lg">
            Get Early Access Now <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <span className="text-xl font-bold text-white">Charge Flow</span>
              </div>
              <p className="text-sm">The most reliable B2B recharge platform for digital payments.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 Charge Flow. All rights reserved. | Made with ❤️ for your success</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
