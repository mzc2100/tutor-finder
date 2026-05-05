export type RateType = 'month' | 'day' | 'service' | 'negotiable';

export interface Listing {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category: string;
  price: number;
  rate_type: RateType;
  location: string;
  phone: string;
  phone_visibility: 'show' | 'request';
  is_active: boolean;
  created_at: string;
  main_image?: string;
  images?: string[];
}

export interface CreateListing {
  title: string;
  description: string;
  category_id: number;
  price: number;
  rate_type: RateType;
  location: string;
  phone: string;
  phone_visibility: 'show' | 'request';
}

export interface UpdateListing {
  title: string;
  description: string;
  price: number;
  rate_type: RateType;
  location: string;
  phone: string;
  phone_visibility: 'show' | 'request';
  is_active: boolean;
}

export interface PhoneRequest {
  id: number;
  listing_id: number;
  listing_title: string;
  user_name: string;
  user_phone: string;
  user_description: string;
  created_at: string;
}

export interface CreatePhoneRequest {
  listing_id: number;
  user_name: string;
  user_phone: string;
  user_description: string;
}