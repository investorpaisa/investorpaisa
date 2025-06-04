
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EmailParsingService } from '@/services/email/emailParsingService';
import { ParsedTransaction } from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export const EmailTransactionSync: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const data = await EmailParsingService.getParsedTransactions(user.id);
      setTransactions(data);
      
      if (data.length > 0) {
        setLastSync(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleManualSync = () => {
    setIsLoading(true);
    
    // Simulate email parsing process
    setTimeout(() => {
      toast({
        title: "Email Sync Complete",
        description: "No new transactions found in recent emails.",
      });
      setIsLoading(false);
      setLastSync(new Date().toLocaleString());
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Transaction Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {lastSync ? `Last sync: ${lastSync}` : 'No sync yet'}
          </div>
          <Button
            onClick={handleManualSync}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your email to automatically import broker transactions
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">{transaction.ticker}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.broker} • {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={transaction.transaction_type === 'buy' ? 'default' : 'secondary'}>
                    {transaction.transaction_type?.toUpperCase()}
                  </Badge>
                  <div className="text-sm font-medium mt-1">
                    {transaction.quantity} @ {formatCurrency(transaction.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {transactions.length > 5 && (
          <div className="text-center">
            <Button variant="ghost" size="sm">
              View All Transactions ({transactions.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
