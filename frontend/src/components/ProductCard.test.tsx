import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types/product';

const product: Product = {
  id: 42,
  name: 'Wireless Headphones',
  category: 'Electronics',
  price: 99.99,
  stock_status: 'low_stock',
};

describe('ProductCard', () => {
  it('renders product data, formatted price, and stock status', () => {
    render(<ProductCard product={product} index={0} />);

    expect(
      screen.getByRole('heading', { name: 'Wireless Headphones' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Electronics/, { selector: '.product-art__category' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Stock faible')).toBeInTheDocument();
    expect(screen.getByText(/99,99\s*€/)).toBeInTheDocument();
    expect(screen.getByText('ARTICLE N°0042')).toBeInTheDocument();
  });

  it.each([
    ['in_stock', 'En stock'],
    ['low_stock', 'Stock faible'],
    ['out_of_stock', 'Épuisé'],
  ] as const)('maps %s to the visible status %s', (stockStatus, label) => {
    render(
      <ProductCard
        product={{ ...product, stock_status: stockStatus }}
        index={0}
      />,
    );

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders a fallback symbol for an unrecognized category', () => {
    render(
      <ProductCard
        product={{ ...product, category: 'Accessories' }}
        index={0}
      />,
    );

    expect(screen.getByText(/Accessories/)).toBeInTheDocument();
    expect(screen.getByText('◇')).toBeInTheDocument();
  });
});
