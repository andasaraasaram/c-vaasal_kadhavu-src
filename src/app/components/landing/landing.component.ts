import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-landing',
  imports: [MatButtonModule, MatCardModule, MatToolbarModule],
  template: `
    <div class="landing-container">
      <mat-toolbar color="primary">
        <span>Welcome to Our App</span>
      </mat-toolbar>
      
      <div class="content">
        <mat-card class="welcome-card">
          <mat-card-header>
            <mat-card-title>Get Started</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Welcome! Please login or register to continue.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="goToLogin()">
              Login
            </button>
            <button mat-raised-button (click)="goToRegister()">
              Register
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }

    .welcome-card {
      max-width: 500px;
      width: 90%;
      text-align: center;
    }

    mat-card-content {
      padding: 24px 0;
    }

    mat-card-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      padding: 16px;
    }

    button {
      min-width: 120px;
    }
  `]
})
export class LandingComponent {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}