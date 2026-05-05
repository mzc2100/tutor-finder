import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderRegistration, CreateProviderRegistration } from '../models/provider-registration.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderRegistrationService {
  private apiUrl = `${environment.apiUrl}/provider-registrations`;

  constructor(private http: HttpClient) {}

  submitRegistration(registration: FormData): Observable<any> {
    return this.http.post(this.apiUrl, registration);
  }

  getAllRegistrations(): Observable<ProviderRegistration[]> {
    return this.http.get<ProviderRegistration[]>(this.apiUrl);
  }

  getRegistrationById(id: number): Observable<ProviderRegistration> {
    return this.http.get<ProviderRegistration>(`${this.apiUrl}/${id}`);
  }

  updateRegistrationStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteRegistration(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
