import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">Bank Transfer Initiated!</CardTitle>
          <CardDescription className="text-center">
            Your withdrawal has been processed and the bank transfer has been initiated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for using our QRNG Credit System. Your funds will be transferred to your bank account within 1-3 business days.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}