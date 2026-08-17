import React, { useState } from "react";
import { ResaleListing, MaterialCategory, Site, User } from "../types";
import { formatINR, formatNumber, triggerConfetti } from "../utils";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  MapPin,
  Tag,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Building,
  UserCheck,
  AlertCircle,
  Truck,
} from "lucide-react";

interface MarketplaceViewProps {
  listings: ResaleListing[];
  currentUser: User;
  sites: Site[];
  onCreateListing: (listingData: any) => Promise<void>;
  onSubmitInquiry: (listingId: string, inquiryData: any) => Promise<void>;
  onUpdateListingStatus: (listingId: string, status: "available" | "reserved" | "sold") => Promise<void>;
  onAcceptInquiry: (listingId: string, inquiryId: string) => Promise<void>;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  currentUser,
  sites,
  onCreateListing,
  onSubmitInquiry,
  onUpdateListingStatus,
  onAcceptInquiry,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeSubTab, setActiveSubTab] = useState<"browse" | "my_listings">("browse");

  // Inquire Modal
  const [selectedItemForInquiry, setSelectedItemForInquiry] = useState<ResaleListing | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    buyerName: currentUser.name,
    buyerPhone: currentUser.phone || "+91 93701 55667",
    buyerEmail: currentUser.email,
    offeredPrice: 0,
    quantityRequested: 1,
    message: "Interested in purchasing this surplus material lot. Can arrange immediate site transport pickup.",
  });

  // Post Listing Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newListingForm, setNewListingForm] = useState({
    title: "",
    category: "cement" as MaterialCategory,
    quantity: 50,
    unit: "Bags (50kg)",
    pricePerUnit: 330,
    originalCostPerUnit: 385,
    condition: "Unopened / Factory Pack" as const,
    description: "",
    location: "Panchavati Construction Yard",
    city: "Nashik",
    sellerPhone: currentUser.phone || "+91 94222 67890",
    sellerName: `${currentUser.name} (${sites[0]?.name || "Nashik Project"})`,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    sellerSiteId: sites[0]?.id || "site-1",
  });

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedCondition !== "all" && item.condition !== selectedCondition) return false;
    if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenInquiry = (item: ResaleListing) => {
    setSelectedItemForInquiry(item);
    setInquiryForm({
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone || "+91 93701 55667",
      buyerEmail: currentUser.email,
      offeredPrice: item.pricePerUnit,
      quantityRequested: item.quantity,
      message: `Hello! I would like to reserve ${item.quantity} ${item.unit} of ${item.title}. Ready for site inspection.`,
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForInquiry) return;
    await onSubmitInquiry(selectedItemForInquiry.id, inquiryForm);
    triggerConfetti();
    setSelectedItemForInquiry(null);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateListing(newListingForm);
    triggerConfetti();
    setIsPostModalOpen(false);
  };

  const totalMarketplaceSavings = listings.reduce((sum, item) => {
    const savingsPerUnit = Math.max(0, item.originalCostPerUnit - item.pricePerUnit);
    return sum + savingsPerUnit * item.quantity;
  }, 0);

  return (
    <div className="space-y-6 pb-12" id="marketplace-view">
      {/* Marketplace Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                <Tag className="w-3 h-3 mr-1" />
                Verified Surplus Exchange
              </span>
              <span className="text-xs text-amber-200">
                Direct B2B Contractor & Builder Marketplace
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Construction Leftover & Surplus Resale Marketplace
            </h1>
            <p className="text-sm text-amber-100/90 max-w-2xl mt-1">
              Prevent material wastage, monetize excess inventory, and purchase verified construction stock at 15–35% discounted builder rates across Nashik & Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="post-surplus-btn"
              onClick={() => setIsPostModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Surplus Stock</span>
            </button>
          </div>
        </div>

        {/* Savings Ribbon */}
        <div className="mt-4 pt-3 border-t border-amber-600/50 flex flex-wrap items-center justify-between text-xs text-amber-100 gap-2">
          <div className="flex items-center space-x-4">
            <span>
              Total Community Builder Savings: <strong>{formatINR(totalMarketplaceSavings)}</strong>
            </span>
            <span>•</span>
            <span>Active Listings: <strong>{listings.length} Lots</strong></span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-Inspected Site Leftovers</span>
          </div>
        </div>
      </div>

      {/* Sub tabs: Browse Marketplace vs. Manage Listings & Inquiries */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveSubTab("browse")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeSubTab === "browse"
                ? "border-amber-600 text-amber-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Browse Available Surplus ({filteredListings.length})
          </button>
          <button
            onClick={() => setActiveSubTab("my_listings")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeSubTab === "my_listings"
                ? "border-amber-600 text-amber-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>Seller Inquiries & Offers</span>
            {listings.some((l) => l.buyerInquiries.length > 0) && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {listings.reduce((sum, l) => sum + l.buyerInquiries.length, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === "browse" ? (
        <>
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search surplus cement, TMT rebars, vitrified tiles, emulsion paint, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by surplus material category"
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="all">All Material Categories</option>
              <option value="cement">Cement & Concrete</option>
              <option value="steel">Steel & Rebars</option>
              <option value="tiles">Tiles & Marbles</option>
              <option value="paint">Paints & Coatings</option>
              <option value="bricks">Bricks & Blocks</option>
              <option value="plumbing">Plumbing & Pipes</option>
            </select>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              aria-label="Filter by material condition"
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="all">All Conditions</option>
              <option value="Unopened / Factory Pack">Unopened / Factory Sealed</option>
              <option value="Surplus Leftover (Prime)">Surplus Leftover (Prime)</option>
              <option value="Good Usable Condition">Good Usable Condition</option>
            </select>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => {
              const discountPercent = Math.round(
                ((item.originalCostPerUnit - item.pricePerUnit) / item.originalCostPerUnit) * 100
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group"
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white">
                        {item.condition}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                          Save {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize shadow-xs ${
                          item.status === "available"
                            ? "bg-emerald-500 text-white"
                            : item.status === "reserved"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{item.location}, {item.city}</span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing & Stock Details */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                            {formatINR(item.pricePerUnit)}
                            <span className="text-xs font-normal text-slate-500"> / {item.unit.split(" ")[0]}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 line-through">
                            Original: {formatINR(item.originalCostPerUnit)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            {item.quantity} {item.unit} available
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Total Lot: {formatINR(item.quantity * item.pricePerUnit)}
                          </div>
                        </div>
                      </div>

                      {/* Seller Tag */}
                      <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="truncate font-medium text-slate-700">
                          Seller: {item.sellerName}
                        </span>
                        <span className="text-slate-400 shrink-0">
                          {new Date(item.postedDate).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3.5">
                        {item.status === "available" ? (
                          <button
                            onClick={() => handleOpenInquiry(item)}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                            <span>Inquire & Reserve Lot</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 bg-slate-100 text-slate-400 font-semibold text-xs rounded-xl cursor-not-allowed"
                          >
                            {item.status === "reserved" ? "Lot Under Reservation" : "Sold Out"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Seller Inquiries & Offers Tab */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Resale Listings & Incoming Buyer Inquiries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage offers from nearby contractors and accept bookings. Sold items automatically update project material records.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {listings.map((item) => (
              <div key={item.id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>Quantity: <strong>{item.quantity} {item.unit}</strong></span>
                        <span>•</span>
                        <span>Price: <strong>{formatINR(item.pricePerUnit)}</strong></span>
                        <span>•</span>
                        <span className="capitalize font-semibold text-amber-700">Status: {item.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle for Seller */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateListingStatus(item.id, "available")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        item.status === "available"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => onUpdateListingStatus(item.id, "reserved")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        item.status === "reserved"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Reserved
                    </button>
                    <button
                      onClick={() => {
                        onUpdateListingStatus(item.id, "sold");
                        triggerConfetti();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        item.status === "sold"
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Mark as Sold
                    </button>
                  </div>
                </div>

                {/* Inquiries Sub-list */}
                {item.buyerInquiries.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center">
                      <Mail className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                      Buyer Offers & Pickup Inquiries ({item.buyerInquiries.length})
                    </div>
                    {item.buyerInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">
                            {inq.buyerName} • Offered {formatINR(inq.offeredPrice)} / unit for {inq.quantityRequested} {item.unit}
                          </div>
                          <div className="text-slate-500 mt-0.5 flex items-center space-x-3">
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-slate-400" /> {inq.buyerPhone}
                            </span>
                            <span>•</span>
                            <span>{inq.buyerEmail}</span>
                          </div>
                          <p className="text-slate-600 italic mt-1">"{inq.message}"</p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {inq.status === "accepted" ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Offer Accepted
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onAcceptInquiry(item.id, inq.id);
                                triggerConfetti();
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                            >
                              Accept & Reserve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- MODAL: INQUIRE / RESERVE ----------------- */}
      {selectedItemForInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <ShoppingBag className="w-5 h-5 text-amber-600 mr-2" />
              Inquire & Reserve Surplus Stock
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Send your booking request directly to {selectedItemForInquiry.sellerName}.
            </p>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 mb-4">
              <div className="font-semibold text-xs text-slate-900">
                {selectedItemForInquiry.title}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 flex justify-between">
                <span>Available: {selectedItemForInquiry.quantity} {selectedItemForInquiry.unit}</span>
                <span className="font-bold text-amber-800">
                  {formatINR(selectedItemForInquiry.pricePerUnit)} / unit
                </span>
              </div>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name / Org
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.buyerName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, buyerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.buyerPhone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, buyerPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Desired
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItemForInquiry.quantity}
                    value={inquiryForm.quantityRequested}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, quantityRequested: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Offer Price (₹/unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inquiryForm.offeredPrice}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, offeredPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Pickup Timeline
                </label>
                <textarea
                  rows={2}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForInquiry(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Send Inquiry & Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: POST SURPLUS MATERIAL ----------------- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <Plus className="w-5 h-5 text-amber-600 mr-2" />
              List Surplus Construction Material for Resale
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Turn project leftover inventory into revenue and prevent construction waste.
            </p>

            <form onSubmit={handlePostSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Listing Title & Brand
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Bags UltraTech OPC 53 Cement (Factory Sealed)"
                  value={newListingForm.title}
                  onChange={(e) => setNewListingForm({ ...newListingForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newListingForm.category}
                    onChange={(e) =>
                      setNewListingForm({
                        ...newListingForm,
                        category: e.target.value as MaterialCategory,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="cement">Cement</option>
                    <option value="steel">Steel / TMT</option>
                    <option value="tiles">Tiles & Ceramics</option>
                    <option value="paint">Paint</option>
                    <option value="bricks">Bricks & Blocks</option>
                    <option value="plumbing">Plumbing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={newListingForm.condition}
                    onChange={(e) =>
                      setNewListingForm({
                        ...newListingForm,
                        condition: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="Unopened / Factory Pack">Unopened / Factory Sealed</option>
                    <option value="Surplus Leftover (Prime)">Surplus Leftover (Prime)</option>
                    <option value="Good Usable Condition">Good Usable Condition</option>
                    <option value="Partial Lot">Partial Lot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newListingForm.quantity}
                    onChange={(e) =>
                      setNewListingForm({ ...newListingForm, quantity: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newListingForm.unit}
                    onChange={(e) => setNewListingForm({ ...newListingForm, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resale Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newListingForm.pricePerUnit}
                    onChange={(e) =>
                      setNewListingForm({ ...newListingForm, pricePerUnit: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Yard / Pickup Location
                  </label>
                  <input
                    type="text"
                    value={newListingForm.location}
                    onChange={(e) => setNewListingForm({ ...newListingForm, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={newListingForm.city}
                    onChange={(e) => setNewListingForm({ ...newListingForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Storage Condition
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention storage conditions (covered shed, pallets, moisture protection)..."
                  value={newListingForm.description}
                  onChange={(e) =>
                    setNewListingForm({ ...newListingForm, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs"
                >
                  Publish Surplus Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
