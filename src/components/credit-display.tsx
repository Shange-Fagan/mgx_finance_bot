import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { getCredits } from "@/lib/store";
import { CircleCheck, CircleDollarSign, Clock } from "lucide-react";

export function CreditDisplay() {
  const [credits, setCredits] = useState(0);
  
  // Update credits whenever localStorage changes
  useEffect(() => {
    const updateCredits = () => {
      setCredits(getCredits());
    };
    
    // Initial load
    updateCredits();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCredits);
    
    // Custom event for in-app updates
    window.addEventListener('creditsUpdated', updateCredits);
    
    return () => {
      window.removeEventListener('storage', updateCredits);
      window.removeEventListener('creditsUpdated', updateCredits);
    };
  }, []);
  
  // Calculate dollars (1 credit = $1)
  const dollars = credits;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl flex items-center">
          <CircleDollarSign className="mr-2 h-6 w-6 text-emerald-500" />
          Your Quantum Credits
        </CardTitle>
        <CardDescription>
          Generate quantum credits and convert them to real dollars
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground text-sm font-medium">Credits</span>
            <span className="text-3xl font-bold">{credits}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <span className="text-muted-foreground text-sm font-medium">Dollar Value</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ${dollars.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}