import { useEntity } from "../../hooks/useEntity";
import { kycEntityConfig } from "../../entities/KYC";
import type { KYC } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle, Eye, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function KYCManagement() {
  const { items: kycRequests, loading, update } = useEntity<KYC>(kycEntityConfig);

  const handleApprove = async (kyc: KYC) => {
    await update(kyc.id, {
      status: "verified",
      verifiedAt: new Date().toISOString(),
      verifiedBy: 1,
    });
  };

  const handleReject = async (kyc: KYC) => {
    await update(kyc.id, {
      status: "rejected",
      rejectionReason: "Documents not clear",
      verifiedBy: 1,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading KYC requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Management</CardTitle>
        <CardDescription>Review and approve user KYC documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Aadhar Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kycRequests.map((kyc) => (
                <TableRow key={kyc.id}>
                  <TableCell className="font-medium">#{kyc.userId}</TableCell>
                  <TableCell>{kyc.aadharNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{kyc.aadharName}</p>
                      <div className="flex gap-2 mt-1">
                        {kyc.aadharVerified === "true" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Aadhar Verified
                          </Badge>
                        )}
                        {kyc.panVerified === "true" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            PAN Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{kyc.bankName}</p>
                      <p className="text-gray-600">{kyc.bankAccountNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        kyc.status === "verified"
                          ? "default"
                          : kyc.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {kyc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {kyc.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleApprove(kyc)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleReject(kyc)}
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {kycRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No KYC requests pending review.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
