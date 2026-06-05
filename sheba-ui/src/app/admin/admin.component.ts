import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { ProviderRegistrationService } from '../services/provider-registration.service';
import { Listing, PhoneRequest } from '../models/listing.model';
import { ProviderRegistration } from '../models/provider-registration.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateListingDialogComponent } from './create-listing-dialog/create-listing-dialog.component';
import { EditListingDialogComponent } from './edit-listing-dialog/edit-listing-dialog.component';
import { CreateServiceTypeDialogComponent } from './create-service-type-dialog/create-service-type-dialog.component';
import { EditServiceTypeDialogComponent } from './edit-service-type-dialog/edit-service-type-dialog.component';
import { ServiceTypesService, ServiceType } from '../services/service-types.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'category', 'price', 'location', 'phone', 'status', 'actions'];
  listings: Listing[] = [];
  isLoading = true;
  selectedTab = 0;
  phoneRequests: PhoneRequest[] = [];
  phoneRequestsLoading = true;
  phoneRequestsDisplayedColumns: string[] = ['id', 'listing', 'user', 'userPhone', 'description', 'date', 'actions'];
  providerRegistrations: ProviderRegistration[] = [];
  providerRegistrationsLoading = true;
  providerRegistrationsDisplayedColumns: string[] = ['id', 'name', 'category', 'mobile', 'address', 'files', 'status', 'date', 'actions'];
  serviceTypes: ServiceType[] = [];
  serviceTypesLoading = true;
  serviceTypesDisplayedColumns: string[] = ['id', 'name', 'display_name', 'icon', 'sort_order', 'status', 'actions'];

  constructor(
    private adminService: AdminService,
    private registrationService: ProviderRegistrationService,
    private serviceTypesService: ServiceTypesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadListings();
    this.loadPhoneRequests();
    this.loadProviderRegistrations();
    this.loadServiceTypes();
  }

  loadListings(): void {
    this.isLoading = true;
    this.adminService.getAllListings().subscribe({
      next: (data) => {
        this.listings = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading listings:', error);
        this.snackBar.open('Failed to load listings', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateListingDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadListings();
        this.snackBar.open('Listing created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(listing: Listing): void {
    const dialogRef = this.dialog.open(EditListingDialogComponent, {
      width: '500px',
      data: listing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadListings();
        this.snackBar.open('Listing updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteListing(id: number): void {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.adminService.deleteListing(id).subscribe({
        next: () => {
          this.loadListings();
          this.snackBar.open('Listing deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting listing:', error);
          this.snackBar.open('Failed to delete listing', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

    getCategoryClass(category: string): string {
    switch (category.toLowerCase()) {
      case 'tutor':
        return 'category-tutor';
      case 'maid':
        return 'category-maid';
      case 'rent':
        return 'category-rent';
      default:
        return 'category-default';
    }
  }

  loadPhoneRequests(): void {
    this.phoneRequestsLoading = true;
    this.adminService.getPhoneRequests().subscribe({
      next: (data) => {
        this.phoneRequests = data;
        this.phoneRequestsLoading = false;
      },
      error: (error) => {
        console.error('Error loading phone requests:', error);
        this.snackBar.open('Failed to load phone requests', 'Close', { duration: 3000 });
        this.phoneRequestsLoading = false;
      }
    });
  }

  deletePhoneRequest(id: number): void {
    if (confirm('Are you sure you want to delete this phone request?')) {
      this.adminService.deletePhoneRequest(id).subscribe({
        next: () => {
          this.loadPhoneRequests();
          this.snackBar.open('Phone request deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting phone request:', error);
          this.snackBar.open('Failed to delete phone request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  loadProviderRegistrations(): void {
    this.providerRegistrationsLoading = true;
    this.registrationService.getAllRegistrations().subscribe({
      next: (data) => {
        this.providerRegistrations = data;
        this.providerRegistrationsLoading = false;
      },
      error: (error) => {
        console.error('Error loading provider registrations:', error);
        this.snackBar.open('Failed to load provider registrations', 'Close', { duration: 3000 });
        this.providerRegistrationsLoading = false;
      }
    });
  }

  updateRegistrationStatus(id: number, status: 'pending' | 'approved' | 'rejected'): void {
    this.registrationService.updateRegistrationStatus(id, status).subscribe({
      next: () => {
        this.loadProviderRegistrations();
        this.snackBar.open(`Registration ${status} successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating registration status:', error);
        this.snackBar.open('Failed to update registration status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteRegistration(id: number): void {
    if (confirm('Are you sure you want to delete this provider registration?')) {
      this.registrationService.deleteRegistration(id).subscribe({
        next: () => {
          this.loadProviderRegistrations();
          this.snackBar.open('Provider registration deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting registration:', error);
          this.snackBar.open('Failed to delete registration', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getRegistrationStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }

  loadServiceTypes(): void {
    this.serviceTypesLoading = true;
    this.serviceTypesService.getAllServiceTypes().subscribe({
      next: (response) => {
        this.serviceTypes = response.data;
        this.serviceTypesLoading = false;
      },
      error: (error) => {
        console.error('Error loading service types:', error);
        this.snackBar.open('Failed to load service types', 'Close', { duration: 3000 });
        this.serviceTypesLoading = false;
      }
    });
  }

  openCreateServiceTypeDialog(): void {
    const dialogRef = this.dialog.open(CreateServiceTypeDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServiceTypes();
        this.snackBar.open('Service type created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditServiceTypeDialog(serviceType: ServiceType): void {
    const dialogRef = this.dialog.open(EditServiceTypeDialogComponent, {
      width: '400px',
      data: serviceType
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServiceTypes();
        this.snackBar.open('Service type updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteServiceType(id: number): void {
    if (confirm('Are you sure you want to delete this service type?')) {
      this.serviceTypesService.deleteServiceType(id).subscribe({
        next: () => {
          this.loadServiceTypes();
          this.snackBar.open('Service type deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting service type:', error);
          this.snackBar.open('Failed to delete service type', 'Close', { duration: 3000 });
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('isAdmin');
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    this.router.navigate(['/']);
  }

  downloadRegistrationPDF(registration: ProviderRegistration): void {
    const status = registration.status || 'pending';
    const submittedDate = registration.created_at ? new Date(registration.created_at).toLocaleString() : new Date().toLocaleString();
    
    const pdfContent = `
PROVIDER REGISTRATION SUMMARY
Help Now BD - Service Provider Registration

REGISTRATION ID: #${registration.id}
STATUS: ${status.toUpperCase()}
SUBMITTED: ${submittedDate}

PERSONAL INFORMATION
--------------------
Full Name: ${registration.full_name}
Mobile Number: ${registration.mobile_number}
Address: ${registration.address}

CATEGORY: ${registration.category}

DOCUMENTS
---------
NID Photo: ${registration.nid_photo_path ? '✓ Uploaded' : 'Not uploaded'}
CV: ${registration.cv_path ? '✓ Uploaded' : 'Not uploaded'}

ADDITIONAL INFORMATION
----------------------
Reference Number: ${registration.reference_number || 'N/A'}
Other Notes: ${registration.other_notes || 'None'}

Generated by Help Now BD Admin Panel
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registration_${registration.id}_${registration.full_name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Registration summary downloaded', 'Close', { duration: 3000 });
  }
}