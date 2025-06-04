
import { supabase } from '@/integrations/supabase/client';
import { ParsedTransaction } from '@/types/financial';

export interface EmailTransactionData {
  ticker: string;
  quantity: number;
  price: number;
  transactionType: 'buy' | 'sell';
  broker?: string;
  transactionDate?: string;
  messageId?: string;
}

class EmailParsingService {
  // Parse broker confirmation emails
  static parseZerodhaEmail(emailContent: string, messageId: string): EmailTransactionData | null {
    try {
      // Look for transaction patterns in Zerodha emails
      const buyPattern = /(?:BUY|BOUGHT)\s+(\d+)\s+(?:shares?\s+of\s+)?([A-Z0-9&]+).*?(?:at|@)\s*(?:Rs\.?\s*)?(\d+(?:\.\d{2})?)/i;
      const sellPattern = /(?:SELL|SOLD)\s+(\d+)\s+(?:shares?\s+of\s+)?([A-Z0-9&]+).*?(?:at|@)\s*(?:Rs\.?\s*)?(\d+(?:\.\d{2})?)/i;
      
      let match = emailContent.match(buyPattern);
      let transactionType: 'buy' | 'sell' = 'buy';
      
      if (!match) {
        match = emailContent.match(sellPattern);
        transactionType = 'sell';
      }
      
      if (match) {
        return {
          ticker: match[2].trim(),
          quantity: parseInt(match[1]),
          price: parseFloat(match[3]),
          transactionType,
          broker: 'Zerodha',
          messageId
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing Zerodha email:', error);
      return null;
    }
  }

  static parseUpstoxEmail(emailContent: string, messageId: string): EmailTransactionData | null {
    try {
      // Look for transaction patterns in Upstox emails
      const pattern = /(?:You\s+(?:bought|sold)|Transaction\s+(?:BUY|SELL))\s+(\d+)\s+(?:shares?\s+of\s+)?([A-Z0-9&]+).*?(?:at|@|for)\s*(?:Rs\.?\s*)?(\d+(?:\.\d{2})?)/i;
      const typePattern = /(?:bought|BUY)/i;
      
      const match = emailContent.match(pattern);
      
      if (match) {
        const transactionType = typePattern.test(emailContent) ? 'buy' : 'sell';
        
        return {
          ticker: match[2].trim(),
          quantity: parseInt(match[1]),
          price: parseFloat(match[3]),
          transactionType,
          broker: 'Upstox',
          messageId
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing Upstox email:', error);
      return null;
    }
  }

  static parseGenericBrokerEmail(emailContent: string, messageId: string): EmailTransactionData | null {
    try {
      // Generic pattern for most broker emails
      const pattern = /(?:BUY|SELL|bought|sold)\s+(\d+)\s+(?:shares?\s+of\s+|qty\s+)?([A-Z0-9&]+).*?(?:at|@|price|rate)\s*(?:Rs\.?\s*)?(\d+(?:\.\d{2})?)/i;
      const buyPattern = /(?:BUY|bought)/i;
      
      const match = emailContent.match(pattern);
      
      if (match) {
        const transactionType = buyPattern.test(emailContent) ? 'buy' : 'sell';
        
        return {
          ticker: match[2].trim(),
          quantity: parseInt(match[1]),
          price: parseFloat(match[3]),
          transactionType,
          messageId
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing generic broker email:', error);
      return null;
    }
  }

  static parseTransactionEmail(emailContent: string, sender: string, messageId: string): EmailTransactionData | null {
    // Determine broker from sender
    const senderLower = sender.toLowerCase();
    
    if (senderLower.includes('zerodha')) {
      return this.parseZerodhaEmail(emailContent, messageId);
    } else if (senderLower.includes('upstox')) {
      return this.parseUpstoxEmail(emailContent, messageId);
    } else if (senderLower.includes('groww') || senderLower.includes('angel') || senderLower.includes('icici')) {
      return this.parseGenericBrokerEmail(emailContent, messageId);
    }
    
    return null;
  }

  static async saveTransactionFromEmail(userId: string, transactionData: EmailTransactionData): Promise<ParsedTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('parsed_transactions')
        .insert({
          user_id: userId,
          ticker: transactionData.ticker,
          quantity: transactionData.quantity,
          price: transactionData.price,
          transaction_type: transactionData.transactionType,
          broker: transactionData.broker,
          transaction_date: transactionData.transactionDate ? new Date(transactionData.transactionDate).toISOString() : new Date().toISOString(),
          email_message_id: transactionData.messageId
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving parsed transaction:', error);
        return null;
      }

      return data as ParsedTransaction;
    } catch (error) {
      console.error('Error in saveTransactionFromEmail:', error);
      return null;
    }
  }

  static async getParsedTransactions(userId: string): Promise<ParsedTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('parsed_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching parsed transactions:', error);
        return [];
      }

      return data as ParsedTransaction[];
    } catch (error) {
      console.error('Error in getParsedTransactions:', error);
      return [];
    }
  }
}

export { EmailParsingService };
