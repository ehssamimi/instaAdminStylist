// Extension Payment Intent Request
export interface CreateExtensionPaymentIntentRequest {
  duration_years: number;
  plan_type: string;
}

// Extension Details in the payment intent response
export interface ExtensionDetails {
  current_expiration_date: string;
  new_expiration: string;
  extension_years: number;
  plan_type: string;
  plan_display: string;
}

// Extension Payment Intent Response
export interface CreateExtensionPaymentIntentResponse {
  success: boolean;
  data: {
    client_secret: string;
    payment_intent_id: string;
    amount: number;
    extension_details: ExtensionDetails;
  };
  message?: string;
}

// Confirm Extension Payment Request
export interface ConfirmExtensionPaymentRequest {
  payment_intent_id: string;
}

// Confirm Extension Payment Response
export interface ConfirmExtensionPaymentResponse {
  success: boolean;
  data: {
    coverage_product: {
      id: number;
      new_expiration: string;
      status: string;
      policy_number: string;
    };
    extension_details: ExtensionDetails;
  };
  message: string;
}
