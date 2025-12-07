import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { rechargePlanEntityConfig } from "../../entities";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

type RechargePlan = {
  id: number;
  operator: string;
  amount: number;
  validity: string;
  data: string;
  voice: string;
  sms: string;
  type: string;
  benefits: string;
  description: string;
  isActive: string;
  commission: number;
  created_at: string;
  updated_at: string;
};

const OPERATORS = ["Jio", "Airtel", "Vi", "BSNL"];
const PLAN_TYPES = ["Prepaid", "Postpaid", "Data", "Roaming", "Special", "Top-up"];

// Sample comprehensive plans for auto-update
const COMPREHENSIVE_PLANS = [
  // JIO PLANS
  {
    operator: "Jio",
    amount: 155,
    validity: "28 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Jio Apps access",
      "Complimentary subscription to JioTV, JioCinema"
    ]),
    description: "Perfect monthly plan with unlimited calling and daily data",
    commission: 2,
  },
  {
    operator: "Jio",
    amount: 239,
    validity: "28 days",
    data: "1.5GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Netflix Mobile (1 month)",
      "Jio Apps"
    ]),
    description: "Entertainment pack with Netflix Mobile subscription",
    commission: 2.5,
  },
  {
    operator: "Jio",
    amount: 299,
    validity: "28 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Disney+ Hotstar Mobile (3 months)",
      "Jio Apps"
    ]),
    description: "OTT combo with Disney+ Hotstar",
    commission: 2.5,
  },
  {
    operator: "Jio",
    amount: 399,
    validity: "28 days",
    data: "3GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "All Jio Apps premium",
      "Priority customer care"
    ]),
    description: "Premium plan with extra data",
    commission: 3,
  },
  {
    operator: "Jio",
    amount: 666,
    validity: "84 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Jio Apps for 84 days",
      "Best value for money"
    ]),
    description: "Quarterly plan with maximum savings",
    commission: 2.5,
  },
  {
    operator: "Jio",
    amount: 2999,
    validity: "365 days",
    data: "2.5GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Full year validity",
      "Maximum savings",
      "All Jio Apps"
    ]),
    description: "Annual plan with best per-day cost",
    commission: 3,
  },
  {
    operator: "Jio",
    amount: 19,
    validity: "1 day",
    data: "Unlimited",
    voice: "Unlimited",
    sms: "20 SMS",
    type: "Data",
    benefits: JSON.stringify(["Emergency data top-up", "Full day validity"]),
    description: "Quick data boost for urgent needs",
    commission: 1.5,
  },

  // AIRTEL PLANS
  {
    operator: "Airtel",
    amount: 179,
    validity: "28 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Airtel Xstream Play",
      "Wynk Music",
      "Free Hellotunes"
    ]),
    description: "Popular monthly plan with entertainment benefits",
    commission: 2,
  },
  {
    operator: "Airtel",
    amount: 265,
    validity: "28 days",
    data: "1.5GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Disney+ Hotstar Mobile (3 months)",
      "Airtel Xstream Play"
    ]),
    description: "Entertainment combo with Hotstar",
    commission: 2.5,
  },
  {
    operator: "Airtel",
    amount: 299,
    validity: "28 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Apollo 24/7 Circle",
      "Free Hellotunes",
      "Shaw Academy courses"
    ]),
    description: "Health and wellness benefits included",
    commission: 2.5,
  },
  {
    operator: "Airtel",
    amount: 455,
    validity: "28 days",
    data: "3GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Amazon Prime (1 month)",
      "All Airtel premium services"
    ]),
    description: "Premium plan with Amazon Prime",
    commission: 3,
  },
  {
    operator: "Airtel",
    amount: 719,
    validity: "84 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "Airtel Xstream for 84 days",
      "Quarterly savings"
    ]),
    description: "3-month value pack",
    commission: 2.5,
  },
  {
    operator: "Airtel",
    amount: 3359,
    validity: "365 days",
    data: "2.5GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Unlimited 5G data",
      "365 days validity",
      "All premium benefits",
      "Maximum savings"
    ]),
    description: "Full year plan with maximum benefits",
    commission: 3,
  },

  // VI (VODAFONE IDEA) PLANS
  {
    operator: "Vi",
    amount: 155,
    validity: "28 days",
    data: "1GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Weekend data rollover",
      "Vi Movies & TV",
      "Binge all night"
    ]),
    description: "Basic monthly pack with weekend benefits",
    commission: 2,
  },
  {
    operator: "Vi",
    amount: 249,
    validity: "28 days",
    data: "1.5GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Weekend data rollover",
      "SonyLIV Premium",
      "Vi Movies & TV"
    ]),
    description: "Entertainment pack with SonyLIV",
    commission: 2.5,
  },
  {
    operator: "Vi",
    amount: 299,
    validity: "28 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Weekend data rollover",
      "All Vi entertainment apps",
      "Data delight"
    ]),
    description: "Popular plan with extra weekend data",
    commission: 2.5,
  },
  {
    operator: "Vi",
    amount: 449,
    validity: "28 days",
    data: "3GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Weekend data rollover",
      "Disney+ Hotstar Mobile",
      "Priority network"
    ]),
    description: "Premium with Hotstar subscription",
    commission: 3,
  },
  {
    operator: "Vi",
    amount: 666,
    validity: "84 days",
    data: "1.5GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Weekend data rollover",
      "Vi entertainment for 84 days",
      "Quarterly savings"
    ]),
    description: "3-month economy pack",
    commission: 2.5,
  },
  {
    operator: "Vi",
    amount: 2899,
    validity: "365 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Weekend data rollover",
      "Full year validity",
      "All benefits included"
    ]),
    description: "Annual value plan",
    commission: 3,
  },

  // BSNL PLANS
  {
    operator: "BSNL",
    amount: 107,
    validity: "28 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "BSNL Tunes",
      "Eros Now",
      "Most affordable plan"
    ]),
    description: "Budget-friendly monthly plan",
    commission: 2,
  },
  {
    operator: "BSNL",
    amount: 153,
    validity: "35 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Extended 35-day validity",
      "BSNL Tunes",
      "Eros Now"
    ]),
    description: "Extended validity plan",
    commission: 2,
  },
  {
    operator: "BSNL",
    amount: 187,
    validity: "45 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "45 days validity",
      "All entertainment",
      "Best value"
    ]),
    description: "45-day special plan",
    commission: 2.5,
  },
  {
    operator: "BSNL",
    amount: 397,
    validity: "80 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "80 days validity",
      "Maximum savings",
      "All benefits"
    ]),
    description: "Long validity plan",
    commission: 2.5,
  },
  {
    operator: "BSNL",
    amount: 797,
    validity: "160 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "160 days validity",
      "Half-yearly plan",
      "Best value for money"
    ]),
    description: "Half-year value pack",
    commission: 3,
  },
  {
    operator: "BSNL",
    amount: 1999,
    validity: "365 days",
    data: "2GB/day",
    voice: "Unlimited",
    sms: "100 SMS/day",
    type: "Prepaid",
    benefits: JSON.stringify([
      "Full year validity",
      "Lowest annual plan price",
      "Maximum savings"
    ]),
    description: "Most affordable annual plan",
    commission: 3,
  },

  // DATA TOP-UP PLANS (All Operators)
  {
    operator: "Jio",
    amount: 15,
    validity: "1 day",
    data: "1GB",
    voice: "N/A",
    sms: "N/A",
    type: "Data",
    benefits: JSON.stringify(["Extra data", "No calling/SMS"]),
    description: "Data-only top-up",
    commission: 1.5,
  },
  {
    operator: "Airtel",
    amount: 48,
    validity: "28 days",
    data: "3GB",
    voice: "N/A",
    sms: "N/A",
    type: "Data",
    benefits: JSON.stringify(["Data add-on", "Valid with existing plan"]),
    description: "Extra data add-on",
    commission: 1.5,
  },
  {
    operator: "Vi",
    amount: 51,
    validity: "28 days",
    data: "4GB",
    voice: "N/A",
    sms: "N/A",
    type: "Data",
    benefits: JSON.stringify(["Data boost", "Works with base plan"]),
    description: "Quick data boost",
    commission: 1.5,
  },
];

