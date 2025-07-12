import { CreditDisplay } from "@/components/credit-display";
import { CreditGenerator } from "@/components/credit-generator";
import { CreditWithdrawal } from "@/components/credit-withdrawal";
import { TransactionHistory } from "@/components/transaction-history";
import { initializeStore } from "@/lib/store";
import { useEffect } from "react";

export default function QRNGCreditSystem() {
  // Initialize the store on component load
  useEffect(() => {
    initializeStore();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              QRNG Credit System
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
          </nav>
        </div>
      </header>
      
      <main className="container py-8 px-4 md:px-6">
        <div className="flex flex-col gap-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quantum Random Number Generator Credit System</h1>
            <p className="text-muted-foreground">
              Generate quantum credits and convert them to real dollars with Stripe payouts
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <CreditDisplay />
          <CreditGenerator />
        </div>
        
        <div className="mt-6">
          <CreditWithdrawal />
        </div>
        
        <div className="mt-6">
          <TransactionHistory />
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 QRNG Credit System. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by quantum randomness and Stripe
          </p>
        </div>
      </footer>
    </div>
  );
}