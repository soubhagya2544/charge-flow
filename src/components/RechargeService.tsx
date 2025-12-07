import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Tv, Lightbulb, Wifi, Shield, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type ServiceType = 'mobile' | 'dth' | 'electricity' | 'water' | 'gas' | 'broadband' | 'insurance' | 'loan';
type MobileType = 'prepaid' | 'postpaid';

interface Operator {
  id: string;
  name: string;
  logo: string;
}

interface Plan {
  id: string;
  amount: number;
  validity: string;
  data: string;
  description: string;
}

const operators: Record<string, Operator[]> = {
  mobile: [
    { id: 'airtel', name: 'Airtel', logo: '🔴' },
    { id: 'jio', name: 'Jio', logo: '🔵' },
    { id: 'vi', name: 'Vi (Vodafone Idea)', logo: '🟠' },
    { id: 'bsnl', name: 'BSNL', logo: '🟡' },
  ],
  dth: [
    { id: 'tatasky', name: 'Tata Play', logo: '📡' },
    { id: 'airtel-dth', name: 'Airtel Digital TV', logo: '📺' },
    { id: 'dish', name: 'Dish TV', logo: '🛰️' },
    { id: 'sun-direct', name: 'Sun Direct', logo: '☀️' },
  ],
  electricity: [
    { id: 'adani', name: 'Adani Electricity', logo: '⚡' },
    { id: 'tata', name: 'Tata Power', logo: '🔌' },
    { id: 'bescom', name: 'BESCOM', logo: '💡' },
    { id: 'mseb', name: 'MSEB (Maharashtra)', logo: '⚡' },
  ],
  water: [
    { id: 'bwssb', name: 'BWSSB (Bangalore)', logo: '💧' },
    { id: 'mcgm', name: 'MCGM (Mumbai)', logo: '🌊' },
    { id: 'dwsc', name: 'Delhi Jal Board', logo: '💦' },
  ],
  gas: [
    { id: 'indane', name: 'Indane Gas', logo: '🔥' },
    { id: 'hp', name: 'HP Gas', logo: '🟢' },
    { id: 'bharat', name: 'Bharat Gas', logo: '🔴' },
  ],
  broadband: [
    { id: 'act', name: 'ACT Fibernet', logo: '🌐' },
    { id: 'airtel-fiber', name: 'Airtel Xstream Fiber', logo: '📶' },
    { id: 'jio-fiber', name: 'JioFiber', logo: '🔵' },
    { id: 'bsnl-fiber', name: 'BSNL Fiber', logo: '📡' },
  ],
};

