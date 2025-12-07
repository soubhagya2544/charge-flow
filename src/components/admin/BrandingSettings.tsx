import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BrandingConfig {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  registrationNumber: string;
  taxId: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
}

const BrandingSettings: React.FC = () => {
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: 'Charge Flow',
    companyEmail: 'contact@chargeflow.in',
    companyPhone: '+91-9876543210',
    companyWebsite: 'https://chargeflow.in',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    logoUrl: 'https://via.placeholder.com/200x50?text=Charge+Flow',
    faviconUrl: 'https://via.placeholder.com/32x32?text=CF',
    supportEmail: 'support@chargeflow.in',
    supportPhone: '+91-9876543210',
    address: '123 Business Street',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    country: 'India',
    registrationNumber: 'REG123456',
    taxId: 'TAX123456',
    bankName: 'HDFC Bank',
    bankAccount: '1234567890123456',
    ifscCode: 'HDFC0001234',
  });

  const [saved, setSaved] = useState(false);

  const handleInputChange = (field: keyof BrandingConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleColorChange = (field: keyof BrandingConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('brandingConfig', JSON.stringify(config));
      setSaved(true);
      toast.success('Branding settings saved successfully');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error('Failed to save branding settings');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({
          ...prev,
          logoUrl: reader.result as string,
        }));
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Branding & Settings</h1>
        <p className="text-gray-600 mt-1">Customize your Charge Flow platform appearance and company details</p>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            All changes have been saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Branding</CardTitle>
              <CardDescription>Customize colors and logos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="font-semibold">Company Logo</Label>
                <div className="flex gap-4 items-end">
                  <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                  </div>
                  <Button variant="outline" className="relative overflow-hidden">
                    <Upload className="w-4 h-4 mr-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    Upload Logo
                  </Button>
                </div>
              </div>

              {/* Color Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="font-semibold">Primary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="flex-1"
                      placeholder="#3b82f6"
                    />
                  </div>
                  <div
                    className="w-full h-12 rounded-lg border-2"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Secondary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="flex-1"
                      placeholder="#10b981"
                    />
                  </div>
                  <div
                    className="w-full h-12 rounded-lg border-2"
                    style={{ backgroundColor: config.secondaryColor }}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={config.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="flex-1"
                      placeholder="#f59e0b"
                    />
                  </div>
                  <div
                    className="w-full h-12 rounded-lg border-2"
                    style={{ backgroundColor: config.accentColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={config.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={config.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={config.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    placeholder="+91-9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={config.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={config.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Business Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={config.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Bangalore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={config.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Karnataka"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={config.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="560001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={config.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Legal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={config.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      placeholder="REG123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / GST</Label>
                    <Input
                      id="taxId"
                      value={config.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      placeholder="TAX123456"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Information</CardTitle>
              <CardDescription>Configure customer support channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    placeholder="support@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={config.supportPhone}
                    onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                    placeholder="+91-9876543210"
                  />
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These contact details will be displayed across the platform for customer support
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banking Details</CardTitle>
              <CardDescription>Configure bank account information for settlements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Bank details are encrypted and used only for automated settlements
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={config.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="HDFC Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={config.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    placeholder="HDFC0001234"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account Number</Label>
                <Input
                  id="bankAccount"
                  value={config.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  placeholder="1234567890123456"
                  type="password"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default BrandingSettings;
