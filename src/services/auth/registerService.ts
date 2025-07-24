export interface RegisterResponse {
  idToken: string;
  refreshToken: string;
  uid: string;
}

import { showToast } from './utils';
import { login } from './loginService';

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse | null> => {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data: RegisterResponse | { error: any } = await response.json();

    if (!response.ok || (data as any).error) {
      const errMsg = (data as any).error?.message || 'Registration failed';
      throw new Error(errMsg);
    }

    // Auto-login after successful registration
    await login(email, password);

    showToast('Registration successful', 'Your account has been created successfully');
    return data as RegisterResponse;
  } catch (error) {
    console.error('Registration error:', error);
    showToast('Registration failed', error instanceof Error ? error.message : 'Something went wrong', 'destructive');
    return null;
  }
};
