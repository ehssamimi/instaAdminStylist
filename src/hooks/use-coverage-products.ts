import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coverageProductsApi } from "@/lib/api";

export const useCoverageProducts = (page = 1, per_page = 100) => {
  return useQuery({
    queryKey: ["coverage-products", page],
    queryFn: () => coverageProductsApi.getCoverageProducts(page, per_page),
    staleTime: 120000,
    gcTime: 120000,
  });
};

export const useCoverageProduct = (id: number) => {
  return useQuery({
    queryKey: ["coverage-product", id],
    queryFn: () => coverageProductsApi.getCoverageProduct(id),
    enabled: !!id,
    staleTime: 120000,
    gcTime: 120000,
  });
};

