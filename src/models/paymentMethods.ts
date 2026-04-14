export interface CardIcon {
  name: string;
  url: string;
}

export interface CardDetails {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  funding: string;
  icon: CardIcon;
}

export interface PaymentMethod {
  id: string;
  type: string;
  is_default: boolean;
  card: CardDetails;
  created: number;
}

export interface PaymentMethodsResponse {
  success: boolean;
  data: PaymentMethod[];
  message: string;
}

