
import { login } from "./loginService";
import { register } from "./registerService";
import { logout, getCurrentUser } from "./userService";
import { User } from "../api";

class AuthService {
  login = (email: string, password: string): Promise<User | null> => login(email, password);
  register = (name: string, email: string, password: string): Promise<User | null> => register(name, email, password);
  logout = (): Promise<boolean> => logout();
  getCurrentUser = (): Promise<User | null> => getCurrentUser();
}

export const authService = new AuthService();
