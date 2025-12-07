import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { telecomOperatorEntityConfig } from "../../entities/TelecomOperator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Phone, Tv, Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { toast } from "sonner";

type TelecomOperator = {
  id: number;
  operatorName: string;
  operatorType: "mobile" | "dth";
  operatorCode: string;
  logo: string;
  isActive: string;
  incomingCommission: number;
  outgoingCommission: number;
  margin: number;
  minRechargeAmount: number;
  maxRechargeAmount: number;
  description: string;
  created_at: string;
  updated_at: string;
};

const defaultOperators = [
  { name: "Airtel", type: "mobile", code: "AIRTEL", logo: "📱" },
  { name: "Jio", type: "mobile", code: "JIO", logo: "📱" },
  { name: "Vodafone", type: "mobile", code: "VODAFONE", logo: "📱" },
  { name: "BSNL", type: "mobile", code: "BSNL", logo: "📱" },
  { name: "Airtel Digital TV", type: "dth", code: "AIRTEL_DTH", logo: "📺" },
  { name: "Tata Play", type: "dth", code: "TATA_PLAY", logo: "📺" },
  { name: "Dish TV", type: "dth", code: "DISH_TV", logo: "📺" },
  { name: "Sun Direct", type: "dth", code: "SUN_DIRECT", logo: "📺" },
  { name: "D2H", type: "dth", code: "D2H", logo: "📺" },
];

