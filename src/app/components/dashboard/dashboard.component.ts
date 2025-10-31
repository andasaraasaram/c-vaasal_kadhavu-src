import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SupabaseService } from '../../services/supabase.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    JsonPipe,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Dashboard</span>
        <span class="spacer"></span>
        <span class="user-email">{{ userEmail() }}</span>
        <button mat-raised-button (click)="logout()">Logout</button>
      </mat-toolbar>

      <div class="content">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Welcome to Your Dashboard</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <p>You are successfully logged in!</p>
            @if (loading()) {
              <p>Loading data from server...</p>
              <mat-spinner diameter="40"></mat-spinner>
            }
            
            @if (!loading() && apiData()) {
              <div class="api-data">
                <h3>Server Response:</h3>
                <pre>{{ apiData() | json }}</pre>
              </div>
            }

            @if (!loading() && error()) {
              <div class="error-message">
                {{ error() }}
              </div>
            }
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="fetchData()" [disabled]="loading()">
              Fetch Data from Server
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    mat-toolbar {
      display: flex;
      align-items: center;
    }

    .spacer {
      flex: 1;
    }

    .user-email {
      margin-right: 16px;
      font-size: 14px;
    }

    .content {
      flex: 1;
      padding: 24px;
      background: #f5f5f5;
      overflow-y: auto;
    }

    .dashboard-card {
      max-width: 800px;
      margin: 0 auto;
    }

    mat-card-header {
      padding: 16px 0;
    }

    mat-card-content {
      padding: 24px 0;
      min-height: 200px;
    }

    .api-data {
      margin-top: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .api-data h3 {
      margin-top: 0;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .error-message {
      color: #f44336;
      padding: 16px;
      background: #ffebee;
      border-radius: 4px;
      margin-top: 16px;
    }

    mat-spinner {
      margin: 24px auto;
    }

    mat-card-actions {
      padding: 16px 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private api = inject(ApiService);
  private router = inject(Router);

  userEmail = signal('');
  loading = signal(false);
  apiData = signal<any>(null);
  error = signal('');

  async ngOnInit() {
    const user = this.supabase.currentUser();
    if (user) {
      this.userEmail.set(user.email || '');
    }
  }

  async fetchData() {
    this.loading.set(true);
    this.error.set('');
    this.apiData.set(null);

    try {
      const observable = await this.api.getData('/api/data');
      observable.subscribe({
        next: (data) => {
          this.apiData.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to fetch data from server: ' + err.message);
          this.loading.set(false);
        }
      });
    } catch (err: any) {
      this.error.set('Failed to fetch data: ' + err.message);
      this.loading.set(false);
    }
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}