import { Download, FileText, Table } from "lucide-react";

type Transaction = {
  id: number;
  transactionId: string;
  userName: string;
  userEmail: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  serviceType?: string;
  operatorName?: string;
  paymentMethod?: string;
  status: string;
  created_at: string;
};

type ReceiptGeneratorProps = {
  transaction: Transaction;
};

export default function ReceiptGenerator({ transaction }: ReceiptGeneratorProps) {
  const generatePDF = () => {
    const receiptContent = `
      ==========================================
      CHARGE FLOW - TRANSACTION RECEIPT
      ==========================================
      
      Receipt Date: ${new Date().toLocaleDateString()}
      Transaction Date: ${new Date(transaction.created_at).toLocaleString()}
      
      Transaction ID: ${transaction.transactionId}
      Status: ${transaction.status.toUpperCase()}
      
      ------------------------------------------
      CUSTOMER DETAILS
      ------------------------------------------
      Name: ${transaction.userName}
      Email: ${transaction.userEmail}
      
      ------------------------------------------
      TRANSACTION DETAILS
      ------------------------------------------
      Service: ${transaction.description}
      Category: ${transaction.category.replace("_", " ").toUpperCase()}
      Type: ${transaction.type.toUpperCase()}
      ${transaction.operatorName ? `Operator: ${transaction.operatorName}` : ""}
      ${transaction.serviceType ? `Service Type: ${transaction.serviceType}` : ""}
      ${transaction.paymentMethod ? `Payment Method: ${transaction.paymentMethod}` : ""}
      
      ------------------------------------------
      AMOUNT DETAILS
      ------------------------------------------
      Amount: ₹${transaction.amount.toFixed(2)}
      Transaction Type: ${transaction.type === "credit" ? "Credit (Added)" : "Debit (Deducted)"}
      
      ------------------------------------------
      
      Thank you for using Charge Flow!
      For support, contact: support@chargeflow.com
      
      ==========================================
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${transaction.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    const csvContent = [
      ["Field", "Value"],
      ["Transaction ID", transaction.transactionId],
      ["Date", new Date(transaction.created_at).toLocaleString()],
      ["Customer Name", transaction.userName],
      ["Customer Email", transaction.userEmail],
      ["Description", transaction.description],
      ["Category", transaction.category.replace("_", " ")],
      ["Type", transaction.type],
      ["Amount (₹)", transaction.amount.toFixed(2)],
      ["Status", transaction.status],
      ...(transaction.operatorName ? [["Operator", transaction.operatorName]] : []),
      ...(transaction.serviceType ? [["Service Type", transaction.serviceType]] : []),
      ...(transaction.paymentMethod ? [["Payment Method", transaction.paymentMethod]] : []),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${transaction.transactionId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={generatePDF}
        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        title="Download as PDF (Text)"
      >
        <FileText size={16} />
        PDF
      </button>
      <button
        onClick={generateCSV}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        title="Download as CSV"
      >
        <Table size={16} />
        CSV
      </button>
    </div>
  );
}
