export type FlowStepOption = {
  id: string
  label: string | null
  imageUrl?: string | null
  image_url?: string | null
  allowsTextInput?: boolean
  textInputPlaceholder?: string
}

export type FlowFormField = {
  id: string
  kind: string
  label: string
  required: boolean
  placeholder?: string
  options?: FlowStepOption[]
}

export type FlowStep = {
  id: string
  type: string
  index: number
  title: string
  blocKey?: string
  options?: FlowStepOption[]
  fields?: FlowFormField[]
  skippable?: boolean
  subtitle?: string
}

/** Response from GET /api/onboarding/flow?role=... */
export type OnboardingFlowResponse = {
  role: string
  steps: FlowStep[]
  flowId: string
  version: number
}