export default function RechargePlanManagement() {
  const {
    items: plans,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  } = useEntity<RechargePlan>(rechargePlanEntityConfig);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOperator, setFilterOperator] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");

  const [formData, setFormData] = useState({
    operator: "",
    amount: "",
    validity: "",
    data: "",
    voice: "",
    sms: "",
    type: "",
    benefits: "",
    description: "",
    commission: "2",
  });

  const handleAutoUpdate = async () => {
    try {
      let updatedCount = 0;
      let addedCount = 0;

      // Update or add all comprehensive plans
      for (const plan of COMPREHENSIVE_PLANS) {
        // Check if plan exists
        const existingPlan = plans.find(
          (p) =>
            p.operator === plan.operator &&
            p.amount === plan.amount &&
            p.type === plan.type
        );

        if (existingPlan) {
          // Update existing plan
          await update(existingPlan.id, {
            ...plan,
            isActive: "true",
          });
          updatedCount++;
        } else {
          // Add new plan
          await create({
            ...plan,
            isActive: "true",
          });
          addedCount++;
        }
      }

      await reload();
      toast.success(
        `Plans updated! Added ${addedCount} new plans, updated ${updatedCount} existing plans`
      );
    } catch (err) {
      console.error("Auto-update error:", err);
      toast.error("Failed to update plans. Please try again.");
    }
  };

  const handleAddPlan = async () => {
    try {
      if (!formData.operator || !formData.amount || !formData.validity || !formData.type) {
        toast.error("Please fill in all required fields");
        return;
      }

      await create({
        operator: formData.operator,
        amount: parseFloat(formData.amount),
        validity: formData.validity,
        data: formData.data,
        voice: formData.voice,
        sms: formData.sms,
        type: formData.type,
        benefits: formData.benefits,
        description: formData.description,
        commission: parseFloat(formData.commission),
        isActive: "true",
      });

      toast.success("Plan added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
      await reload();
    } catch (err) {
      console.error("Add plan error:", err);
      toast.error("Failed to add plan");
    }
  };

  const handleEditPlan = async () => {
    if (!selectedPlan) return;

    try {
      await update(selectedPlan.id, {
        operator: formData.operator,
        amount: parseFloat(formData.amount),
        validity: formData.validity,
        data: formData.data,
        voice: formData.voice,
        sms: formData.sms,
        type: formData.type,
        benefits: formData.benefits,
        description: formData.description,
        commission: parseFloat(formData.commission),
      });

      toast.success("Plan updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
      resetForm();
      await reload();
    } catch (err) {
      console.error("Edit plan error:", err);
      toast.error("Failed to update plan");
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      await remove(id);
      toast.success("Plan deleted successfully!");
      await reload();
    } catch (err) {
      console.error("Delete plan error:", err);
      toast.error("Failed to delete plan");
    }
  };

  const openEditDialog = (plan: RechargePlan) => {
    setSelectedPlan(plan);
    setFormData({
      operator: plan.operator,
      amount: plan.amount.toString(),
      validity: plan.validity,
      data: plan.data,
      voice: plan.voice,
      sms: plan.sms,
      type: plan.type,
      benefits: plan.benefits,
      description: plan.description,
      commission: plan.commission.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      operator: "",
      amount: "",
      validity: "",
      data: "",
      voice: "",
      sms: "",
      type: "",
      benefits: "",
      description: "",
      commission: "2",
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Operator",
      "Amount",
      "Validity",
      "Data",
      "Voice",
      "SMS",
      "Type",
      "Description",
      "Commission%",
    ];
    const csvData = filteredPlans.map((plan) => [
      plan.operator,
      plan.amount,
      plan.validity,
      plan.data,
      plan.voice,
      plan.sms,
      plan.type,
      plan.description,
      plan.commission,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recharge-plans-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.amount.toString().includes(searchTerm);

    const matchesOperator =
      filterOperator === "All" || plan.operator === filterOperator;
    const matchesType = filterType === "All" || plan.type === filterType;

    return matchesSearch && matchesOperator && matchesType;
  });

  // Group by operator
  const plansByOperator = OPERATORS.reduce((acc, operator) => {
    acc[operator] = filteredPlans.filter((p) => p.operator === operator);
    return acc;
  }, {} as Record<string, RechargePlan[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recharge plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading plans: {String(error)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recharge Plan Management
          </h2>
          <p className="text-gray-600">
            Manage all telecom operator recharge plans and benefits
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAutoUpdate} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto-Update All Plans
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Total Plans</div>
            <div className="text-3xl font-bold text-blue-600">{plans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Active Plans</div>
            <div className="text-3xl font-bold text-green-600">
              {plans.filter((p) => p.isActive === "true").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Operators</div>
            <div className="text-3xl font-bold text-purple-600">
              {OPERATORS.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Plan Types</div>
            <div className="text-3xl font-bold text-orange-600">
              {PLAN_TYPES.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterOperator} onValueChange={setFilterOperator}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Operators</SelectItem>
                {OPERATORS.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {PLAN_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans by Operator */}
      <Tabs defaultValue="Jio" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {OPERATORS.map((operator) => (
            <TabsTrigger key={operator} value={operator}>
              {operator}{" "}
              <Badge variant="secondary" className="ml-2">
                {plansByOperator[operator]?.length || 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {OPERATORS.map((operator) => (
          <TabsContent key={operator} value={operator}>
            <Card>
              <CardHeader>
                <CardTitle>{operator} Recharge Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Voice</TableHead>
                        <TableHead>SMS</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plansByOperator[operator]?.length > 0 ? (
                        plansByOperator[operator].map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell className="font-semibold">
                              ₹{plan.amount}
                            </TableCell>
                            <TableCell>{plan.validity}</TableCell>
                            <TableCell>{plan.data}</TableCell>
                            <TableCell>{plan.voice}</TableCell>
                            <TableCell>{plan.sms}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{plan.type}</Badge>
                            </TableCell>
                            <TableCell>{plan.commission}%</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  plan.isActive === "true"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {plan.isActive === "true"
                                  ? "Active"
                                  : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(plan)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeletePlan(plan.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <p className="text-gray-500">
                              No plans found for {operator}
                            </p>
                            <Button
                              className="mt-4"
                              onClick={handleAutoUpdate}
                              variant="outline"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Load Default Plans
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Recharge Plan</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Operator *</Label>
              <Select
                value={formData.operator}
                onValueChange={(value) =>
                  setFormData({ ...formData, operator: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₹) *</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="299"
              />
            </div>
            <div>
              <Label>Validity *</Label>
              <Input
                value={formData.validity}
                onChange={(e) =>
                  setFormData({ ...formData, validity: e.target.value })
                }
                placeholder="28 days"
              />
            </div>
            <div>
              <Label>Plan Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                placeholder="2GB/day"
              />
            </div>
            <div>
              <Label>Voice</Label>
              <Input
                value={formData.voice}
                onChange={(e) =>
                  setFormData({ ...formData, voice: e.target.value })
                }
                placeholder="Unlimited"
              />
            </div>
            <div>
              <Label>SMS</Label>
              <Input
                value={formData.sms}
                onChange={(e) =>
                  setFormData({ ...formData, sms: e.target.value })
                }
                placeholder="100 SMS/day"
              />
            </div>
            <div>
              <Label>Commission (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.commission}
                onChange={(e) =>
                  setFormData({ ...formData, commission: e.target.value })
                }
                placeholder="2"
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Plan description"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <Label>Benefits (JSON format)</Label>
              <Textarea
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                placeholder='["Unlimited 5G", "OTT subscription"]'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPlan}>Add Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Recharge Plan</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Operator *</Label>
              <Select
                value={formData.operator}
                onValueChange={(value) =>
                  setFormData({ ...formData, operator: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₹) *</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Validity *</Label>
              <Input
                value={formData.validity}
                onChange={(e) =>
                  setFormData({ ...formData, validity: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Plan Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Voice</Label>
              <Input
                value={formData.voice}
                onChange={(e) =>
                  setFormData({ ...formData, voice: e.target.value })
                }
              />
            </div>
            <div>
              <Label>SMS</Label>
              <Input
                value={formData.sms}
                onChange={(e) =>
                  setFormData({ ...formData, sms: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Commission (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.commission}
                onChange={(e) =>
                  setFormData({ ...formData, commission: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <Label>Benefits (JSON format)</Label>
              <Textarea
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditPlan}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
