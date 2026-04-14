export interface CoverageDurationsResponse {
  success: boolean
  data: Duration[]
  message: string
}

export interface Duration {
  value: number
  label: string
}
