export interface DuplicatedProductsResponse {
  success: boolean;
  data: {
    district_id: number;
    products: Array<{
      product_id: number;
      already_added: boolean;
      schools?: Array<{
        school_id: number;
        school_name: string;
      }>;
    }>;
  };
}
