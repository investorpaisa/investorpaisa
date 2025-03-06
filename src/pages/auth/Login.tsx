
import React from 'react';
import { LoginForm } from './components/LoginForm';
import { PremiumPromo } from './components/PremiumPromo';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';

const Login = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="font-heading text-3xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">Welcome Back</h1>
        <p className="text-muted-foreground">Continue your financial journey with Investor Paisa</p>
      </div>
      
      <LoginForm />
      <PremiumPromo />
      <LegalDisclaimer />
    </div>
  );
};

export default Login;
