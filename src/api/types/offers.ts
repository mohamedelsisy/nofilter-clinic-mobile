// Offers types for the Site API

export interface OfferListItem {
  id: number;
  title: string;
  title_ar: string;
  title_en: string;
  new_price: number;
  old_price?: number;
  photo: string;
  image?: string;
  is_active?: boolean;
  service?: {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
  };
  discount_percentage?: number;
  valid_from?: string;
  valid_to?: string;
}

export interface OfferDetails extends OfferListItem {
  description?: string;
  description_ar?: string;
  description_en?: string;
  terms?: string;
  terms_ar?: string;
  terms_en?: string;
  related_offers?: OfferListItem[];
}
