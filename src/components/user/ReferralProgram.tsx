import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Gift, Users, Copy, Share2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ReferralProgram() {
  const referralCode = "RETAIL001";
  const referralLink = `https://chargeflow.com/signup?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const referralStats = [
    { label: "Total Referrals", value: "12", icon: Users, color: "text-blue-600" },
    { label: "Active Users", value: "8", icon: TrendingUp, color: "text-green-600" },
    { label: "Total Earnings", value: "₹1,250", icon: Gift, color: "text-purple-600" },
  ];

  const referredUsers = [
    { name: "Rahul Kumar", phone: "98765*****", joinDate: "2024-12-01", earnings: "₹150", status: "active" },
    { name: "Priya Sharma", phone: "91234*****", joinDate: "2024-11-28", earnings: "₹200", status: "active" },
    { name: "Amit Patel", phone: "87654*****", joinDate: "2024-11-25", earnings: "₹125", status: "inactive" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Referral Program</h2>
              <p className="text-purple-100">Invite friends and earn rewards</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-purple-100 mb-2">Your Referral Code</p>
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="bg-white text-gray-900 font-semibold text-lg"
              />
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(referralCode)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-3">
            <p className="text-sm text-purple-100 mb-2">Referral Link</p>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-white text-gray-900 text-sm"
              />
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(referralLink)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {referralStats.map((stat, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Earn rewards by referring new users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Code</h3>
              <p className="text-sm text-gray-600">
                Share your unique referral code with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-gray-600">
                Your friend signs up using your referral code
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-gray-600">
                Get ₹100 when they complete their first transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Users you have referred</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referredUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.phone} • Joined {user.joinDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 mb-1">{user.earnings}</p>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
