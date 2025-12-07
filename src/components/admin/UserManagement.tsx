import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { userEntityConfig } from "../../entities/User";
import { walletEntityConfig } from "../../entities/Wallet";
import type { User } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, UserPlus, Edit, Trash2, Eye, Shield, X, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "sonner";

type Wallet = {
  id: number;
  userId: string;
  balance: number;
  totalFunded: number;
  totalSpent: number;
  commissionEarned: number;
  created_at: string;
  updated_at: string;
};

export default function UserManagement() {
  const { items: users, loading, create, update, remove } = useEntity<User>(userEntityConfig);
  const { create: createWallet } = useEntity<Wallet>(walletEntityConfig);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer" as User["role"],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const generateReferralCode = () => {
    return 'CF' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    const emailExists = users.some(u => u.email === newUser.email);
    if (emailExists) {
      toast.error("Email already exists");
      return;
    }

    try {
      await create({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
        role: newUser.role,
        referralCode: generateReferralCode(),
        walletBalance: 0,
        kycStatus: "pending",
        status: "active",
      });

      await createWallet({
        userId: newUser.email,
        balance: 0,
        totalFunded: 0,
        totalSpent: 0,
        commissionEarned: 0,
      });

      toast.success("User created successfully!");
      setShowAddDialog(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "customer",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      kycStatus: user.kycStatus,
      aadharNumber: user.aadharNumber,
      panNumber: user.panNumber,
      address: user.address,
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !editUser.name || !editUser.email || !editUser.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await update(selectedUser.id, {
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
        status: editUser.status,
        kycStatus: editUser.kycStatus,
        aadharNumber: editUser.aadharNumber,
        panNumber: editUser.panNumber,
        address: editUser.address,
      });

      toast.success("User updated successfully!");
      setShowEditDialog(false);
      setSelectedUser(null);
      setEditUser({});
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getRoleBadge = (role: User["role"]) => {
    const colors = {
      admin: "bg-red-100 text-red-700 border-red-300",
      api_user: "bg-purple-100 text-purple-700 border-purple-300",
      master_distributor: "bg-blue-100 text-blue-700 border-blue-300",
      distributor: "bg-green-100 text-green-700 border-green-300",
      retailer: "bg-orange-100 text-orange-700 border-orange-300",
      customer: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[role] || colors.customer;
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all platform users and roles</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="api_user">API User</SelectItem>
                <SelectItem value="master_distributor">Master Distributor</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.referralCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{user.email}</p>
                        <p className="text-gray-600">{user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadge(user.role)}>
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        ₹{user.walletBalance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.kycStatus === "verified"
                            ? "default"
                            : user.kycStatus === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {user.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "suspended"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleViewUser(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(user.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the platform. A wallet will be created automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as User["role"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="master_distributor">Master Distributor</SelectItem>
                  <SelectItem value="api_user">API User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about this user</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-500">Full Name</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Phone Number</Label>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">User Role</Label>
                  <Badge variant="outline" className={getRoleBadge(selectedUser.role)}>
                    {selectedUser.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Referral Code</Label>
                  <p className="font-medium">{selectedUser.referralCode}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Wallet Balance</Label>
                  <p className="font-semibold text-green-600">₹{selectedUser.walletBalance.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">KYC Status</Label>
                  <Badge
                    variant={
                      selectedUser.kycStatus === "verified"
                        ? "default"
                        : selectedUser.kycStatus === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedUser.kycStatus}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Account Status</Label>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "default"
                        : selectedUser.status === "suspended"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
                {selectedUser.aadharNumber && (
                  <div className="space-y-2">
                    <Label className="text-gray-500">Aadhar Number</Label>
                    <p className="font-medium">{selectedUser.aadharNumber}</p>
                  </div>
                )}
                {selectedUser.panNumber && (
                  <div className="space-y-2">
                    <Label className="text-gray-500">PAN Number</Label>
                    <p className="font-medium">{selectedUser.panNumber}</p>
                  </div>
                )}
                {selectedUser.address && (
                  <div className="space-y-2 col-span-2">
                    <Label className="text-gray-500">Address</Label>
                    <p className="font-medium">{selectedUser.address}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-gray-500">Account Created</Label>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Last Updated</Label>
                  <p className="font-medium">{new Date(selectedUser.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editUser.name || ""}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={editUser.phone || ""}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">User Role *</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) => setEditUser({ ...editUser, role: value as User["role"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="master_distributor">Master Distributor</SelectItem>
                    <SelectItem value="api_user">API User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-kyc">KYC Status</Label>
                <Select
                  value={editUser.kycStatus}
                  onValueChange={(value) => setEditUser({ ...editUser, kycStatus: value as User["kycStatus"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Account Status</Label>
                <Select
                  value={editUser.status}
                  onValueChange={(value) => setEditUser({ ...editUser, status: value as User["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-aadhar">Aadhar Number</Label>
                <Input
                  id="edit-aadhar"
                  placeholder="XXXX XXXX XXXX"
                  value={editUser.aadharNumber || ""}
                  onChange={(e) => setEditUser({ ...editUser, aadharNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-pan">PAN Number</Label>
                <Input
                  id="edit-pan"
                  placeholder="ABCDE1234F"
                  value={editUser.panNumber || ""}
                  onChange={(e) => setEditUser({ ...editUser, panNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  placeholder="Enter full address"
                  value={editUser.address || ""}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
