import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../services/admin.service';
import { Listing, UpdateListing } from '../../models/listing.model';
import { ServiceTypesService, ServiceType } from '../../services/service-types.service';

@Component({
  selector: 'app-edit-listing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './edit-listing-dialog.component.html',
  styleUrl: './edit-listing-dialog.component.scss'
})
export class EditListingDialogComponent implements OnInit {
  listingForm: FormGroup;
  isLoading = false;
  serviceTypes: ServiceType[] = [];
  isServiceTypesLoading = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditListingDialogComponent>,
    private adminService: AdminService,
    private serviceTypesService: ServiceTypesService,
    @Inject(MAT_DIALOG_DATA) public data: Listing
  ) {
    // Initialize form with service_types field
    const existingServiceTypeIds = data.service_types?.map((st: any) => st.id) || [];
    this.listingForm = this.fb.group({
      title: [data.title, [Validators.required, Validators.minLength(3)]],
      description: [data.description, [Validators.required, Validators.minLength(10)]],
      price: [data.price, [Validators.required, Validators.min(0)]],
      rate_type: [data.rate_type || 'month', Validators.required],
      location: [data.location, Validators.required],
      phone: [data.phone, [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,}$/)]],
      phone_visibility: [data.phone_visibility || 'show', Validators.required],
      is_active: [data.is_active],
      service_types: [existingServiceTypeIds]
    });
  }

  ngOnInit(): void {
    this.loadServiceTypes();
    
    // Apply validation based on category
    this.updateServiceTypeValidation();
  }

  loadServiceTypes(): void {
    this.serviceTypesService.getAllServiceTypes().subscribe({
      next: (response) => {
        this.serviceTypes = response.data;
        this.isServiceTypesLoading = false;
      },
      error: (error) => {
        console.error('Error loading service types:', error);
        this.isServiceTypesLoading = false;
      }
    });
  }

  get isServiceCategory(): boolean {
    return this.data.category === 'Service';
  }

  updateServiceTypeValidation(): void {
    const serviceTypesControl = this.listingForm.get('service_types');
    
    if (this.isServiceCategory) {
      serviceTypesControl?.setValidators(Validators.required);
    } else {
      serviceTypesControl?.clearValidators();
      serviceTypesControl?.setValue([]);
    }
    serviceTypesControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.listingForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      // Create FormData for multipart/form-data request (to handle service_types array)
      const formData = new FormData();
      formData.append('title', this.listingForm.get('title')?.value);
      formData.append('description', this.listingForm.get('description')?.value);
      formData.append('price', this.listingForm.get('price')?.value);
      formData.append('rate_type', this.listingForm.get('rate_type')?.value);
      formData.append('location', this.listingForm.get('location')?.value);
      formData.append('phone', this.listingForm.get('phone')?.value);
      formData.append('phone_visibility', this.listingForm.get('phone_visibility')?.value);
      formData.append('is_active', this.listingForm.get('is_active')?.value ? '1' : '0');
      
      // Add service_types if it's a Service category
      const serviceTypes = this.listingForm.get('service_types')?.value;
      if (this.isServiceCategory && serviceTypes && serviceTypes.length > 0) {
        serviceTypes.forEach((serviceTypeId: number) => {
          formData.append('service_types', serviceTypeId.toString());
        });
      }

      this.adminService.updateListing(this.data.id, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error updating listing:', error);
          this.isLoading = false;
          alert('Failed to update listing. Please try again.');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.listingForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    if (control?.hasError('min')) {
      return `Value must be at least ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('pattern')) {
      return 'Invalid phone number format';
    }
    return '';
  }
}