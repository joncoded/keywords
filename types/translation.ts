export interface TranslationResponse {
  translation: string
  explanation: string  
}

export interface ApiResponse {
  success: boolean
  data?: TranslationResponse
  error?: string
  details?: string
}
