// Service types for the Site API

export interface ServiceListItem {
  id: number;
  slug: string;
  title: string;
  title_ar: string;
  title_en: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  image?: string;
  price?: number;
  duration?: number;
  category_id?: number;
  is_featured?: boolean;
}

export interface ServiceDetails {
  id: number;
  slug: string;
  title: string;
  title_ar: string;
  title_en: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  content?: string;
  content_ar?: string;
  content_en?: string;
  image?: string;
  images?: string[];
  price?: number;
  duration?: number;
  category_id?: number;
  category?: {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
  };
  is_featured?: boolean;
  sub_services?: SubService[];
  related_services?: ServiceListItem[];
}

export interface SubService {
  id: number;
  service_id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  price?: number;
  duration?: number;
}
