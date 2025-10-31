import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private supabase = inject(SupabaseService);
  private apiUrl = environment.apiUrl;

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.supabase.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  async getData(endpoint: string): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}${endpoint}`, { headers });
  }

  async postData(endpoint: string, data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}${endpoint}`, data, { headers });
  }
}