
import { login } from "./loginService";
import { register } from "./registerService";
import { logout, getCurrentUser, signInWithGoogle } from "./userService";

class AuthService {
  login = (email: string, password: string) => login(email, password);
  register = (name: string, email: string, password: string) => register(name, email, password);
  logout = (): Promise<boolean> => logout();
  getCurrentUser = (): Promise<any> => getCurrentUser();
  signInWithGoogle = (): Promise<void> => signInWithGoogle();
}

export const authService = new AuthService();
