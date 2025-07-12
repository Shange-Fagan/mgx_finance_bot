import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addTransaction, withdrawCredits, getCredits } from "@/lib/store";
import { createCheckoutSession } from "@/lib/stripe";
import { toast } from "sonner";

export function CreditWithdrawal() {
  const [loading, setLoading] = useState(false);
  
  // Get current balance immediately - not in useEffect
  const credits = getCredits();
  // Changed from 100:1 to 1:1 ratio
  const dollarAmount = credits; // Now 1 credit = $1
  const [maxAmount, setMaxAmount] = useState(dollarAmount > 0 ? dollarAmount : 14);
  const [currentBalance, setCurrentBalance] = useState(credits);
  
  // Dynamic schema based on current balance
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    amount: z.coerce.number()
      .min(1, { message: "Withdrawal amount must be at least 1 dollar." })
      .max(maxAmount, { message: `Maximum withdrawal amount is $${maxAmount}.` }),
    accountNumber: z.string()
      .min(8, { message: "Account number must be at least 8 digits." })
      .max(10, { message: "Account number must be at most 10 digits." })
      .regex(/^\d+$/, { message: "Account number must contain only numbers." }),
    sortCode: z.string()
      .length(6, { message: "Sort code must be 6 digits." })
      .regex(/^\d+$/, { message: "Sort code must contain only numbers." })
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: maxAmount,
      accountNumber: "",
      sortCode: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      // Calculate credit equivalent (1 credit = $1) - updated from 100:1 to 1:1 ratio
      const creditAmount = values.amount;
      
      // Use current credits from state
      const currentCredits = getCredits();
      
      // Verify current balance is sufficient (should always be true due to form validation, but double check)
      if (currentCredits < creditAmount) {
        toast.error(`Not enough credits. You need ${creditAmount} credits but have ${currentCredits}. Your current balance allows withdrawal of up to $${currentCredits}.`);
        return;
      }
      
      // Mask the account number for security (show only last 4 digits)
      const maskedAccountNumber = values.accountNumber.slice(-4).padStart(values.accountNumber.length, '*');
      // Format the sort code for display (xx-xx-xx)
      const formattedSortCode = `${values.sortCode.slice(0, 2)}-${values.sortCode.slice(2, 4)}-${values.sortCode.slice(4, 6)}`;
      
      // Initiate direct bank transfer (no Stripe checkout needed for bank transfer)
      try {
        // In a real app, this would call an API endpoint to process the bank transfer
        console.log(`Processing bank transfer to account: ${maskedAccountNumber}, sort code: ${formattedSortCode}`);
        
        // Update local credits
        withdrawCredits(creditAmount);
        
        // Record the transaction with bank details (masked for security)
        addTransaction({
          type: 'withdrawal',
          amount: creditAmount,
          dollarValue: values.amount,
          timestamp: new Date().toISOString(),
          details: `Bank transfer to ${values.name}, Account: *****${values.accountNumber.slice(-4)}, Sort Code: ${formattedSortCode}`
        });
        
        toast.success(`Initiated bank transfer of $${values.amount} to account ending in ${values.accountNumber.slice(-4)}`);
      } catch (error) {
        console.error("Bank transfer failed:", error);
        throw new Error("Bank transfer failed: " + (error instanceof Error ? error.message : String(error)));
      }
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Withdraw Credits</CardTitle>
        <CardDescription>Convert your credits to real money via bank transfer</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormDescription>We'll send payment confirmation to this email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormDescription>Your bank account number (8-10 digits)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" maxLength={6} {...field} />
                  </FormControl>
                  <FormDescription>Your bank sort code (6 digits, no dashes)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Each dollar requires 1 credit (1:1 ratio)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Transfer Credits to Bank"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Credits will be converted at a rate of 1 credit = $1 USD
      </CardFooter>
    </Card>
  );
}