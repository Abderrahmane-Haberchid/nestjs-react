import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import type { PaginatedProducts, ProductFilters } from '../types/product';

const filters: ProductFilters = {
  category: '',
  stockStatus: '',
};

const pageResult: PaginatedProducts = {
  data: [],
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
};

describe('useProducts', () => {
  it('requests the configured page and filters and exposes the result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ...pageResult, page: 2 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useProducts(2, {
        category: 'Electronics',
        stockStatus: 'low_stock',
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3000/api/v1/products?page=2&limit=12&category=Electronics&stock_status=low_stock',
    );
    expect(result.current.result?.page).toBe(2);
    expect(result.current.error).toBeNull();
  });

  it('reports HTTP errors and does not swallow them as successful results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Service unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const { result } = renderHook(() => useProducts(1, filters));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('Service unavailable');
  });

  it('uses the HTTP status when an error response is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('upstream failure', { status: 502 }),
      ),
    );

    const { result } = renderHook(() => useProducts(1, filters));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Le serveur a répondu avec le statut 502.');
  });

  it('reports rejected network requests', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('network failure'));

    const { result } = renderHook(() => useProducts(1, filters));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('Une erreur inattendue est survenue.');
  });

  it('aborts a stale request when query parameters change', async () => {
    const signals: AbortSignal[] = [];
    const fetchMock = vi.fn((_url: string, options: RequestInit) => {
      signals.push(options.signal as AbortSignal);
      return new Promise<Response>(() => {});
    });
    vi.stubGlobal('fetch', fetchMock);

    const { rerender } = renderHook(
      ({ page }) => useProducts(page, filters),
      { initialProps: { page: 1 } },
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    rerender({ page: 2 });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    expect(signals[0].aborted).toBe(true);
  });
});
