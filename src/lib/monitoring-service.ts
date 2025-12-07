// Service utility for creating recharge and bus booking transactions

export const createRechargeTransaction = async (
  userId: string,
  userName: string,
  userEmail: string,
  operator: string,
  operatorCode: string,
  mobileNumber: string,
  amount: number,
  serviceType: "mobile" | "dth" = "mobile"
) => {
  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const operatorId = `OP${Date.now()}${Math.floor(Math.random() * 10000)}`;
  
  // Simulate API call success rate (90% success)
  const isSuccess = Math.random() > 0.1;
  const status = isSuccess ? "success" : Math.random() > 0.5 ? "pending" : "failed";
  
  const apiResponse = JSON.stringify({
    status: status,
    operatorTransactionId: operatorId,
    message: isSuccess ? "Recharge successful" : "Recharge failed",
    timestamp: new Date().toISOString(),
  });

  return {
    userId,
    userName,
    userEmail,
    operator,
    operatorCode,
    mobileNumber,
    amount,
    transactionId,
    operatorId: isSuccess ? operatorId : undefined,
    apiResponse,
    status,
    paymentMethod: "wallet",
    commissionAmount: isSuccess ? amount * 0.02 : 0, // 2% commission
    serviceType,
    complaintStatus: "none",
  };
};

export const createBusBooking = async (
  userId: string,
  userName: string,
  userEmail: string,
  apiProvider: string,
  apiProviderId: string,
  source: string,
  destination: string,
  amount: number,
  passengerName: string,
  passengerPhone: string,
  seatNumbers: string,
  travelDate: string
) => {
  const bookingId = `BUS${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const operatorBookingId = `OPB${Date.now()}${Math.floor(Math.random() * 10000)}`;
  
  // Simulate API call success rate (85% success)
  const isSuccess = Math.random() > 0.15;
  const status = isSuccess ? "confirmed" : Math.random() > 0.6 ? "pending" : "failed";
  
  const apiResponse = JSON.stringify({
    status: status,
    bookingId: operatorBookingId,
    pnr: isSuccess ? `PNR${Math.floor(Math.random() * 1000000)}` : undefined,
    message: isSuccess ? "Booking confirmed" : "Booking failed",
    timestamp: new Date().toISOString(),
  });

  return {
    userId,
    userName,
    userEmail,
    apiProvider,
    apiProviderId,
    bookingId,
    operatorBookingId: isSuccess ? operatorBookingId : undefined,
    busOperator: ["Volvo", "Sleeper Coach", "SRS Travels", "VRL Travels"][Math.floor(Math.random() * 4)],
    source,
    destination,
    travelDate,
    passengerName,
    passengerPhone,
    seatNumbers,
    amount,
    status,
    apiResponse,
    paymentMethod: "wallet",
    commissionAmount: isSuccess ? amount * 0.03 : 0, // 3% commission
    complaintStatus: "none",
  };
};

export const sampleOperators = [
  { name: "Airtel", code: "AIR" },
  { name: "Jio", code: "JIO" },
  { name: "Vodafone", code: "VOD" },
  { name: "BSNL", code: "BSN" },
];

export const sampleDTHOperators = [
  { name: "Airtel Digital TV", code: "ADTV" },
  { name: "Tata Play", code: "TPLY" },
  { name: "Dish TV", code: "DISH" },
  { name: "Sun Direct", code: "SUN" },
];

export const sampleRoutes = [
  { source: "Mumbai", destination: "Pune" },
  { source: "Delhi", destination: "Jaipur" },
  { source: "Bangalore", destination: "Chennai" },
  { source: "Hyderabad", destination: "Vijayawada" },
  { source: "Kolkata", destination: "Bhubaneswar" },
];

export const generateMobileNumber = () => {
  return `98765${Math.floor(10000 + Math.random() * 90000)}`;
};

export const generateAmount = (min: number = 100, max: number = 1000) => {
  return Math.floor(min + Math.random() * (max - min));
};