const samplePlans: Plan[] = [
  { id: '1', amount: 239, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls' },
  { id: '2', amount: 299, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + 100 SMS/day' },
  { id: '3', amount: 479, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls' },
  { id: '4', amount: 666, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls + Disney+ Hotstar' },
  { id: '5', amount: 719, validity: '84 days', data: '2GB/day', description: 'Unlimited calls + OTT benefits' },
  { id: '6', amount: 839, validity: '84 days', data: '2GB/day', description: 'Unlimited calls + Prime & Netflix' },
];

export default function RechargeService({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'service' | 'details' | 'plans' | 'payment' | 'confirmation'>('service');
  const [serviceType, setServiceType] = useState<ServiceType>('mobile');
  const [mobileType, setMobileType] = useState<MobileType>('prepaid');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [billInfo, setBillInfo] = useState<any>(null);

  const services = [
    { type: 'mobile' as ServiceType, name: 'Mobile Recharge', icon: Zap, color: 'bg-blue-500' },
    { type: 'dth' as ServiceType, name: 'DTH Recharge', icon: Tv, color: 'bg-purple-500' },
    { type: 'electricity' as ServiceType, name: 'Electricity Bill', icon: Lightbulb, color: 'bg-yellow-500' },
    { type: 'water' as ServiceType, name: 'Water Bill', icon: Lightbulb, color: 'bg-cyan-500' },
    { type: 'gas' as ServiceType, name: 'Gas Bill', icon: Lightbulb, color: 'bg-orange-500' },
    { type: 'broadband' as ServiceType, name: 'Broadband Bill', icon: Wifi, color: 'bg-green-500' },
    { type: 'insurance' as ServiceType, name: 'Insurance', icon: Shield, color: 'bg-indigo-500' },
    { type: 'loan' as ServiceType, name: 'Loan EMI', icon: CreditCard, color: 'bg-red-500' },
  ];

  const validateNumber = () => {
    setError('');
    
    if (serviceType === 'mobile') {
      if (!/^[6-9]\d{9}$/.test(number)) {
        setError('Please enter a valid 10-digit mobile number');
        return false;
      }
    } else if (serviceType === 'dth') {
      if (number.length < 8 || number.length > 14) {
        setError('Please enter a valid subscriber ID (8-14 digits)');
        return false;
      }
    } else {
      if (number.length < 5) {
        setError('Please enter a valid account/consumer number');
        return false;
      }
    }
    
    return true;
  };

  const fetchBillInfo = async () => {
    if (!validateNumber()) return;
    
    setFetchingInfo(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (serviceType === 'electricity' || serviceType === 'water' || serviceType === 'gas' || serviceType === 'broadband') {
        setBillInfo({
          consumerName: 'John Doe',
          billAmount: Math.floor(Math.random() * 3000) + 500,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
          billPeriod: 'Jan 2025',
        });
        setStep('payment');
      } else if (serviceType === 'mobile' && mobileType === 'prepaid') {
        setStep('plans');
      } else {
        setStep('payment');
      }
      setFetchingInfo(false);
    }, 1500);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setAmount(plan.amount.toString());
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep('confirmation');
    }, 2000);
  };

  const resetForm = () => {
    setStep('service');
    setServiceType('mobile');
    setMobileType('prepaid');
    setSelectedOperator(null);
    setNumber('');
    setAmount('');
    setSelectedPlan(null);
    setError('');
    setBillInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={step === 'service' ? onBack : () => setStep(step === 'details' ? 'service' : step === 'plans' ? 'details' : step === 'payment' ? (serviceType === 'mobile' && mobileType === 'prepaid' ? 'plans' : 'details') : 'service')}
            className="p-2 hover:bg-white rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {step === 'service' && 'Select Service'}
            {step === 'details' && 'Enter Details'}
            {step === 'plans' && 'Choose Plan'}
            {step === 'payment' && 'Payment Summary'}
            {step === 'confirmation' && 'Payment Successful'}
          </h1>
        </div>

        {/* Service Selection */}
        {step === 'service' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.type}
                  onClick={() => {
                    setServiceType(service.type);
                    setStep('details');
                  }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-left"
                >
                  <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Pay bills & recharge instantly</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Details Entry */}
        {step === 'details' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {/* Mobile Type Selection */}
              {serviceType === 'mobile' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setMobileType('prepaid')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        mobileType === 'prepaid'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <div className="font-semibold text-gray-800">Prepaid</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setMobileType('postpaid')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        mobileType === 'postpaid'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">📞</div>
                        <div className="font-semibold text-gray-800">Postpaid</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Operator Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {serviceType === 'mobile' ? 'Operator' : serviceType === 'dth' ? 'DTH Provider' : 'Service Provider'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {operators[serviceType]?.map((operator) => (
                    <button
                      key={operator.id}
                      onClick={() => setSelectedOperator(operator)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedOperator?.id === operator.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{operator.logo}</span>
                        <span className="font-medium text-gray-800">{operator.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {serviceType === 'mobile' ? 'Mobile Number' : serviceType === 'dth' ? 'Subscriber ID' : 'Consumer/Account Number'}
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                    setError('');
                  }}
                  placeholder={
                    serviceType === 'mobile'
                      ? 'Enter 10-digit mobile number'
                      : serviceType === 'dth'
                      ? 'Enter subscriber ID'
                      : 'Enter consumer number'
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Custom Amount for certain services */}
              {serviceType !== 'mobile' && serviceType !== 'electricity' && serviceType !== 'water' && serviceType !== 'gas' && serviceType !== 'broadband' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              )}

              <button
                onClick={fetchBillInfo}
                disabled={!selectedOperator || !number || fetchingInfo}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {fetchingInfo ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching Details...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Plans Selection */}
        {step === 'plans' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Selected Number</p>
                  <p className="text-lg font-semibold text-gray-800">{number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Operator</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedOperator?.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Plans</h3>
              <div className="space-y-3">
                {samplePlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-gray-800">₹{plan.amount}</span>
                          <span className="text-sm text-gray-500">{plan.validity}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{plan.data} | {plan.description}</p>
                      </div>
                      <div className="text-blue-600 font-semibold">Select →</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Enter Custom Amount</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
                <button
                  onClick={() => {
                    if (amount && parseFloat(amount) >= 10) {
                      setStep('payment');
                    } else {
                      setError('Minimum amount is ₹10');
                    }
                  }}
                  disabled={!amount || parseFloat(amount) < 10}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Continue
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {step === 'payment' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold text-gray-800 capitalize">{serviceType} {serviceType === 'mobile' ? `(${mobileType})` : ''}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Operator/Provider</span>
                <span className="font-semibold text-gray-800">{selectedOperator?.name}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">
                  {serviceType === 'mobile' ? 'Mobile Number' : serviceType === 'dth' ? 'Subscriber ID' : 'Account Number'}
                </span>
                <span className="font-semibold text-gray-800">{number}</span>
              </div>

              {billInfo && (
                <>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Consumer Name</span>
                    <span className="font-semibold text-gray-800">{billInfo.consumerName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Bill Period</span>
                    <span className="font-semibold text-gray-800">{billInfo.billPeriod}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Due Date</span>
                    <span className="font-semibold text-red-600">{billInfo.dueDate}</span>
                  </div>
                </>
              )}

              {selectedPlan && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Selected Plan</p>
                  <p className="font-semibold text-gray-800">{selectedPlan.data} | {selectedPlan.validity}</p>
                  <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                </div>
              )}
              
              <div className="flex justify-between py-4 border-t-2 border-gray-300">
                <span className="text-xl font-semibold text-gray-800">Total Amount</span>
                <span className="text-3xl font-bold text-blue-600">
                  ₹{billInfo ? billInfo.billAmount : (selectedPlan ? selectedPlan.amount : amount)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500">
                🔒 Secure payment powered by Charge Flow
              </p>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirmation' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-8">Your transaction has been completed successfully</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-semibold text-gray-800">TXN{Date.now().toString().slice(-10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold text-gray-800 capitalize">{serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number</span>
                  <span className="font-semibold text-gray-800">{number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-blue-600 text-xl">
                    ₹{billInfo ? billInfo.billAmount : (selectedPlan ? selectedPlan.amount : amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-semibold text-gray-800">{new Date().toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={resetForm}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                New Transaction
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
