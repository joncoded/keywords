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

    const prompt = `You are a linguistic expert specializing in Germanic etymology. Your task is to translate English words and phrases into "Panglish", a version of English that uses only words with Germanic etymological roots, avoiding Latin, French, Greek, and other Romance or Classical borrowings. Try not to make the translations sound too "medieval" or "foreign", as the translations should be natural and understandable to contemporary English speakers. If a direct Germanic root isn't available, create a compound word or descriptive phrase using Germanic elements, e.g. "panda" can be calqued into "bear-cat" from Chinese. Provide a brief explanation of your key word choices and their Germanic roots. If there are interesting alternative translations that also follow the Germanic rule, list up to three of them.

    Input: "${query}"

    Provide a Panglish translation following these rules:
    1. Replace non-Germanic words with Germanic alternatives or calques
    2. Use compound words when necessary (e.g., "telephone" → "far-speaker")
    3. Maintain the original meaning and context
    4. Keep it natural-sounding and understandable

    Then, for the etymological explanation, show the translation's Germanic roots, and show why the original query was replaced or modified.

    Finally, if there are interesting alternative translations that also follow the Germanic rule, list up to three of them.

    Format your response as JSON with this structure:
    {
      "translation": "the Panglish translation",
      "explanation": "brief explanation of key word choices and their Germanic roots",
      "alternatives": ["alternative translation 1", "alternative translation 2", "alternate translation 3"] 
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
