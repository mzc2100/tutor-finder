import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ServiceTypesService, ServiceType } from '../../services/service-types.service';

@Component({
  selector: 'app-edit-service-type-dialog',
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
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-service-type-dialog.component.html',
  styleUrl: './edit-service-type-dialog.component.scss'
})
export class EditServiceTypeDialogComponent {
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
    private dialogRef: MatDialogRef<EditServiceTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceType,
    private fb: FormBuilder,
    private serviceTypesService: ServiceTypesService
  ) {
    this.serviceTypeForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z_]+$/)]],
      display_name: [data.display_name, [Validators.required, Validators.minLength(2)]],
      icon: [data.icon || ''],
      sort_order: [data.sort_order, [Validators.required, Validators.min(0)]],
      is_active: [data.is_active === 1]
    });
  }

  onSubmit(): void {
    if (this.serviceTypeForm.invalid) {
      this.serviceTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.serviceTypeForm.value;
    
    // Convert boolean is_active to number
    const updateData = {
      ...formData,
      is_active: formData.is_active ? 1 : 0
    };

    this.serviceTypesService.updateServiceType(this.data.id, updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating service type:', error);
        this.isLoading = false;
        alert(error.error?.message || 'Failed to update service type');
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