import { fireEvent, render, screen } from '@testing-library/react';
import { CatalogFilters } from './CatalogFilters';
import type { ProductFilters } from '../types/product';

describe('CatalogFilters', () => {
  it('reports category changes while preserving the selected stock filter', () => {
    const onChange = vi.fn();
    const filters: ProductFilters = {
      category: '',
      stockStatus: 'in_stock',
    };
    render(<CatalogFilters filters={filters} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Catégorie'), {
      target: { value: 'Electronics' },
    });

    expect(onChange).toHaveBeenCalledWith({
      category: 'Electronics',
      stockStatus: 'in_stock',
    });
  });

  it('reports stock changes while preserving the selected category', () => {
    const onChange = vi.fn();
    const filters: ProductFilters = {
      category: 'Clothing',
      stockStatus: '',
    };
    render(<CatalogFilters filters={filters} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Disponibilité'), {
      target: { value: 'out_of_stock' },
    });

    expect(onChange).toHaveBeenCalledWith({
      category: 'Clothing',
      stockStatus: 'out_of_stock',
    });
  });
});
