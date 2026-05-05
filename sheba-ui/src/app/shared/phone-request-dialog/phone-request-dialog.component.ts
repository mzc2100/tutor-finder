import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ListingService } from '../../services/listing.service';
import { CreatePhoneRequest } from '../../models/listing.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-phone-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './phone-request-dialog.component.html',
  styleUrl: './phone-request-dialog.component.scss'
})
export class PhoneRequestDialogComponent {
  requestForm: FormGroup;
  isLoading = false;
  listingTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PhoneRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listingId: number; listingTitle: string },
    private listingService: ListingService,
    private snackBar: MatSnackBar
  ) {
    this.listingTitle = data.listingTitle;
    this.requestForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(2)]],
      user_phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]+$/)]],
      user_description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      const request: CreatePhoneRequest = {
        listing_id: this.data.listingId,
        ...this.requestForm.value
      };

      this.listingService.createPhoneRequest(request).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Phone request sent successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to send phone request. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error sending phone request:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.requestForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum length required';
    }
    if (control?.hasError('maxlength')) {
      return 'Maximum length exceeded';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
}