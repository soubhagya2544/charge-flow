import { useEntity } from "../../hooks/useEntity";
import { fundOrderEntityConfig } from "../../entities/FundOrder";
import type { FundOrder } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle, Eye, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function FundOrderManagement() {
  const { items: fundOrders, loading, update } = useEntity<FundOrder>(fundOrderEntityConfig);

  const handleApprove = async (order: FundOrder) => {
    await update(order.id, {
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: 1,
    });
  };

  const handleReject = async (order: FundOrder) => {
    await update(order.id, {
      status: "rejected",
      adminRemarks: "Invalid transaction details",
      approvedBy: 1,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading fund orders...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Order Management</CardTitle>
        <CardDescription>Review and approve wallet recharge requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>User #{order.userId}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      ₹{order.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.paymentMode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{order.bankName}</p>
                      <p className="text-gray-600">{order.transactionRef}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "approved"
                          ? "default"
                          : order.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleApprove(order)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleReject(order)}
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

        {fundOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No fund orders pending approval.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
