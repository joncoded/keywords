/* 
keywords by @joncoded (aka @jonchius)
/lib/groq.ts
GROQ client setup - change the LLM API with one variable!
*/

import Groq from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not defined in environment variables')
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Using llama-3.3-70b-versatile for multilingual support
export const DEFAULT_MODEL = 'llama-3.3-70b-versatile'
