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
import { MatSelectModule } from '@angular/material/select';
import { PhoneRequestDialogComponent } from '../../shared/phone-request-dialog/phone-request-dialog.component';
import { ListingDetailDialogComponent, ListingDetailData } from '../../shared/listing-detail-dialog/listing-detail-dialog.component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ServiceTypesService, ServiceType } from '../../services/service-types.service';

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
    MatSelectModule,
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
  selectedServiceType = 'All';
  
  // Service types for dropdown filter (fetched from API)
  serviceTypes: { value: string; label: string }[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;
  paginatedListings: Listing[] = [];

  constructor(
    private listingService: ListingService,
    private dialog: MatDialog,
    private serviceTypesService: ServiceTypesService
  ) {}

  ngOnInit(): void {
    this.loadServiceTypes();
    this.loadServiceListings(1);
  }

  loadServiceTypes(): void {
    this.serviceTypesService.getAllServiceTypes().subscribe({
      next: (response) => {
        // Transform API response to component format
        this.serviceTypes = [
          { value: 'All', label: 'All Services' },
          ...response.data.map(type => ({
            value: type.name,
            label: type.display_name
          }))
        ];
      },
      error: (error) => {
        console.error('Error loading service types:', error);
        // Fallback to default types if API fails
        this.serviceTypes = [
          { value: 'All', label: 'All Services' },
          { value: 'Electrician', label: 'Electrician' },
          { value: 'Plumber', label: 'Plumber' },
          { value: 'AC', label: 'AC' },
          { value: 'General', label: 'General' }
        ];
      }
    });
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
        
        // Apply current filters after loading
        this.filterListings();
      },
      error: (error) => {
        console.error('Error loading service listings:', error);
        this.isLoading = false;
      }
    });
  }

  filterListings(): void {
    // Start with all listings
    let filtered = [...this.listings];
    
    // Apply service type filter (check the service_types array)
    if (this.selectedServiceType !== 'All') {
      filtered = filtered.filter(listing => 
        listing.service_types && 
        listing.service_types.some((st: any) => st.name === this.selectedServiceType)
      );
    }
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term) ||
        listing.location.toLowerCase().includes(term) ||
        listing.price.toString().includes(term)
      );
    }
    
    this.filteredListings = filtered;
    this.paginatedListings = filtered; // Update paginated listings with filtered results
  }

  onServiceTypeChange(): void {
    this.filterListings();
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
}