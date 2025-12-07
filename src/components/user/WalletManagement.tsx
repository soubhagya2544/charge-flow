import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Wallet, ArrowUp, ArrowDown, CreditCard, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function WalletManagement() {
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const recentTransactions = [
    { id: 1, type: "credit", amount: 2000, desc: "Fund Added", date: "2024-12-06" },
    { id: 2, type: "debit", amount: 299, desc: "Mobile Recharge", date: "2024-12-06" },
    { id: 3, type: "credit", amount: 5.98, desc: "Commission Earned", date: "2024-12-05" },
    { id: 4, type: "debit", amount: 599, desc: "DTH Recharge", date: "2024-12-05" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold">₹5,250.00</h2>
            </div>
            <Wallet className="w-16 h-16 text-white/30" />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-blue-100 text-sm">Total Credit</p>
              <p className="font-semibold text-lg">₹15,250</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Debit</p>
              <p className="font-semibold text-lg">₹10,000</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Commission</p>
              <p className="font-semibold text-lg">₹1,250</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <ArrowDown className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-lg mb-1">Add Money</h3>
                <p className="text-sm text-gray-600">Add funds to wallet</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>Choose payment method and amount</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-amount">Enter Amount</Label>
                <Input
                  id="add-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(amt.toString())}
                  >
                    ₹{amt}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-mode">Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="gateway">Payment Gateway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {paymentMode === "bank_transfer" && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-sm">
                    <p className="font-semibold mb-2">Bank Details:</p>
                    <p>Bank: HDFC Bank</p>
                    <p>Account: 12345678901234</p>
                    <p>IFSC: HDFC0001234</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Upload payment receipt after transfer
                    </p>
                  </CardContent>
                </Card>
              )}
              <Button className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Pay ₹{amount || "0"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <ArrowUp className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-lg mb-1">Withdraw</h3>
            <p className="text-sm text-gray-600">Transfer to bank account</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === "credit" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowDown className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUp className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.desc}</p>
                    <p className="text-sm text-gray-600">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-lg ${
                      txn.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