export default function OperatorManagement() {
  const { items: operators, loading, create, update, remove } = useEntity<TelecomOperator>(telecomOperatorEntityConfig);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<TelecomOperator | null>(null);
  const [formData, setFormData] = useState({
    operatorName: "",
    operatorType: "mobile" as "mobile" | "dth",
    operatorCode: "",
    logo: "📱",
    isActive: "true",
    incomingCommission: 0,
    outgoingCommission: 0,
    minRechargeAmount: 10,
    maxRechargeAmount: 10000,
    description: "",
  });

  const handleInitializeDefaults = async () => {
    try {
      for (const op of defaultOperators) {
        const exists = operators.find(o => o.operatorCode === op.code);
        if (!exists) {
          const incoming = op.type === "mobile" ? 2.5 : 3.0;
          const outgoing = op.type === "mobile" ? 2.0 : 2.5;
          await create({
            operatorName: op.name,
            operatorType: op.type as "mobile" | "dth",
            operatorCode: op.code,
            logo: op.logo,
            isActive: "true",
            incomingCommission: incoming,
            outgoingCommission: outgoing,
            margin: incoming - outgoing,
            minRechargeAmount: 10,
            maxRechargeAmount: 10000,
            description: `${op.name} ${op.type === "mobile" ? "Mobile" : "DTH"} Recharge`,
          });
        }
      }
      toast.success("Default operators initialized successfully!");
    } catch (error) {
      toast.error("Failed to initialize operators");
    }
  };

  const handleSubmit = async () => {
    try {
      const margin = formData.incomingCommission - formData.outgoingCommission;
      
      if (editingOperator) {
        await update(editingOperator.id, { ...formData, margin });
        toast.success("Operator updated successfully!");
      } else {
        await create({ ...formData, margin });
        toast.success("Operator created successfully!");
      }
      
      setIsDialogOpen(false);
      setEditingOperator(null);
      resetForm();
    } catch (error) {
      toast.error("Failed to save operator");
    }
  };

  const handleEdit = (operator: TelecomOperator) => {
    setEditingOperator(operator);
    setFormData({
      operatorName: operator.operatorName,
      operatorType: operator.operatorType,
      operatorCode: operator.operatorCode,
      logo: operator.logo,
      isActive: operator.isActive,
      incomingCommission: operator.incomingCommission,
      outgoingCommission: operator.outgoingCommission,
      minRechargeAmount: operator.minRechargeAmount,
      maxRechargeAmount: operator.maxRechargeAmount,
      description: operator.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this operator?")) {
      try {
        await remove(id);
        toast.success("Operator deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete operator");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      operatorName: "",
      operatorType: "mobile",
      operatorCode: "",
      logo: "📱",
      isActive: "true",
      incomingCommission: 0,
      outgoingCommission: 0,
      minRechargeAmount: 10,
      maxRechargeAmount: 10000,
      description: "",
    });
  };

  const mobileOperators = operators.filter(op => op.operatorType === "mobile");
  const dthOperators = operators.filter(op => op.operatorType === "dth");

  const calculateStats = (ops: TelecomOperator[]) => {
    const total = ops.length;
    const active = ops.filter(op => op.isActive === "true").length;
    const avgIncoming = ops.reduce((sum, op) => sum + op.incomingCommission, 0) / (total || 1);
    const avgOutgoing = ops.reduce((sum, op) => sum + op.outgoingCommission, 0) / (total || 1);
    const avgMargin = ops.reduce((sum, op) => sum + op.margin, 0) / (total || 1);
    return { total, active, avgIncoming, avgOutgoing, avgMargin };
  };

  const allStats = calculateStats(operators);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading operators...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Operator Management</h2>
          <p className="text-muted-foreground">Manage telecom operators and DTH providers with commission settings</p>
        </div>
        <div className="flex gap-2">
          {operators.length === 0 && (
            <Button onClick={handleInitializeDefaults} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Initialize Default Operators
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingOperator(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Operator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingOperator ? "Edit Operator" : "Add New Operator"}</DialogTitle>
                <DialogDescription>Configure operator details and commission structure</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Operator Name</Label>
                    <Input
                      value={formData.operatorName}
                      onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                      placeholder="Airtel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator Type</Label>
                    <Select value={formData.operatorType} onValueChange={(value: "mobile" | "dth") => setFormData({ ...formData, operatorType: value, logo: value === "mobile" ? "📱" : "📺" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="dth">DTH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Operator Code</Label>
                    <Input
                      value={formData.operatorCode}
                      onChange={(e) => setFormData({ ...formData, operatorCode: e.target.value.toUpperCase() })}
                      placeholder="AIRTEL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.isActive} onValueChange={(value) => setFormData({ ...formData, isActive: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mobile recharge operator"
                  />
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Commission Structure</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Incoming Commission (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.incomingCommission}
                        onChange={(e) => setFormData({ ...formData, incomingCommission: parseFloat(e.target.value) || 0 })}
                        placeholder="2.5"
                      />
                      <p className="text-xs text-muted-foreground">Commission you receive from operator</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Outgoing Commission (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.outgoingCommission}
                        onChange={(e) => setFormData({ ...formData, outgoingCommission: parseFloat(e.target.value) || 0 })}
                        placeholder="2.0"
                      />
                      <p className="text-xs text-muted-foreground">Commission you pay to retailers</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Net Margin:</span>
                      <span className={`text-lg font-bold ${(formData.incomingCommission - formData.outgoingCommission) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(formData.incomingCommission - formData.outgoingCommission).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Recharge Limits</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Amount (₹)</Label>
                      <Input
                        type="number"
                        value={formData.minRechargeAmount}
                        onChange={(e) => setFormData({ ...formData, minRechargeAmount: parseInt(e.target.value) || 10 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Amount (₹)</Label>
                      <Input
                        type="number"
                        value={formData.maxRechargeAmount}
                        onChange={(e) => setFormData({ ...formData, maxRechargeAmount: parseInt(e.target.value) || 10000 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>
                  {editingOperator ? "Update" : "Create"} Operator
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Operators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allStats.total}</div>
            <p className="text-xs text-muted-foreground">{allStats.active} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Incoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{allStats.avgIncoming.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Commission received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Outgoing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{allStats.avgOutgoing.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Commission paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{allStats.avgMargin.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Net profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Operators</TabsTrigger>
          <TabsTrigger value="mobile">
            <Phone className="w-4 h-4 mr-2" />
            Mobile ({mobileOperators.length})
          </TabsTrigger>
          <TabsTrigger value="dth">
            <Tv className="w-4 h-4 mr-2" />
            DTH ({dthOperators.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OperatorList operators={operators} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="mobile">
          <OperatorList operators={mobileOperators} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="dth">
          <OperatorList operators={dthOperators} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OperatorList({ 
  operators, 
  onEdit, 
  onDelete 
}: { 
  operators: TelecomOperator[]; 
  onEdit: (op: TelecomOperator) => void; 
  onDelete: (id: number) => void; 
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {operators.map((operator) => (
        <Card key={operator.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{operator.logo}</div>
                <div>
                  <CardTitle className="text-lg">{operator.operatorName}</CardTitle>
                  <CardDescription>{operator.operatorCode}</CardDescription>
                </div>
              </div>
              <Badge variant={operator.isActive === "true" ? "default" : "secondary"}>
                {operator.isActive === "true" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Incoming
                </span>
                <span className="font-semibold text-green-600">+{operator.incomingCommission}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                  Outgoing
                </span>
                <span className="font-semibold text-orange-600">-{operator.outgoingCommission}%</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Net Margin
                </span>
                <span className={`font-bold ${operator.margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {operator.margin > 0 ? '+' : ''}{operator.margin.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Limit: ₹{operator.minRechargeAmount} - ₹{operator.maxRechargeAmount}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(operator)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(operator.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
