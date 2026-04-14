"use client"

import React, { useEffect, useState } from "react"
import { z } from "zod"
import { IconLoader } from "@tabler/icons-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useAllCategories } from "@/hooks/use-categories"
import { CategoryItem } from "@/models/category"

// Base schema that can be extended
export const baseRecordSchema = z.object({
  id: z.number(),
  product_name: z.string(),
  category: z.object({
    name: z.string(),
    id: z.number(),
  }),
})

export type BaseRecord = z.infer<typeof baseRecordSchema>

interface RecordModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingRecord: BaseRecord | null
  onSubmit: (data: Record<string, string>) => Promise<void>
  className?: string
}

type ProductFormData = {
  product_name: string
  category: { id: number; name: string }
}

export function ProductModal({
  isOpen,
  onOpenChange,
  editingRecord,
  onSubmit,
  className,
}: RecordModalProps) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: '',
    category: { name: '', id: 0 },
  })
  const { data: categoriesData } = useAllCategories();
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (categoriesData && categoriesData.data) {
      const formattedCategories = categoriesData.data.data.map((category: CategoryItem) => ({
        value: category.id?.toString() || '',
        label: category.name,
      }));
      setCategories(formattedCategories);
    }
  }, [categoriesData]);


  // Reset form when modal opens/closes or editing record changes
  useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        setFormData({
          product_name: editingRecord.product_name || '',
          category: { name: editingRecord.category.name || '', id: editingRecord.category.id },
        })
      } else {
        setFormData({
          product_name: '',
          category: { name: '', id: 0 },
        })
      }
    }
  }, [isOpen, editingRecord])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Build FormData
      const fd: Record<string, string> = {}
      fd['product_name'] = formData.product_name
      fd['category_id'] = formData.category.id.toString()

      await onSubmit(fd)

      toast.success(
        editingRecord
          ? 'Record updated successfully'
          : 'Record added successfully'
      )

      onOpenChange(false)
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save record')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isEditing = !!editingRecord

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl rounded-3xl p-0 overflow-hidden ${className || ''}`}>
        <DialogHeader className="bg-gray-100 px-6 py-4">
          <DialogTitle className="text-neutral-black_01 text-base">
            {isEditing ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="header">Product Name</Label>
                <Input
                  id="header"
                  value={formData.product_name as string}
                  onChange={(e) => handleFieldChange('product_name', e.target.value)}
                  placeholder={"Enter product name"}
                  required={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Product Category</Label>
                <Select
                  value={formData.category?.id?.toString() || ''}
                  onValueChange={(value) => handleFieldChange('category', { id: Number(value), name: '' })}
                >
                  <SelectTrigger className="w-full !h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Update" : "Add"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductModal;
