import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { onboardingApi } from "@/lib/api"
import type { OnboardingOption } from "@/models/onboardingOptions"
import type { FlowStepOption } from "@/models/onboardingFlow"

export type SimpleOption = { value: string; label: string }

function normalizeLabel(s: string): string {
  // Normalize en-dash / em-dash to hyphen so labels match stored values
  return s.replace(/[–—]/g, "-")
}

function flowOptionToOnboardingOption(
  opt: FlowStepOption,
  screenType: string
): OnboardingOption {
  return {
    id: opt.id,
    option: opt.label ?? "",
    screenType,
    userType: "stylist",
    key: null,
    label: opt.label,
    imageUrl: opt.imageUrl ?? opt.image_url ?? null,
    meta: opt.allowsTextInput
      ? { allowsTextInput: true, textInputPlaceholder: opt.textInputPlaceholder }
      : null,
    createdAt: "",
    updatedAt: "",
  }
}

function sortByOption<T extends { option: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) =>
    a.option.localeCompare(b.option, undefined, { sensitivity: "base" })
  )
}

export function useOnboardingFlow(role: string = "stylist") {
  const query = useQuery({
    queryKey: ["onboarding-flow", role],
    queryFn: () => onboardingApi.getFlow({ role }),
    staleTime: 60 * 60 * 1000,
    gcTime: 300_000,
  })

  const { genderOptions, experienceOptions, specialityOptions, shopOptions } =
    useMemo(() => {
      const flow = query.data
      if (!flow) {
        return {
          genderOptions: [] as SimpleOption[],
          experienceOptions: [] as SimpleOption[],
          specialityOptions: [] as OnboardingOption[],
          shopOptions: [] as OnboardingOption[],
        }
      }

      const aboutYouStep = flow.steps.find((s) => s.id === "about_you")
      const genderField = aboutYouStep?.fields?.find(
        (f) => f.id === "genderIdentity"
      )
      const genderOptions: SimpleOption[] = (genderField?.options ?? []).map(
        (o) => ({ value: o.id, label: o.label ?? o.id })
      )

      const experienceStep = flow.steps.find((s) => s.id === "experience")
      const experienceOptions: SimpleOption[] = (
        experienceStep?.options ?? []
      ).map((o) => {
        const label = normalizeLabel(o.label ?? o.id)
        return { value: o.id, label }
      })

      const specialityStep = flow.steps.find((s) => s.id === "speciality")
      const specialityOptions: OnboardingOption[] = sortByOption(
        (specialityStep?.options ?? []).map((o) =>
          flowOptionToOnboardingOption(o, "stylist_speciality")
        )
      )

      const shopsStep = flow.steps.find((s) => s.id === "recommend_shops")
      const shopOptions: OnboardingOption[] = (shopsStep?.options ?? []).map(
        (o) => flowOptionToOnboardingOption(o, "stylist_recommended_shops")
      )

      return { genderOptions, experienceOptions, specialityOptions, shopOptions }
    }, [query.data])

  return {
    isLoading: query.isLoading,
    error: query.error,
    genderOptions,
    experienceOptions,
    specialityOptions,
    shopOptions,
  }
}
