'use client'

import { useState } from 'react'
import { Search, Image, File, Loader } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  description?: string
  url?: string
  thumbnail?: string
}

interface SearchResults {
  web: SearchResult[]
  images: SearchResult[]
}

export default function SearchComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResults>({ web: [], images: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('web')

  const fetchSearchResults = async (searchQuery: string) => {
    try {
      setIsLoading(true)

      // Update URL with search query
      router.push(`?q=${encodeURIComponent(searchQuery)}`)

      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`)
      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()

      // Transform API response to match our interface
      const transformedResults: SearchResults = {
        web: data.web?.results?.map((result: any) => ({
          id: result.id || Math.random().toString(),
          title: result.title,
          description: result.description,
          url: result.url
        })) || [],
        images: data.images?.results?.map((image: any) => ({
          id: image.id || Math.random().toString(),
          title: image.title,
          thumbnail: image.thumbnail,
          url: image.url
        })) || []
      }

      setResults(transformedResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      fetchSearchResults(query)
    }
  }

  return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Universal Search</h1>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search across the web..."
                  className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
            >
              {isLoading ? <Loader className="animate-spin" /> : <Search size={20} />}
              Search
            </button>
          </form>
        </div>

        {/* Search Tabs */}
        <div className="flex gap-4 mb-6">
          <button
              onClick={() => setActiveTab('web')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'web' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
              }`}
          >
            <File size={20} />
            Web Results
          </button>
          <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'images' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
              }`}
          >
            <Image size={20} />
            Images
          </button>
        </div>

        {/* Search Results */}
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-500" size={40} />
            </div>
        ) : (
            <div className="space-y-6">
              {activeTab === 'web' && (
                  <div className="space-y-4">
                    {results.web.map((result) => (
                        <div key={result.id} className="bg-white p-4 rounded-lg shadow">
                          <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              {result.title}
                            </a>
                          </h2>
                          <p className="text-gray-600 text-sm">{result.url}</p>
                          <p className="mt-2 text-gray-700">{result.description}</p>
                        </div>
                    ))}
                  </div>
              )}

              {activeTab === 'images' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.images.map((image) => (
                        <div key={image.id} className="bg-white p-2 rounded-lg shadow">
                          <img
                              src={image.thumbnail}
                              alt={image.title}
                              className="w-full h-40 object-cover rounded"
                          />
                          <p className="mt-2 text-sm text-gray-600 truncate">{image.title}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}
      </div>
  )
}
