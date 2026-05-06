import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { IconsComponent, ShellService } from 'lib';

type CardState = 'enter' | 'rest' | 'slide-out' | 'slide-in';

interface SignInModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signin',
  imports: [FormField, IconsComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  private readonly router    = inject(Router);
  protected readonly authService = inject(ShellService);
  
  isStaff = signal(false);
  cardState = signal<CardState>('enter');
  isLoading = signal(false);
  errorMsg  = signal<string | null>(null);

  readonly passwordDisplay = signal<'text'|'password'>('password');
 
  cardClass = computed(() => {
    const base = 'w-80 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5';
    const state = this.cardState();
    if (state === 'slide-out') return `${base} card-slide-out`;
    if (state === 'slide-in')  return `${base} card-slide-in`;
    if (state === 'enter')     return `${base} card-enter`;
    return `${base} card-rest`;
  });
 
  protected signInModel = signal<SignInModel>({
    email: '',
    password: '',
  });
 
  signInForm = form(this.signInModel, (f) => {
    required(f.email);
    required(f.password);
  });
 
  toggleView() {
    if (this.cardState() === 'slide-out' || this.cardState() === 'slide-in') return;
    
    this.cardState.set('slide-out');
    
    setTimeout(() => {
      this.isStaff.update(v => !v);
      this.signInForm().reset();
      this.cardState.set('slide-in');
      setTimeout(() => this.cardState.set('rest'), 400);
    }, 350);
  }
 
  onSignIn(event?: Event) {
    event?.preventDefault();
 
    if (!this.signInForm().valid()) return;
 
    this.isLoading.set(true);
    this.errorMsg.set(null);
 
    this.authService.signIn(this.signInForm().value()).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err?.error?.message ?? 'Sign in failed. Please try again.');
      },
    });
  }
 
  onGoogleSignIn(): void {
    console.log('Google sign in');
  }
 
  onStaffIdSignIn(): void {
    console.log('Staff ID sign in');
  }
 
  onStudentNumberSignIn(): void {
    console.log('Student number sign in');
  }
}