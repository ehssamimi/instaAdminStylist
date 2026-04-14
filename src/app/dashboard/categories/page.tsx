"use client"

import React, { useState, useMemo, useCallback, useId } from 'react'
import { DataTable } from "@/components/data-table"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  IconLoader,
  IconPlus,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useAllCategories, useDeleteCategory, useUpdateCategory, useCreateCategory } from '@/hooks/use-categories'
import CategoryModal from '@/components/category-modal'
import { CategoryItem } from '@/models/category'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { SearchInput } from '@/components/search-input'


const schema = z.object({
  id: z.number(),
  name: z.string(),
  subtitle: z.string(),
  photo_url: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

const CategoriesPage = () => {
  const { title } = usePageTitle();
  const modalBaseId = useId();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchKey, setSearchKey] = useState(0)
  const { data: categoriesData, isLoading } = useAllCategories(searchQuery);
  const deleteCategory = useDeleteCategory();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<CategoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [modalKey, setModalKey] = useState(0)

  // Memoize the search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query)
    setSearchQuery(query)
  }, [])

  // Handle deleting record
  const handleDeleteRecord = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setDeletingId(id)
        await deleteCategory.mutateAsync(id);
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete category');
      }
    }
  }, [deleteCategory])

  // Define columns specific to claims page
  const columns: ColumnDef<z.infer<typeof schema>>[] = useMemo(() => [
    {
      accessorKey: "photo_url",
      header: "Image",
      cell: ({ row }) => {
        return (<>{row.original.photo_url && <Image src={row.original.photo_url} alt={row.original.name} width={50} height={50} />}</>)
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => {
        return (<>{row.original.name}</>)
      },
      enableSorting: false,
    },
    {
      accessorKey: "subtitle",
      header: () => "Category Subtitle",
      cell: ({ row }) => (
        <div className="line-clamp-2 max-w-96 whitespace-normal">{row.original.subtitle}</div>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="w-full text-right">Actions</div>,
      cell: ({ row }) => {
        const isThisRowDeleting = deleteCategory.isPending && deletingId === row.original.id
        return (
          <div className="flex w-full justify-end">
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
                  <IconLoader className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>

        )
      },
    },
  ], [deleteCategory.isPending, deletingId, handleDeleteRecord])

  // Handle adding new record
  const handleAddRecord = async (record: Omit<z.infer<typeof schema>, 'id'> | FormData) => {
    console.log('Adding record:', record)
    try {
      await createCategory.mutateAsync(record as unknown as CategoryItem)
      toast.success('Category added')
    } catch (error) {
      console.error('Add category error:', error)
      throw error
    }
  }

  const handleEditRecord = async (record: z.infer<typeof schema> | FormData & { id?: number }) => {
    console.log('Editing record:', record)
    try {
      if (record instanceof FormData) {
        const idVal = editingRecord?.id;
        if (typeof idVal === 'number') {
          await updateCategory.mutateAsync({ id: idVal, params: record as unknown as CategoryItem })
        }
      } else {
        const category: CategoryItem = {
          "id": record.id,
          "name": record.name,
          "subtitle": record.subtitle,
          "photo_url": record.photo_url,
          "is_active": true,
        }
        await updateCategory.mutateAsync({ id: record.id, params: category })
      }
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Update category error:', error)
      throw error
    }
  }

  // Handle opening add modal
  const handleOpenAddModal = () => {
    setEditingRecord(null)
    setModalKey(prev => prev + 1)
    setIsModalOpen(true)
  }

  // Handle opening edit modal
  const handleOpenEditModal = (record: z.infer<typeof schema>) => {
    setEditingRecord(record as CategoryItem)
    setModalKey(prev => prev + 1)
    setIsModalOpen(true)
  }

  // Handle modal form submission
  const handleModalSubmit = async (formData: FormData) => {
    if (editingRecord) {
      await handleEditRecord(formData as FormData & { id?: number })
    } else {
      console.log('Form data for new record:', formData);
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
              placeholder="Search categories..."
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
              <IconPlus />
              <span className="hidden lg:inline">Add Category</span>
            </Button>
          </div>
        </div>
        <DataTable
          data={categoriesData?.data?.data || []}
          schema={schema}
          isLoading={isLoading}
          columns={columns as ColumnDef<unknown>[]}
        />
      </div>

      <CategoryModal
        key={`${modalBaseId}-${modalKey}`}
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setEditingRecord(null)
          }
        }}
        editingRecord={editingRecord as unknown as CategoryItem}
        onSubmit={handleModalSubmit}
      />

    </div>
  )
}

export default CategoriesPage
