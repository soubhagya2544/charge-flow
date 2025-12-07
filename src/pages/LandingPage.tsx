import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Zap, Shield, Users, TrendingUp, Globe } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap style={{ width: '32px', height: '32px', color: '#2563eb' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>Charge Flow</span>
            </div>

            {/* Desktop Navigation */}
            <div style={{ display: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <a href="#features" style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
                <a href="#roles" style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.2s' }}>User Roles</a>
                <a href="#benefits" style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.2s' }}>Benefits</a>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="#features" style={{ color: '#374151', textDecoration: 'none' }}>Features</a>
              <a href="#roles" style={{ color: '#374151', textDecoration: 'none' }}>User Roles</a>
              <a href="#benefits" style={{ color: '#374151', textDecoration: 'none' }}>Benefits</a>
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #f0f9ff)',
        overflow: 'hidden',
        padding: '5rem 1rem'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
              Power Your <span style={{ color: '#2563eb' }}>Recharge Business</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto 2rem' }}>
              Complete B2B recharge platform with multi-level distribution, real-time analytics, and seamless API integration
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Get Started <ArrowRight style={{ display: 'inline-block', marginLeft: '0.5rem', width: '20px', height: '20px' }} />
              </button>
              <button
                onClick={() => navigate('/admin-secure-portal')}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'white',
                  color: '#2563eb',
                  border: '2px solid #2563eb',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              Platform Features
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto' }}>
              Everything you need to manage a successful B2B recharge business
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Shield, title: 'Secure Payments', description: 'Bank-grade security with PCI DSS compliance' },
              { icon: Users, title: 'Multi-Role System', description: 'Customer, Retailer, Distributor, Master Distributor, API User, Admin' },
              { icon: TrendingUp, title: 'Real-time Analytics', description: 'Track transactions, commissions, and performance' },
              { icon: Globe, title: 'API Integration', description: 'Seamless integration with your existing systems' }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '2rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <feature.icon style={{ width: '40px', height: '40px', color: '#2563eb', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              6 Specialized User Roles
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto' }}>
              Tailored dashboards and features for each role in your distribution network
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Customer', features: ['Purchase recharges', 'View history', 'Manage wallet'] },
              { title: 'Retailer', features: ['Sell recharges', 'Commission tracking', 'Inventory management'] },
              { title: 'Distributor', features: ['Manage retailers', 'Bulk recharges', 'Advanced analytics'] },
              { title: 'Master Distributor', features: ['Multi-distributor', 'Commission control', 'Custom pricing'] },
              { title: 'API User', features: ['API integration', 'Webhook support', 'Rate limiting'] },
              { title: 'Admin', features: ['Full control', 'User management', 'System settings'] }
            ].map((role, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', marginBottom: '1rem' }}>
                  {role.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {role.features.map((feature, fidx) => (
                    <li key={fidx} style={{ color: '#4b5563', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: '#e5e7eb', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Zap style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Charge Flow</span>
          </div>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
            © 2024 Charge Flow. Complete B2B Recharge Platform. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '14px' }}>
            <a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
