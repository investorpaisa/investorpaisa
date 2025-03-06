
import { login } from "./loginService";
import { register } from "./registerService";
import { logout, getCurrentUser } from "./userService";

class AuthService {
  login = login;
  register = register;
  logout = logout;
  getCurrentUser = getCurrentUser;
}

export const authService = new AuthService();
