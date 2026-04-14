import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { categoriesApi } from "@/lib/api";
import { CategoryItem } from '@/models/category';

const useAllCategories = (search?: string) => {
  return useQuery({
    queryKey: ["categories", search],
    queryFn: () => categoriesApi.getCategories(search),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useActiveCategories = () => {
  return useQuery({
    queryKey: ["activeCategories"],
    queryFn: () => categoriesApi.getActivePublicCategories(),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: (params: CategoryItem) => {
      return categoriesApi.createCategory(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  return createCategoryMutation;
};

const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, params }: { id: number; params: CategoryItem }) => {
      return categoriesApi.updateCategory(id, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  return updateCategoryMutation;
};
const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => {
      return categoriesApi.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  return deleteCategoryMutation;
};


export {
  useAllCategories, useActiveCategories, useCreateCategory, useUpdateCategory, useDeleteCategory
};

