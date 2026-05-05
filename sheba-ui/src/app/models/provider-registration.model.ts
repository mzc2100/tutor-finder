export interface ProviderRegistration {
  id?: number;
  full_name: string;
  mobile_number: string;
  address: string;
  category: string;
  nid_photo_path?: string;
  cv_path?: string;
  reference_number?: string;
  other_notes?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface CreateProviderRegistration {
  full_name: string;
  mobile_number: string;
  address: string;
  category: string;
  reference_number?: string;
  other_notes?: string;
  nid_photo?: File;
  cv?: File;
}