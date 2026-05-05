import { Component, Inject } from '@angular/core';
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
export class EditListingDialogComponent {
  listingForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditListingDialogComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: Listing
  ) {
    this.listingForm = this.fb.group({
      title: [data.title, [Validators.required, Validators.minLength(3)]],
      description: [data.description, [Validators.required, Validators.minLength(10)]],
      price: [data.price, [Validators.required, Validators.min(0)]],
      rate_type: [data.rate_type || 'month', Validators.required],
      location: [data.location, Validators.required],
      phone: [data.phone, [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,}$/)]],
      phone_visibility: [data.phone_visibility || 'show', Validators.required],
      is_active: [data.is_active]
    });
  }

  onSubmit(): void {
    if (this.listingForm.valid && !this.isLoading) {
      this.isLoading = true;
      const listing: UpdateListing = this.listingForm.value;

      this.adminService.updateListing(this.data.id, listing).subscribe({
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