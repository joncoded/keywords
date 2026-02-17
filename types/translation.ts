export interface TranslationResponse {
  translation: string
  explanation: string
  alternatives?: string[]
}

export interface ApiResponse {
  success: boolean
  data?: TranslationResponse
  error?: string
  details?: string
}
