"use client"

import * as React from "react"
import { z } from "zod"
import { IconLoader } from "@tabler/icons-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

// Base schema that can be extended
export const baseRecordSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export type BaseRecord = z.infer<typeof baseRecordSchema>

// Configuration for different modal types
export interface ModalConfig {
  title: {
    add: string
    edit: string
  }
  description: {
    add: string
    edit: string
  }
  fields: {
    header: {
      label: string
      placeholder: string
      required?: boolean
    }
    type: {
      label: string
      options: { value: string; label: string }[]
    }
    status: {
      label: string
      options: { value: string; label: string }[]
    }
    target: {
      label: string
      placeholder: string
    }
    limit: {
      label: string
      placeholder: string
    }
    reviewer: {
      label: string
      options: { value: string; label: string }[]
    }
  }
  submitButton: {
    add: string
    edit: string
    loadingAdd: string
    loadingEdit: string
  }
}

// Default configuration for claims/general records
export const defaultModalConfig: ModalConfig = {
  title: {
    add: "Add New Record",
    edit: "Edit Record"
  },
  description: {
    add: "Fill in the information for the new record.",
    edit: "Update the record information below."
  },
  fields: {
    header: {
      label: "Header",
      placeholder: "Enter header",
      required: true
    },
    type: {
      label: "Section Type",
      options: [
        { value: "Table of Contents", label: "Table of Contents" },
        { value: "Executive Summary", label: "Executive Summary" },
        { value: "Technical Approach", label: "Technical Approach" },
        { value: "Design", label: "Design" },
        { value: "Capabilities", label: "Capabilities" },
        { value: "Focus Documents", label: "Focus Documents" },
        { value: "Narrative", label: "Narrative" },
        { value: "Cover Page", label: "Cover Page" },
        { value: "Technical content", label: "Technical content" },
        { value: "Plain language", label: "Plain language" },
        { value: "Legal", label: "Legal" },
        { value: "Visual", label: "Visual" },
        { value: "Financial", label: "Financial" },
        { value: "Research", label: "Research" },
        { value: "Planning", label: "Planning" },
      ]
    },
    status: {
      label: "Status",
      options: [
        { value: "Done", label: "Done" },
        { value: "In Process", label: "In Process" },
        { value: "Not Started", label: "Not Started" },
      ]
    },
    target: {
      label: "Target",
      placeholder: "Enter target"
    },
    limit: {
      label: "Limit",
      placeholder: "Enter limit"
    },
    reviewer: {
      label: "Reviewer",
      options: [
        { value: "Assign reviewer", label: "Assign reviewer" },
        { value: "Eddie Lake", label: "Eddie Lake" },
        { value: "Jamik Tashpulatov", label: "Jamik Tashpulatov" },
        { value: "Emily Whalen", label: "Emily Whalen" },
        { value: "Maya Johnson", label: "Maya Johnson" },
        { value: "Carlos Rodriguez", label: "Carlos Rodriguez" },
        { value: "Sarah Chen", label: "Sarah Chen" },
        { value: "Raj Patel", label: "Raj Patel" },
        { value: "Leila Ahmadi", label: "Leila Ahmadi" },
        { value: "Thomas Wilson", label: "Thomas Wilson" },
        { value: "Sophia Martinez", label: "Sophia Martinez" },
        { value: "Alex Thompson", label: "Alex Thompson" },
        { value: "Nina Patel", label: "Nina Patel" },
        { value: "David Kim", label: "David Kim" },
        { value: "Maria Garcia", label: "Maria Garcia" },
        { value: "James Wilson", label: "James Wilson" },
        { value: "Priya Singh", label: "Priya Singh" },
        { value: "Sarah Johnson", label: "Sarah Johnson" },
        { value: "Michael Chen", label: "Michael Chen" },
        { value: "Lisa Wong", label: "Lisa Wong" },
        { value: "Daniel Park", label: "Daniel Park" },
        { value: "Emma Davis", label: "Emma Davis" },
      ]
    }
  },
  submitButton: {
    add: "Add Record",
    edit: "Update Record",
    loadingAdd: "Adding...",
    loadingEdit: "Updating..."
  }
}

interface RecordModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingRecord: BaseRecord | null
  onSubmit: (data: Omit<BaseRecord, 'id'>) => Promise<void>
  config?: ModalConfig
  className?: string
}

export function RecordModal({
  isOpen,
  onOpenChange,
  editingRecord,
  onSubmit,
  config = defaultModalConfig,
  className,
}: RecordModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<Record<string, string>>({})

  // Reset form when modal opens/closes or editing record changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        setFormData({
          header: editingRecord.header || '',
          type: editingRecord.type || '',
          status: editingRecord.status || '',
          target: editingRecord.target || '',
          limit: editingRecord.limit || '',
          reviewer: editingRecord.reviewer || '',
        })
      } else {
        setFormData({
          header: '',
          type: '',
          status: '',
          target: '',
          limit: '',
          reviewer: '',
        })
      }
    }
  }, [isOpen, editingRecord])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate the form data
      const recordData = {
        header: formData.header,
        type: formData.type,
        status: formData.status,
        target: formData.target,
        limit: formData.limit,
        reviewer: formData.reviewer,
      }

      await onSubmit(recordData)

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

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isEditing = !!editingRecord

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${className || ''}`}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? config.title.edit : config.title.add}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? config.description.edit : config.description.add}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Header Field */}
            <div className="space-y-2">
              <Label htmlFor="header">{config.fields.header.label}</Label>
              <Input
                id="header"
                value={formData.header || ''}
                onChange={(e) => handleFieldChange('header', e.target.value)}
                placeholder={config.fields.header.placeholder}
                required={config.fields.header.required}
              />
            </div>

            {/* Type and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">{config.fields.type.label}</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) => handleFieldChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.fields.type.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{config.fields.status.label}</Label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => handleFieldChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.fields.status.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target and Limit Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">{config.fields.target.label}</Label>
                <Input
                  id="target"
                  value={formData.target || ''}
                  onChange={(e) => handleFieldChange('target', e.target.value)}
                  placeholder={config.fields.target.placeholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">{config.fields.limit.label}</Label>
                <Input
                  id="limit"
                  value={formData.limit || ''}
                  onChange={(e) => handleFieldChange('limit', e.target.value)}
                  placeholder={config.fields.limit.placeholder}
                />
              </div>
            </div>

            {/* Reviewer Field */}
            <div className="space-y-2">
              <Label htmlFor="reviewer">{config.fields.reviewer.label}</Label>
              <Select
                value={formData.reviewer || ''}
                onValueChange={(value) => handleFieldChange('reviewer', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {config.fields.reviewer.options.map((option) => (
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
                  {isEditing ? config.submitButton.loadingEdit : config.submitButton.loadingAdd}
                </>
              ) : (
                isEditing ? config.submitButton.edit : config.submitButton.add
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RecordModal
