import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ServiceType {
  id: number;
  name: string;
  display_name: string;
  icon: string;
  is_active: number;
  sort_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceTypesService {
  private apiUrl = `${environment.apiUrl}/service-types`;

  constructor(private http: HttpClient) {}

  getAllServiceTypes(): Observable<{ success: boolean; data: ServiceType[] }> {
    return this.http.get<{ success: boolean; data: ServiceType[] }>(this.apiUrl);
  }

  getServiceTypeById(id: number): Observable<{ success: boolean; data: ServiceType }> {
    return this.http.get<{ success: boolean; data: ServiceType }>(`${this.apiUrl}/${id}`);
  }

  createServiceType(serviceType: Partial<ServiceType>): Observable<{ success: boolean; message: string; data: { id: number } }> {
    return this.http.post<{ success: boolean; message: string; data: { id: number } }>(this.apiUrl, serviceType);
  }

  updateServiceType(id: number, serviceType: Partial<ServiceType>): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, serviceType);
  }

  deleteServiceType(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}