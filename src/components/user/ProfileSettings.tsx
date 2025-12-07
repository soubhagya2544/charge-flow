import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Shield, CreditCard, Bell, Lock, Upload, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { useAuth } from "../../context/AuthContext";
import { useEntity } from "../../hooks/useEntity";
import { userEntityConfig } from "../../entities/User";
import type { User } from "../../types";
import { toast } from "sonner";

export default function ProfileSettings() {
  const { user: currentUser } = useAuth();
  const { items: users, update } = useEntity<User>(userEntityConfig);
  const [userData, setUserData] = useState<User | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    aadharNumber: "",
    panNumber: "",
    address: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    push: true,
  });

  useEffect(() => {
    if (currentUser && users.length > 0) {
      const foundUser = users.find(u => u.email === currentUser.email);
      if (foundUser) {
        setUserData(foundUser);
        setEditData({
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          aadharNumber: foundUser.aadharNumber || "",
          panNumber: foundUser.panNumber || "",
          address: foundUser.address || "",
        });
      }
    }
  }, [currentUser, users]);

  const handleUpdateProfile = async () => {
    if (!userData) {
      toast.error("User data not loaded");
      return;
    }

    if (!editData.name || !editData.email || !editData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await update(userData.id, {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        aadharNumber: editData.aadharNumber,
        panNumber: editData.panNumber,
        address: editData.address,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!userData) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: User["role"]) => {
    const colors = {
      admin: "bg-red-500/50",
      api_user: "bg-purple-500/50",
      master_distributor: "bg-blue-500/50",
      distributor: "bg-green-500/50",
      retailer: "bg-orange-500/50",
      customer: "bg-gray-500/50",
    };
    return colors[role] || colors.customer;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
              {getInitials(userData.name)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-blue-100">{userData.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className={`${getRoleBadge(userData.role)} text-white border-0`}>
                  {userData.role.replace("_", " ").toUpperCase()}
                </Badge>
                {userData.kycStatus === "verified" && (
                  <Badge variant="secondary" className="bg-green-500/50 text-white border-0">
                    KYC Verified
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral">Referral Code</Label>
                  <Input id="referral" value={userData.referralCode} readOnly />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your full address"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>Verify your identity documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.kycStatus === "verified" ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">KYC Verified</p>
                    <p className="text-sm text-green-700">Your account is fully verified</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                  <Shield className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">KYC {userData.kycStatus}</p>
                    <p className="text-sm text-yellow-700">
                      {userData.kycStatus === "pending" && "Please submit your documents for verification"}
                      {userData.kycStatus === "submitted" && "Your documents are under review"}
                      {userData.kycStatus === "rejected" && "Your KYC was rejected. Please resubmit"}
                    </p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    placeholder="Enter 12-digit Aadhar"
                    value={editData.aadharNumber}
                    onChange={(e) => setEditData({ ...editData, aadharNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    placeholder="ABCDE1234F"
                    value={editData.panNumber}
                    onChange={(e) => setEditData({ ...editData, panNumber: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile}>
                <Save className="w-4 h-4 mr-2" />
                Update KYC Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
              <CardDescription>Manage your bank accounts for withdrawals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold">Add Bank Account</p>
                      <p className="text-sm text-gray-600">No bank accounts linked yet</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Add New Bank Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <Switch
                      id="email-notif"
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="sms-notif">SMS Notifications</Label>
                    <Switch
                      id="sms-notif"
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="whatsapp-notif">WhatsApp Notifications</Label>
                    <Switch
                      id="whatsapp-notif"
                      checked={notifications.whatsapp}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, whatsapp: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <Switch
                      id="push-notif"
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Status:</span>
                  <Badge
                    variant={
                      userData.status === "active"
                        ? "default"
                        : userData.status === "suspended"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {userData.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">{new Date(userData.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
