import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { warrantyPricingApi } from "@/lib/api";
import { WarrantyPriceFormData, WarrantyPricingItem } from '@/models/warrantyPricing';

const useAllWarrantyPricing = (activeCategoryId: number | undefined) => {
  return useQuery({
    queryKey: ["warrantyPricing", activeCategoryId],
    queryFn: () => warrantyPricingApi.getWarrantyPricing(activeCategoryId),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useDeleteWarrantyPricing = () => {
  const queryClient = useQueryClient();

  const deleteWarrantyMutation = useMutation({
    mutationFn: (id: number) => {
      return warrantyPricingApi.deleteWarrantyPricing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warrantyPricing"] });
    }
  });

  return deleteWarrantyMutation;
};
const useCreateWarrantyPricing = () => {
  const queryClient = useQueryClient();

  const postWarrantyMutation = useMutation({
    mutationFn: (params: WarrantyPriceFormData) => {
      return warrantyPricingApi.postWarrantyPricing(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warrantyPricing"] });
    }
  });

  return postWarrantyMutation;
};
const useUpdateWarrantyPricing = () => {
  const queryClient = useQueryClient();

  const updateWarrantyMutation = useMutation({
    mutationFn: ({ id, params }: { id: number, params: WarrantyPricingItem }) => {
      return warrantyPricingApi.updateWarrantyPricing(id, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warrantyPricing"] });
    }
  });

  return updateWarrantyMutation;
};

const useAllCoverageDurations = () => {
  return useQuery({
    queryKey: ["coverage-durations"],
    queryFn: () => warrantyPricingApi.getCoverageDurations(),
    staleTime: 120000,
    gcTime: 120000,
  });
};

export {
  useAllWarrantyPricing,
  useAllCoverageDurations,
  useDeleteWarrantyPricing,
  useCreateWarrantyPricing,
  useUpdateWarrantyPricing,
};

