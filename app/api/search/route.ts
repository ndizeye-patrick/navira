// app/api/search/route.ts
import { NextResponse } from 'next/server'

interface BraveSearchResponse {
    web?: {
        results: Array<{
            title: string
            url: string
            description: string
        }>
    }
    images?: {
        results: Array<{
            title: string
            url: string
            thumbnail: string
        }>
    }
}

export async function GET(request: Request) {
    try {
        // 1. Extract and validate query parameters
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        const type = searchParams.get('type')

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            )
        }

        if (!['web', 'images'].includes(type || '')) {
            return NextResponse.json(
                { error: 'Invalid search type. Must be "web" or "images"' },
                { status: 400 }
            )
        }

        // 2. Validate API key
        const API_KEY = process.env.BRAVE_SEARCH_API_KEY
        if (!API_KEY) {
            console.error('BRAVE_SEARCH_API_KEY is not configured')
            return NextResponse.json(
                { error: 'Search service configuration error' },
                { status: 500 }
            )
        }

        // 3. Construct API endpoint - Using the correct Brave Search API domain
        const endpoint = 'https://api.search.brave.com/res/v1/' + (type === 'images' ? 'images/search' : 'web/search')

        // 4. Make API request with proper error handling
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
            headers: {
                'Accept': 'application/json',
                'X-Subscription-Token': API_KEY
            }
        })

        if (!response.ok) {
            const errorMessage = await response.text().catch(() => 'Unknown error')
            console.error('Brave Search API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
                endpoint: endpoint // Log endpoint for debugging
            })

            return NextResponse.json(
                { error: `Search API error: ${response.statusText || 'Unknown error'}` },
                { status: response.status }
            )
        }

        // 5. Parse and validate response
        const data: BraveSearchResponse = await response.json()

        // 6. Transform response based on search type
        if (type === 'images') {
            return NextResponse.json({
                images: {
                    results: data.images?.results || []
                }
            })
        } else {
            return NextResponse.json({
                web: {
                    results: data.web?.results || []
                }
            })
        }

    } catch (error) {
        // 7. Log error for debugging
        console.error('Search API error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            cause: error instanceof Error ? error.cause : undefined,
            stack: error instanceof Error ? error.stack : undefined
        })

        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred while processing your search'
            },
            { status: 500 }
        )
    }
}