/* 
keywords by @joncoded (aka @jonchius)
/app/api/analyze-writing/route.ts
user submits a writing sample for analysis 
responses retrieved from an LLM (via api/analyze-writing/route.ts)
then displayed on UI
*/

import { NextRequest, NextResponse } from 'next/server'
import { groq, DEFAULT_MODEL } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Escape text for JSON prompt
    const escapedText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')

    const prompt = `Analyze the following writing sample: "${escapedText}"

Please provide a comprehensive analysis in the following JSON format:

{
  "originalText": "${escapedText}",
  "language": "detected language name",
  "translation": "English translation if not in English, or 'Already in English' if in English",
  "summary": "Simple summary at CEFR A1-A2 level explaining what this text means",
  "difficultWords": [
    {
      "word": "The difficult word (CEFR B2 and above)",
      "cefrLevel": "B2, C1, or C2",
      "romanization": "Latin transliteration or IPA if the word uses non-Latin alphabet",
      "definition": "Clear, simple definition",
      "etymology": {
        "origin": "Language/culture of origin",
        "history": "Brief historical background"
      },
      "examples": [
        {
          "sentence": "Example sentence",
          "romanization": "Romanization if non-Latin script",
          "translation": "Translation if needed"
        }
      ],
      "rephrasing": "Simpler way to express the same meaning (CEFR A2-B1 level)",
      "inflections": {
        "type": "Type of word (noun, verb, adjective, etc.)",
        "forms": [
          {
            "form": "Grammatical form name",
            "value": "The inflected form"
          }
        ]
      }
    }
  ]
}

IMPORTANT:
- Only identify words at CEFR level A2 and above as "difficult"
- Provide at least 2 examples for each difficult word
- If inflections don't apply (e.g., for adverbs, prepositions), set inflections to null
- For any text in non-Latin alphabets (Cyrillic, Arabic, Greek, Chinese, Japanese, Korean, Hebrew, Thai, etc.), always provide romanization
- Return ONLY valid JSON, no additional text`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a multilingual language expert specializing in language education and CEFR proficiency levels. Provide accurate analysis of text difficulty. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_tokens: 3000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    // Strip markdown code blocks if present
    let jsonContent = content.trim()
    if (jsonContent.startsWith('```')) {
      // Remove opening code fence (```json or ```)
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '')
      // Remove closing code fence
      jsonContent = jsonContent.replace(/\n?```$/, '')
    }

    // Parse JSON response
    const analysis = JSON.parse(jsonContent)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing writing:', error)
    
    return NextResponse.json(
      { error: 'Failed to analyze writing. Please try again.' },
      { status: 500 }
    )
  }
}
