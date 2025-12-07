import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { commissionEntityConfig } from "../../entities/Commission";
import type { Commission } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, Edit, Trash2, Percent } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";

export default function CommissionSettings() {
  const { items: commissions, loading, create, update, remove } = useEntity<Commission>(commissionEntityConfig);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [formData, setFormData] = useState({
    role: "retailer" as Commission["role"],
    serviceType: "all" as Commission["serviceType"],
    inCommission: 0,
    outCommission: 0,
    minAmount: 0,
    maxAmount: 0,
    status: "active" as Commission["status"],
    packageId: 0,
    operatorName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCommission) {
      await update(editingCommission.id, formData);
    } else {
      await create(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      role: "retailer",
      serviceType: "all",
      inCommission: 0,
      outCommission: 0,
      minAmount: 0,
      maxAmount: 0,
      status: "active",
      packageId: 0,
      operatorName: "",
    });
    setEditingCommission(null);
  };

  const handleEdit = (commission: Commission) => {
    setEditingCommission(commission);
    setFormData({
      role: commission.role,
      serviceType: commission.serviceType,
      inCommission: commission.inCommission,
      outCommission: commission.outCommission,
      minAmount: commission.minAmount,
      maxAmount: commission.maxAmount,
      status: commission.status,
      packageId: commission.packageId,
      operatorName: commission.operatorName,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading commission settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Commission Management</CardTitle>
            <CardDescription>Set role-wise and service-wise commission rates</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Commission Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCommission ? "Edit Commission Rule" : "Add Commission Rule"}</DialogTitle>
                <DialogDescription>Configure commission rates for roles and services</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as Commission["role"] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api_user">API User</SelectItem>
                        <SelectItem value="master_distributor">Master Distributor</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value as Commission["serviceType"] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="recharge">Mobile Recharge</SelectItem>
                        <SelectItem value="dth">DTH</SelectItem>
                        <SelectItem value="electricity">Electricity</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="gas">Gas</SelectItem>
                        <SelectItem value="broadband">Broadband</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="loan">Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inCommission">In Commission %</Label>
                    <Input
                      id="inCommission"
                      type="number"
                      step="0.01"
                      value={formData.inCommission}
                      onChange={(e) => setFormData({ ...formData, inCommission: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outCommission">Out Commission %</Label>
                    <Input
                      id="outCommission"
                      type="number"
                      step="0.01"
                      value={formData.outCommission}
                      onChange={(e) => setFormData({ ...formData, outCommission: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Min Amount ₹</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Max Amount ₹</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      value={formData.maxAmount}
                      onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCommission ? "Update Rule" : "Add Rule"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {commissions.map((commission) => (
            <div key={commission.id} className="p-4 border rounded-lg hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {commission.role.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline">{commission.serviceType}</Badge>
                    <Badge variant={commission.status === "active" ? "default" : "secondary"}>
                      {commission.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-green-600" />
                      <span className="font-medium">In: {commission.inCommission}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Out: {commission.outCommission}%</span>
                    </div>
                    <div className="text-gray-600">
                      Min: ₹{commission.minAmount}
                    </div>
                    <div className="text-gray-600">
                      Max: {commission.maxAmount > 0 ? `₹${commission.maxAmount}` : "No limit"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(commission)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => remove(commission.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {commissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Percent className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No commission rules configured yet. Add your first rule to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
