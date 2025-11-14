// auth.service.ts
const API_BASE_URL = 'http://localhost:4000/api';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    name?: string;
    profilePicture?: string;
    token: string;
  };
}

interface User {
  userId: string;
  email: string;
  name?: string;
  profilePicture?: string;
}

export class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'user_data';

  // Register with email and password
  static async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      this.saveAuth(data.data.token, {
        userId: data.data.userId,
        email: data.data.email,
        name: data.data.name,
        profilePicture: data.data.profilePicture,
      });
    }
    
    return data;
  }

  // Login with email and password
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      this.saveAuth(data.data.token, {
        userId: data.data.userId,
        email: data.data.email,
        name: data.data.name,
        profilePicture: data.data.profilePicture,
      });
    }
    
    return data;
  }

  // Login with Google
  static async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      this.saveAuth(data.data.token, {
        userId: data.data.userId,
        email: data.data.email,
        name: data.data.name,
        profilePicture: data.data.profilePicture,
      });
    }
    
    return data;
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
    
    return null;
  }

  // Update profile
  static async updateProfile(name?: string, preferences?: any): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, preferences }),
    });

    return await response.json();
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return await response.json();
  }

  // Logout
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Token management
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private static saveAuth(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Helper to make authenticated API calls
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers = {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

