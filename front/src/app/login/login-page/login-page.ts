import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../auth/auth';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(Auth);

  form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  private readonly router = inject(Router);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    const { login, password } = this.form.getRawValue();
    this.authService.login(login, password).subscribe({
      next: () => this.router.navigateByUrl('/caisse'),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.status === 401 ? 'Identifiant ou mot de passe incorrect' : 'Le serveur ne répond pas',
        );
      },
    });
  }
}
