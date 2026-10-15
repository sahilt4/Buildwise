import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { PostListingModal } from './PostListingModal';
import { InquiryModal } from './InquiryModal';
import { InquiryDetailModal } from './InquiryDetailModal';
import { OrderDetailModal } from './OrderDetailModal';
import { MarketplaceDashboardSection } from './MarketplaceDashboardSection';
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
  ShieldCheck,
  Package,
  MessageSquare,
  FileText,
  Truck,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building,
  User
} from 'lucide-react';

export const MarketplaceView = () => {
  const {
    marketplace,
    marketplaceInquiries,
    marketplaceOrders,
    searchQuery,
    userRole,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-listings' | 'inquiries' | 'orders' | 'messages'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');

  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedListingForInquiry, setSelectedListingForInquiry] = useState(null);
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const categories = ['All', 'Tiles', 'Steel', 'Carpentry', 'Wood & Formwork', 'Electrical', 'Plumbing', 'Cement', 'Aggregates', 'Bricks & Blocks', 'Paint & Finishes', 'Hardware'];
  const cities = ['All', 'Nashik', 'Pune', 'Mumbai', 'Bangalore'];
  const conditions = ['All', 'Brand New', 'Brand New In Box', 'Clean Surplus', 'Unused / Mint', '1-time Used (Good)', 'Surplus'];
  const statuses = ['All', 'Available', 'Reserved', 'Sold'];

  const isWorker = userRole === 'worker';
  const isBuilder = userRole === 'builder';

  // Filter listings for Browse tab
  const filteredProducts = marketplace.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || (p.city && p.city.toLowerCase() === selectedCity.toLowerCase()) || p.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesCondition = selectedCondition === 'All' || p.condition === selectedCondition;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.seller && p.seller.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesCity && matchesStatus && matchesCondition && matchesSearch;
  });

  // Filter for My Listings tab (Seller)
  const myListings = marketplace.filter(m =>
    m.seller?.toLowerCase().includes('rajesh') ||
    m.seller?.toLowerCase().includes('buildwise') ||
    m.seller === currentUser?.name
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Leftover Resale & Materials Marketplace</h1>
          <p>
            Construction-first circular economy: verified buyer & seller transaction workflows, real-time stock reservation, and pickup tracking.
          </p>
        </div>

        <div className="page-actions">
          {!isWorker && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsPostModalOpen(true)}
            >
              Post Surplus Material
            </Button>
          )}
        </div>
      </div>

      {/* Role-Aware Marketplace Dashboard Summary */}
      <MarketplaceDashboardSection onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Navigation Tab Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        <button
          onClick={() => setActiveTab('browse')}
          className={`btn ${activeTab === 'browse' ? 'btn-dark' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Store size={14} />
          Browse Listings ({marketplace.length})
        </button>

        {!isWorker && (
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`btn ${activeTab === 'my-listings' ? 'btn-dark' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Package size={14} />
            My Listings ({myListings.length})
          </button>
        )}

        {!isWorker && (
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`btn ${activeTab === 'inquiries' ? 'btn-dark' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <MessageSquare size={14} />
            Inquiries & Offers ({marketplaceInquiries.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-dark' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Truck size={14} />
          Orders & Pickup Tracking ({marketplaceOrders.length})
        </button>
      </div>

      {/* TAB 1: BROWSE LISTINGS */}
      {activeTab === 'browse' && (
        <>
          {/* Filter Bar */}
          <div style={{
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
          }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-dark' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', fontSize: '0.78rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* City & Status Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(c => <option key={c} value={c}>{c === 'All' ? '📍 All Cities' : `📍 ${c}`}</option>)}
              </select>

              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : `Status: ${s}`}</option>)}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No surplus materials match criteria"
              description="Try adjusting your filters or be the first to post extra materials from your jobsite!"
              actionLabel={!isWorker ? "+ Post Surplus Material" : null}
              onAction={() => setIsPostModalOpen(true)}
            />
          ) : (
            <div className="marketplace-grid">
              {filteredProducts.map((product) => {
                const isReserved = product.status === 'Reserved' || (product.availableQuantity === 0 && (product.reservedQuantity || 0) > 0);
                const isSold = product.status === 'Sold';
                const hasPartialReserve = (product.reservedQuantity || 0) > 0 && (product.availableQuantity || 0) > 0;

                return (
                  <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="product-img-wrap" style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.title} style={{ height: '180px', width: '100%', objectFit: 'cover' }} />
                      <span className="product-condition-tag">
                        ✓ {product.condition}
                      </span>

                      {/* Status Overlay Tag */}
                      {isReserved && (
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: 'rgba(245, 158, 11, 0.95)',
                          color: '#ffffff',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          🔒 Reserved
                        </div>
                      )}

                      {isSold && (
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: 'rgba(239, 68, 68, 0.95)',
                          color: '#ffffff',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          ✕ Sold Out
                        </div>
                      )}

                      {product.verifiedSeller && (
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: 'rgba(16, 185, 129, 0.95)',
                          color: '#ffffff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          <ShieldCheck size={12} /> Verified
                        </div>
                      )}
                    </div>

                    <div className="product-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{product.category}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{product.postedTime || 'Recently'}</span>
                      </div>

                      <h4 className="product-title" style={{ fontSize: '0.92rem', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                        {product.title}
                      </h4>

                      <div className="product-meta" style={{ marginBottom: '0.4rem' }}>
                        <span>
                          📦 Available: <strong>{product.availableQuantity !== undefined ? product.availableQuantity : product.totalQuantity} {product.unit}</strong>
                        </span>
                        {hasPartialReserve && (
                          <span style={{ color: 'var(--amber-700)', fontWeight: 600, fontSize: '0.7rem' }}>
                            ({product.reservedQuantity} reserved)
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                        <MapPin size={12} /> {product.location}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                        <span>Seller: <strong>{product.seller}</strong></span>
                        <span style={{ display: 'flex', alignItems: 'center', color: 'var(--amber-600)', fontWeight: 700 }}>
                          <Star size={11} fill="currentColor" /> {product.sellerRating || 5.0}
                        </span>
                      </div>

                      <div className="product-price-row" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <div>
                          <div className="product-price" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                            ₹{product.price?.toLocaleString()} <small style={{ fontSize: '0.75rem', fontWeight: 500 }}>/{product.unit}</small>
                          </div>
                          {product.totalPrice && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Lot: ₹{product.totalPrice?.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {!isWorker && !isSold ? (
                          <Button
                            variant={isReserved ? 'secondary' : 'primary'}
                            size="sm"
                            disabled={isReserved}
                            onClick={() => setSelectedListingForInquiry(product)}
                          >
                            {isReserved ? 'Fully Reserved' : 'Make Offer / Buy'}
                          </Button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {isSold ? 'Sold' : 'View Only'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: MY LISTINGS (SELLER) */}
      {activeTab === 'my-listings' && (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                Your Surplus Inventory ({myListings.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Track available quantities, reservation allocations, and buyer demand for materials posted by your company.
              </p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsPostModalOpen(true)}>
              List New Material
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Material Listing</th>
                  <th>Category</th>
                  <th>Total Stock</th>
                  <th>Reserved Stock</th>
                  <th>Available Stock</th>
                  <th>Price / Unit</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={item.image} alt={item.title} style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-900)' }}>{item.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.location}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{item.category}</span></td>
                    <td style={{ fontWeight: 700 }}>{item.totalQuantity} {item.unit}</td>
                    <td style={{ color: (item.reservedQuantity || 0) > 0 ? 'var(--amber-700)' : 'var(--text-muted)', fontWeight: 700 }}>
                      {item.reservedQuantity || 0} {item.unit}
                    </td>
                    <td style={{ color: 'var(--success-dark)', fontWeight: 700 }}>
                      {item.availableQuantity} {item.unit}
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{item.price}/{item.unit}</td>
                    <td>
                      <Badge variant={item.status === 'Available' ? 'success' : (item.status === 'Reserved' ? 'warning' : 'danger')}>
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedListingForInquiry(item)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES & NEGOTIATIONS */}
      {activeTab === 'inquiries' && (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                Buyer Inquiries & Price Negotiations ({marketplaceInquiries.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Review requested quantities, respond with counter-offers, and accept proposals to automatically reserve stock.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {marketplaceInquiries.map(inq => (
              <div
                key={inq.id}
                style={{
                  background: 'var(--gray-50)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.2 }}>
                      {inq.listingTitle}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Inquiry #{inq.id} • {inq.buyerProfile?.name} ({inq.buyerProfile?.companyName})
                    </div>
                  </div>
                  <Badge variant={inq.status === 'Accepted' ? 'success' : (inq.status === 'Countered' ? 'warning' : (inq.status === 'Rejected' ? 'danger' : 'info'))}>
                    {inq.status}
                  </Badge>
                </div>

                <div style={{
                  background: 'var(--white)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Proposed Offer</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--amber-600)' }}>
                      {inq.requestedQuantity} {inq.unit} @ ₹{inq.proposedPrice}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valuation</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                      ₹{inq.totalProposedAmount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {inq.counterOffer && (
                  <div style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.1)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--amber-800)', fontWeight: 600 }}>
                    ⚡ Countered: {inq.counterOffer.quantity} {inq.unit} @ ₹{inq.counterOffer.price}/{inq.unit}
                  </div>
                )}

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{inq.message || 'No additional note'}"
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Slot: {inq.preferredPickupDate}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={MessageSquare}
                    onClick={() => setSelectedInquiryDetail(inq)}
                  >
                    Open Thread
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                Marketplace Orders & Pickup Fulfillment ({marketplaceOrders.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Track the complete transaction lifecycle: quantity reservation, loading staging, and driver pickup confirmation.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Material & Quantity</th>
                  <th>Amount</th>
                  <th>Seller</th>
                  <th>Buyer</th>
                  <th>Pickup Slot</th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketplaceOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 800, color: 'var(--navy-900)' }}>{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{order.materialName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.quantity} {order.unit} @ ₹{order.unitPrice}/{order.unit}</div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--amber-600)' }}>
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{order.sellerProfile?.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.sellerProfile?.companyName}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{order.buyerProfile?.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.buyerProfile?.companyName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{order.scheduledPickupDate}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.city}</div>
                    </td>
                    <td>
                      <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={order.orderStatus === 'Completed' ? 'success' : (order.orderStatus === 'Ready for Pickup' ? 'warning' : 'info')}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedOrderDetail(order)}
                      >
                        Track Stepper
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <PostListingModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      <InquiryModal
        isOpen={Boolean(selectedListingForInquiry)}
        onClose={() => setSelectedListingForInquiry(null)}
        listing={selectedListingForInquiry}
      />

      <InquiryDetailModal
        isOpen={Boolean(selectedInquiryDetail)}
        onClose={() => setSelectedInquiryDetail(null)}
        inquiry={selectedInquiryDetail}
        onOrderCreated={() => setActiveTab('orders')}
      />

      <OrderDetailModal
        isOpen={Boolean(selectedOrderDetail)}
        onClose={() => setSelectedOrderDetail(null)}
        order={selectedOrderDetail}
      />
    </div>
  );
};
