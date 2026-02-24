import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const wordCount = query.trim().split(/\s+/).filter(Boolean).length
    if (wordCount > 50) {
      return NextResponse.json(
        { error: 'Query exceeds 50 word limit' },
        { status: 400 }
      )
    }

    const prompt = `You are a linguistic expert specializing in English etymology. Your task is to translate English words and phrases into a version of English that uses only words with Germanic etymological roots. The translation must include components whose roots are entirely and directly from Proto-Germanic roots. No part of a translation should have any non-Proto-Germanic roots. Also, if a word did come from Middle English, Old English or earlier, verify that the word did not come from a non-Germanic source before that. Also, try not to make the translations sound too "medieval" or "foreign", as the translations should be natural and understandable to contemporary English speakers. If a direct Germanic root isn't available, create a compound word or descriptive phrase using Germanic elements, e.g. "panda" can be calqued into "bear-cat" from Chinese, or "task" can be calqued into something like "work share". Provide a brief explanation of your key word choices and their Germanic roots. If the original word is already made up of Germanic components, please keep the translation the same as the query, but still provide an explanation of its Germanic roots. Do not provide any synonyms to confuse the user.

    Input: "${query}"

    Provide a translation that follows these rules explicitly:
    1. Replace non-Germanic words with calques that have only Germanic roots
    2. Use compound words when necessary (e.g., "telephone" → "far-speaker")
    3. Maintain the original meaning and context
    4. Keep it natural-sounding and understandable
    5. Replace any hyphenations with spaces to ensure the translation is a single, natural phrase
    6. Try to match the part of speech of the original word
    7. If the word already has Germanic roots, keep the translation the same but still explain its etymology... 
       a. For example, if a user enters "spreadsheet", keep the translation as "spreadsheet" but explain how the word comes from Germanic roots! 
       b. Do not provide any synonyms to confuse the user! 

    Then, for the etymological explanation, show the translation's Germanic roots, and show why the original query was replaced or modified, if it was modified.    

    Format your response as JSON with this structure:
    {
      "translation": "the Panglish translation",
      "explanation": "brief explanation of key word choices and their Germanic roots"
    }

    Respond only with valid JSON, no additional text.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile', 
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      throw new Error('No response from AI')
    }

    const result = JSON.parse(responseText)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate translation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
