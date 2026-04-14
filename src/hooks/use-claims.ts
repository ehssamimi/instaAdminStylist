import axios from "axios";
import apiClient from "../lib/api-client";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { claimsApi, dashboardApi } from "@/lib/api";

const useAllClaims = (search?: string, page?: number, perPage?: number) => {
  return useQuery({
    queryKey: ["claims", search, page, perPage],
    queryFn: () => claimsApi.getClaims(search, page, perPage),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useClaimAdmin = (id: number) => {
  return useQuery({
    queryKey: ["claims", id],
    queryFn: () => claimsApi.getClaimAdmin(id),
    staleTime: 120000,
    gcTime: 120000,
  });
};
const useUserClaims = () => {
  return useQuery({
    queryKey: ["user-claims"],
    queryFn: () => dashboardApi.getClaims(),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useClaim = (id: number) => {
  return useQuery({
    queryKey: ["claims", id],
    queryFn: () => dashboardApi.getClaim(id),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useUpdateClaimStatus = () => {
  const queryClient = useQueryClient();

  const createClaimMutation = useMutation({
    mutationFn: ({ id, params }: {
      id: number, params: FormData
    }) => {
      return claimsApi.updateClaimStatus(id, params);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    }
  });

  return createClaimMutation;
};


export {
  useAllClaims, useClaimAdmin, useClaim, useUpdateClaimStatus, useUserClaims
};

