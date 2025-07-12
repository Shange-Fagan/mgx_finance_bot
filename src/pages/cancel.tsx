import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-center text-2xl">Payment Cancelled</CardTitle>
          <CardDescription className="text-center">
            Your withdrawal request has been cancelled.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            No worries! Your credits are still available in your account. You can try again whenever you're ready.
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