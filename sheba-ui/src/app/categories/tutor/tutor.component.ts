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
import { ListingDetailDialogComponent, ListingDetailData } from '../../shared/listing-detail-dialog/listing-detail-dialog.component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tutor',
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
  templateUrl: './tutor.component.html',
  styleUrl: './tutor.component.scss'
})
export class TutorComponent implements OnInit {
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
    this.loadTutorListings(1);
  }

  loadTutorListings(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;
    
    this.listingService.getListingsByCategory('Tutor', page, this.itemsPerPage).subscribe({
      next: (response: PaginatedListingsResponse) => {
        this.listings = response.data;
        this.filteredListings = response.data;
        this.paginatedListings = response.data;
        this.totalItems = response.pagination.totalItems;
        this.totalPages = response.pagination.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tutor listings:', error);
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
      this.loadTutorListings(page);
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

  openListingDetail(listing: Listing): void {
    const mainImage = this.getMainImage(listing);
    const imageUrl = mainImage ? this.getImageUrl(mainImage) : '';
    
    const dialogRef = this.dialog.open(ListingDetailDialogComponent, {
      maxWidth: '900px',
      width: '95%',
      maxHeight: '90vh',
      data: {
        listing: listing,
        imageUrl: imageUrl,
        getRateDisplay: this.getRateDisplay.bind(this)
      }
    });
  }

  getRateDisplay(rateType: string, price: number): string {
    switch(rateType) {
      case 'month':
        return `${price} BDT/month`;
      case 'day':
        return `${price} BDT/day`;
      case 'service':
        return `${price} BDT/service`;
      case 'negotiable':
        return 'Negotiable';
      default:
        return `${price} BDT`;
    }
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

  getStarColor(rating: number, star: number): string {
    return star <= rating ? 'warn' : 'primary';
  }

  getStarFillStyle(rating: number, star: number): string {
    // Calculate the fill percentage for this star
    const ratingForThisStar = rating - (star - 1);
    const fillPercentage = Math.min(100, Math.max(0, ratingForThisStar * 100));
    
    // Use linear-gradient to create partial fill effect
    // gold color (#FFD700) for filled part, gray (#E0E0E0) for empty part
    return `linear-gradient(90deg, #FFD700 ${fillPercentage}%, #E0E0E0 ${fillPercentage}%)`;
  }

  getStarFillPercentage(rating: number, star: number): number {
    // Calculate how much of this star should be filled
    const ratingForThisStar = rating - (star - 1);
    return Math.min(100, Math.max(0, ratingForThisStar * 100));
  }
}
