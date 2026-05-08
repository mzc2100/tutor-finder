import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Listing } from '../../models/listing.model';

export interface ListingDetailData {
  listing: Listing;
  imageUrl: string;
  getRateDisplay: (rateType: string, price: number) => string;
}

@Component({
  selector: 'app-listing-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './listing-detail-dialog.component.html',
  styleUrl: './listing-detail-dialog.component.scss'
})
export class ListingDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ListingDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListingDetailData
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}