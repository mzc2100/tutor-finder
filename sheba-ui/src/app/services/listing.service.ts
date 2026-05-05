import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Listing, CreatePhoneRequest } from '../models/listing.model';

export interface PaginatedListingsResponse {
  data: Listing[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ListingService {

  private API = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.API}/listings`);
  }

  getListingsByCategory(category: string, page: number = 1, limit: number = 20): Observable<PaginatedListingsResponse> {
    return this.http.get<PaginatedListingsResponse>(
      `${this.API}/listings/search?category=${category}&page=${page}&limit=${limit}`
    );
  }

  searchListings(keyword: string, category: string, page: number = 1, limit: number = 20): Observable<PaginatedListingsResponse> {
    return this.http.get<PaginatedListingsResponse>(
      `${this.API}/listings/search?keyword=${keyword}&category=${category}&page=${page}&limit=${limit}`
    );
  }

  createPhoneRequest(request: CreatePhoneRequest): Observable<any> {
    return this.http.post(`${this.API}/listings/phone-request`, request);
  }
}