"use client";
import React from 'react';
import { CloudUploadIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
import { Input } from './ui/input';
import { Label } from './ui/label';


interface ClaimNotesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  modalType: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: (files: File[]) => void;
  onCancel: () => void;
  claimNumber?: string;
  policyNumber?: string;
  isLoading?: boolean;
  approvedAmount?: number;
  setApprovedAmount?: (amount: number) => void;
}

export function ClaimNotesModal({
  isOpen,
  onOpenChange,
  modalType,
  notes,
  onNotesChange,
  onSubmit,
  onCancel,
  claimNumber,
  policyNumber,
  isLoading = false,
  approvedAmount,
  setApprovedAmount
}: ClaimNotesModalProps) {

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 2 * 1024 * 1024,
      maxFiles: 1,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden ">
        <DialogHeader className="bg-gray-100 px-6 py-4">
          <DialogTitle className="text-neutral-black_01 text-base">
            {modalType === 'approve' && 'Approve Claim'}
            {modalType === 'reject' && 'Reject Claim'}
            {modalType === 'note' && 'Add Note'}
          </DialogTitle>

        </DialogHeader>
        <div className="p-5 pt-0">
          <div className="grid md:grid-cols-2 gap-2 mb-6">
            <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
              <p className="text-sm font-semibold text-neutral-black_03">Claim Number</p>
              <p className="text-xs text-gray-600">{claimNumber}</p>
            </div>
            <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
              <p className="text-sm font-semibold text-neutral-black_03">Policy Number</p>
              <p className="text-xs text-gray-600">{policyNumber}</p>
            </div>
          </div>
          <div className="relative ">
            {modalType === 'approve' && (
              <div className="mb-6">
                <Label htmlFor="approved-amount" className='mb-2'>Approved Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="approved-amount"
                    placeholder="Enter approved amount"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount?.(Number(e.target.value))}
                    type="number"
                    className="w-full pl-7"
                  />
                </div>
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note
            </label>

            <Textarea
              placeholder={modalType === 'reject'
                ? "Explain why you are rejecting this claim or what additional information is needed..."
                : modalType === 'note'
                  ? "Add a note"
                  : "Add any notes about approving this claim..."
              }
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  onNotesChange(e.target.value);
                }
              }}
              maxLength={200}
              className="min-h-[120px] resize-none"
            />
            <div className="absolute bottom-1 right-1 bg-white px-2 rounded">
              <span className={`text-xs font-medium ${notes.length >= 200 ? 'text-red-500' : 'text-gray-600'}`}>
                {notes.length}/200
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="not-prose flex flex-col gap-4">
              <Dropzone {...dropzone}>
                <div>
                  <div className="flex justify-between">
                    <DropzoneMessage />
                  </div>
                  <DropZoneArea className='w-auto p-0 justify-start inline-flex border-neutral-black_01'>
                    <DropzoneTrigger className="flex items-center gap-4 bg-transparent py-4 px-5 text-center text-sm ">
                      <div>
                        <p className="font-semibold">Attach a file (optional)</p>
                      </div>
                      <CloudUploadIcon className="size-8" />

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
                          variant="ghost"
                          className="shrink-0 hover:outline"
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
          <div className="flex gap-3 mt-6 justify-end">
            <Button
              onClick={onCancel}
              variant="outline"
              className="rounded-full px-10 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(dropzone.fileStatuses.map(f => f.file))}
              disabled={isLoading}
              className={`rounded-full px-10 py-3 text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Submitting...' : 'Submit Note'}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
