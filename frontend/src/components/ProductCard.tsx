import type { Product, StockStatus } from '../types/product';

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '◉',
  Clothing: '◌',
  Food: '✳',
  Home: '⌂',
  Books: '▤',
  Sports: '↗',
  Beauty: '✧',
};

const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'En stock',
  low_stock: 'Stock faible',
  out_of_stock: 'Épuisé',
};

const STOCK_CLASSES: Record<StockStatus, string> = {
  in_stock: 'stock-badge--available',
  low_stock: 'stock-badge--low',
  out_of_stock: 'stock-badge--empty',
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article
      className="product-card"
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
    >
      <div className={`product-art product-art--${index % 6}`}>
        <span className="product-art__category">
          {CATEGORY_ICONS[product.category] ?? '◇'} {product.category}
        </span>
        <span className="product-art__symbol" aria-hidden="true">
          {CATEGORY_ICONS[product.category] ?? '◇'}
        </span>
        <span className="product-art__id">
          ARTICLE N°{String(product.id).padStart(4, '0')}
        </span>
      </div>
      <div className="product-card__content">
        <div className="product-card__heading">
          <h2>{product.name}</h2>
          <span className={`stock-badge ${STOCK_CLASSES[product.stock_status]}`}>
            <span className="stock-badge__dot" />
            {STOCK_LABELS[product.stock_status]}
          </span>
        </div>
        <div className="product-card__footer">
          <span className="product-card__caption">Prix de vente</span>
          <span className="product-card__price">
            {priceFormatter.format(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
