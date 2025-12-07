import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Shield, Key, User, LogOut, Smartphone } from "lucide-react";
import { useEntity } from "../../hooks/useEntity";
import { userEntityConfig } from "../../entities";
import TwoFactorManagement from "../TwoFactorManagement";

type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  kycStatus?: string;
  accountStatus?: string;
  aadharNumber?: string;
  panNumber?: string;
  address?: string;
  parentId?: string;
  ipAddress?: string;
  twoFactorEnabled?: string;
  created_at: string;
  updated_at: string;
};

interface AdminProfileSettingsProps {
  adminEmail: string;
  onLogout: () => void;
}

export default function AdminProfileSettings({ adminEmail, onLogout }: AdminProfileSettingsProps) {
  const { items: users, update, loading, error } = useEntity<User>(userEntityConfig);
  const [admin, setAdmin] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const adminUser = users.find((u) => u.email === adminEmail && u.role === "admin");
    if (adminUser) {
      setAdmin(adminUser);
      setFormData({
        name: adminUser.name || "",
        email: adminUser.email || "",
        phone: adminUser.phone || "",
        address: adminUser.address || "",
      });
    }
  }, [users, adminEmail]);

  const handleProfileUpdate = async () => {
    if (!admin) return;

    try {
      await update(admin.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (!admin) return;

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwordData.currentPassword !== admin.password) {
      alert("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    try {
      await update(admin.id, {
        password: passwordData.newPassword,
      });
      alert("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div>Loading admin profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !admin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-600">Failed to load admin profile</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Settings</h2>
          <p className="text-muted-foreground">Manage your admin account and security</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Key className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="2fa">
            <Smartphone className="mr-2 h-4 w-4" />
            Two-Factor Auth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value="Administrator"
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your address"
                />
              </div>

              <div className="pt-4 border-t">
                <div className="grid gap-2 text-sm">
                  <p><strong>Account Status:</strong> <span className="text-green-600">Active</span></p>
                  <p><strong>Member Since:</strong> {new Date(admin.created_at).toLocaleDateString()}</p>
                  <p><strong>Last Updated:</strong> {new Date(admin.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              <Button onClick={handleProfileUpdate} className="w-full">
                Save Profile Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900">Security Tips</p>
                    <ul className="mt-2 space-y-1 text-yellow-800">
                      <li>• Use a strong, unique password</li>
                      <li>• Include uppercase, lowercase, numbers, and symbols</li>
                      <li>• Avoid common words or personal information</li>
                      <li>• Enable two-factor authentication for extra security</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={handlePasswordChange} className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa">
          <TwoFactorManagement userEmail={adminEmail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
