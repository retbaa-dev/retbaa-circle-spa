// lib/queryClient.js — configuration centrale TanStack Query
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache 5 minutes par défaut — données Supabase ne changent pas à chaque seconde
      staleTime: 5 * 60 * 1000,
      // Pas de refetch au focus fenêtre — UX plus stable pour un portail investisseur
      refetchOnWindowFocus: false,
      // 1 retry en cas d'erreur réseau
      retry: 1,
    },
  },
})
