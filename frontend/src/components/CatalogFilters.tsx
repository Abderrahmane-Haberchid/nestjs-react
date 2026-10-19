import {
  STOCK_STATUSES,
  type ProductFilters as ProductFiltersType,
} from '../types/product';

const STATUS_LABELS: Record<(typeof STOCK_STATUSES)[number], string> = {
  in_stock: 'En stock',
  low_stock: 'Stock faible',
  out_of_stock: 'Épuisé',
};

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Home',
  'Books',
  'Sports',
  'Beauty',
];

interface CatalogFiltersProps {
  filters: ProductFiltersType;
  onChange: (filters: ProductFiltersType) => void;
}

export function CatalogFilters({ filters, onChange }: CatalogFiltersProps) {
  return (
    <div className="filters" aria-label="Filtres produits">
      <label className="filter-control">
        <span className="filter-control__label">Catégorie</span>
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({ ...filters, category: event.target.value })
          }
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-control">
        <span className="filter-control__label">Disponibilité</span>
        <select
          value={filters.stockStatus}
          onChange={(event) =>
            onChange({
              ...filters,
              stockStatus: event.target.value as ProductFiltersType['stockStatus'],
            })
          }
        >
          <option value="">Tous les statuts</option>
          {STOCK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
