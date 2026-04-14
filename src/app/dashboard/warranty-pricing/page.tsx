"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { DataTable } from "@/components/data-table"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Pencil, Trash2 } from 'lucide-react';
import {
  IconLoader,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useAllCategories } from '@/hooks/use-categories'
import { CategoryItem } from '@/models/category'
import Image from 'next/image'
import { useAllWarrantyPricing, useCreateWarrantyPricing, useDeleteWarrantyPricing, useUpdateWarrantyPricing } from '@/hooks/use-warranty-pricing'
import { WarrantyPriceFormData, WarrantyPricingItem } from '@/models/warrantyPricing'
import PricingModal from '@/components/pricing-modal'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SearchInput } from '@/components/search-input'
import { usePageTitle } from '@/hooks/use-page-title'


const schema = z.object({
  id: z.number(),
  category_id: z.number(),
  retail_min: z.string(),
  retail_max: z.string(),
  coverage_duration: z.number(),
  yearly_standard: z.string(),
  yearly_premium: z.string(),
  monthly_standard: z.string(),
  monthly_premium: z.string(),
  service_fee: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  category: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    photo_url: z.string().nullable(),
  }),
})

const WarrantyPricingPage = () => {
  const { title } = usePageTitle();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchKey, setSearchKey] = useState(0)

  const [activeCategory, setActiveCategory] = useState<Record<string, number | string | undefined>>({ id: undefined, name: undefined })

  const { data: warrantyPricingData, isLoading: isLoadingWarrantyPricing } = useAllWarrantyPricing(activeCategory.id as number | undefined);
  const { data: categoriesData } = useAllCategories("");

  const deleteWarrantyPricing = useDeleteWarrantyPricing();
  const createWarrantyPricing = useCreateWarrantyPricing();
  const updateWarrantyPricing = useUpdateWarrantyPricing();

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<CategoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)


  useEffect(() => {
    if (categoriesData?.data?.data && categoriesData.data.data.length > 0) {
      const firstCategory = categoriesData.data.data[0];
      setActiveCategory({ id: firstCategory.id, name: firstCategory.name });
    }
  }, [categoriesData]);

  // Handle deleting record
  const handleDeleteRecord = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setDeletingId(id)
        await deleteWarrantyPricing.mutateAsync(id);
        toast.success('Warranty pricing deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete warranty pricing');
      }
    }
  }, [deleteWarrantyPricing])

  // Define columns specific to claims page
  const columns: ColumnDef<z.infer<typeof schema>>[] = React.useMemo(() => [
    {
      accessorKey: "retail-min",
      header: () => "Retail Min",
      cell: ({ row }) => (
        <>${row.original.retail_min}</>
      ),
      sortingFn: (rowA, rowB) => {
        const priceA = parseFloat(rowA.original.retail_min);
        const priceB = parseFloat(rowB.original.retail_min);
        return priceA - priceB;
      },
    },
    {
      accessorKey: "retail-max",
      header: () => "Retail Max",
      cell: ({ row }) => (
        <>${row.original.retail_max}</>
      ),
      sortingFn: (rowA, rowB) => {
        const priceA = parseFloat(rowA.original.retail_max);
        const priceB = parseFloat(rowB.original.retail_max);
        return priceA - priceB;
      },
    },
    {
      accessorKey: "coverage_duration",
      header: () => "Coverage Duration",
      cell: ({ row }) => (
        row.original.coverage_duration + ' Months'
      ),
    },
    {
      accessorKey: "is_active",
      header: () => "Status",
      cell: ({ row }) => {
        return row.original.is_active === true ? '✅ Active' : '❌ Inactive'
      },
      enableSorting: false,
    },

    {
      id: "actions",
      header: () => <div className="w-full text-right">Actions</div>,
      cell: ({ row }) => {
        const isThisRowDeleting = deleteWarrantyPricing.isPending && deletingId === row.original.id
        return (
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                handleOpenEditModal(row.original)
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
      enableSorting: false,
    },
  ], [deleteWarrantyPricing.isPending, deletingId, handleDeleteRecord])

  // Example API-based search function
  const handleApiSearch = (query: string) => {
    console.log('Searching for:', query)
    // Search functionality can be implemented later
  }

  // Handle adding new record
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddRecord = async (record: WarrantyPriceFormData) => {
    console.log('Adding record:', record)

    // Handle FormData vs object differently
    const newRecord: WarrantyPriceFormData = {
      "category_id": record.category_id,
      "retail_min": record.retail_min,
      "retail_max": record.retail_max,
      "coverage_duration": record.coverage_duration,
      "yearly_standard": record.yearly_standard,
      "yearly_premium": record.yearly_premium,
      "monthly_standard": record.monthly_standard,
      "monthly_premium": record.monthly_premium,
      "service_fee": record.service_fee,
      "is_active": record.is_active
    }
    try {
      await createWarrantyPricing.mutateAsync(newRecord)
    } catch (error) {
      console.error('Add warranty pricing error:', error)
      throw error
    }
  }


  const handleOpenAddModal = () => {
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  // Handle opening edit modal
  const handleOpenEditModal = (record: z.infer<typeof schema>) => {
    setEditingRecord(record as unknown as CategoryItem)
    setIsModalOpen(true)
  }

  // Handle modal form submission
  // TODO: Fix type mismatches between BaseRecord and warranty pricing schema
  const handleModalSubmit = async (data: WarrantyPriceFormData) => {
    console.log('TODO: Fix modal submission types:', data)
    if (editingRecord) {
      await handleEditRecord(data)
    } else {
      await handleAddRecord(data)
    }
    setEditingRecord(null)
  }

  const handleEditRecord = async (record: WarrantyPriceFormData) => {
    console.log('Editing record:', record)
    try {
      const product = {
        "category_id": record.category_id,
        "retail_min": record.retail_min,
        "retail_max": record.retail_max,
        "coverage_duration": record.coverage_duration,
        "yearly_standard": record.yearly_standard,
        "yearly_premium": record.yearly_premium,
        "monthly_standard": record.monthly_standard,
        "monthly_premium": record.monthly_premium,
        "service_fee": record.service_fee,
        "is_active": record.is_active
      }
      await updateWarrantyPricing.mutateAsync({ id: Number(record.id), params: product as WarrantyPricingItem })
    } catch (error) {
      console.error('Update warranty pricing error:', error)
      throw error
    }
  }

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query)
    setSearchQuery(query)
  }, [])

  return (
    <div>
      <h1 className="admin-page-title">{title}</h1>

      {categoriesData?.data && (
        <Tabs defaultValue={categoriesData.data.data[0]?.name}
          onValueChange={(value) => {
            setActiveCategory({
              id: categoriesData?.data?.data?.find(cat => cat.name === value)?.id,
              name: value
            });
          }}>
          <TabsList className="block h-auto p-0 justify-start border-b border-border-soft bg-inherit rounded-none">
            {categoriesData?.data?.data?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.name}
                className="rounded-none text-gray-900 !bg-inherit h-12 p-4 data-[state=active]:font-semibold data-[state=active]:shadow-none border-0 border-b-2 data-[state=active]:border-brand data-[state=active]:text-brand"
              >
                <span className="text-base inline-block">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categoriesData?.data?.data?.map((category) => (
            <TabsContent key={category.id} value={category.name}>
              <>
                <div className="flex items-start gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <Image src={category.photo_url as string || '/default-image.jpg'} alt={category.name} width={72} height={72} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <div className='bg-surface p-4 rounded-xl border-2 border-border-soft'>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4 w-full">
                      {/* <SearchInput
                        key={searchKey}
                        onSearch={handleSearch}
                        placeholder="Search categories..."
                        disabled={isLoadingWarrantyPricing}
                        isLoading={isLoadingWarrantyPricing}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleSearch("")
                          setSearchKey(prev => prev + 1)
                        }}
                        disabled={isLoadingWarrantyPricing}
                      >
                        Clear
                      </Button> */}
                      <Button
                        variant="outline"
                        className='ml-auto'
                        size="sm"
                        onClick={handleOpenAddModal}
                      >
                        Add Pricing
                      </Button>
                    </div>
                  </div>
                  <DataTable
                    data={warrantyPricingData?.data?.data || []}
                    schema={schema}
                    isLoading={isLoadingWarrantyPricing}
                    columns={columns as ColumnDef<unknown>[]}
                  />
                </div>

              </>
            </TabsContent>
          ))}

        </Tabs>
      )
      }
      <br />

      {/* <Alert className="border-red-200 bg-red-50 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your 24 month, and 36 month have overlapping product costs.
        </AlertDescription>
      </Alert> */}
      <PricingModal
        isOpen={isModalOpen}
        activeCategory={activeCategory}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setEditingRecord(null)
          }
        }}
        editingRecord={(editingRecord) as unknown as WarrantyPricingItem}
        onSubmit={handleModalSubmit}
        existingRecords={warrantyPricingData?.data?.data || []}
      />

    </div >
  )
}

export default WarrantyPricingPage
