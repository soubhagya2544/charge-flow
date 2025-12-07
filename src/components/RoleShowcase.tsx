import React, { useState } from 'react';
import { 
  Users, Store, Network, Briefcase, Code, Shield, 
  CreditCard, TrendingUp, Zap, Lock, BarChart3, Globe,
  ArrowRight, CheckCircle2 
} from 'lucide-react';

interface Role {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  benefits: string[];
  cta: string;
}

const roles: Role[] = [
  {
    id: 'customer',
    title: 'Customer',
    subtitle: 'Simple & Instant Recharges',
    description: 'Experience hassle-free mobile and DTH recharges with instant processing and secure transactions.',
    image: '/images/customer-role-hero.png',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Mobile Prepaid & Postpaid Recharges',
      'DTH Recharges for All Operators',
      '40+ Pre-loaded Plans',
      'Instant Transaction Processing',
      'Digital Wallet Management',
      'Transaction History & Receipts'
    ],
    benefits: [
      'Save time with quick recharges',
      'Secure payment processing',
      'Track all your transactions',
      'Special offers and cashback'
    ],
    cta: 'Start Recharging Now'
  },
  {
    id: 'retailer',
    title: 'Retailer',
    subtitle: 'Grow Your Retail Business',
    description: 'Manage your retail outlet efficiently with our comprehensive point-of-sale system and earn attractive commissions.',
    image: '/images/retailer-role-hero.png',
    icon: Store,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Point-of-Sale Dashboard',
      'Customer Management',
      'Commission Tracking',
      'Fund Request System',
      'Real-time Transaction Updates',
      'Business Analytics'
    ],
    benefits: [
      'Earn commission on every transaction',
      'Manage multiple customers',
      'Track your earnings in real-time',
      'Grow your business with analytics'
    ],
    cta: 'Become a Retailer'
  },
  {
    id: 'distributor',
    title: 'Distributor',
    subtitle: 'Manage Your Retail Network',
    description: 'Build and manage a network of retailers with powerful tools for commission management and business growth.',
    image: '/images/distributor-role-hero.png',
    icon: Network,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Retailer Network Management',
      'Multi-level Commission System',
      'Fund Distribution',
      'Performance Analytics',
      'Retailer Support Tools',
      'Revenue Tracking'
    ],
    benefits: [
      'Build a profitable retail network',
      'Earn from retailer transactions',
      'Monitor network performance',
      'Scale your business efficiently'
    ],
    cta: 'Join as Distributor'
  },
  {
    id: 'master-distributor',
    title: 'Master Distributor',
    subtitle: 'Control Regional Operations',
    description: 'Oversee entire regions with advanced tools for managing distributors, retailers, and maximizing revenue.',
    image: '/images/master-distributor-hero.png',
    icon: Briefcase,
    color: 'from-orange-500 to-red-500',
    features: [
      'Regional Network Control',
      'Distributor Management',
      'Advanced Analytics Dashboard',
      'Commission Hierarchy Management',
      'Performance Monitoring',
      'Strategic Business Reports'
    ],
    benefits: [
      'Maximize regional revenue',
      'Control entire distribution chain',
      'Access premium analytics',
      'Build enterprise-level operations'
    ],
    cta: 'Become Master Distributor'
  },
  {
    id: 'api-user',
    title: 'API User',
    subtitle: 'Integrate & Automate',
    description: 'Seamlessly integrate Charge Flow into your platform with our robust API and comprehensive documentation.',
    image: '/images/api-user-role-hero.png',
    icon: Code,
    color: 'from-indigo-500 to-blue-600',
    features: [
      'RESTful API Access',
      'Webhook Integration',
      'Comprehensive Documentation',
      'API Keys & Security',
      'Real-time Transaction Status',
      'Developer Support'
    ],
    benefits: [
      'Automate recharge operations',
      'Integrate with your platform',
      'Scale with API reliability',
      'Priority developer support'
    ],
    cta: 'Get API Access'
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Complete Platform Control',
    description: 'Full platform management with advanced tools for user management, monitoring, and strategic decision-making.',
    image: '/images/admin-role-hero.png',
    icon: Shield,
    color: 'from-red-600 to-pink-600',
    features: [
      'User Management (CRUD)',
      'Fund Request Approval',
      'Live Transaction Monitoring',
      'Recharge Plan Management',
      'Advanced Analytics & Reports',
      'Security & Compliance Tools'
    ],
    benefits: [
      'Total platform oversight',
      'Manage all user roles',
      'Monitor system health',
      'Make data-driven decisions'
    ],
    cta: 'Admin Login'
  }
];

export default function RoleShowcase() {
  const [activeRole, setActiveRole] = useState<string>('customer');

  const currentRole = roles.find(r => r.id === activeRole) || roles[0];
  const Icon = currentRole.icon;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for Every User Role
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From individual customers to enterprise distributors, Charge Flow provides tailored experiences 
            for every type of user with role-specific features and benefits.
          </p>
        </div>

        {/* Role Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-semibold
                  transition-all duration-300 transform hover:scale-105
                  ${activeRole === role.id
                    ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <RoleIcon className="w-5 h-5" />
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Image & Overview */}
            <div className={`bg-gradient-to-br ${currentRole.color} p-8 md:p-12 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">{currentRole.title}</h3>
                    <p className="text-white/90 text-lg">{currentRole.subtitle}</p>
                  </div>
                </div>

                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  {currentRole.description}
                </p>

                <div className="mb-8">
                  <img 
                    src={currentRole.image} 
                    alt={currentRole.title}
                    className="rounded-2xl shadow-2xl border-4 border-white/20 w-full object-cover"
                  />
                </div>

                <button className="w-full bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  {currentRole.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side - Features & Benefits */}
            <div className="p-8 md:p-12">
              {/* Key Features */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <h4 className="text-2xl font-bold text-gray-900">Key Features</h4>
                </div>
                <div className="space-y-3">
                  {currentRole.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <h4 className="text-2xl font-bold text-gray-900">Benefits</h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {currentRole.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${currentRole.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-white shadow-2xl">
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users already using Charge Flow. Choose your role and start today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Sign Up Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
