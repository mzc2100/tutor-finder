import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ProviderRegistrationService } from '../services/provider-registration.service';

@Component({
  selector: 'app-provider-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './provider-registration.component.html',
  styleUrl: './provider-registration.component.scss'
})
export class ProviderRegistrationComponent {
  registrationForm: FormGroup;
  selectedCategory: string = '';
  categories = [
    { name: 'Tutor', icon: 'school' },
    { name: 'Maid', icon: 'cleaning_services' },
    { name: 'Rentals - Car', icon: 'directions_car' },
    { name: 'Rentals - Home', icon: 'home' },
    { name: 'Service - Electrician', icon: 'electrical_services' },
    { name: 'Service - Plumber', icon: 'plumbing' },
    { name: 'Service - AC', icon: 'ac_unit' },
    { name: 'Service - General', icon: 'build' }
  ];
  isLoading = false;
  nidPhotoFile: File | null = null;
  cvFile: File | null = null;
  nidPhotoPreview: string | null = null;
  cvFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: ProviderRegistrationService
  ) {
    this.registrationForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      reference_number: [''],
      other_notes: ['']
    });
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.registrationForm.patchValue({ category });
  }

  onNIDPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      this.nidPhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.nidPhotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCVSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB limit. Please choose a smaller file.');
        event.target.value = '';
        return;
      }
      
      this.cvFile = file;
      this.cvFileName = file.name;
    }
  }

  removeNIDPhoto(): void {
    this.nidPhotoFile = null;
    this.nidPhotoPreview = null;
  }

  removeCV(): void {
    this.cvFile = null;
    this.cvFileName = '';
  }

  onSubmit(): void {
    if (this.registrationForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = new FormData();
      formData.append('full_name', this.registrationForm.value.full_name);
      formData.append('mobile_number', this.registrationForm.value.mobile_number);
      formData.append('address', this.registrationForm.value.address);
      formData.append('category', this.registrationForm.value.category);
      formData.append('reference_number', this.registrationForm.value.reference_number || '');
      formData.append('other_notes', this.registrationForm.value.other_notes || '');

      if (this.nidPhotoFile) {
        formData.append('nid_photo', this.nidPhotoFile);
      }
      if (this.cvFile) {
        formData.append('cv', this.cvFile);
      }

      this.registrationService.submitRegistration(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Registration submitted successfully! We will review your application and contact you soon.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error submitting registration:', error);
          this.isLoading = false;
          alert('Failed to submit registration. Please try again.');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    if (control?.hasError('pattern')) {
      return 'Invalid phone number format';
    }
    return '';
  }
}