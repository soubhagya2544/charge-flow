import { useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { apiConfigEntityConfig } from "../../entities/ApiConfig";
import type { ApiConfig } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, Power, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

export default function ApiManagement() {
  const { items: apis, loading, create, update, remove } = useEntity<ApiConfig>(apiConfigEntityConfig);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<ApiConfig | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "recharge" as ApiConfig["type"],
    endpoint: "",
    authKey: "",
    authType: "bearer" as ApiConfig["authType"],
    priority: 1,
    status: "active" as ApiConfig["status"],
    commission: 0,
    parameters: "",
    headers: "",
    successCodes: "",
    testMode: "false"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApi) {
      await update(editingApi.id, formData);
    } else {
      await create(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "recharge",
      endpoint: "",
      authKey: "",
      authType: "bearer",
      priority: 1,
      status: "active",
      commission: 0,
      parameters: "",
      headers: "",
      successCodes: "",
      testMode: "false"
    });
    setEditingApi(null);
  };

  const handleEdit = (api: ApiConfig) => {
    setEditingApi(api);
    setFormData({
      name: api.name,
      type: api.type,
      endpoint: api.endpoint,
      authKey: api.authKey,
      authType: api.authType,
      priority: api.priority,
      status: api.status,
      commission: api.commission,
      parameters: api.parameters,
      headers: api.headers,
      successCodes: api.successCodes,
      testMode: api.testMode
    });
    setIsDialogOpen(true);
  };

  const toggleApiStatus = async (api: ApiConfig) => {
    await update(api.id, {
      status: api.status === "active" ? "inactive" : "active"
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading APIs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage multiple recharge APIs</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add API
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingApi ? "Edit API" : "Add New API"}</DialogTitle>
                <DialogDescription>Configure API connection settings</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">API Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Service Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ApiConfig["type"] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    placeholder="https://api.example.com/recharge"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authKey">Authentication Key</Label>
                    <Input
                      id="authKey"
                      type="password"
                      value={formData.authKey}
                      onChange={(e) => setFormData({ ...formData, authKey: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authType">Auth Type</Label>
                    <Select value={formData.authType} onValueChange={(value) => setFormData({ ...formData, authType: value as ApiConfig["authType"] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission %</Label>
                    <Input
                      id="commission"
                      type="number"
                      step="0.01"
                      value={formData.commission}
                      onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ApiConfig["status"] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="testMode">Test Mode</Label>
                  <Switch
                    id="testMode"
                    checked={formData.testMode === "true"}
                    onCheckedChange={(checked) => setFormData({ ...formData, testMode: checked ? "true" : "false" })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingApi ? "Update API" : "Add API"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {apis.map((api) => (
            <div key={api.id} className="p-4 border rounded-lg hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{api.name}</h3>
                    <Badge variant={api.status === "active" ? "default" : "secondary"}>
                      {api.status}
                    </Badge>
                    <Badge variant="outline">{api.type}</Badge>
                    {api.testMode === "true" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Test Mode
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Endpoint:</span>
                      <p className="truncate">{api.endpoint}</p>
                    </div>
                    <div>
                      <span className="font-medium">Auth Type:</span>
                      <p>{api.authType}</p>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>
                      <p>{api.priority}</p>
                    </div>
                    <div>
                      <span className="font-medium">Commission:</span>
                      <p>{api.commission}%</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => toggleApiStatus(api)}
                  >
                    <Power className={`w-4 h-4 ${api.status === "active" ? "text-green-600" : "text-gray-400"}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(api)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => remove(api.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {apis.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No APIs configured yet. Add your first API to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
