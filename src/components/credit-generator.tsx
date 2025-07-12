import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addCredits, addTransaction } from "@/lib/store";
import { generateQuantumRandom, generateCredits } from "@/lib/qrng";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export function CreditGenerator() {
  const [loading, setLoading] = useState(false);
  const [lastQuantumValue, setLastQuantumValue] = useState<number | null>(null);

  async function handleGenerateCredits() {
    try {
      setLoading(true);
      
      // Generate quantum random number
      const quantumValue = await generateQuantumRandom();
      
      // Save the quantum value for display
      setLastQuantumValue(quantumValue);
      
      // Generate credits based on quantum value
      const amount = await generateCredits();
      
      // Update credits in store
      const newBalance = addCredits(amount);
      
      // Record the transaction
      addTransaction({
        type: 'generation',
        amount,
        dollarValue: amount / 100, // 100 credits = $1
        timestamp: new Date().toISOString(),
        details: `Generated from quantum value: ${quantumValue}`
      });
      
      // Dispatch event to update other components
      window.dispatchEvent(new Event('creditsUpdated'));
      
      // Show success message
      if (amount > 0) {
        toast.success(`Successfully generated ${amount} credits!`, {
          description: `Quantum value: ${quantumValue}`,
        });
      } else {
        toast.info(`No credits generated this time.`, {
          description: `Quantum value: ${quantumValue} (needs to be > 70)`,
        });
      }
      
    } catch (error) {
      console.error("Failed to generate credits:", error);
      toast.error("Failed to generate credits. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
          Generate Quantum Credits
        </CardTitle>
        <CardDescription>
          Use quantum randomness to generate credits
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button 
          onClick={handleGenerateCredits} 
          disabled={loading} 
          size="lg" 
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Credits"
          )}
        </Button>
        
        {lastQuantumValue !== null && (
          <div className="mt-4 p-3 bg-muted rounded-md w-full">
            <p className="text-sm text-center">
              Last quantum value: <strong>{lastQuantumValue}</strong>
              <br/>
              {lastQuantumValue > 70 ? (
                <span className="text-green-600 font-medium">Success! +7 credits</span>
              ) : (
                <span className="text-muted-foreground">No credits this time</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col text-xs text-muted-foreground">
        <p>Credits are generated when quantum value &gt; 70</p>
        <p>Each successful generation adds 7 credits to your balance</p>
      </CardFooter>
    </Card>
  );
}