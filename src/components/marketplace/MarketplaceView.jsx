import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { PostListingModal } from './PostListingModal';
import { RequestListingModal } from './RequestListingModal';
import {
  Store,
  Plus,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const MarketplaceView = () => {
  const { marketplace, searchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedProductForRequest, setSelectedProductForRequest] = useState(null);

  const categories = ['All', 'Tiles', 'Steel', 'Carpentry', 'Wood & Formwork', 'Electrical', 'Plumbing'];
  const cities = ['All', 'Nashik', 'Pune', 'Mumbai', 'Bangalore'];

  // Filter listings
  const filteredProducts = marketplace.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || (p.city && p.city.toLowerCase() === selectedCity.toLowerCase()) || p.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Leftover Resale Marketplace</h1>
          <p>
            The construction-first circular economy. Buy verified surplus materials at 30–50% discount or sell your leftovers.
          </p>
        </div>

        <div className="page-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsPostModalOpen(true)}
          >
            Post Surplus Material
          </Button>
        </div>
      </div>

      {/* Hero Marketplace Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          color: 'var(--white)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245,158,11,0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 700 }}>
            <Sparkles size={12} />
            Circular Construction Economy
          </div>
          <h3 style={{ color: 'var(--white)', fontSize: '1.25rem', marginTop: '0.35rem', fontWeight: 800 }}>
            Direct Builder-to-Builder Surplus Trading
          </h3>
          <p style={{ color: 'var(--gray-300)', fontSize: '0.85rem', maxWidth: '600px' }}>
            Avoid dumping unused tiles, rebar offcuts, and extra fixtures. Connect directly with nearby sites for instant pickup.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Active Listings</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber-400)' }}>{marketplace.length}</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Avg. Discount</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>38% Off</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'var(--white)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-dark' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* City Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map(c => <option key={c} value={c}>{c === 'All' ? 'All Cities' : `📍 ${c}`}</option>)}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No surplus materials found"
          description="No materials match your selected filters. Try broadening your criteria or be the first to list surplus!"
          actionLabel="+ Post Surplus Material"
          onAction={() => setIsPostModalOpen(true)}
        />
      ) : (
        <div className="marketplace-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrap">
                <img src={product.image} alt={product.title} />
                <span className="product-condition-tag">
                  ✓ {product.condition}
                </span>
                {product.verifiedSeller && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(16, 185, 129, 0.9)', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <ShieldCheck size={12} /> Verified
                  </div>
                )}
              </div>

              <div className="product-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{product.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{product.postedTime}</span>
                </div>

                <h4 className="product-title">{product.title}</h4>

                <div className="product-meta">
                  <span>📦 {product.quantity}</span>
                  <span>•</span>
                  <span><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {product.location}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <span>Seller: <strong>{product.seller}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--amber-600)', fontWeight: 700 }}>
                    <Star size={11} fill="currentColor" /> {product.sellerRating}
                  </span>
                </div>

                <div className="product-price-row">
                  <div>
                    <div className="product-price">
                      ₹{product.price.toLocaleString()} <small>/{product.unit}</small>
                    </div>
                    {product.totalPrice && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Lot Total: ₹{product.totalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedProductForRequest(product)}
                  >
                    Request Material
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PostListingModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      <RequestListingModal
        isOpen={Boolean(selectedProductForRequest)}
        onClose={() => setSelectedProductForRequest(null)}
        product={selectedProductForRequest}
      />
    </div>
  );
};
