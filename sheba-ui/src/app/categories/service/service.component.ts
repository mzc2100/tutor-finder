import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ListingService, PaginatedListingsResponse } from '../../services/listing.service';
import { Listing } from '../../models/listing.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PhoneRequestDialogComponent } from '../../shared/phone-request-dialog/phone-request-dialog.component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit {
  listings: Listing[] = [];
  filteredListings: Listing[] = [];
  isLoading = true;
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;
  paginatedListings: Listing[] = [];

  constructor(
    private listingService: ListingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadServiceListings(1);
  }

  loadServiceListings(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;
    
    this.listingService.getListingsByCategory('Service', page, this.itemsPerPage).subscribe({
      next: (response: PaginatedListingsResponse) => {
        this.listings = response.data;
        this.filteredListings = response.data;
        this.paginatedListings = response.data;
        this.totalItems = response.pagination.totalItems;
        this.totalPages = response.pagination.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading service listings:', error);
        this.isLoading = false;
      }
    });
  }

  filterListings(): void {
    if (!this.searchTerm) {
      this.filteredListings = this.listings;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredListings = this.listings.filter(listing => 
      listing.title.toLowerCase().includes(term) ||
      listing.description.toLowerCase().includes(term) ||
      listing.location.toLowerCase().includes(term) ||
      listing.price.toString().includes(term)
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadServiceListings(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openPhoneRequestDialog(listing: Listing): void {
    const dialogRef = this.dialog.open(PhoneRequestDialogComponent, {
      width: '500px',
      data: {
        listingId: listing.id,
        listingTitle: listing.title
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Phone request sent');
      }
    });
  }

  getImageUrl(imageName: string): string {
    return `${environment.apiUrl}/uploads/${imageName}`;
  }

  getMainImage(listing: Listing): string | undefined {
    if (listing.main_image) {
      return listing.main_image;
    }
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    return undefined;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}