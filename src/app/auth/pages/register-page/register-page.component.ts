import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  public registerForm: FormGroup;
  public validationErrors: any = {};

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeat_password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue] 
    });

    Object.keys(this.registerForm.controls).forEach(key => {
      this.addBlurHandler(key);
    });
  }

  addBlurHandler(controlName: string): void {
    const control = this.registerForm.get(controlName);
    if (control) {
      control.valueChanges.subscribe(() => {
        this.validateField(controlName);
        if (controlName === 'password' || controlName === 'repeat_password') {
          this.validatePasswordMatch();
        }
      });
      control.statusChanges.subscribe(() => {
        this.validateField(controlName);
        if (controlName === 'password' || controlName === 'repeat_password') {
          this.validatePasswordMatch();
        }
      });
    }
  }

  validateField(controlName: string): void {
    const control = this.registerForm.get(controlName);
    if (control) {
      control.markAsTouched();
      if (control.errors?.['required']) {
        this.validationErrors[controlName] = 'This field is required';
      } else if (controlName === 'password' && control.errors?.['minlength']) {
        this.validationErrors[controlName] = 'Password must be at least 6 characters long';
      } else {
        delete this.validationErrors[controlName];
      }
    }
  }

  validatePasswordMatch(): void {
    const password = this.registerForm.get('password')?.value;
    const repeatPassword = this.registerForm.get('repeat_password')?.value;

    if (password !== repeatPassword) {
      this.validationErrors['repeat_password'] = 'Passwords do not match';
    } else {
      delete this.validationErrors['repeat_password'];
    }
  }

  register(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.validateField(key);
    });

    if (Object.keys(this.validationErrors).length > 0) {
      return;
    }

    const userData = { ...this.registerForm.value };
    delete userData.repeat_password;

    this.authService.register(userData)
      .then(response => {
        if (response.success) {
          console.log('Registro exitoso');
          this.router.navigate(['/auth/login']);
        } else {
          console.log('Error durante el registro:', response.errors);
          this.validationErrors = response.errors || {};
        }
      })
      .catch(error => {
        console.error('Error durante el registro:', error);
      });
  }
}
