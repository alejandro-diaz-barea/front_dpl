  import { Component, OnInit, Renderer2 } from '@angular/core';
  import { AuthService } from './auth/services/auth.service';
  import { Router } from '@angular/router';
import { User } from './auth/interfaces/user.interfaces';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent implements OnInit {
    title = 'front-end-easeSell';
    authChecked: boolean = false;
    showMenu: boolean = false;
    darkMode: boolean = false;

    constructor(private authService: AuthService, private router: Router, private renderer: Renderer2) {}

    ngOnInit(): void {
      this.authService.checkAuthStatus().then(isAuthenticated => {
        this.authChecked = true;
        if (!isAuthenticated) {
          console.log('El usuario no está autenticado.');
        } else {
          console.log('El usuario está autenticado.');
        }
      }).catch(error => {
        console.error('Error al verificar el estado de autenticación:', error);
        this.authChecked = true;
      });
    }

    toggleMenu() {
      // Alternar la visibilidad del menú desplegable
      this.showMenu = !this.showMenu;
    }

    goToLogin(): void {
      if (!this.authService.isUserLoggedIn) {
        this.router.navigate(['/auth/login']);
      }
    }

    get user(): boolean {
      return this.authService.isUserLoggedIn;
    }

    get userInfo(): string | undefined {
      return this.authService.currentUserInfo?.name;
    }

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      const elements = ['header', 'main', 'footer'];
      elements.forEach(element => {
        if (this.darkMode) {
          this.renderer.addClass(document.querySelector(element)!, 'dark-mode');
        } else {
          this.renderer.removeClass(document.querySelector(element)!, 'dark-mode');
        }
      });
    }


    getUserLogoPath(): string {
      const baseUrl = 'https://backenddpl-production.up.railway.app/';
      return this.userLogo?.logo_path ? `${baseUrl}${this.userLogo.logo_path}` : '../../../../assets/profile-user.png';
    }

    get userLogo(): User | undefined {
      return this.authService.currentUserInfo;
    }



    get isAdmin(): boolean | undefined {
      return this.authService.currentUserInfo?.is_super;
    }


  }
