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

// Using openai/gpt-oss-120b for multilingual support
export const DEFAULT_MODEL = 'openai/gpt-oss-120b'
