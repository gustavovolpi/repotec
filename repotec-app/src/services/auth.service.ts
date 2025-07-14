import { 
  apiLogin, 
  apiRegistro, 
  apiVerificarToken, 
  apiRenovarToken, 
  apiRecuperarSenha, 
  apiRedefinirSenha, 
  apiValidarTokenRecuperacao,
  LoginResponse 
} from './api';
import { store } from '../store';
import { loginStart, loginSuccess, loginFailure, logout, updateUser } from '../store/slices/authSlice';

class AuthService {
  private token: string | null = null;
  private usuario: LoginResponse['usuario'] | null = null;

  constructor() {
    // Tenta carregar o token e o usuário do localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('usuario');

    if (token) {
      this.token = token;
    }

    if (userStr && this.token) {
      try {
        const parsedUser = JSON.parse(userStr) as LoginResponse['usuario'];
        if (parsedUser) {
          this.usuario = parsedUser;
          // Atualizar o estado do Redux
          store.dispatch(loginSuccess({ token: this.token, user: this.usuario }));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        this.logout();
      }
    }
  }

  async login(email: string, senha: string): Promise<LoginResponse> {
    try {
      store.dispatch(loginStart());
      
      // Faz a requisição de login
      const response = await apiLogin(email, senha);

      // Valida a resposta
      if (!response.token || !response.usuario) {
        throw new Error('Dados de autenticação inválidos');
      }

      // Armazena os dados
      this.setToken(response.token);
      this.setUsuario(response.usuario);

      // Atualiza o estado do Redux
      store.dispatch(loginSuccess({ token: response.token, user: response.usuario }));

      return response;
    } catch (error) {
      store.dispatch(loginFailure(error instanceof Error ? error.message : 'Erro ao fazer login'));
      throw error;
    }
  }

  async register(data: { email: string; senha: string; nome: string }): Promise<void> {
    try {
      await apiRegistro(data);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao registrar usuário');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      return await apiVerificarToken(token);
    } catch (error: unknown) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  async renewToken(token: string): Promise<boolean> {
    try {
      const newToken = await apiRenovarToken(token);
      if (newToken) {
        this.setToken(newToken);
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  }

  async requestPasswordRecovery(email: string): Promise<{ message: string }> {
    try {
      return await apiRecuperarSenha(email);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao solicitar recuperação de senha');
    }
  }

  async resetPassword(token: string, novaSenha: string): Promise<{ message: string }> {
    try {
      return await apiRedefinirSenha(token, novaSenha);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao redefinir senha');
    }
  }

  async validarTokenRecuperacao(token: string): Promise<{ valido: boolean; message: string }> {
    try {
      return await apiValidarTokenRecuperacao(token);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao validar token de recuperação');
    }
  }

  logout(): void {
    this.clearAuth();
    store.dispatch(logout());
  }

  private clearAuth(): void {
    this.token = null;
    this.usuario = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): LoginResponse['usuario'] | null {
    return this.usuario;
  }

  updateUser(user: LoginResponse['usuario']): void {
    if (!user) {
      throw new Error('Usuário inválido');
    }
    this.setUsuario(user);
    store.dispatch(updateUser(user));
  }

  private setToken(token: string): void {
    this.token = token;
    if (this.token) {
      localStorage.setItem('token', this.token);
    }
  }

  private setUsuario(usuario: LoginResponse['usuario']): void {
    this.usuario = usuario;
    if (this.usuario) {
      localStorage.setItem('usuario', JSON.stringify(this.usuario));
    }
  }
}

export const authService = new AuthService(); 