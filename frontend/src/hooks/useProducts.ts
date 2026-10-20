import { useEffect, useState } from 'react';
import type {
  PaginatedProducts,
  ProductFilters,
} from '../types/product';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD
    ? '/api/v1'
    : 'http://localhost:3000/api/v1');
const PAGE_SIZE = 12;

interface ProductsState {
  result: PaginatedProducts | null;
  loading: boolean;
  error: string | null;
}

export function useProducts(page: number, filters: ProductFilters) {

  const [state, setState] = useState<ProductsState>({
    result: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    
    const query = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    if (filters.category) query.set('category', filters.category);
    if (filters.stockStatus) query.set('stock_status', filters.stockStatus);

    async function loadProducts() {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const response = await fetch(
          `${API_BASE_URL}/products?${query.toString()}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          const body: unknown = await response.json().catch(() => null);
          const message =
            body &&
            typeof body === 'object' &&
            'message' in body &&
            typeof body.message === 'string'
              ? body.message
              : `Le serveur a répondu avec le statut ${response.status}.`;
          throw new Error(message);
        }

        const result = (await response.json()) as PaginatedProducts;
        setState({ result, loading: false, error: null });
      } catch (error) {
        if (abortController.signal.aborted) return;

        setState({
          result: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Une erreur inattendue est survenue.',
        });
      }
    }

    void loadProducts();
    return () => abortController.abort();
  }, [page, filters.category, filters.stockStatus]);

  return { ...state, pageSize: PAGE_SIZE };
}
