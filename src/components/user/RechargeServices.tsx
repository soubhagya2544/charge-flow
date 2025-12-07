import { useState } from 'react';
import RechargeService from '../RechargeService';
import { Zap, Tv, Lightbulb, Droplet, Flame, Wifi, Shield, CreditCard } from 'lucide-react';

export default function RechargeServices() {
  const [showRechargeService, setShowRechargeService] = useState(false);

  const services = [
    { type: 'mobile', name: 'Mobile Recharge', icon: Zap, color: 'bg-blue-500', description: 'Prepaid & Postpaid' },
    { type: 'dth', name: 'DTH Recharge', icon: Tv, color: 'bg-purple-500', description: 'All DTH operators' },
    { type: 'electricity', name: 'Electricity Bill', icon: Lightbulb, color: 'bg-yellow-500', description: 'Pay electricity bills' },
    { type: 'water', name: 'Water Bill', icon: Droplet, color: 'bg-cyan-500', description: 'Water bill payment' },
    { type: 'gas', name: 'Gas Bill', icon: Flame, color: 'bg-orange-500', description: 'Book & pay gas bills' },
    { type: 'broadband', name: 'Broadband Bill', icon: Wifi, color: 'bg-green-500', description: 'Internet bill payment' },
    { type: 'insurance', name: 'Insurance', icon: Shield, color: 'bg-indigo-500', description: 'Insurance premium' },
    { type: 'loan', name: 'Loan EMI', icon: CreditCard, color: 'bg-red-500', description: 'Pay loan EMI' },
  ];

  if (showRechargeService) {
    return <RechargeService onBack={() => setShowRechargeService(false)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Recharge & Bill Payments</h2>
        <p className="text-gray-600 mt-2">Quick and secure payments for all your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.type}
              onClick={() => setShowRechargeService(true)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-left"
            >
              <div className={`${service.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Mobile Recharge</p>
                <p className="text-sm text-gray-500">9876543210</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">₹299</p>
              <p className="text-xs text-green-600">Success</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Tv className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">DTH Recharge</p>
                <p className="text-sm text-gray-500">1234567890</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">₹450</p>
              <p className="text-xs text-green-600">Success</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
