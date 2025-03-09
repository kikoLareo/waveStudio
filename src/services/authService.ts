import { jwtDecode } from 'jwt-decode';
import api from './api';
import logService from '../utils/logService';

// Interfaces
interface DecodedToken {
  sub: string;
  user_id: number;
  email: string;
  roles: number[];
  exp: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: number[];
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Constants
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REMEMBER_ME_KEY = 'rememberMe';

/**
 * Servicio para manejar la autenticación
 */
const authService = {
  /**
   * Iniciar sesión con credenciales
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<User> {
    try {
      // Validar datos antes de enviar la petición
      if (!username || !password) {
        const error = new Error('El nombre de usuario y la contraseña son obligatorios');
        logService.log('error', 'Error en login: datos incompletos', { username });
        throw error;
      }
      
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password
      });

      const { access_token, user } = response.data;
      
      // Guardar token y datos de usuario
      this.setToken(access_token);
      this.setUser(user);
      
      // Guardar preferencia de "recordarme"
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
      
      logService.log('info', 'Login exitoso', { username });
      return user;
    } catch (error: any) {
      // Mejorar el registro de errores
      if (error.response) {
        const statusCode = error.response.status;
        const errorData = error.response.data;
        
        logService.log('error', 'Error en login (respuesta del servidor)', { 
          statusCode,
          errorData,
          username
        });
        
        // Agregar información adicional al error para facilitar su manejo
        error.authError = true;
        error.errorCode = errorData?.code || 'UNKNOWN_ERROR';
        error.errorDetails = errorData?.details || errorData?.message || 'Error desconocido';
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        logService.log('error', 'Error en login (sin respuesta del servidor)', { 
          error: error.message,
          username
        });
        
        error.authError = true;
        error.errorCode = 'NETWORK_ERROR';
        error.errorDetails = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        // Error al configurar la petición
        logService.log('error', 'Error en login (configuración de la petición)', { 
          error: error.message,
          username
        });
      }
      
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // No eliminamos REMEMBER_ME_KEY para mantener la preferencia del usuario
    logService.log('info', 'Logout exitoso');
  },

  /**
   * Verificar si hay un token almacenado
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  /**
   * Obtener el token almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Guardar el token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Obtener el usuario almacenado
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      logService.log('error', 'Error al parsear datos de usuario', { error });
      return null;
    }
  },

  /**
   * Guardar datos del usuario
   */
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Verificar si el token es válido (no expirado)
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      // Verificar si el token ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      logService.log('error', 'Error al validar token', { error });
      return false;
    }
  },

  /**
   * Decodificar el token JWT
   */
  decodeToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token);
  },

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(roleId: number): boolean {
    const user = this.getUser();
    if (!user || !user.roles) return false;
    return user.roles.includes(roleId);
  },

  /**
   * Verificar si se debe recordar al usuario
   */
  shouldRememberUser(): boolean {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  },

  /**
   * Intentar login automático
   */
  async attemptAutoLogin(): Promise<User | null> {
    // Solo intentar auto-login si hay un token y está configurado "recordarme"
    if (!this.shouldRememberUser() || !this.isLoggedIn()) {
      return null;
    }
    
    // Verificar si el token es válido
    if (!this.isTokenValid()) {
      this.logout();
      return null;
    }
    
    // Verificar que el usuario existe en localStorage
    const user = this.getUser();
    if (!user) {
      this.logout();
      return null;
    }
    
    // Intentar hacer una petición para validar el token con el servidor
    try {
      // Hacemos una petición simple para verificar que el token es aceptado por el servidor
      await api.get('/users');
      logService.log('info', 'Auto-login exitoso', { userId: user.id });
      return user;
    } catch (error) {
      logService.log('error', 'Error en auto-login', { error });
      this.logout();
      return null;
    }
  }
};

export default authService;
