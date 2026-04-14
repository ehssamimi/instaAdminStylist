"use client"

import React, { useState, useCallback } from 'react'
import { DataTable } from "@/components/data-table"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  IconLoader,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useAllProducts, useDeleteProduct, usePostProduct, useUpdateProduct } from '@/hooks/use-products'
import ProductModal from '@/components/product-modal'
import { ProductItem } from '@/models/product'
import { Pencil, Trash2 } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { SearchInput } from '@/components/search-input'
import { mdiFileChartOutline } from '@mdi/js'
import Icon from '@mdi/react'
const schema = z.object({
  id: z.number(),
  product_name: z.string(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

const ProductsPage = () => {
  const { title } = usePageTitle();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchKey, setSearchKey] = useState(0)
  const { data: productsData, isLoading } = useAllProducts(searchQuery);
  const deleteProduct = useDeleteProduct();
  const postProduct = usePostProduct();
  const updateProduct = useUpdateProduct();
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  // use useAllClaims to fetch claims data
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingRecord, setEditingRecord] = useState<ProductItem | null>(null)

  // Memoize the search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query)
    setSearchQuery(query)
  }, [])

  // Handle deleting record
  const handleDeleteRecord = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeletingId(id)
        await deleteProduct.mutateAsync(id)
        toast.success('Product deleted')
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? 'Delete failed')
      } finally {
        setDeletingId(null)
      }
    }
  }, [deleteProduct])

  // Define columns specific to claims page
  const columns: ColumnDef<z.infer<typeof schema>>[] = React.useMemo(() => [
    {
      accessorKey: "category_name",
      header: "Category",
      cell: ({ row }) => {
        return (<>{row.original.category.name}</>)
      },
      enableSorting: false,

    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => {
        return (<>{row.original.product_name}</>)
      },
      enableSorting: false,

    },
    {
      id: "actions",
      header: () => <div className="w-full text-right">Actions</div>,
      cell: ({ row }) => {
        const isThisRowDeleting = deleteProduct.isPending && deletingId === row.original.id
        return (
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                handleOpenEditModal(row.original as ProductItem)
              }}
              disabled={isThisRowDeleting}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              disabled={isThisRowDeleting}
              onClick={handleDeleteRecord.bind(null, row.original.id)}
            >
              {isThisRowDeleting ? (
                <>
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>

        )
      },
    },
  ], [deleteProduct.isPending, deletingId, handleDeleteRecord])


  // Handle adding new record
  const handleAddRecord = async (record: Record<string, string>) => {
    try {
      const recordData = record as unknown as { product_name: string; category_id: number };
      const product = {
        "product_name": recordData.product_name,
        "category_id": recordData.category_id,
        "is_active": true
      }
      await postProduct.mutateAsync(product)
      toast.success('Product added')
    } catch (error) {
      console.error('Add Product error:', error)
      throw error
    }
  }

  // Handle editing record
  const handleEditRecord = async (record: Record<string, string>) => {
    console.log('Editing record:', record)
    try {
      const recordData = record as unknown as { product_name: string; category_id: number };
      const product = {
        "product_name": recordData.product_name,
        "category_id": recordData.category_id,
        "is_active": true
      }
      await updateProduct.mutateAsync({ id: editingRecord?.id || 0, productData: product })
      toast.success('Product updated')
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    }
  }

  // Handle opening add modal
  const handleOpenAddModal = () => {
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  // Handle opening edit modal
  const handleOpenEditModal = (record: ProductItem) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  // Handle modal form submission
  const handleModalSubmit = async (formData: Record<string, string>) => {
    if (editingRecord) {
      // Edit existing record - for products we'd need to handle FormData differently
      await handleEditRecord(formData)
    } else {
      // Add new record
      await handleAddRecord(formData)
    }
    setIsModalOpen(false)
    setEditingRecord(null)
  }


  return (
    <div>
      <h1 className="admin-page-title">{title}</h1>

      <div className='bg-surface p-4 rounded-xl border-2 border-border-soft'>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 w-full">
            <SearchInput
              key={searchKey}
              onSearch={handleSearch}
              placeholder="Search products..."
              disabled={isLoading}
              isLoading={isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleSearch("")
                setSearchKey(prev => prev + 1)
              }}
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAddModal}
            >
              <Icon path={mdiFileChartOutline} size={1} />
              <span className="hidden lg:inline">Add Product</span>
            </Button>
          </div>
        </div>
        <DataTable
          data={(productsData?.data?.data as unknown[]) || []}
          columns={columns as ColumnDef<unknown>[]}
          isLoading={isLoading}
          schema={schema}
        />
      </div>



      <ProductModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setEditingRecord(null)
          }
        }}
        editingRecord={editingRecord}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

export default ProductsPage
