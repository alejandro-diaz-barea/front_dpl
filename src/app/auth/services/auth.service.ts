import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedIn: boolean = false;
  private currentUser?: User;

  constructor(private http: HttpClient) { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  get currentUserInfo(): User | undefined {
    return this.currentUser;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        const { access_token, address, id, name, email, logo_path, is_super, is_banned } = responseData;

        localStorage.setItem('accessToken', access_token);

        this.currentUser = { access_token, address, id, name, email, logo_path, is_super };

        this.isLoggedIn = true;
        return true;
      } else {
        if (response.status === 403) {
          throw new Error('User is banned');
        } else {
          throw new Error('HTTP error: ' + response.status);
        }
      }
    } catch (error) {
      throw error;
    }
  }



  async register(userData: { name: string, email: string, password: string, address: string, phone_number: string }): Promise<{ success: boolean, errors?: any }> {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log('Registration response:', responseData);

      if (response.ok) {
        return { success: true };
      } else {
        if (response.status === 422) {
          const validationErrors = responseData['message']; 
          return { success: false, errors: validationErrors };
        } else {
          // Otro tipo de error
          console.error('Error during registration:', responseData.error);
          return { success: false, errors: { general: 'Error during registration' } };
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, errors: { general: 'Error during registration' } };
    }
  }


  //Mantener sesion
  async checkAuthStatus(): Promise<boolean> {
    const url = 'http://127.0.0.1:8000/api/v1/auth/checktoken';
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.log('No se encontró ningún token en el almacenamiento local.');
      return false;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.name && responseData.address && responseData.email) {
          const { access_token, address, id, name, email, logo_path, is_super} = responseData;
          localStorage.setItem('accessToken', access_token);
          this.currentUser = { access_token, address, id, name, email, logo_path, is_super };
          this.isLoggedIn = true;
          return true;
        } else {
          this.isLoggedIn = false;
          this.currentUser = undefined;
          return false;
        }
      } else {
        this.isLoggedIn = false;
        this.currentUser = undefined;
        return false;
      }
    } catch (error) {
      console.error('Error during checkAuthStatus:', error);
      this.isLoggedIn = false;
      this.currentUser = undefined;
      return false;
    }
  }




  updateUser(data: Partial<User>): Observable<User> {
    const url = `http://127.0.0.1:8000/api/v1/users`;
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('No se encontró ningún token en el almacenamiento local.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Agregamos el ID del usuario a los datos que se enviarán al backend
    const requestData = { ...data, id: this.currentUser?.id };

    return this.http.put<User>(url, requestData, { headers });
  }


  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  logout(): void {
    // Elimina el token del almacenamiento local al cerrar sesión
    localStorage.removeItem('accessToken');
    this.isLoggedIn = false;
    this.currentUser = undefined;

  }
}
