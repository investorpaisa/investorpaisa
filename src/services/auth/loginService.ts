export interface LoginResponse {
  idToken: string;
  refreshToken: string;
  uid: string;
}

import { showToast } from './utils';

export const login = async (email: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data: LoginResponse | { error: any } = await response.json();

    if (!response.ok || (data as any).error) {
      const errMsg = (data as any).error?.message || 'Login failed';
      throw new Error(errMsg);
    }

    showToast('Login successful', 'Welcome back to Investor Paisa!');
    return data as LoginResponse;
  } catch (error) {
    console.error('Login error:', error);
    showToast('Login failed', error instanceof Error ? error.message : 'Something went wrong', 'destructive');
    return null;
  }
};
