import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../services/admin.service';
import { CreateListing } from '../../models/listing.model';

@Component({
  selector: 'app-create-listing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-listing-dialog.component.html',
  styleUrl: './create-listing-dialog.component.scss'
})
export class CreateListingDialogComponent {
  listingForm: FormGroup;
  categories = [
    { id: 1, name: 'Tutor' },
    { id: 2, name: 'Maid' },
    { id: 3, name: 'Rent' },
    { id: 4, name: 'Service' }
  ];
  isLoading = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  maxImages = 10;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateListingDialogComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.listingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category_id: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      rate_type: ['month', Validators.required],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,}$/)]],
      phone_visibility: ['show', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files) {
      const fileArray = Array.from(files);
      
      // Check if adding these files would exceed the limit
      if (this.selectedFiles.length + fileArray.length > this.maxImages) {
        alert(`You can only upload up to ${this.maxImages} images total.`);
        return;
      }

      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = fileArray.filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== fileArray.length) {
        alert('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed.');
      }

      // Add valid files and create previews
      validFiles.forEach(file => {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.imagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Clear input so same files can be selected again if needed
      input.value = '';
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onSubmit(): void {
    if (this.listingForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = new FormData();
      formData.append('title', this.listingForm.get('title')?.value);
      formData.append('description', this.listingForm.get('description')?.value);
      formData.append('category_id', this.listingForm.get('category_id')?.value);
      formData.append('price', this.listingForm.get('price')?.value);
      formData.append('rate_type', this.listingForm.get('rate_type')?.value);
      formData.append('location', this.listingForm.get('location')?.value);
      formData.append('phone', this.listingForm.get('phone')?.value);
      formData.append('phone_visibility', this.listingForm.get('phone_visibility')?.value);

      // Add images to form data
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      this.adminService.createListing(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating listing:', error);
          this.isLoading = false;
          alert('Failed to create listing. Please try again.');
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