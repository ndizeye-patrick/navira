// // hooks/useSearch.ts
// import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
// import { useDebounce } from 'use-debounce'
//
// interface SearchParams {
//     query: string
//     type: 'web' | 'images'
//     page: number
// }
//
// export function useSearch({ query, type, page }: SearchParams) {
//     return useInfiniteQuery({
//         queryKey: ['search', type, query],
//         queryFn: async ({ pageParam = 1 }) => {
//             const response = await fetch(
//                 `/api/search?q=${query}&type=${type}&page=${pageParam}`
//             )
//             return response.json()
//         },
//         getNextPageParam: (lastPage) => lastPage.nextCursor,
//         enabled: !!query,
//         staleTime: 1000 * 60 * 5, // Cache for 5 minutes
//         cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
//     })
// }
//
// export function useSuggestions(query: string) {
//     const [debouncedQuery] = useDebounce(query, 300)
//
//     return useQuery({
//         queryKey: ['suggestions', debouncedQuery],
//         queryFn: async () => {
//             const response = await fetch(
//                 `/api/suggestions?q=${encodeURIComponent(debouncedQuery)}`
//             )
//             return response.json()
//         },
//         enabled: debouncedQuery.length > 2,
//         staleTime: 1000 * 60 * 5,
//         cacheTime: 1000 * 60 * 30,
//     })
// }