import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Listing, CreateListing, UpdateListing, PhoneRequest } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private adminKey = 'SECRET123';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-admin-key': this.adminKey
    });
  }

  getAllListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings`, {
      headers: this.getHeaders()
    });
  }

  createListing(listing: CreateListing | FormData): Observable<{ message: string; id: number; main_image?: string; images_count?: number }> {
    // If FormData (with images), don't set Content-Type header
    if (listing instanceof FormData) {
      return this.http.post<{ message: string; id: number; main_image?: string; images_count?: number }>(
        `${this.apiUrl}/listings`,
        listing,
        {
          headers: new HttpHeaders({
            'x-admin-key': this.adminKey
          })
        }
      );
    }
    
    return this.http.post<{ message: string; id: number }>(`${this.apiUrl}/listings`, listing, {
      headers: this.getHeaders()
    });
  }

  updateListing(id: number, listing: UpdateListing): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/listings/${id}`, listing, {
      headers: this.getHeaders()
    });
  }

  deleteListing(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/listings/${id}`, {
      headers: this.getHeaders()
    });
  }

  getPhoneRequests(): Observable<PhoneRequest[]> {
    return this.http.get<PhoneRequest[]>(`${this.apiUrl}/phone-requests`, {
      headers: this.getHeaders()
    });
  }

  deletePhoneRequest(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/phone-requests/${id}`, {
      headers: this.getHeaders()
    });
  }
}
