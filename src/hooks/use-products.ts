import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { productsApi } from "@/lib/api";

const useAllProducts = (search?: string) => {
  return useQuery({
    queryKey: ["products", search],
    queryFn: () => productsApi.getProducts(search),
    staleTime: 120000,
    gcTime: 120000,
  });
};

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => {
      return productsApi.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return deleteProductMutation;
};

const usePostProduct = () => {
  const queryClient = useQueryClient();

  const postProductMutation = useMutation({
    mutationFn: (productData: Record<string, unknown>) => {
      return productsApi.postProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return postProductMutation;
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: ({ id, productData }: { id: number; productData: Record<string, unknown> }) => {
      return productsApi.updateProduct(id, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return updateProductMutation;
};
export {
  useAllProducts,
  useDeleteProduct,
  usePostProduct,
  useUpdateProduct
};

