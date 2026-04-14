"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import { z } from "zod"
import { IconLoader, IconCheck } from "@tabler/icons-react"
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

import { toast } from "sonner"

import { Switch } from '@/components/ui/switch';

import { useAllCoverageDurations } from '@/hooks/use-warranty-pricing'
import { WarrantyPriceFormData, WarrantyPricingItem } from "@/models/warrantyPricing"
// Base schema that can be extended
export const baseRecordSchema = z.object({
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

export type BaseRecord = z.infer<typeof baseRecordSchema>

interface RecordModalProps {
  isOpen: boolean
  activeCategory: Record<string, number | string | undefined>
  onOpenChange: (open: boolean) => void
  editingRecord: BaseRecord | WarrantyPricingItem
  onSubmit: (data: WarrantyPriceFormData) => Promise<void>
  className?: string
  /** Existing pricing records for this category (used to skip sequential validation for matching retail ranges) */
  existingRecords?: Array<{ retail_min: string | number; retail_max: string | number; coverage_duration: number }>
}

type TabFormData = {
  id?: number | string
  yearly_standard: number | string
  yearly_premium: number | string
  monthly_standard?: number | string
  monthly_premium?: number | string
  service_fee: number | string
  is_active: boolean
}

type CommonFormData = {
  retail_min: number | string
  retail_max: number | string
  monthly_standard?: number | string
  monthly_premium?: number | string
}

const createEmptyTabData = (): TabFormData => ({
  yearly_standard: '',
  yearly_premium: '',
  service_fee: '',
  is_active: true,
})

const hasValue = (v: number | string | undefined) =>
  v !== undefined && v !== null && String(v).trim() !== ''

/** Tab is filled if service fee has a value AND at least one of: monthly fields or yearly fields */
function isTabFilled(data: TabFormData, commonData: CommonFormData): boolean {
  const hasMonthly = hasValue(commonData.monthly_standard) || hasValue(commonData.monthly_premium)
  const hasYearly = hasValue(data.yearly_standard) || hasValue(data.yearly_premium)
  const hasServiceFee = hasValue(data.service_fee)
  return hasServiceFee && (hasMonthly || hasYearly)
}

/** Block tab switch when current tab has some values but isn't fully filled (with new rule this is rarely true) */
function isTabPartiallyFilled(data: TabFormData, commonData: CommonFormData): boolean {
  const anyValue = hasValue(commonData.monthly_standard) || hasValue(commonData.monthly_premium) ||
    hasValue(data.yearly_standard) || hasValue(data.yearly_premium) || hasValue(data.service_fee)
  return anyValue && !isTabFilled(data, commonData)
}


export function PricingModal({
  isOpen,
  activeCategory,
  onOpenChange,
  editingRecord,
  onSubmit,
  className,
  existingRecords = [],
}: RecordModalProps) {
  const { data: coverageDurations } = useAllCoverageDurations();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(12)

  // Common data shared across all tabs
  const [commonData, setCommonData] = useState<CommonFormData>({ retail_min: '', retail_max: '', monthly_standard: '', monthly_premium: '' })

  // Store form data per coverage duration
  const [tabsData, setTabsData] = useState<Record<number, TabFormData>>({})

  const isEditing = !!editingRecord

  const sortedDurations = useMemo(() => {
    return coverageDurations?.data?.map((d: { value: number }) => d.value).sort((a: number, b: number) => a - b) || [12, 24, 36]
  }, [coverageDurations])

  // Reset form when modal opens/closes or editing record changes
  useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        console.log('Editing record:', editingRecord);
        const duration = editingRecord.coverage_duration
        setActiveTab(duration)
        setCommonData({
          retail_min: editingRecord.retail_min || '',
          retail_max: editingRecord.retail_max || '',
          monthly_standard: editingRecord.monthly_standard || '',
          monthly_premium: editingRecord.monthly_premium || '',
        })
        setTabsData({
          [duration]: {
            id: editingRecord.id,
            yearly_standard: editingRecord.yearly_standard || '',
            yearly_premium: editingRecord.yearly_premium || '',
            service_fee: editingRecord.service_fee || '',
            is_active: editingRecord.is_active || false,
          }
        })
      } else {
        setActiveTab(sortedDurations[0] || 12)
        setCommonData({ retail_min: '', retail_max: '' })
        setTabsData({})
      }
    }
  }, [isOpen, editingRecord, sortedDurations])

  const currentTabData = useMemo(() => {
    return tabsData[activeTab] || createEmptyTabData()
  }, [tabsData, activeTab])

  // Durations that already exist in DB for the current retail range (disable these tabs in add mode)
  const existingDurationsForRange = useMemo(() => {
    if (isEditing || !commonData.retail_min || !commonData.retail_max) return []
    const normalizeValue = (v: string | number) => parseFloat(String(v)) || 0
    const formMin = normalizeValue(commonData.retail_min)
    const formMax = normalizeValue(commonData.retail_max)
    return existingRecords
      .filter(r => normalizeValue(r.retail_min) === formMin && normalizeValue(r.retail_max) === formMax)
      .map(r => r.coverage_duration)
  }, [isEditing, commonData.retail_min, commonData.retail_max, existingRecords])

  // Auto-switch to first available tab when current tab becomes disabled
  useEffect(() => {
    if (!isEditing && existingDurationsForRange.includes(activeTab)) {
      const firstAvailable = sortedDurations.find(d => !existingDurationsForRange.includes(d))
      if (firstAvailable) {
        setActiveTab(firstAvailable)
      }
    }
  }, [existingDurationsForRange, activeTab, sortedDurations, isEditing])

  const handleCommonChange = useCallback((field: keyof CommonFormData, value: string) => {
    setCommonData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleTabChange = useCallback((newTab: number) => {
    if (isEditing) return
    const currentData = tabsData[activeTab]
    if (currentData && isTabPartiallyFilled(currentData, commonData)) {
      toast.error('Please fill out all fields or clear them before switching tabs')
      return
    }
    setActiveTab(newTab)
  }, [activeTab, tabsData, commonData, isEditing])

  const handleInputChange = useCallback((field: keyof TabFormData, value: string | number | boolean) => {
    setTabsData(prev => {
      const currentData = prev[activeTab] || createEmptyTabData()
      const updates: Partial<TabFormData> = { [field]: value }

      // // Autofill monthly from yearly (yearly / 10)
      // if (field === 'yearly_standard' && typeof value === 'string' && value !== '') {
      //   const yearly = parseFloat(value)
      //   if (!isNaN(yearly)) {
      //     updates.monthly_standard = (yearly / 10).toFixed(2)
      //   }
      // }
      // if (field === 'yearly_premium' && typeof value === 'string' && value !== '') {
      //   const yearly = parseFloat(value)
      //   if (!isNaN(yearly)) {
      //     updates.monthly_premium = (yearly / 10).toFixed(2)
      //   }
      // }

      return {
        ...prev,
        [activeTab]: {
          ...currentData,
          ...updates
        }
      }
    })
  }, [activeTab])

  const validateAndGetFilledTabs = useCallback((): { valid: boolean; filledTabs: number[]; error?: string } => {
    // Check common fields first
    if (!commonData.retail_min || !commonData.retail_max) {
      return { valid: false, filledTabs: [], error: 'Please fill out Retail Min and Retail Max' }
    }

    const filledTabs: number[] = []

    for (const duration of sortedDurations) {
      const data = tabsData[duration]
      if (data && isTabFilled(data, commonData)) {
        filledTabs.push(duration)
      }
    }

    if (filledTabs.length === 0) {
      return { valid: false, filledTabs: [], error: 'Please fill out Service Fee and at least one of: Monthly Standard/Premium or Yearly Standard/Premium' }
    }

    // Skip previous durations check in edit mode
    if (!isEditing) {
      // Get durations that already exist for the same retail range
      // Normalize values to numbers for comparison (handles "100" vs "100.00" vs 100)
      const normalizeValue = (v: string | number) => parseFloat(String(v)) || 0
      const formMin = normalizeValue(commonData.retail_min)
      const formMax = normalizeValue(commonData.retail_max)

      const existingDurationsForRange = existingRecords
        .filter(r => normalizeValue(r.retail_min) === formMin && normalizeValue(r.retail_max) === formMax)
        .map(r => r.coverage_duration)


      // Check if previous durations are filled for each filled duration
      // But skip durations that already exist in the database for this retail range
      for (const filled of filledTabs) {
        const index = sortedDurations.indexOf(filled)
        const previousDurations = sortedDurations.slice(0, index)

        for (const prev of previousDurations) {
          // Skip if this duration already exists in the database for this retail range OR is filled in the form
          if (!filledTabs.includes(prev) && !existingDurationsForRange.includes(prev)) {
            return {
              valid: false,
              filledTabs,
              error: `Please fill out ${prev} month coverage before ${filled} month coverage`
            }
          }
        }
      }
    }

    return { valid: true, filledTabs }
  }, [tabsData, sortedDurations, commonData, isEditing, existingRecords])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { valid, filledTabs, error } = validateAndGetFilledTabs()

    if (!valid) {
      toast.error(error)
      return
    }

    setIsSubmitting(true);

    try {
      // Submit each filled tab
      for (const duration of filledTabs) {
        const data = tabsData[duration]!
        const formData: WarrantyPriceFormData = {
          ...data,
          ...commonData,
          monthly_standard: commonData.monthly_standard ?? '',
          monthly_premium: commonData.monthly_premium ?? '',
          category_id: activeCategory.id || '',
          coverage_duration: duration,
        }
        await onSubmit(formData)
      }

      toast.success(
        editingRecord
          ? 'Warranty pricing updated successfully'
          : `${filledTabs.length} pricing record(s) added successfully`
      );
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl max-h-[90vh] rounded-3xl p-0 overflow-hidden flex flex-col ${className || ''}`}>
        <DialogHeader className="bg-gray-100 px-6 py-4 shrink-0">
          <DialogTitle className="text-neutral-black_01 text-base">
            {isEditing ? `Edit ${activeCategory.name} pricing` : `Add ${activeCategory.name} Pricing`}
          </DialogTitle>
        </DialogHeader>
        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="">
              <div className="space-y-4">
                <h3 className="font-semibold text-base text-neutral-black_01">Price Range</h3>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="retailMin" className="text-sm text-neutral-black_01">
                        Retail Min
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="retailMin"
                          type="number"
                          value={commonData.retail_min}
                          onChange={(e) => handleCommonChange('retail_min', e.target.value)}
                          disabled={isEditing}
                          className="w-full pl-7"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retailMax" className="text-sm text-neutral-black_01">
                        Retail Max
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="retailMax"
                          type="number"
                          value={commonData.retail_max}
                          onChange={(e) => handleCommonChange('retail_max', e.target.value)}
                          disabled={isEditing}
                          className="w-full pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-base text-neutral-black_01">Monthly Pricing</h3>

                {/* Monthly Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyStandard" className="text-sm text-neutral-black_01">
                      Monthly Standard
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="monthlyStandard"
                        type="number"
                        value={commonData.monthly_standard}
                        onChange={(e) => handleCommonChange('monthly_standard', e.target.value)}
                        className="w-full pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPremium" className="text-sm text-neutral-black_01">
                      Monthly Premium (Additional)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="monthlyPremium"
                        type="number"
                        value={commonData.monthly_premium}
                        onChange={(e) => handleCommonChange('monthly_premium', e.target.value)}
                        className="w-full pl-7"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-base text-neutral-black_01">Yearly Pricing</h3>

                {/* Tab-style duration selector */}
                <div className="flex justify-between">
                  {coverageDurations?.data?.map((option: { value: number; label: string }) => {
                    const isFilled = tabsData[option.value] && isTabFilled(tabsData[option.value], commonData)
                    const alreadyExists = existingDurationsForRange.includes(option.value)
                    const isDisabled = (isEditing && activeTab !== option.value) || alreadyExists
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleTabChange(option.value)}
                        title={alreadyExists ? `${option.label} already exists for this retail range` : undefined}
                        className={`relative rounded-xl px-2 py-2 text-sm transition-colors border-2 border-gray-200 text-neutral-black_01 ${activeTab === option.value
                          ? '!text-brand !border-border-muted bg-bg-main -mb-px'
                          : isDisabled
                            ? 'text-gray-300 !cursor-not-allowed bg-gray-200'
                            : ' hover:text-gray-700'
                          }`}
                      >
                        <span className="flex items-center gap-1.5 ">
                          {option.label}
                          {(alreadyExists || isFilled) && (
                            <div className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <IconCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearlyStandard" className="text-sm text-neutral-black_01">
                      Yearly Standard
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="yearlyStandard"
                        type="number"
                        value={currentTabData.yearly_standard}
                        onChange={(e) => handleInputChange('yearly_standard', e.target.value)}
                        className="w-full pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearlyPremium" className="text-sm text-neutral-black_01">
                      Yearly Premium (Additional)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="yearlyPremium"
                        type="number"
                        value={currentTabData.yearly_premium}
                        onChange={(e) => handleInputChange('yearly_premium', e.target.value)}
                        className="w-full pl-7"
                      />
                    </div>
                  </div>
                </div>


                {/* Service Fee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="serviceFee" className="text-sm text-neutral-black_01">
                      Service Fee
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="serviceFee"
                        type="number"
                        value={currentTabData.service_fee}
                        onChange={(e) => handleInputChange('service_fee', e.target.value)}
                        className="w-full pl-7"
                      />
                    </div>
                  </div>
                  {/* Active Toggle */}
                  <div className="flex justify-center items-end pb-3 gap-2">
                    <Label htmlFor="active-toggle" className="text-sm text-neutral-black_01 font-normal">
                      Active Duration
                    </Label>
                    <Switch
                      id="active-toggle"
                      checked={currentTabData.is_active}
                      className="data-[state=checked]:bg-success-600 data-[state=unchecked]:bg-[#EEEEF1] "
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                  </div>
                </div>

              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-full px-10">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="rounded-full px-10">
                {isSubmitting ? (
                  <>
                    <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  isEditing ? "Update Pricing" : "Add Pricing"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PricingModal;
