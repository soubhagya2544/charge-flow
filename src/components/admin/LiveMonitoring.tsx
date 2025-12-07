import { useEntity } from "../../hooks/useEntity";
import { rechargeEntityConfig, busBookingEntityConfig, complaintEntityConfig } from "../../entities";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { Activity, AlertTriangle, Bus, Phone, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";

type Recharge = {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  operator: string;
  operatorCode: string;
  mobileNumber: string;
  amount: number;
  transactionId: string;
  operatorId?: string;
  apiResponse?: string;
  status: "success" | "pending" | "failed";
  paymentMethod?: string;
  commissionAmount?: number;
  serviceType?: "mobile" | "dth";
  complaintStatus?: "none" | "raised" | "resolved" | "disputed";
  complaintId?: string;
  complaintNote?: string;
  created_at: string;
  updated_at: string;
};

type BusBooking = {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  apiProvider: string;
  apiProviderId: string;
  bookingId: string;
  operatorBookingId?: string;
  busOperator?: string;
  source: string;
  destination: string;
  travelDate?: string;
  passengerName?: string;
  passengerPhone?: string;
  seatNumbers?: string;
  amount: number;
  status: "confirmed" | "pending" | "cancelled" | "failed";
  apiResponse?: string;
  paymentMethod?: string;
  commissionAmount?: number;
  complaintStatus?: "none" | "raised" | "resolved" | "disputed";
  complaintId?: string;
  complaintNote?: string;
  created_at: string;
  updated_at: string;
};

type Complaint = {
  id: number;
  complaintId: string;
  userId: string;
  userName: string;
  userEmail: string;
  transactionType: "recharge" | "bus_booking";
  transactionId: string;
  complaintType: "failed_transaction" | "wrong_recharge" | "booking_issue" | "refund_request" | "other";
  description: string;
  amount?: number;
  status: "open" | "in_progress" | "resolved" | "disputed" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  adminResponse?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  attachments?: string;
  created_at: string;
  updated_at: string;
};

export default function LiveMonitoring() {
  const { items: recharges, loading: loadingRecharges, update: updateRecharge } = useEntity<Recharge>(rechargeEntityConfig);
  const { items: bookings, loading: loadingBookings, update: updateBooking } = useEntity<BusBooking>(busBookingEntityConfig);
  const { items: complaints, loading: loadingComplaints, create: createComplaint, update: updateComplaint } = useEntity<Complaint>(complaintEntityConfig);

  const [selectedTab, setSelectedTab] = useState<"recharges" | "bookings" | "complaints">("recharges");
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [complaintData, setComplaintData] = useState<any>({});

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: "default",
      confirmed: "default",
      pending: "secondary",
      failed: "destructive",
      cancelled: "destructive",
      open: "secondary",
      in_progress: "outline",
      resolved: "default",
      disputed: "destructive",
    };
    
    const icons = {
      success: <CheckCircle className="w-3 h-3" />,
      confirmed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };

    return (
      <Badge variant={variants[status] || "outline"} className="gap-1">
        {icons[status as keyof typeof icons]}
        {status.toUpperCase()}
      </Badge>
    );
  };

  const handleRaiseComplaint = async (type: "recharge" | "bus_booking", transaction: any) => {
    setComplaintData({
      transactionType: type,
      transactionId: type === "recharge" ? transaction.transactionId : transaction.bookingId,
      userId: transaction.userId,
      userName: transaction.userName,
      userEmail: transaction.userEmail,
      amount: transaction.amount,
    });
    setComplaintDialog(true);
  };

  const submitComplaint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const complaintId = `CPL${Date.now()}`;

    await createComplaint({
      complaintId,
      userId: complaintData.userId,
      userName: complaintData.userName,
      userEmail: complaintData.userEmail,
      transactionType: complaintData.transactionType,
      transactionId: complaintData.transactionId,
      complaintType: formData.get("complaintType") as "failed_transaction" | "wrong_recharge" | "booking_issue" | "refund_request" | "other",
      description: formData.get("description") as string,
      amount: complaintData.amount,
      status: "open",
      priority: formData.get("priority") as "low" | "medium" | "high" | "urgent",
    });

    // Update transaction with complaint info
    if (complaintData.transactionType === "recharge") {
      const recharge = recharges.find(r => r.transactionId === complaintData.transactionId);
      if (recharge) {
        await updateRecharge(recharge.id, {
          complaintStatus: "raised",
          complaintId,
          complaintNote: formData.get("description") as string,
        });
      }
    } else {
      const booking = bookings.find(b => b.bookingId === complaintData.transactionId);
      if (booking) {
        await updateBooking(booking.id, {
          complaintStatus: "raised",
          complaintId,
          complaintNote: formData.get("description") as string,
        });
      }
    }

    setComplaintDialog(false);
    setComplaintData({});
  };

  const handleResolveComplaint = async (complaint: Complaint, resolution: string) => {
    await updateComplaint(complaint.id, {
      status: "resolved",
      adminResponse: resolution,
      resolvedBy: "Admin",
      resolvedAt: new Date().toISOString(),
    });

    // Update transaction complaint status
    if (complaint.transactionType === "recharge") {
      const recharge = recharges.find(r => r.transactionId === complaint.transactionId);
      if (recharge) {
        await updateRecharge(recharge.id, { complaintStatus: "resolved" });
      }
    } else {
      const booking = bookings.find(b => b.bookingId === complaint.transactionId);
      if (booking) {
        await updateBooking(booking.id, { complaintStatus: "resolved" });
      }
    }
  };

  const stats = {
    totalRecharges: recharges.length,
    successfulRecharges: recharges.filter(r => r.status === "success").length,
    pendingRecharges: recharges.filter(r => r.status === "pending").length,
    failedRecharges: recharges.filter(r => r.status === "failed").length,
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter(b => b.status === "confirmed").length,
    pendingBookings: bookings.filter(b => b.status === "pending").length,
    failedBookings: bookings.filter(b => b.status === "failed").length,
    openComplaints: complaints.filter(c => c.status === "open" || c.status === "in_progress").length,
    resolvedComplaints: complaints.filter(c => c.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Live Monitoring</h2>
        <p className="text-muted-foreground">Real-time tracking of recharges and bus bookings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recharges</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecharges}</div>
            <p className="text-xs text-muted-foreground">
              {stats.successfulRecharges} successful • {stats.failedRecharges} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.confirmedBookings} confirmed • {stats.failedBookings} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openComplaints}</div>
            <p className="text-xs text-muted-foreground">
              {stats.resolvedComplaints} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRecharges + stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Pending transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={selectedTab === "recharges" ? "default" : "ghost"}
          onClick={() => setSelectedTab("recharges")}
          className="rounded-b-none"
        >
          <Phone className="w-4 h-4 mr-2" />
          Recharges ({recharges.length})
        </Button>
        <Button
          variant={selectedTab === "bookings" ? "default" : "ghost"}
          onClick={() => setSelectedTab("bookings")}
          className="rounded-b-none"
        >
          <Bus className="w-4 h-4 mr-2" />
          Bus Bookings ({bookings.length})
        </Button>
        <Button
          variant={selectedTab === "complaints" ? "default" : "ghost"}
          onClick={() => setSelectedTab("complaints")}
          className="rounded-b-none"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Complaints ({complaints.length})
          {stats.openComplaints > 0 && (
            <Badge variant="destructive" className="ml-2">{stats.openComplaints}</Badge>
          )}
        </Button>
      </div>

      {/* Recharges Tab */}
      {selectedTab === "recharges" && (
        <Card>
          <CardHeader>
            <CardTitle>Live Recharge Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRecharges ? (
              <p>Loading recharges...</p>
            ) : recharges.length === 0 ? (
              <p className="text-muted-foreground">No recharges yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date/Time</th>
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Operator</th>
                      <th className="text-left p-2">Mobile</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Txn ID</th>
                      <th className="text-left p-2">Op ID</th>
                      <th className="text-center p-2">Status</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recharges.map((recharge) => (
                      <tr key={recharge.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 text-sm">
                          {new Date(recharge.created_at).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <div className="text-sm font-medium">{recharge.userName}</div>
                          <div className="text-xs text-muted-foreground">{recharge.userEmail}</div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{recharge.operator}</div>
                          <div className="text-xs text-muted-foreground">{recharge.operatorCode}</div>
                        </td>
                        <td className="p-2">{recharge.mobileNumber}</td>
                        <td className="p-2 text-right font-semibold">₹{recharge.amount.toFixed(2)}</td>
                        <td className="p-2 text-xs font-mono">{recharge.transactionId}</td>
                        <td className="p-2 text-xs font-mono">{recharge.operatorId || "N/A"}</td>
                        <td className="p-2 text-center">
                          {getStatusBadge(recharge.status)}
                          {recharge.complaintStatus && recharge.complaintStatus !== "none" && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              {recharge.complaintStatus}
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {recharge.status === "failed" && recharge.complaintStatus === "none" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRaiseComplaint("recharge", recharge)}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Raise Issue
                            </Button>
                          )}
                          {recharge.apiResponse && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="ml-1">
                                  View Response
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>API Response</DialogTitle>
                                </DialogHeader>
                                <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                                  {JSON.stringify(JSON.parse(recharge.apiResponse), null, 2)}
                                </pre>
                              </DialogContent>
                            </Dialog>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bus Bookings Tab */}
      {selectedTab === "bookings" && (
        <Card>
          <CardHeader>
            <CardTitle>Live Bus Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-muted-foreground">No bus bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date/Time</th>
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Route</th>
                      <th className="text-left p-2">Travel Date</th>
                      <th className="text-left p-2">Passenger</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Booking ID</th>
                      <th className="text-left p-2">API Provider</th>
                      <th className="text-center p-2">Status</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 text-sm">
                          {new Date(booking.created_at).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <div className="text-sm font-medium">{booking.userName}</div>
                          <div className="text-xs text-muted-foreground">{booking.userEmail}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-sm font-medium">{booking.source} → {booking.destination}</div>
                          {booking.busOperator && (
                            <div className="text-xs text-muted-foreground">{booking.busOperator}</div>
                          )}
                        </td>
                        <td className="p-2 text-sm">
                          {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">
                          <div className="text-sm">{booking.passengerName || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{booking.passengerPhone || ""}</div>
                          {booking.seatNumbers && (
                            <div className="text-xs text-muted-foreground">Seats: {booking.seatNumbers}</div>
                          )}
                        </td>
                        <td className="p-2 text-right font-semibold">₹{booking.amount.toFixed(2)}</td>
                        <td className="p-2 text-xs font-mono">{booking.bookingId}</td>
                        <td className="p-2 text-sm">{booking.apiProvider}</td>
                        <td className="p-2 text-center">
                          {getStatusBadge(booking.status)}
                          {booking.complaintStatus && booking.complaintStatus !== "none" && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              {booking.complaintStatus}
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {(booking.status === "failed" || booking.status === "cancelled") && booking.complaintStatus === "none" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRaiseComplaint("bus_booking", booking)}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Raise Issue
                            </Button>
                          )}
                          {booking.apiResponse && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="ml-1">
                                  View Response
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>API Response</DialogTitle>
                                </DialogHeader>
                                <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                                  {JSON.stringify(JSON.parse(booking.apiResponse), null, 2)}
                                </pre>
                              </DialogContent>
                            </Dialog>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Complaints Tab */}
      {selectedTab === "complaints" && (
        <Card>
          <CardHeader>
            <CardTitle>Complaints & Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingComplaints ? (
              <p>Loading complaints...</p>
            ) : complaints.length === 0 ? (
              <p className="text-muted-foreground">No complaints yet</p>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <Card key={complaint.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{complaint.complaintId}</Badge>
                            {getStatusBadge(complaint.status)}
                            <Badge variant={complaint.priority === "urgent" ? "destructive" : "secondary"}>
                              {complaint.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{complaint.transactionType.replace("_", " ")}</Badge>
                          </div>
                          <h4 className="font-semibold text-lg mb-1">
                            {complaint.complaintType.replace(/_/g, " ").toUpperCase()}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            User: {complaint.userName} ({complaint.userEmail})
                          </p>
                          <p className="text-sm mb-2">Transaction ID: <span className="font-mono">{complaint.transactionId}</span></p>
                          {complaint.amount && (
                            <p className="text-sm font-semibold">Amount: ₹{complaint.amount.toFixed(2)}</p>
                          )}
                          <div className="mt-3 p-3 bg-muted rounded">
                            <p className="text-sm">{complaint.description}</p>
                          </div>
                          {complaint.adminResponse && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                              <p className="text-sm font-semibold text-green-900 mb-1">Admin Response:</p>
                              <p className="text-sm text-green-800">{complaint.adminResponse}</p>
                              {complaint.resolvedBy && (
                                <p className="text-xs text-green-700 mt-2">
                                  Resolved by {complaint.resolvedBy} on {new Date(complaint.resolvedAt!).toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        {complaint.status === "open" || complaint.status === "in_progress" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">Resolve</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Resolve Complaint</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Enter resolution details..."
                                  id={`resolution-${complaint.id}`}
                                />
                                <Button
                                  onClick={() => {
                                    const resolution = (document.getElementById(`resolution-${complaint.id}`) as HTMLTextAreaElement).value;
                                    handleResolveComplaint(complaint, resolution);
                                  }}
                                >
                                  Mark as Resolved
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Created: {new Date(complaint.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Complaint / Dispute</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitComplaint} className="space-y-4">
            <div>
              <Label>Transaction ID</Label>
              <Input value={complaintData.transactionId || ""} disabled />
            </div>
            <div>
              <Label>Amount</Label>
              <Input value={complaintData.amount ? `₹${complaintData.amount}` : ""} disabled />
            </div>
            <div>
              <Label htmlFor="complaintType">Complaint Type</Label>
              <Select name="complaintType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select complaint type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="failed_transaction">Failed Transaction</SelectItem>
                  <SelectItem value="wrong_recharge">Wrong Recharge</SelectItem>
                  <SelectItem value="booking_issue">Booking Issue</SelectItem>
                  <SelectItem value="refund_request">Refund Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue="medium" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                placeholder="Describe the issue in detail..."
                required
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Submit Complaint</Button>
              <Button type="button" variant="outline" onClick={() => setComplaintDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
