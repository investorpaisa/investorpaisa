
import { login } from "./loginService";
import { register } from "./registerService";
import { logout, getCurrentUser, signInWithGoogle } from "./userService";
import { User } from "../api";

class AuthService {
  login = (email: string, password: string): Promise<User | null> => login(email, password);
  register = (name: string, email: string, password: string): Promise<User | null> => register(name, email, password);
  logout = (): Promise<boolean> => logout();
  getCurrentUser = (): Promise<User | null> => getCurrentUser();
  signInWithGoogle = (): Promise<void> => signInWithGoogle();
}

export const authService = new AuthService();
