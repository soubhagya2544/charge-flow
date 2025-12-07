import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { busAPIProviderEntityConfig } from "../../entities/BusAPIProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Bus, Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, Share2, Zap, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

type BusAPIProvider = {
  id: number;
  providerName: string;
  providerCode: string;
  apiEndpoint: string;
  apiKey: string;
  apiSecret: string;
  isActive: string;
  incomingCommission: number;
  outgoingCommission: number;
  margin: number;
  apiSharingEnabled: string;
  maxDailyRequests: number;
  currentDailyRequests: number;
  priority: number;
  responseTime: number;
  successRate: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export default function BusAPIManagement() {
  const { items: providers, loading, create, update, remove } = useEntity<BusAPIProvider>(busAPIProviderEntityConfig);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<BusAPIProvider | null>(null);
  const [formData, setFormData] = useState({
    providerName: "",
    providerCode: "",
    apiEndpoint: "",
    apiKey: "",
    apiSecret: "",
    isActive: "true",
    incomingCommission: 0,
    outgoingCommission: 0,
    apiSharingEnabled: "true",
    maxDailyRequests: 10000,
    currentDailyRequests: 0,
    priority: 1,
    responseTime: 0,
    successRate: 100,
    description: "",
  });

  const handleSubmit = async () => {
    try {
      const margin = formData.incomingCommission - formData.outgoingCommission;
      
      if (editingProvider) {
        await update(editingProvider.id, { ...formData, margin });
        toast.success("API provider updated successfully!");
      } else {
        await create({ ...formData, margin });
        toast.success("API provider created successfully!");
      }
      
      setIsDialogOpen(false);
      setEditingProvider(null);
      resetForm();
    } catch (error) {
      toast.error("Failed to save API provider");
    }
  };

  const handleEdit = (provider: BusAPIProvider) => {
    setEditingProvider(provider);
    setFormData({
      providerName: provider.providerName,
      providerCode: provider.providerCode,
      apiEndpoint: provider.apiEndpoint,
      apiKey: provider.apiKey,
      apiSecret: provider.apiSecret,
      isActive: provider.isActive,
      incomingCommission: provider.incomingCommission,
      outgoingCommission: provider.outgoingCommission,
      apiSharingEnabled: provider.apiSharingEnabled,
      maxDailyRequests: provider.maxDailyRequests,
      currentDailyRequests: provider.currentDailyRequests,
      priority: provider.priority,
      responseTime: provider.responseTime,
      successRate: provider.successRate,
      description: provider.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this API provider?")) {
      try {
        await remove(id);
        toast.success("API provider deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete API provider");
      }
    }
  };

  const toggleStatus = async (provider: BusAPIProvider) => {
    try {
      await update(provider.id, { isActive: provider.isActive === "true" ? "false" : "true" });
      toast.success(`Provider ${provider.isActive === "true" ? "disabled" : "enabled"}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleAPISharing = async (provider: BusAPIProvider) => {
    try {
      await update(provider.id, { apiSharingEnabled: provider.apiSharingEnabled === "true" ? "false" : "true" });
      toast.success(`API sharing ${provider.apiSharingEnabled === "true" ? "disabled" : "enabled"}`);
    } catch (error) {
      toast.error("Failed to update API sharing");
    }
  };

  const resetForm = () => {
    setFormData({
      providerName: "",
      providerCode: "",
      apiEndpoint: "",
      apiKey: "",
      apiSecret: "",
      isActive: "true",
      incomingCommission: 0,
      outgoingCommission: 0,
      apiSharingEnabled: "true",
      maxDailyRequests: 10000,
      currentDailyRequests: 0,
      priority: 1,
      responseTime: 0,
      successRate: 100,
      description: "",
    });
  };

  const calculateStats = () => {
    const total = providers.length;
    const active = providers.filter(p => p.isActive === "true").length;
    const sharingEnabled = providers.filter(p => p.apiSharingEnabled === "true").length;
    const totalRequests = providers.reduce((sum, p) => sum + p.currentDailyRequests, 0);
    const avgIncoming = providers.reduce((sum, p) => sum + p.incomingCommission, 0) / (total || 1);
    const avgOutgoing = providers.reduce((sum, p) => sum + p.outgoingCommission, 0) / (total || 1);
    const avgMargin = providers.reduce((sum, p) => sum + p.margin, 0) / (total || 1);
    const avgResponseTime = providers.reduce((sum, p) => sum + p.responseTime, 0) / (total || 1);
    const avgSuccessRate = providers.reduce((sum, p) => sum + p.successRate, 0) / (total || 1);
    return { total, active, sharingEnabled, totalRequests, avgIncoming, avgOutgoing, avgMargin, avgResponseTime, avgSuccessRate };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading API providers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Bus API Management</h2>
          <p className="text-muted-foreground">Manage multiple bus booking API providers with sharing and commission settings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProvider(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add API Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProvider ? "Edit API Provider" : "Add New API Provider"}</DialogTitle>
              <DialogDescription>Configure bus booking API provider details and commission structure</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider Name</Label>
                  <Input
                    value={formData.providerName}
                    onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    placeholder="RedBus API"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Provider Code</Label>
                  <Input
                    value={formData.providerCode}
                    onChange={(e) => setFormData({ ...formData, providerCode: e.target.value.toUpperCase() })}
                    placeholder="REDBUS"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <Input
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  placeholder="https://api.redbus.com/v1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Secret</Label>
                  <Input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    placeholder="Enter API secret"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="RedBus API for bus ticket booking"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High (1)</SelectItem>
                      <SelectItem value="2">Medium (2)</SelectItem>
                      <SelectItem value="3">Low (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Daily Requests</Label>
                  <Input
                    type="number"
                    value={formData.maxDailyRequests}
                    onChange={(e) => setFormData({ ...formData, maxDailyRequests: parseInt(e.target.value) || 0 })}
                  />
                </div>
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
                      placeholder="5.0"
                    />
                    <p className="text-xs text-muted-foreground">Commission from API provider</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Outgoing Commission (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.outgoingCommission}
                      onChange={(e) => setFormData({ ...formData, outgoingCommission: parseFloat(e.target.value) || 0 })}
                      placeholder="4.0"
                    />
                    <p className="text-xs text-muted-foreground">Commission when sharing API</p>
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Sharing</Label>
                    <p className="text-xs text-muted-foreground">Allow others to use this API</p>
                  </div>
                  <Select value={formData.apiSharingEnabled} onValueChange={(value) => setFormData({ ...formData, apiSharingEnabled: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {editingProvider ? "Update" : "Create"} Provider
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.active} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">API Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sharingEnabled}</div>
            <p className="text-xs text-muted-foreground">Sharing enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all APIs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avgMargin.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Net profit margin</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.providerName}</CardTitle>
                    <CardDescription>{provider.providerCode}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={provider.isActive === "true" ? "default" : "secondary"}>
                    {provider.isActive === "true" ? "Active" : "Inactive"}
                  </Badge>
                  {provider.apiSharingEnabled === "true" && (
                    <Badge variant="outline" className="bg-blue-50">
                      <Share2 className="w-3 h-3 mr-1" />
                      Sharing
                    </Badge>
                  )}
                  <Badge variant="outline">Priority {provider.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Incoming
                  </div>
                  <div className="text-lg font-semibold text-green-600">+{provider.incomingCommission}%</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingDown className="w-4 h-4 text-orange-600" />
                    Outgoing
                  </div>
                  <div className="text-lg font-semibold text-orange-600">-{provider.outgoingCommission}%</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Net Margin
                  </div>
                  <div className={`text-lg font-bold ${provider.margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {provider.margin > 0 ? '+' : ''}{provider.margin.toFixed(2)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-purple-600" />
                    Requests
                  </div>
                  <div className="text-lg font-semibold">{provider.currentDailyRequests} / {provider.maxDailyRequests}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Avg Response Time
                  </div>
                  <div className="text-sm font-medium">{provider.responseTime}ms</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4" />
                    Success Rate
                  </div>
                  <div className="text-sm font-medium">{provider.successRate}%</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                {provider.apiEndpoint}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(provider)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleStatus(provider)}
                >
                  {provider.isActive === "true" ? "Disable" : "Enable"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleAPISharing(provider)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {provider.apiSharingEnabled === "true" ? "Stop Sharing" : "Enable Sharing"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(provider.id)}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {providers.length === 0 && (
          <Card className="p-12 text-center">
            <Bus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API Providers Yet</h3>
            <p className="text-muted-foreground mb-4">Add your first bus booking API provider to get started</p>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add API Provider
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
