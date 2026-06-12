import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ListingService, PaginatedListingsResponse } from '../../services/listing.service';
import { Listing } from '../../models/listing.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PhoneRequestDialogComponent } from '../../shared/phone-request-dialog/phone-request-dialog.component';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rent',
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
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.scss'
})
export class RentComponent implements OnInit {
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
    this.loadRentListings(1);
  }

  loadRentListings(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;
    
    this.listingService.getListingsByCategory('Room Rent', page, this.itemsPerPage).subscribe({
      next: (response: PaginatedListingsResponse) => {
        this.listings = response.data;
        this.filteredListings = response.data;
        this.paginatedListings = response.data;
        this.totalItems = response.pagination.totalItems;
        this.totalPages = response.pagination.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading rent listings:', error);
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
      this.loadRentListings(page);
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

  viewDetails(listing: Listing): void {
    // Create a simple dialog to show listing details with all images
    const dialogRef = this.dialog.open(ListingDetailsDialog, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: listing
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

@Component({
  selector: 'listing-details-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <div class="details-content">
        <div class="images-section" *ngIf="data.images && data.images.length > 0">
          <h3>Gallery</h3>
          <div class="images-grid">
            <div *ngFor="let image of data.images" class="image-item">
              <img [src]="getImageUrl(image)" [alt]="data.title" (click)="openFullImageView(image)">
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput [value]="data.description" rows="5" readonly></textarea>
          </mat-form-field>
          
          <div class="detail-row">
            <mat-icon>payments</mat-icon>
            <span><strong>Price:</strong> {{ data.price }} BDT/month</span>
          </div>
          
          <div class="detail-row">
            <mat-icon>location_on</mat-icon>
            <span><strong>Location:</strong> {{ data.location }}</span>
          </div>
          
          <div class="detail-row" *ngIf="data.phone_visibility === 'show'">
            <mat-icon>phone</mat-icon>
            <span><strong>Phone:</strong> {{ data.phone }}</span>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .details-content {
      max-height: 60vh;
      overflow-y: auto;
    }
    .images-section {
      margin-bottom: 1.5rem;
    }
    .images-section h3 {
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #333;
    }
    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 0.75rem;
    }
    .image-item {
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .image-item img:hover {
      transform: scale(1.05);
    }
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
    }
    .detail-row mat-icon {
      color: #666;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule]
})
export class ListingDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<ListingDetailsDialog>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Listing
  ) {}

  getImageUrl(imageName: string): string {
    return `${environment.apiUrl}/uploads/${imageName}`;
  }

  openFullImageView(imageName: string): void {
    const currentIndex = this.data.images?.indexOf(imageName) || 0;
    this.dialog.open(FullImageViewDialog, {
      width: '90vw',
      height: '90vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        images: this.data.images || [],
        currentIndex: currentIndex,
        title: this.data.title,
        getImageUrl: (name: string) => this.getImageUrl(name)
      }
    });
  }
}

@Component({
  selector: 'full-image-view-dialog',
  template: `
    <div class="full-image-wrapper">
      <div class="nav-zone left-zone" (click)="previousImage()" *ngIf="data.images.length > 1"></div>
      <div class="nav-zone right-zone" (click)="nextImage()" *ngIf="data.images.length > 1"></div>
      
      <div class="full-image-container">
        <img [src]="currentImageUrl" [alt]="data.title" (error)="onImageError()">
      </div>
      
      <div class="image-counter" *ngIf="data.images.length > 1">
        {{ currentIndex + 1 }} / {{ data.images.length }}
      </div>
      
      <button mat-icon-button class="close-btn" (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: rgba(0, 0, 0, 0.9);
    }
    .full-image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-zone {
      position: absolute;
      top: 0;
      height: 100%;
      width: 30%;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-zone:hover::after {
      content: '';
      position: absolute;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .left-zone {
      left: 0;
    }
    .left-zone:hover::after {
      content: '←';
      color: white;
      font-size: 30px;
      background: rgba(255, 255, 255, 0.2);
    }
    .right-zone {
      right: 0;
    }
    .right-zone:hover::after {
      content: '→';
      color: white;
      font-size: 30px;
      background: rgba(255, 255, 255, 0.2);
    }
    .full-image-container {
      width: 70%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .full-image-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
      transition: opacity 0.2s ease-in-out;
    }
    .image-counter {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      z-index: 20;
    }
    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      z-index: 30;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  `],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule]
})
export class FullImageViewDialog {
  currentIndex: number = 0;
  currentImageUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<FullImageViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      images: string[]; 
      currentIndex: number; 
      title: string;
      getImageUrl: (name: string) => string;
    }
  ) {
    this.currentIndex = this.data.currentIndex;
    this.updateCurrentImage();
    this.setupKeyboardNavigation();
  }

  updateCurrentImage(): void {
    if (this.data.images.length > 0) {
      this.currentImageUrl = this.data.getImageUrl(this.data.images[this.currentIndex]);
    }
  }

  nextImage(): void {
    if (this.currentIndex < this.data.images.length - 1) {
      this.currentIndex++;
      this.updateCurrentImage();
    } else {
      // Loop back to first image
      this.currentIndex = 0;
      this.updateCurrentImage();
    }
  }

  previousImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCurrentImage();
    } else {
      // Loop to last image
      this.currentIndex = this.data.images.length - 1;
      this.updateCurrentImage();
    }
  }

  setupKeyboardNavigation(): void {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (this.data.images.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.previousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          this.dialogRef.close();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when dialog is closed
    this.dialogRef.afterClosed().subscribe(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  }

  onImageError(): void {
    console.error('Failed to load image:', this.currentImageUrl);
  }
}