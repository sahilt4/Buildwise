import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { api, setAuthToken, getAuthToken } from '../utils/api';
import {
  initialSites,
  initialMaterials,
  initialLeftovers,
  initialMarketplace,
  initialMarketplaceProfiles,
  initialMarketplaceInquiries,
  initialMarketplaceMessages,
  initialMarketplaceOrders,
  initialWorkers,
  initialTasks,
  initialActivities,
  initialAttendanceLogs
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State loaded via Cloud API, initialized with mockData as instant fallback
  const [sites, setSites] = useState(initialSites);
  const [materials, setMaterials] = useState(initialMaterials);
  const [leftovers, setLeftovers] = useState(initialLeftovers);
  const [marketplace, setMarketplace] = useState(initialMarketplace);
  const [marketplaceProfiles, setMarketplaceProfiles] = useState(initialMarketplaceProfiles);
  const [marketplaceInquiries, setMarketplaceInquiries] = useState(initialMarketplaceInquiries);
  const [marketplaceMessages, setMarketplaceMessages] = useState(initialMarketplaceMessages);
  const [marketplaceOrders, setMarketplaceOrders] = useState(initialMarketplaceOrders);
  const [workers, setWorkers] = useState(initialWorkers);
  const [tasks, setTasks] = useState(initialTasks);
  const [activities, setActivities] = useState(initialActivities);
  const [attendanceLogs, setAttendanceLogs] = useState(initialAttendanceLogs);

  // Loading and Error state
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Auth & RBAC State
  const [token, setToken] = useState(getAuthToken());
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App UI State
  const [userRole, setUserRole] = useState('builder'); // 'builder' | 'manager' (site manager) | 'worker'
  const [activeView, setActiveView] = useState('dashboard');
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetRole, setLoginTargetRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [undoStack, setUndoStack] = useState([]);

  // Toast dispatch
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#0f172a']
      });
    } catch {
      // fallback
    }
  }, []);

  // Fetch all initial data from MongoDB Backend
  const refreshData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setApiError(null);

    try {
      // Test health first
      const health = await api.checkHealth().catch(() => null);
      if (!health) {
        setIsBackendConnected(false);
        if (isInitial) {
          console.info('[Buildwise] Backend API offline or starting up; using local offline store.');
        }
        setIsLoading(false);
        return;
      }

      setIsBackendConnected(true);

      const [
        fetchedSites,
        fetchedMaterials,
        fetchedLeftovers,
        fetchedMarketplace,
        fetchedProfiles,
        fetchedInquiries,
        fetchedOrders,
        fetchedWorkers,
        fetchedTasks,
        fetchedAttendance,
        fetchedActivities
      ] = await Promise.all([
        api.getSites().catch(() => null),
        api.getMaterials().catch(() => null),
        api.getLeftovers().catch(() => null),
        api.getMarketplace().catch(() => null),
        api.getMarketplaceProfiles().catch(() => null),
        api.getMarketplaceInquiries().catch(() => null),
        api.getMarketplaceOrders().catch(() => null),
        api.getWorkers().catch(() => null),
        api.getTasks().catch(() => null),
        api.getAttendanceLogs().catch(() => null),
        api.getActivities().catch(() => null)
      ]);

      if (fetchedSites && fetchedSites.length) setSites(fetchedSites);
      if (fetchedMaterials && fetchedMaterials.length) setMaterials(fetchedMaterials);
      if (fetchedLeftovers) setLeftovers(fetchedLeftovers);
      if (fetchedMarketplace && fetchedMarketplace.length) setMarketplace(fetchedMarketplace);
      if (fetchedProfiles && fetchedProfiles.length) setMarketplaceProfiles(fetchedProfiles);
      if (fetchedInquiries && fetchedInquiries.length) setMarketplaceInquiries(fetchedInquiries);
      if (fetchedOrders && fetchedOrders.length) setMarketplaceOrders(fetchedOrders);
      if (fetchedWorkers && fetchedWorkers.length) setWorkers(fetchedWorkers);
      if (fetchedTasks && fetchedTasks.length) setTasks(fetchedTasks);
      if (fetchedAttendance && fetchedAttendance.length) setAttendanceLogs(fetchedAttendance);
      if (fetchedActivities && fetchedActivities.length) setActivities(fetchedActivities);
    } catch (err) {
      console.error('[Buildwise] Error fetching from backend:', err);
      setApiError(err.message);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  // Check existing auth session on mount
  const checkAuthSession = useCallback(async () => {
    let savedToken = getAuthToken();
    
    // If no existing token, automatically log in as Builder demo account for frictionless experience
    if (!savedToken) {
      try {
        const autoRes = await api.login('builder@buildwise.in', 'Buildwise@2026', 'builder');
        if (autoRes && autoRes.token) {
          savedToken = autoRes.token;
          setAuthToken(savedToken);
          setToken(savedToken);
          setAuthUser(autoRes.user);
          setIsAuthenticated(true);
          setUserRole(autoRes.user.role || 'builder');
          return;
        }
      } catch (autoErr) {
        console.warn('Auto demo login skipped:', autoErr.message);
      }
    }

    if (!savedToken) {
      setIsAuthenticated(false);
      setAuthUser(null);
      return;
    }

    try {
      const res = await api.getMe();
      if (res && res.user) {
        setAuthUser(res.user);
        setIsAuthenticated(true);
        setUserRole(res.user.role === 'engineer' ? 'manager' : res.user.role);
      }
    } catch {
      // Invalid/expired token
      setAuthToken(null);
      setToken(null);
      setAuthUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Login handler
  const login = useCallback(async (email, password, role, extraPayload = {}) => {
    try {
      const res = await api.login(email, password, role, extraPayload);
      if (res && res.token) {
        setAuthToken(res.token);
        setToken(res.token);
        setAuthUser(res.user);
        setIsAuthenticated(true);
        const resolvedRole = res.user.role === 'engineer' ? 'manager' : res.user.role;
        setUserRole(resolvedRole);
        addToast(`Welcome back, ${res.user.name} (${resolvedRole.toUpperCase()})`, 'success');

        // Scope default active view per role
        if (resolvedRole === 'worker') {
          setActiveView('dashboard'); // Worker portal
        } else {
          setActiveView('dashboard');
        }

        // Re-fetch backend data with newly authenticated token
        await refreshData(false);
        return res;
      }
    } catch (err) {
      console.error('Login error:', err);
      addToast(err.message || 'Login failed', 'danger');
      throw err;
    }
  }, [addToast, refreshData]);

  // Logout handler
  const logout = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setAuthUser(null);
    setIsAuthenticated(false);
    addToast('You have been logged out securely.', 'info');
  }, [addToast]);

  // Initial load effect
  useEffect(() => {
    checkAuthSession().finally(() => {
      refreshData(true);
    });
  }, [checkAuthSession, refreshData]);

  // Activity Helper
  const logActivity = useCallback(async (text, type = 'general', statusClass = 'info') => {
    const newAct = {
      id: 'act-' + Date.now(),
      text,
      time: 'Just now',
      type,
      statusClass
    };
    setActivities(prev => [newAct, ...prev.slice(0, 15)]);

    if (isBackendConnected) {
      try {
        await api.createActivity(newAct);
      } catch (e) {
        console.warn('Could not sync activity to backend:', e.message);
      }
    }
  }, [isBackendConnected]);

  // Action Handlers
  const addMaterial = async (newMat) => {
    const purchased = Number(newMat.purchased);
    const used = Number(newMat.used || 0);
    const remaining = purchased - used;
    const threshold = Number(newMat.threshold || 50);
    const status = remaining <= threshold ? 'Low Stock' : 'In Stock';

    const localMat = {
      ...newMat,
      id: 'mat-' + Date.now(),
      purchased,
      used,
      remaining,
      lastUpdated: 'Just now',
      status
    };

    // Optimistic UI update
    setMaterials(prev => [localMat, ...prev]);
    logActivity(`Added ${localMat.name} (${localMat.purchased} ${localMat.unit}) to ${localMat.siteName}`, 'material', 'success');
    addToast(`✓ Material "${localMat.name}" added successfully`, 'success');

    if (isBackendConnected) {
      try {
        const saved = await api.createMaterial(localMat);
        setMaterials(prev => prev.map(m => (m.id === localMat.id ? saved : m)));
      } catch (err) {
        console.error('Failed to sync material with server:', err);
        addToast(`Note: Saved locally. Backend sync notice: ${err.message}`, 'info');
      }
    }
  };

  const recordUsage = async (matId, usedQty) => {
    const prevMat = materials.find(m => m.id === matId);
    if (!prevMat) return;

    // Push the previous state of this material to the undo stack
    setUndoStack(prev => [...prev, { type: 'MATERIAL_USAGE', prevState: { ...prevMat } }]);

    const qty = Number(usedQty);
    const newUsed = Number(prevMat.used) + qty;
    const newRemaining = Math.max(0, Number(prevMat.purchased) - newUsed);
    let newStatus = newRemaining <= Number(prevMat.threshold || 50) ? 'Low Stock' : 'In Stock';
    let isSurplus = false;

    // Waste-to-Value Classifier Rule
    if (prevMat.required && newRemaining > prevMat.required && prevMat.condition && prevMat.condition !== 'Scrap') {
      newStatus = 'Surplus Candidate';
      isSurplus = true;
    }

    // Optimistic update
    setMaterials(prev => prev.map(m => {
      if (m.id === matId) {
        return {
          ...m,
          used: newUsed,
          remaining: newRemaining,
          status: newStatus,
          lastUpdated: 'Just now'
        };
      }
      return m;
    }));

    if (isSurplus) {
      const surplusQty = newRemaining - prevMat.required;
      const conditionFactor = prevMat.condition === 'Brand New' ? 0.8 : 0.6;
      const estValue = surplusQty * (prevMat.costPerUnit || 100) * conditionFactor;

      setLeftovers(prev => {
        if (prev.some(l => l.materialId === matId)) return prev;
        return [{
          id: 'left-' + Date.now(),
          materialId: matId,
          title: prevMat.name,
          quantity: surplusQty + ' ' + prevMat.unit,
          estimatedValue: estValue,
          site: prevMat.siteName,
          condition: prevMat.condition,
          category: prevMat.category,
          image: prevMat.image,
          description: 'Automatically flagged surplus based on site requirements.'
        }, ...prev];
      });
      addToast(`💡 Identified surplus ${prevMat.name}! Added to Waste-to-Value.`, 'info');
    }

    logActivity(`Recorded usage of ${usedQty} ${prevMat.unit} of ${prevMat.name}`, 'material', 'info');
    addToast(`✓ Recorded ${usedQty} ${prevMat.unit} usage for ${prevMat.name}`, 'success');

    if (isBackendConnected) {
      try {
        const result = await api.recordMaterialUsage(matId, qty);
        if (result.material) {
          setMaterials(prev => prev.map(m => (m.id === matId ? result.material : m)));
        }
        if (result.createdLeftover) {
          setLeftovers(prev => [result.createdLeftover, ...prev.filter(l => l.id !== result.createdLeftover.id)]);
        }
      } catch (err) {
        console.error('Failed to sync usage with server:', err);
      }
    }
  };

  const undoLastAction = async () => {
    if (undoStack.length === 0) return;

    const newStack = [...undoStack];
    const lastAction = newStack.pop();
    setUndoStack(newStack);

    if (lastAction.type === 'MATERIAL_USAGE') {
      const prev = lastAction.prevState;
      setMaterials(currentMaterials =>
        currentMaterials.map(m => (m.id === prev.id ? prev : m))
      );
      addToast(`Reverted usage entry for ${prev.name}`, 'info');

      if (isBackendConnected) {
        try {
          await api.updateMaterial(prev.id, prev);
        } catch (e) {
          console.warn('Could not revert on backend:', e.message);
        }
      }
    }
  };

  // Waste -> Value: 1-Click Sell Leftover to Marketplace
  const listLeftoverOnMarketplace = async (leftoverId) => {
    const item = leftovers.find(l => l.id === leftoverId);
    if (!item) return;

    const newMarketListing = {
      id: 'mkt-' + Date.now(),
      title: item.title,
      quantity: item.quantity,
      price: Math.round(item.estimatedValue / (parseInt(item.quantity) || 1)),
      unit: item.quantity.includes('piece') ? 'piece' : (item.quantity.includes('Ton') ? 'ton' : 'unit'),
      totalPrice: item.estimatedValue,
      location: item.site + ', Nashik',
      city: 'Nashik',
      condition: item.condition,
      seller: 'Rajesh Infra (Direct)',
      sellerRating: 5.0,
      category: item.category,
      image: item.image,
      postedTime: 'Just now',
      verifiedSeller: true
    };

    // Optimistic UI updates
    setMarketplace(prev => [newMarketListing, ...prev]);
    setLeftovers(prev => prev.filter(l => l.id !== leftoverId));
    logActivity(`Listed leftover ${item.title} (${item.quantity}) on Marketplace for ₹${item.estimatedValue.toLocaleString()}`, 'marketplace', 'success');
    triggerConfetti();
    addToast(`🎉 Value Recovered! Listed ${item.title} on Marketplace for ₹${item.estimatedValue.toLocaleString()}`, 'success');

    if (isBackendConnected) {
      try {
        const res = await api.listLeftoverOnMarketplace(leftoverId);
        if (res.listing) {
          setMarketplace(prev => [res.listing, ...prev.filter(m => m.id !== res.listing.id && m.id !== newMarketListing.id)]);
        }
      } catch (err) {
        console.error('Failed to sync leftover listing to backend:', err);
      }
    }
  };

  const addMarketplaceListing = async (listing) => {
    const newListing = {
      ...listing,
      id: 'mkt-' + Date.now(),
      postedTime: 'Just now',
      seller: listing.seller || 'Buildwise Verified User',
      sellerRating: 5.0,
      verifiedSeller: true
    };

    setMarketplace(prev => [newListing, ...prev]);
    logActivity(`Created marketplace listing for ${listing.title}`, 'marketplace', 'success');
    triggerConfetti();
    addToast(`✓ Listing "${listing.title}" published to marketplace`, 'success');

    if (isBackendConnected) {
      try {
        const saved = await api.createMarketplaceListing(newListing);
        setMarketplace(prev => prev.map(m => (m.id === newListing.id ? saved : m)));
      } catch (err) {
        console.error('Failed to sync marketplace listing:', err);
      }
    }
  };

  const requestMarketplaceItem = async (itemTitle, sellerName, itemId) => {
    logActivity(`Sent purchase request to ${sellerName} for ${itemTitle}`, 'marketplace', 'info');
    addToast(`✓ Request sent to ${sellerName}. They will contact you shortly!`, 'success');

    if (isBackendConnected && itemId) {
      try {
        await api.requestMarketplaceItem(itemId, currentUser?.name || 'Engineer');
      } catch (err) {
        console.warn('Purchase request sync warning:', err.message);
      }
    }
  };

  // Submit formal Inquiry
  const submitMarketplaceInquiry = async (inquiryData) => {
    const listing = marketplace.find(m => m.id === inquiryData.listingId);
    if (!listing) return;

    const requestedQty = Number(inquiryData.requestedQuantity);
    const proposedPrice = Number(inquiryData.proposedPrice);
    const totalProposedAmount = requestedQty * proposedPrice;

    const newInquiry = {
      id: 'inq-' + Date.now(),
      listingId: listing.id,
      listingTitle: listing.title,
      unit: listing.unit,
      requestedQuantity: requestedQty,
      proposedPrice: proposedPrice,
      totalProposedAmount,
      message: inquiryData.message || 'We are interested in purchasing this surplus material for our site.',
      preferredPickupDate: inquiryData.preferredPickupDate || 'Next 3 Days',
      contactPreference: inquiryData.contactPreference || 'Phone',
      status: 'Pending',
      buyerProfileId: inquiryData.buyerProfileId || 'prof-2',
      buyerProfile: inquiryData.buyerProfile || {
        name: currentUser?.name || 'Suresh Deshmukh',
        companyName: currentUser?.company || 'Sunrise Residency Site',
        phone: '+91 98450 44321',
        email: 'suresh@sunriseinfra.in',
        city: 'Nashik',
        rating: 4.8,
        isVerified: true
      },
      sellerProfileId: listing.sellerProfileId || 'prof-1',
      sellerProfile: listing.sellerProfile || {
        name: listing.seller,
        companyName: 'Buildwise Infra Ltd.',
        phone: '+91 98220 12345',
        city: listing.city,
        rating: listing.sellerRating || 5.0,
        isVerified: true
      },
      createdAt: new Date().toISOString()
    };

    const initialMsg = {
      id: 'msg-' + Date.now(),
      inquiryId: newInquiry.id,
      senderProfileId: newInquiry.buyerProfileId,
      senderName: newInquiry.buyerProfile.name,
      senderRole: 'buyer',
      text: newInquiry.message,
      type: 'message',
      createdAt: new Date().toISOString()
    };

    setMarketplaceInquiries(prev => [newInquiry, ...prev]);
    setMarketplaceMessages(prev => [...prev, initialMsg]);
    logActivity(`Submitted inquiry to ${listing.seller} for ${listing.title} (${requestedQty} ${listing.unit} @ ₹${proposedPrice})`, 'marketplace', 'info');
    addToast(`✓ Inquiry for "${listing.title}" sent successfully!`, 'success');

    if (isBackendConnected) {
      try {
        const saved = await api.createMarketplaceInquiry(newInquiry);
        if (saved && saved.id) {
          setMarketplaceInquiries(prev => prev.map(i => i.id === newInquiry.id ? saved : i));
        }
      } catch (err) {
        console.warn('Backend sync for inquiry error:', err.message);
      }
    }
    return newInquiry;
  };

  // Respond to Inquiry (Accept, Counter, Reject)
  const respondToMarketplaceInquiry = async (inquiryId, action, payload = {}) => {
    const inquiry = marketplaceInquiries.find(i => i.id === inquiryId);
    if (!inquiry) return;

    const listing = marketplace.find(m => m.id === inquiry.listingId);
    if (!listing && action === 'accept') {
      addToast('Listing not found for this inquiry', 'danger');
      return;
    }

    if (action === 'accept') {
      const agreedQty = inquiry.counterOffer?.quantity || inquiry.requestedQuantity;
      const agreedPrice = inquiry.counterOffer?.price || inquiry.proposedPrice;

      if (listing && agreedQty > (listing.availableQuantity ?? listing.totalQuantity ?? 999)) {
        addToast(`Cannot accept. Requested ${agreedQty} exceeds available ${listing.availableQuantity}.`, 'danger');
        return;
      }

      // Reserve stock and create order
      const newAvail = Math.max(0, (listing.availableQuantity ?? listing.totalQuantity) - agreedQty);
      const newReserved = (listing.reservedQuantity || 0) + agreedQty;
      const newListingStatus = newAvail === 0 ? 'Reserved' : listing.status;

      // Update listing
      setMarketplace(prev => prev.map(m => m.id === listing.id ? {
        ...m,
        availableQuantity: newAvail,
        reservedQuantity: newReserved,
        status: newListingStatus
      } : m));

      // Update inquiry
      setMarketplaceInquiries(prev => prev.map(i => i.id === inquiryId ? {
        ...i,
        status: 'Accepted'
      } : i));

      // Add acceptance message
      const acceptMsg = {
        id: 'msg-' + Date.now(),
        inquiryId: inquiry.id,
        senderProfileId: inquiry.sellerProfileId,
        senderName: inquiry.sellerProfile.name,
        senderRole: 'seller',
        text: payload.message || `Offer accepted for ${agreedQty} ${listing.unit} at ₹${agreedPrice}/${listing.unit}. Stock reserved!`,
        type: 'offer_accepted',
        createdAt: new Date().toISOString()
      };
      setMarketplaceMessages(prev => [...prev, acceptMsg]);

      // Auto-generate Marketplace Order
      const newOrder = {
        id: 'ord-' + Date.now(),
        orderNumber: `BW-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        listingId: listing.id,
        inquiryId: inquiry.id,
        materialName: listing.title,
        category: listing.category,
        quantity: agreedQty,
        unit: listing.unit,
        unitPrice: agreedPrice,
        totalAmount: agreedQty * agreedPrice,
        pickupLocation: listing.location,
        city: listing.city,
        scheduledPickupDate: inquiry.preferredPickupDate || 'Next 48 Hours',
        orderStatus: 'Confirmed',
        paymentStatus: 'Paid',
        buyerProfile: { ...inquiry.buyerProfile },
        sellerProfile: { ...inquiry.sellerProfile },
        reservationExpiry: '7 days from confirmation',
        timeline: [
          {
            step: 'Inquiry Submitted',
            title: 'Inquiry Submitted',
            note: `Initial buyer request for ${inquiry.requestedQuantity} ${listing.unit}`,
            status: 'completed',
            updatedBy: inquiry.buyerProfile.name,
            timestamp: inquiry.createdAt
          },
          {
            step: 'Seller Responded',
            title: 'Seller Accepted Offer',
            note: `Agreed: ${agreedQty} ${listing.unit} @ ₹${agreedPrice}/${listing.unit}`,
            status: 'completed',
            updatedBy: inquiry.sellerProfile.name,
            timestamp: new Date().toISOString()
          },
          {
            step: 'Quantity Reserved',
            title: 'Stock Reserved & Order Confirmed',
            note: `Reserved ${agreedQty} ${listing.unit} from listing stock`,
            status: 'completed',
            updatedBy: 'Buildwise System',
            timestamp: new Date().toISOString()
          },
          {
            step: 'Ready for Pickup',
            title: 'Awaiting Seller Preparation',
            note: 'Material staging at site loading dock',
            status: 'current',
            updatedBy: inquiry.sellerProfile.name,
            timestamp: new Date().toISOString()
          },
          {
            step: 'Picked Up',
            title: 'Site Transport Handshake',
            note: 'Awaiting buyer vehicle arrival',
            status: 'pending',
            updatedBy: inquiry.buyerProfile.name,
            timestamp: new Date().toISOString()
          },
          {
            step: 'Completed',
            title: 'Transaction Closed',
            note: 'Delivery signoff and material muster entry',
            status: 'pending',
            updatedBy: 'System',
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      };

      setMarketplaceOrders(prev => [newOrder, ...prev]);
      triggerConfetti();
      addToast(`🎉 Offer accepted! Order ${newOrder.orderNumber} created & stock reserved.`, 'success');
      logActivity(`Order ${newOrder.orderNumber} confirmed: reserved ${agreedQty} ${listing.unit} of ${listing.title}`, 'marketplace', 'success');

    } else if (action === 'counter') {
      const cQty = Number(payload.counterQuantity || inquiry.requestedQuantity);
      const cPrice = Number(payload.counterPrice || inquiry.proposedPrice);

      setMarketplaceInquiries(prev => prev.map(i => i.id === inquiryId ? {
        ...i,
        status: 'Countered',
        counterOffer: {
          quantity: cQty,
          price: cPrice,
          note: payload.message || 'Counter-offer proposed by seller.',
          counteredAt: new Date().toISOString(),
          counteredBy: 'seller'
        }
      } : i));

      const counterMsg = {
        id: 'msg-' + Date.now(),
        inquiryId: inquiry.id,
        senderProfileId: inquiry.sellerProfileId,
        senderName: inquiry.sellerProfile.name,
        senderRole: 'seller',
        text: payload.message || `Counter-offer: ${cQty} ${inquiry.unit} at ₹${cPrice}/${inquiry.unit}.`,
        type: 'counter_offer',
        payload: { quantity: cQty, price: cPrice },
        createdAt: new Date().toISOString()
      };
      setMarketplaceMessages(prev => [...prev, counterMsg]);
      addToast(`Counter-offer submitted to ${inquiry.buyerProfile.name}`, 'info');
      logActivity(`Countered inquiry for ${inquiry.listingTitle} (${cQty} ${inquiry.unit} @ ₹${cPrice})`, 'marketplace', 'info');

    } else if (action === 'reject') {
      setMarketplaceInquiries(prev => prev.map(i => i.id === inquiryId ? {
        ...i,
        status: 'Rejected'
      } : i));

      const rejectMsg = {
        id: 'msg-' + Date.now(),
        inquiryId: inquiry.id,
        senderProfileId: inquiry.sellerProfileId,
        senderName: inquiry.sellerProfile.name,
        senderRole: 'seller',
        text: payload.message || 'Request declined by seller.',
        type: 'offer_rejected',
        createdAt: new Date().toISOString()
      };
      setMarketplaceMessages(prev => [...prev, rejectMsg]);
      addToast(`Inquiry rejected`, 'info');
      logActivity(`Declined inquiry for ${inquiry.listingTitle}`, 'marketplace', 'info');
    }

    if (isBackendConnected) {
      try {
        await api.respondToMarketplaceInquiry(inquiryId, { action, ...payload });
      } catch (err) {
        console.warn('Backend sync for respondToMarketplaceInquiry:', err.message);
      }
    }
  };

  // Send message in negotiation thread
  const sendInquiryMessage = async (inquiryId, text) => {
    const inquiry = marketplaceInquiries.find(i => i.id === inquiryId);
    if (!inquiry || !text.trim()) return;

    const isCurrentSeller = currentUser?.role?.toLowerCase().includes('builder') || currentUser?.name === inquiry.sellerProfile.name;
    const senderRole = isCurrentSeller ? 'seller' : 'buyer';
    const senderName = currentUser?.name || (isCurrentSeller ? inquiry.sellerProfile.name : inquiry.buyerProfile.name);
    const senderProfileId = isCurrentSeller ? inquiry.sellerProfileId : inquiry.buyerProfileId;

    const newMsg = {
      id: 'msg-' + Date.now(),
      inquiryId,
      senderProfileId,
      senderName,
      senderRole,
      text: text.trim(),
      type: 'message',
      createdAt: new Date().toISOString()
    };

    setMarketplaceMessages(prev => [...prev, newMsg]);

    if (isBackendConnected) {
      try {
        await api.sendInquiryMessage(inquiryId, newMsg);
      } catch (err) {
        console.warn('Backend sync for sendInquiryMessage:', err.message);
      }
    }
  };

  // Advance Order Lifecycle (Ready for Pickup, Picked Up, Completed, Cancelled)
  const updateMarketplaceOrderStatus = async (orderId, newStatus, note = '') => {
    const order = marketplaceOrders.find(o => o.id === orderId);
    if (!order) return;

    const updatedBy = currentUser?.name || 'Site Supervisor';
    const stepTitleMap = {
      'Ready for Pickup': 'Material Ready for Pickup at Site Yard',
      'Picked Up': 'Material Dispatched / Picked Up by Buyer',
      'Completed': 'Transaction Completed & Closed',
      'Cancelled': 'Order Cancelled'
    };

    const newTimelineEvent = {
      step: newStatus,
      title: stepTitleMap[newStatus] || newStatus,
      note: note || `Order marked ${newStatus}`,
      status: 'completed',
      updatedBy,
      timestamp: new Date().toISOString()
    };

    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedTimeline = [...o.timeline.map(t => t.status === 'current' ? { ...t, status: 'completed' } : t), newTimelineEvent];
        return {
          ...o,
          orderStatus: newStatus,
          timeline: updatedTimeline
        };
      }
      return o;
    }));

    if (newStatus === 'Completed') {
      triggerConfetti();
      addToast(`🎉 Order ${order.orderNumber} successfully marked as Completed!`, 'success');
      logActivity(`Order ${order.orderNumber} Completed for ${order.materialName} (${order.quantity} ${order.unit})`, 'marketplace', 'success');
    } else if (newStatus === 'Ready for Pickup') {
      addToast(`✓ Order ${order.orderNumber} is marked Ready for Pickup!`, 'success');
      logActivity(`Order ${order.orderNumber} marked Ready for Pickup`, 'marketplace', 'info');
    } else if (newStatus === 'Picked Up') {
      addToast(`✓ Order ${order.orderNumber} confirmed as Picked Up!`, 'success');
      logActivity(`Order ${order.orderNumber} Picked Up by ${order.buyerProfile.name}`, 'marketplace', 'info');
    }

    if (isBackendConnected) {
      try {
        await api.updateMarketplaceOrderStatus(orderId, { status: newStatus, note, updatedBy });
      } catch (err) {
        console.warn('Backend sync for updateMarketplaceOrderStatus:', err.message);
      }
    }
  };

  const addWorker = async (workerData) => {
    const newWorker = {
      ...workerData,
      id: 'w-' + Date.now(),
      attendanceRate: 100,
      status: 'Active',
      isCheckedIn: false,
      checkInTime: null,
      avatar: workerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    setWorkers(prev => [newWorker, ...prev]);
    logActivity(`Added crew member ${newWorker.name} (${newWorker.trade}) to ${newWorker.siteName}`, 'worker', 'success');
    addToast(`✓ Worker "${newWorker.name}" added successfully`, 'success');

    if (isBackendConnected) {
      try {
        const saved = await api.createWorker(newWorker);
        setWorkers(prev => prev.map(w => (w.id === newWorker.id ? saved : w)));
      } catch (err) {
        console.error('Failed to sync worker:', err);
      }
    }
  };

  const createTask = async (taskData) => {
    const newTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      progress: 0,
      status: 'To Do'
    };

    setTasks(prev => [newTask, ...prev]);
    logActivity(`Assigned task "${newTask.title}" to ${newTask.workerName}`, 'task', 'info');
    addToast(`✓ Task "${newTask.title}" created`, 'success');

    if (isBackendConnected) {
      try {
        const saved = await api.createTask(newTask);
        setTasks(prev => prev.map(t => (t.id === newTask.id ? saved : t)));
      } catch (err) {
        console.error('Failed to sync task:', err);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus, newProgress) => {
    let isBlocked = false;

    // Check DAG prerequisite
    const task = tasks.find(t => t.id === taskId);
    if (task && task.prerequisiteId && newStatus === 'In Progress') {
      const prereqTask = tasks.find(t => t.id === task.prerequisiteId);
      if (prereqTask && prereqTask.status !== 'Completed') {
        isBlocked = true;
        addToast(`Blocked! Prerequisite "${prereqTask.title}" must be completed first.`, 'danger');
        return;
      }
    }

    const calculatedProgress = newProgress !== undefined ? newProgress : (newStatus === 'Completed' ? 100 : task?.progress || 0);

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus, progress: calculatedProgress };
      }
      return t;
    }));

    if (!isBlocked) {
      if (newStatus === 'Completed') {
        triggerConfetti();
        addToast(`🎉 Task marked as completed!`, 'success');
      } else {
        addToast(`✓ Task updated to ${newStatus}`, 'info');
      }

      if (isBackendConnected) {
        try {
          const res = await api.updateTaskStatus(taskId, newStatus, calculatedProgress);
          if (res.task) {
            setTasks(prev => prev.map(t => (t.id === taskId ? res.task : t)));
          }
        } catch (err) {
          if (err.details?.isBlocked) {
            addToast(err.details.error, 'danger');
            refreshData();
          } else {
            console.error('Failed to sync task status:', err);
          }
        }
      }
    }
  };

  // 1-Click Worker Attendance Check-in / Check-out
  const toggleWorkerAttendance = async (workerId) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    let updatedWorker = null;
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        const newCheckedState = !w.isCheckedIn;
        updatedWorker = {
          ...w,
          isCheckedIn: newCheckedState,
          checkInTime: newCheckedState ? timeStr : null
        };
        return updatedWorker;
      }
      return w;
    }));

    if (updatedWorker) {
      if (updatedWorker.isCheckedIn) {
        triggerConfetti();
        addToast(`✓ Checked in successfully at ${timeStr}`, 'success');
        logActivity(`${updatedWorker.name} checked in at ${updatedWorker.siteName}`, 'attendance', 'success');
        setAttendanceLogs(prev => [
          {
            id: 'att-' + Date.now(),
            workerId: updatedWorker.id,
            workerName: updatedWorker.name,
            trade: updatedWorker.trade,
            siteName: updatedWorker.siteName,
            time: timeStr,
            date: 'Today',
            status: 'Present',
            method: '1-Click Mobile Punch'
          },
          ...prev
        ]);
      } else {
        addToast(`✓ Checked out at ${timeStr}`, 'info');
        logActivity(`${updatedWorker.name} checked out from ${updatedWorker.siteName}`, 'attendance', 'info');
      }

      if (isBackendConnected) {
        try {
          const res = await api.toggleWorkerAttendance(workerId, '1-Click Mobile Punch');
          if (res.worker) {
            setWorkers(prev => prev.map(w => (w.id === workerId ? res.worker : w)));
          }
          if (res.attendanceLog) {
            setAttendanceLogs(prev => [res.attendanceLog, ...prev.filter(l => l.id !== res.attendanceLog.id)]);
          }
        } catch (err) {
          console.error('Failed to sync attendance toggle:', err);
        }
      }
    }
  };

  // QR Code Attendance scan
  const scanQRAttendance = async (siteName) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const currentWorker = workers.find(w =>
      (authUser?.workerId && w.id === authUser.workerId) ||
      (authUser?.name && w.name.toLowerCase() === authUser.name.toLowerCase())
    ) || workers[0] || { id: 'w-1', name: authUser?.name || 'Worker', trade: 'Master Mason', siteName: siteName || 'Sunrise Residency' };

    setWorkers(prev => prev.map(w => {
      if (w.id === currentWorker.id) {
        return {
          ...w,
          isCheckedIn: true,
          checkInTime: timeStr,
          siteName: siteName || w.siteName
        };
      }
      return w;
    }));

    const newLog = {
      id: 'att-' + Date.now(),
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      trade: currentWorker.trade,
      siteName: siteName || currentWorker.siteName,
      time: timeStr,
      date: 'Today',
      status: 'Present',
      method: 'QR Code Scan'
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    logActivity(`${currentWorker.name} verified QR code at ${siteName || currentWorker.siteName}`, 'attendance', 'success');
    triggerConfetti();
    addToast(`✓ QR Attendance verified at ${siteName || currentWorker.siteName} (${timeStr})`, 'success');

    if (isBackendConnected) {
      try {
        const res = await api.scanQRAttendance(siteName || currentWorker.siteName, currentWorker.id);
        if (res && res.id) {
          setAttendanceLogs(prev => [res, ...prev.filter(l => l.id !== res.id && l.id !== newLog.id)]);
        }
      } catch (err) {
        console.error('Failed to sync QR attendance:', err);
      }
    }
  };

  const addSite = async (siteData) => {
    const newSite = {
      ...siteData,
      id: 'site-' + Date.now(),
      progress: 0,
      spent: '₹0.00 Cr',
      workerCount: 0,
      health: 'Good',
      alertCount: 0,
      image: siteData.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
    };

    setSites(prev => [newSite, ...prev]);
    logActivity(`Created new site project: ${newSite.name}`, 'site', 'success');
    addToast(`✓ Site "${newSite.name}" added successfully`, 'success');

    if (isBackendConnected) {
      try {
        const saved = await api.createSite(newSite);
        setSites(prev => prev.map(s => (s.id === newSite.id ? saved : s)));
      } catch (err) {
        console.error('Failed to sync site:', err);
      }
    }
  };

  // Delete Material
  const deleteMaterial = async (matId) => {
    const target = materials.find(m => m.id === matId);
    setMaterials(prev => prev.filter(m => m.id !== matId));
    logActivity(`Deleted material: ${target?.name || matId}`, 'material', 'warning');
    addToast('Material item removed', 'info');
    if (isBackendConnected) {
      try {
        await api.deleteMaterial(matId);
      } catch (err) {
        console.error('Failed to delete material from backend:', err);
      }
    }
  };

  // Delete Worker
  const deleteWorker = async (workerId) => {
    const target = workers.find(w => w.id === workerId);
    setWorkers(prev => prev.filter(w => w.id !== workerId));
    logActivity(`Removed worker: ${target?.name || workerId}`, 'worker', 'warning');
    addToast('Worker removed from roster', 'info');
    if (isBackendConnected) {
      try {
        await api.deleteWorker(workerId);
      } catch (err) {
        console.error('Failed to delete worker from backend:', err);
      }
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    const target = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    logActivity(`Deleted task: ${target?.title || taskId}`, 'task', 'warning');
    addToast('Task removed', 'info');
    if (isBackendConnected) {
      try {
        await api.deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task from backend:', err);
      }
    }
  };

  // Update Site Progress
  const updateSiteProgress = async (siteId, progress) => {
    const numProgress = Math.min(100, Math.max(0, Number(progress)));
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, progress: numProgress } : s));
    addToast(`Site progress updated to ${numProgress}%`, 'success');
    if (isBackendConnected) {
      try {
        await api.updateSite(siteId, { progress: numProgress });
      } catch (err) {
        console.error('Failed to update site progress:', err);
      }
    }
  };

  // Seed MongoDB Database
  const seedDatabase = async (options = {}) => {
    try {
      addToast('Seeding database with demo records...', 'info');
      const res = await api.seedDatabase(options);
      addToast('✓ MongoDB database seeded successfully!', 'success');
      triggerConfetti();
      await refreshData(false);
      return res;
    } catch (err) {
      addToast(`Seed failed: ${err.message}`, 'danger');
      throw err;
    }
  };

  // User Profile based on authenticated user with role-based presets as fallback
  const resolvedRole = userRole === 'engineer' ? 'manager' : userRole;
  const rolePresets = {
    builder: {
      name: 'Rajesh Sharma',
      role: 'Builder / Director',
      company: 'Buildwise Infra Ltd.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    manager: {
      name: 'Suresh Deshmukh',
      role: 'Site Manager (Site Eng.)',
      company: 'Sunrise Residency Site',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    engineer: {
      name: 'Suresh Deshmukh',
      role: 'Site Manager (Site Eng.)',
      company: 'Sunrise Residency Site',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    worker: {
      name: 'Amit Patil',
      role: 'Master Mason',
      company: 'Sunrise Residency Crew',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  };

  const currentUser = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    role: authUser.role === 'builder' ? 'Builder / Director' : (authUser.role === 'manager' ? 'Site Manager' : 'Field Worker'),
    rawRole: authUser.role,
    company: authUser.company || rolePresets[authUser.role]?.company || 'Buildwise Infra Ltd.',
    avatar: authUser.avatar || rolePresets[authUser.role]?.avatar,
    assignedSiteIds: authUser.assignedSiteIds || [],
    workerId: authUser.workerId
  } : rolePresets[resolvedRole] || rolePresets.builder;

  return (
    <AppContext.Provider
      value={{
        sites,
        materials,
        leftovers,
        marketplace,
        marketplaceProfiles,
        marketplaceInquiries,
        marketplaceMessages,
        marketplaceOrders,
        submitMarketplaceInquiry,
        respondToMarketplaceInquiry,
        sendInquiryMessage,
        updateMarketplaceOrderStatus,
        workers,
        tasks,
        activities,
        attendanceLogs,
        isLoading,
        apiError,
        isBackendConnected,
        refreshData,
        userRole,
        setUserRole,
        currentUser,
        authUser,
        isAuthenticated,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginTargetRole,
        setLoginTargetRole,
        activeView,
        setActiveView,
        isLandingPage,
        setIsLandingPage,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        undoStack,
        undoLastAction,
        addMaterial,
        recordUsage,
        deleteMaterial,
        listLeftoverOnMarketplace,
        addMarketplaceListing,
        requestMarketplaceItem,
        addWorker,
        deleteWorker,
        createTask,
        updateTaskStatus,
        deleteTask,
        toggleWorkerAttendance,
        scanQRAttendance,
        addSite,
        updateSiteProgress,
        seedDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
