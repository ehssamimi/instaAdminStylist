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
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import { CloudUploadIcon, Trash2Icon } from 'lucide-react';
import { toast } from "sonner"
import { CategoryItem } from "@/models/category"
import { Switch } from '@/components/ui/switch';
import { Textarea } from "./ui/textarea"

// Base schema that can be extended
export const baseRecordSchema = z.object({
  id: z.number(),
  name: z.string(),
  subtitle: z.string(),
  photo_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type BaseRecord = z.infer<typeof baseRecordSchema>

interface RecordModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingRecord: BaseRecord | CategoryItem
  onSubmit: (data: FormData) => Promise<void>
  className?: string
}

type CategoryFormData = {
  name: string
  subtitle: string
  photo: File | string | null
  id: string
}

export function CategoryModal({
  isOpen,
  onOpenChange,
  editingRecord,
  onSubmit,
  className,
}: RecordModalProps) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    subtitle: '',
    photo: null,
    id: '',
  })

  // Reset form when modal opens/closes or editing record changes
  useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        console.log('Editing record:', editingRecord);
        setFormData({
          name: editingRecord.name || '',
          subtitle: editingRecord.subtitle || '',
          photo: (editingRecord.photo_url as string) || null,
          id: editingRecord.id ? editingRecord.id.toString() : '',
        })
      } else {
        setFormData({
          name: '',
          subtitle: '',
          photo: '',
          id: '',
        })
        // Clear dropzone files when adding new record

      }
    }
  }, [isOpen, editingRecord])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const successFile = dropzone.fileStatuses.find(f => f.status === 'success');
    const hasExistingPhoto = isEditing && typeof editingRecord.photo_url === 'string' && editingRecord.photo_url;

    if (!successFile && !hasExistingPhoto) {
      toast.error('Please upload a category image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build multipart form data
      const fd = new FormData();
      fd.append('name', formData.name || '');
      fd.append('subtitle', formData.subtitle || '');
      if (formData.id) fd.append('id', formData.id);

      // Attach original file if present for backend upload; only send existing photo_url if no new file picked
      if (successFile) {
        fd.append('photo', successFile.file, successFile.fileName);
      }
      if (editingRecord) {
        fd.append('_method', 'PUT');
      }
      console.log('Submitting form data:', fd);
      await onSubmit(fd);
      onOpenChange(false);
    } catch (error) {
      console.log('Form submission error:', error);
      if (typeof error === 'object' && error !== null) {
        const maybeAxios = error as { response?: { data?: { message?: string } } };
        const message = maybeAxios.response?.data?.message;
        toast.error(message || 'Submission failed');
      } else {
        toast.error('Submission failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isEditing = !!editingRecord

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      // Simulate async upload delay; replace with real API call returning URL
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        status: "success",
        // Use an object URL for immediate preview; real impl should return server URL
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 2 * 1024 * 1024,
      // Category has a single photo_url so restrict to one image
      maxFiles: 1,
    },
  });

  // Only update formData.photo_url when a new file successfully uploads; do not clear existing value on removal unless it was a newly added file
  useEffect(() => {
    const successFile = dropzone.fileStatuses.find((f) => f.status === "success");
    if (successFile) {
      // We deliberately DO NOT store the blob: URL in formData; keep real URL only
      // So no handleFieldChange here – preview handled via dropzone result directly
    } else {
      // If there was an existing editingRecord photo_url we keep it; if we were creating new and removed the temp file we also keep empty
      // Nothing to do
    }
  }, [dropzone.fileStatuses]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} >
      <DialogContent className={`max-w-2xl max-h-[90vh] rounded-3xl p-0 overflow-hidden flex flex-col ${className || ''}`}>
        <DialogHeader className="bg-gray-100 px-6 py-4 shrink-0">
          <DialogTitle className="text-neutral-black_01 text-base">
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name as string}
                  onChange={(e) => {
                    if (e.target.value.length <= 25) {
                      handleFieldChange('name', e.target.value);
                    }
                  }}
                  placeholder={"Enter Name"}
                  required={true}
                  maxLength={25}
                />
                <p className={`text-xs text-right ${((formData.name as string)?.length || 0) >= 25 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {(formData.name as string)?.length || 0}/25
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Category Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle as string}
                  onChange={(e) => {
                    if (e.target.value.length <= 90) {
                      handleFieldChange('subtitle', e.target.value);
                    }
                  }}
                  placeholder={"Enter category subtitle"}
                  maxLength={90}
                />
                <p className={`text-xs text-right ${((formData.subtitle as string)?.length || 0) >= 90 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {(formData.subtitle as string)?.length || 0}/90
                </p>
              </div>
              <div className="space-y-2">
                <div className="mt-4">
                  <div className="not-prose flex flex-col gap-4">
                    {(isEditing && typeof editingRecord.photo_url === 'string' && editingRecord.photo_url) && (
                      <div className="mb-4">
                        <Label className="text-sm font-medium">Current Photo</Label>
                        <div className="mt-2 relative inline-block">
                          <img
                            src={editingRecord.photo_url}
                            alt="Current category photo"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload a new photo below to replace this image
                        </p>
                      </div>
                    )}

                    <Dropzone {...dropzone}>
                      <div>
                        <div className="flex justify-between">
                          <DropzoneDescription>
                            Please select 1 image (PNG / JPG, max 2MB)
                          </DropzoneDescription>
                          <DropzoneMessage />
                        </div>
                        <DropZoneArea className="bg-bg-main border-2 border-dashed border-border-muted rounded-lg">
                          <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 w-full text-center text-sm ">
                            <div>
                              <span className="font-semibold bg-primary-buffer text-black rounded-full mb-3 py-3 px-5 inline-block">Upload Files</span>
                              <p className="text-sm text-muted-foreground">
                                or drag and drop them here
                              </p>
                            </div>
                          </DropzoneTrigger>
                        </DropZoneArea>
                      </div>

                      <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
                        {dropzone.fileStatuses.map((file) => (
                          <DropzoneFileListItem
                            className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                            key={file.id}
                            file={file}
                          >
                            {file.status === "pending" && (
                              <div className="aspect-video animate-pulse bg-black/20" />
                            )}
                            {file.status === "success" && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={file.result}
                                alt={`uploaded-${file.fileName}`}
                                className="aspect-video object-cover"
                              />
                            )}
                            <div className="flex items-center justify-between p-2 pl-4">
                              <div className="min-w-0">
                                <p className="truncate text-sm">{file.fileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                              <DropzoneRemoveFile
                                className="shrink-0 hover:outline"
                                aria-label="Remove file"
                              >
                                <Trash2Icon className="size-4" />
                              </DropzoneRemoveFile>
                            </div>
                          </DropzoneFileListItem>
                        ))}
                      </DropzoneFileList>
                    </Dropzone>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" className="rounded-full" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  isEditing ? "Update Category" : "Publish Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryModal;
