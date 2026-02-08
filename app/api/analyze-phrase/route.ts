/* 
keywords by @joncoded (aka @jonchius)
/app/api/analyze-phrase/route.ts
user submits a phrase for analysis 
responses retrieved from an LLM 
then displayed on UI
*/

import { NextRequest, NextResponse } from 'next/server'
import { groq, DEFAULT_MODEL } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const { phrase } = await request.json()

    if (!phrase || typeof phrase !== 'string') {
      return NextResponse.json(
        { error: 'Phrase is required' },
        { status: 400 }
      )
    }

    // escapes for quotes, backslashes, and newlines to prevent breaking the JSON prompt
    const escapedPhrase = phrase.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')

    // the prompt template for phrase analysis
    const prompt = `Analyze the following phrase or word: "${escapedPhrase}"

      Please provide a comprehensive analysis in the following JSON format:

      {
        "phrase": "${escapedPhrase}",
        "language": "detected language name",
        "romanization": "Latin transliteration or IPA if the phrase uses non-Latin alphabet, leave blank if no transliteration is needed",
        "translation": "English translation if not in English, or brief (less than 10 words) explanation if already in English",
        "meaning": "Simple explanation at CEFR A1-A2 level",
        "etymology": {
          "origin": "Language/culture of origin",
          "history": "Brief historical background",
          "evolution": "How the meaning evolved to the current usage"
        },
        "examples": [
          {
            "sentence": "Example sentence using the phrase",
            "romanization": "Latin transliteration or IPA if the sentence uses non-Latin alphabet (Arabic, Cyrillic, Greek, Chinese, Japanese, Korean, etc.)",
            "translation": "English translation if needed",
            "context": "When/where this is used"
          }
        ],
        "synonyms": [
          {
            "word": "Synonym",
            "romanization": "Latin transliteration (e.g. Japanese), International Phonetic Alphabet (IPA) if the language is already in written in a Latin alphabet (e.g. German) or if there is no common transliteration method available (e.g. Russian) ",
            "context": "When to use this instead"
          }
        ],
        "inflections": {
          "type": "Type of inflection (noun, verb, adjective, etc.)",
          "forms": [
            {
              "form": "Grammatical form name",
              "value": "The inflected form for all numbers/persons/tenses/cases as applicable",
              "translation" : "English translation if needed"
            }
          ]
        }
      }

      Provide at 2 examples and 3 synonyms. If the phrase doesn't have inflections (like idioms), set inflections to null.
      
      IMPORTANT: For any text in non-Latin alphabets (Cyrillic, Arabic, Greek, Chinese, Japanese, Korean, Hebrew, Thai, etc.), always provide romanization using standard transliteration systems (e.g., Pinyin for Chinese, Romaji for Japanese, standard Cyrillic romanization). 
      
      If standard romanization is not available, provide IPA (International Phonetic Alphabet).
      
      Return ONLY valid JSON, no additional text.`

    // LLM "chat" completion
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a multilingual language expert and linguist. Provide accurate, educational analysis of words and phrases. Always respond with valid JSON only.',
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

    // content sanity check
    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // strip markdown code blocks if present
    let jsonContent = content.trim()

    // remove opening/closing code fence (```json or ```)
    if (jsonContent.startsWith('```')) {    
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '')      
      jsonContent = jsonContent.replace(/\n?```$/, '')
    }

    // JSON parse the response
    const analysis = JSON.parse(jsonContent)

    // take it all the way back to the UI!
    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Error analyzing phrase:', error)
    
    return NextResponse.json(
      { error: 'Failed to analyze phrase. Please try again.' },
      { status: 500 }
    )
  }
}
