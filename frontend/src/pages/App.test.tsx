import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import type { PaginatedProducts, Product } from '../types/product';

const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock_status: 'in_stock',
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 24.5,
    stock_status: 'low_stock',
  },
];

function responseFor(url: string): Response {
  const requestUrl = new URL(url, window.location.origin);
  const page = Number(requestUrl.searchParams.get('page') ?? 1);
  const filtered = products.filter(
    (product) =>
      (!requestUrl.searchParams.has('category') ||
        product.category === requestUrl.searchParams.get('category')) &&
      (!requestUrl.searchParams.has('stock_status') ||
        product.stock_status === requestUrl.searchParams.get('stock_status')),
  );
  const body: PaginatedProducts = {
    data: filtered,
    total: filtered.length,
    page,
    limit: 12,
    totalPages: filtered.length > 0 ? 2 : 0,
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('App catalog integration', () => {
  it('loads products, filters them, and returns to page one after changing filters', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) =>
      Promise.resolve(responseFor(String(input))),
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: 'Wireless Headphones' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 articles')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Suivant/ }));
    await waitFor(() =>
      expect(screen.getByText('02', { selector: 'strong' })).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/v1/products?page=2&limit=12',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ),
    );

    fireEvent.change(screen.getByLabelText('Catégorie'), {
      target: { value: 'Electronics' },
    });
    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/v1/products?page=1&limit=12&category=Electronics',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ),
    );
  });

  it('filters by stock status using the API query contract', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) =>
      Promise.resolve(responseFor(String(input))),
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);

    await screen.findByRole('heading', { name: 'Wireless Headphones' });
    fireEvent.change(screen.getByLabelText('Disponibilité'), {
      target: { value: 'low_stock' },
    });

    expect(
      await screen.findByRole('heading', { name: 'Cotton T-Shirt' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        'http://localhost:3000/api/v1/products?page=1&limit=12&stock_status=low_stock',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ),
    );
  });

  it('shows an explicit error when the API rejects a request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'API unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'API unavailable',
    );
    expect(screen.queryByRole('heading', { name: 'Wireless Headphones' }))
      .not.toBeInTheDocument();
  });

  it('shows a useful empty state when filters match no products', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((input: RequestInfo | URL) =>
        Promise.resolve(responseFor(String(input))),
      ),
    );
    render(<App />);
    await screen.findByRole('heading', { name: 'Wireless Headphones' });

    fireEvent.change(screen.getByLabelText('Catégorie'), {
      target: { value: 'Books' },
    });

    expect(
      await screen.findByText(
        'Aucun article ne correspond à votre sélection.',
      ),
    ).toBeInTheDocument();
  });
});
