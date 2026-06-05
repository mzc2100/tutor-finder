import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ServiceTypesService } from '../../services/service-types.service';

@Component({
  selector: 'app-create-service-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './create-service-type-dialog.component.html',
  styleUrl: './create-service-type-dialog.component.scss'
})
export class CreateServiceTypeDialogComponent {
  serviceTypeForm: FormGroup;
  isLoading = false;

  commonIcons = [
    { value: 'electrical_services', label: 'Electrical Services' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'ac_unit', label: 'AC Unit' },
    { value: 'build', label: 'Build/Construction' },
    { value: 'cleaning_services', label: 'Cleaning Services' },
    { value: 'handyman', label: 'Handyman' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'paint_bucket', label: 'Painter' },
    { value: 'construction', label: 'Construction' },
    { value: 'home_repair_service', label: 'Home Repair' },
    { value: 'settings', label: 'Settings/General' },
    { value: 'school', label: 'Education/Tutor' },
    { value: 'home', label: 'Home' },
    { value: 'apartment', label: 'Apartment/Rent' },
    { value: 'directions_car', label: 'Car/Vehicle' }
  ];

  constructor(
    private dialogRef: MatDialogRef<CreateServiceTypeDialogComponent>,
    private fb: FormBuilder,
    private serviceTypesService: ServiceTypesService
  ) {
    this.serviceTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z_]+$/)]],
      display_name: ['', [Validators.required, Validators.minLength(2)]],
      icon: [''],
      sort_order: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.serviceTypeForm.invalid) {
      this.serviceTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.serviceTypeForm.value;

    this.serviceTypesService.createServiceType(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialogRef.close(response.data);
      },
      error: (error) => {
        console.error('Error creating service type:', error);
        this.isLoading = false;
        alert(error.error?.message || 'Failed to create service type');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getNameErrorMessage(): string {
    const control = this.serviceTypeForm.get('name');
    if (control?.hasError('required')) {
      return 'Name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Name must be at least 2 characters';
    }
    if (control?.hasError('pattern')) {
      return 'Name must contain only lowercase letters and underscores';
    }
    return '';
  }

  getDisplayNameErrorMessage(): string {
    const control = this.serviceTypeForm.get('display_name');
    if (control?.hasError('required')) {
      return 'Display name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Display name must be at least 2 characters';
    }
    return '';
  }
}