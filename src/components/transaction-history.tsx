import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { getTransactions, Transaction } from "@/lib/store";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { ArrowDownToLine, ArrowUpFromLine, ClockIcon } from "lucide-react";
import { format } from "date-fns";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Update transactions whenever localStorage changes
  useEffect(() => {
    const updateTransactions = () => {
      setTransactions(getTransactions());
    };
    
    // Initial load
    updateTransactions();
    
    // Listen for storage changes
    window.addEventListener('storage', updateTransactions);
    
    // Custom event for in-app updates
    window.addEventListener('creditsUpdated', updateTransactions);
    
    return () => {
      window.removeEventListener('storage', updateTransactions);
      window.removeEventListener('creditsUpdated', updateTransactions);
    };
  }, []);
  
  // Format date
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClockIcon className="mr-2 h-5 w-5 text-gray-500" />
          Transaction History
        </CardTitle>
        <CardDescription>
          History of all your credit generations and withdrawals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {transactions.length === 0 
              ? "No transactions yet. Generate or withdraw credits to see them here." 
              : "A list of your recent transactions"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No transactions to display
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.type === 'generate' ? (
                        <>
                          <ArrowUpFromLine className="h-4 w-4 mr-1 text-green-500" />
                          <span>Generation</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="h-4 w-4 mr-1 text-blue-500" />
                          <span>Withdrawal</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.type === 'generate' 
                      ? `+${transaction.amount} credit`
                      : `−${transaction.amount} credit`
                    }
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' : 
                        transaction.status === 'pending' ? 'outline' : 'destructive'
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.type === 'generate' && transaction.quantumValue !== undefined && (
                      <span className="text-xs">Quantum value: {transaction.quantumValue}</span>
                    )}
                    {transaction.type === 'withdraw' && transaction.payoutDetails?.cardNumber && (
                      <span className="text-xs">Card: ****{transaction.payoutDetails.cardNumber.slice(-4)}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}