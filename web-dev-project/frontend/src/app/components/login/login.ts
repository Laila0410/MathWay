import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';
  errorMessage = '';
  isRegisterMode = false;

  constructor(private auth: AuthService, private router: Router) {}

  private authErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'Нет связи с сервером. Запустите backend: python manage.py runserver 8000 (из папки backend).';
      }
      const body = err.error as Record<string, unknown> | string | null;
      if (typeof body === 'string' && body.trim()) return body;
      if (body && typeof body === 'object') {
        const detail = body['detail'];
        if (typeof detail === 'string') return detail;
        const nfe = body['non_field_errors'];
        if (Array.isArray(nfe) && nfe[0]) return String(nfe[0]);
        const firstField = Object.entries(body).find(([, v]) => Array.isArray(v) && v.length > 0);
        if (firstField) {
          const arr = firstField[1];
          if (Array.isArray(arr) && arr[0] != null) return String(arr[0]);
        }
      }
      return err.message || `Ошибка запроса (${err.status})`;
    }
    return 'Не удалось выполнить вход. Проверьте логин и пароль или зарегистрируйтесь.';
  }

  login() {
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/videos']),
      error: (err) => (this.errorMessage = this.authErrorMessage(err))
    });
  }

  register() {
    this.errorMessage = '';
    this.auth.register(this.username, this.password, this.email).subscribe({
      next: () => {
        this.auth.login(this.username, this.password).subscribe({
          next: () => this.router.navigate(['/videos']),
          error: (err) => (this.errorMessage = this.authErrorMessage(err))
        });
      },
      error: (err) => (this.errorMessage = this.authErrorMessage(err))
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }
}
