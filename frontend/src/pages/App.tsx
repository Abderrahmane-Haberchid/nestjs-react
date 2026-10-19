import { useState } from 'react';
import { CatalogFilters } from '../components/CatalogFilters';
import { Pagination } from '../components/Pagination';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import type { ProductFilters } from '../types/product';

const INITIAL_FILTERS: ProductFilters = {
  category: '',
  stockStatus: '',
};

export default function App() {
  
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const { result, loading, error } = useProducts(page, filters);

  function updateFilters(nextFilters: ProductFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Atelier, accueil">
          <span className="brand__mark" aria-hidden="true">
            a.
          </span>
          <span className="brand__name">atelier</span>
        </a>
        <div className="topbar__note">
          <span className="topbar__live-dot" />
          <span>Catalogue en direct</span>
        </div>
      </header>

      <main>
        <section className="intro">
          <div className="intro__eyebrow">
            <span className="eyebrow-line" />
            <span>La sélection du moment</span>
          </div>
          <div className="intro__main">
            <div>
              <h1>
                Des essentiels,
                <br />
                <em>choisis avec soin.</em>
              </h1>
              <p className="intro__description">
                Découvrez des objets pensés pour durer, vivre et vous
                accompagner au quotidien.
              </p>
            </div>
            <div className="intro__stamp" aria-label="Sélection indépendante">
              <span>DEPUIS</span>
              <strong>20</strong>
              <span>24</span>
            </div>
          </div>
        </section>

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog__topline">
            <div>
              <span className="section-kicker">Notre sélection</span>
              <h2 id="catalog-title">Le catalogue</h2>
            </div>
            <CatalogFilters filters={filters} onChange={updateFilters} />
          </div>

          <div className="catalog__meta" aria-live="polite">
            <span>
              {loading
                ? 'Mise à jour du catalogue…'
                : `${result?.total ?? 0} article${result?.total === 1 ? '' : 's'}`}
            </span>
            <span className="catalog__meta-divider" />
            <span>Objets du quotidien, sélectionnés avec intention</span>
          </div>

          {error && (
            <div className="message-panel message-panel--error" role="alert">
              <span className="message-panel__icon" aria-hidden="true">
                !
              </span>
              <div>
                <strong>Le catalogue est momentanément indisponible.</strong>
                <p>{error}</p>
                <p className="message-panel__hint">
                  Vérifiez que le serveur API est démarré et que
                  VITE_API_BASE_URL pointe vers la bonne adresse.
                </p>
              </div>
            </div>
          )}

          {!error && loading && (
            <div className="product-grid" aria-label="Chargement des produits">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="skeleton-card" key={index}>
                  <div className="skeleton-card__art" />
                  <div className="skeleton-card__line" />
                  <div className="skeleton-card__line skeleton-card__line--short" />
                </div>
              ))}
            </div>
          )}

          {!error && !loading && result?.data.length === 0 && (
            <div className="message-panel message-panel--empty">
              <span className="message-panel__icon" aria-hidden="true">
                ◇
              </span>
              <div>
                <strong>Aucun article ne correspond à votre sélection.</strong>
                <p>Essayez une autre catégorie ou un autre statut.</p>
              </div>
            </div>
          )}

          {!error && !loading && result && result.data.length > 0 && (
            <div className="product-grid">
              {result.data.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}

          {result && !error && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onPageChange={setPage}
            />
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="footer__brand" href="/" aria-label="Atelier, accueil">
          a.
        </a>
        <span>De beaux objets, pour la vraie vie.</span>
        <span className="footer__year">© ATELIER 2026</span>
      </footer>
    </div>
  );
}
