import express from 'express';
import { MarketplaceListing } from '../models/MarketplaceListing.js';
import { MarketplaceProfile } from '../models/MarketplaceProfile.js';
import { MarketplaceInquiry } from '../models/MarketplaceInquiry.js';
import { MarketplaceMessage } from '../models/MarketplaceMessage.js';
import { MarketplaceOrder } from '../models/MarketplaceOrder.js';
import { Activity } from '../models/Activity.js';

const router = express.Router();

// ==========================================
// 1. PROFILES
// ==========================================

// GET all profiles
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await MarketplaceProfile.find().sort({ rating: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profiles', details: err.message });
  }
});

// GET single profile
router.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await MarketplaceProfile.findOne({ id: req.params.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

// ==========================================
// 2. LISTINGS
// ==========================================

// GET listings with search and filters
router.get('/listings', async (req, res) => {
  try {
    const { category, city, status, condition, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (city && city !== 'All') filter.city = new RegExp(city, 'i');
    if (status && status !== 'All') filter.status = status;
    if (condition && condition !== 'All') filter.condition = condition;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { seller: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await MarketplaceListing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings', details: err.message });
  }
});

// GET single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await MarketplaceListing.findOne({ id: req.params.id });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing', details: err.message });
  }
});

// POST new listing
router.post('/listings', async (req, res) => {
  try {
    const { title, totalQuantity, price, location, city, category, unit } = req.body;
    if (!title || totalQuantity === undefined || price === undefined || !location || !city || !category) {
      return res.status(400).json({ error: 'Title, totalQuantity, price, location, city, and category are required.' });
    }

    const numPrice = Number(price);
    const numQty = Number(totalQuantity);
    const numTotal = req.body.totalPrice ? Number(req.body.totalPrice) : numPrice * numQty;
    const id = req.body.id || `mkt-${Date.now()}`;

    const newListing = new MarketplaceListing({
      id,
      title,
      materialName: req.body.materialName || title,
      category,
      totalQuantity: numQty,
      availableQuantity: numQty,
      reservedQuantity: 0,
      unit: unit || 'unit',
      quantity: req.body.quantity || `${numQty} ${unit || 'unit'}`,
      price: numPrice,
      totalPrice: numTotal,
      location,
      city,
      condition: req.body.condition || 'Surplus',
      status: 'Available',
      availableUntil: req.body.availableUntil || '30 Days',
      description: req.body.description || '',
      image: req.body.image || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60',
      seller: req.body.seller || 'Buildwise Verified User',
      sellerProfileId: req.body.sellerProfileId || 'prof-1',
      sellerProfile: req.body.sellerProfile || {
        name: req.body.seller || 'Rajesh Sharma',
        companyName: 'Buildwise Infra Ltd.',
        phone: '+91 98220 12345',
        email: 'rajesh@buildwise.in',
        city: city,
        rating: 4.9,
        isVerified: true
      },
      sellerRating: req.body.sellerRating || 5.0,
      postedTime: 'Just now',
      verifiedSeller: true
    });

    const saved = await newListing.save();

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `Created surplus listing for ${saved.title} (${saved.quantity})`,
      type: 'marketplace',
      statusClass: 'success'
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create marketplace listing', details: err.message });
  }
});

// DELETE listing
router.delete('/listings/:id', async (req, res) => {
  try {
    const deleted = await MarketplaceListing.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing removed successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing', details: err.message });
  }
});

// Backward compatibility: GET / (root of router)
router.get('/', async (req, res) => {
  try {
    const listings = await MarketplaceListing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings', details: err.message });
  }
});

// Backward compatibility: POST /
router.post('/', async (req, res) => {
  try {
    const { title, quantity, price, location, city, category } = req.body;
    const numPrice = Number(price);
    const parsedQty = parseInt(quantity) || 10;
    const id = req.body.id || `mkt-${Date.now()}`;

    const listing = new MarketplaceListing({
      id,
      title,
      materialName: title,
      category,
      totalQuantity: parsedQty,
      availableQuantity: parsedQty,
      reservedQuantity: 0,
      unit: req.body.unit || 'unit',
      quantity: req.body.quantity || `${parsedQty} ${req.body.unit || 'unit'}`,
      price: numPrice,
      totalPrice: req.body.totalPrice ? Number(req.body.totalPrice) : numPrice * parsedQty,
      location,
      city,
      condition: req.body.condition || 'Surplus',
      seller: req.body.seller || 'Buildwise Verified User',
      sellerProfileId: req.body.sellerProfileId || 'prof-1',
      sellerProfile: req.body.sellerProfile || {
        name: req.body.seller || 'Rajesh Sharma',
        companyName: 'Buildwise Infra Ltd.',
        phone: '+91 98220 12345',
        city: city || 'Nashik',
        rating: 4.9,
        isVerified: true
      },
      sellerRating: req.body.sellerRating || 5.0,
      image: req.body.image || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60',
      postedTime: 'Just now',
      verifiedSeller: true
    });

    const saved = await listing.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create listing', details: err.message });
  }
});

// Backward compatibility: POST /:id/request
router.post('/:id/request', async (req, res) => {
  try {
    const listing = await MarketplaceListing.findOne({ id: req.params.id });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const buyerName = req.body.buyerName || 'Site Engineer';
    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${buyerName} sent purchase request to ${listing.seller} for ${listing.title}`,
      type: 'marketplace',
      statusClass: 'info'
    });

    res.json({
      message: `✓ Request sent to ${listing.seller}. They will contact you shortly!`,
      listing
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to request item', details: err.message });
  }
});

// ==========================================
// 3. INQUIRIES & NEGOTIATION
// ==========================================

// GET all inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const { buyerProfileId, sellerProfileId, status, listingId } = req.query;
    const filter = {};
    if (buyerProfileId) filter.buyerProfileId = buyerProfileId;
    if (sellerProfileId) filter.sellerProfileId = sellerProfileId;
    if (status && status !== 'All') filter.status = status;
    if (listingId) filter.listingId = listingId;

    const inquiries = await MarketplaceInquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries', details: err.message });
  }
});

// POST create inquiry
router.post('/inquiries', async (req, res) => {
  try {
    const { listingId, requestedQuantity, proposedPrice } = req.body;
    if (!listingId || !requestedQuantity || proposedPrice === undefined) {
      return res.status(400).json({ error: 'listingId, requestedQuantity, and proposedPrice are required.' });
    }

    const listing = await MarketplaceListing.findOne({ id: listingId });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const reqQty = Number(requestedQuantity);
    const propPrice = Number(proposedPrice);

    // Validation: cannot request more than available
    if (reqQty > listing.availableQuantity) {
      return res.status(400).json({
        error: `Cannot request ${reqQty} ${listing.unit}. Only ${listing.availableQuantity} ${listing.unit} currently available.`
      });
    }

    const id = req.body.id || `inq-${Date.now()}`;
    const inquiry = new MarketplaceInquiry({
      id,
      listingId: listing.id,
      listingTitle: listing.title,
      unit: listing.unit,
      requestedQuantity: reqQty,
      proposedPrice: propPrice,
      totalProposedAmount: reqQty * propPrice,
      message: req.body.message || 'We are interested in purchasing this material for our site.',
      preferredPickupDate: req.body.preferredPickupDate || 'Within 3 days',
      contactPreference: req.body.contactPreference || 'Phone',
      status: 'Pending',
      buyerProfileId: req.body.buyerProfileId || 'prof-2',
      buyerProfile: req.body.buyerProfile || {
        name: 'Suresh Deshmukh',
        companyName: 'Sunrise Residency Site',
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
      }
    });

    const savedInquiry = await inquiry.save();

    // Create initial timeline message
    await MarketplaceMessage.create({
      id: `msg-${Date.now()}`,
      inquiryId: savedInquiry.id,
      senderProfileId: savedInquiry.buyerProfileId,
      senderName: savedInquiry.buyerProfile.name,
      senderRole: 'buyer',
      text: savedInquiry.message || `Inquiry submitted for ${reqQty} ${listing.unit} at ₹${propPrice}/${listing.unit}.`,
      type: 'message'
    });

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${savedInquiry.buyerProfile.name} submitted inquiry for ${listing.title} (${reqQty} ${listing.unit})`,
      type: 'marketplace',
      statusClass: 'info'
    });

    res.status(201).json(savedInquiry);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create inquiry', details: err.message });
  }
});

// POST respond to inquiry (Accept / Counter / Reject)
router.post('/inquiries/:id/respond', async (req, res) => {
  try {
    const { action, counterQuantity, counterPrice, message } = req.body;
    const inquiry = await MarketplaceInquiry.findOne({ id: req.params.id });
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    const listing = await MarketplaceListing.findOne({ id: inquiry.listingId });
    if (!listing) return res.status(404).json({ error: 'Listing not found for this inquiry' });

    let createdOrder = null;

    if (action === 'accept') {
      // Stock reservation check
      const agreedQty = inquiry.counterOffer?.quantity || inquiry.requestedQuantity;
      const agreedPrice = inquiry.counterOffer?.price || inquiry.proposedPrice;

      if (agreedQty > listing.availableQuantity) {
        return res.status(400).json({
          error: `Cannot accept offer. Remaining available quantity (${listing.availableQuantity}) is less than agreed quantity (${agreedQty}).`
        });
      }

      // Update listing stock & reservation
      listing.reservedQuantity = (listing.reservedQuantity || 0) + agreedQty;
      listing.availableQuantity = Math.max(0, listing.availableQuantity - agreedQty);
      if (listing.availableQuantity === 0) {
        listing.status = 'Reserved';
      }
      await listing.save();

      // Update inquiry status
      inquiry.status = 'Accepted';
      await inquiry.save();

      // Add Acceptance Message
      await MarketplaceMessage.create({
        id: `msg-${Date.now()}`,
        inquiryId: inquiry.id,
        senderProfileId: inquiry.sellerProfileId,
        senderName: inquiry.sellerProfile.name,
        senderRole: 'seller',
        text: message || `Offer accepted for ${agreedQty} ${listing.unit} at ₹${agreedPrice}/${listing.unit}. Quantity reserved!`,
        type: 'offer_accepted'
      });

      // Auto-generate Marketplace Order
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `BW-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = agreedQty * agreedPrice;

      createdOrder = new MarketplaceOrder({
        id: orderId,
        orderNumber,
        listingId: listing.id,
        inquiryId: inquiry.id,
        materialName: listing.title,
        category: listing.category,
        quantity: agreedQty,
        unit: listing.unit,
        unitPrice: agreedPrice,
        totalAmount,
        pickupLocation: listing.location,
        city: listing.city,
        scheduledPickupDate: inquiry.preferredPickupDate || 'Next 48 Hours',
        orderStatus: 'Confirmed',
        paymentStatus: 'Paid',
        buyerProfile: {
          id: inquiry.buyerProfileId,
          name: inquiry.buyerProfile.name,
          companyName: inquiry.buyerProfile.companyName,
          phone: inquiry.buyerProfile.phone,
          email: inquiry.buyerProfile.email,
          city: inquiry.buyerProfile.city,
          isVerified: inquiry.buyerProfile.isVerified
        },
        sellerProfile: {
          id: inquiry.sellerProfileId,
          name: inquiry.sellerProfile.name,
          companyName: inquiry.sellerProfile.companyName,
          phone: inquiry.sellerProfile.phone,
          email: inquiry.sellerProfile.email,
          city: inquiry.sellerProfile.city,
          isVerified: inquiry.sellerProfile.isVerified
        },
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
            timestamp: new Date()
          },
          {
            step: 'Quantity Reserved',
            title: 'Stock Reserved & Order Confirmed',
            note: `Reserved ${agreedQty} ${listing.unit} from listing stock`,
            status: 'completed',
            updatedBy: 'Buildwise System',
            timestamp: new Date()
          },
          {
            step: 'Ready for Pickup',
            title: 'Awaiting Seller Preparation',
            note: 'Seller packing material at site yard',
            status: 'current',
            updatedBy: inquiry.sellerProfile.name,
            timestamp: new Date()
          },
          {
            step: 'Picked Up',
            title: 'Site Transport Handshake',
            note: 'Awaiting buyer pickup vehicle confirmation',
            status: 'pending',
            updatedBy: inquiry.buyerProfile.name,
            timestamp: new Date()
          },
          {
            step: 'Completed',
            title: 'Transaction Closed',
            note: 'Final delivery verification & feedback',
            status: 'pending',
            updatedBy: 'System',
            timestamp: new Date()
          }
        ]
      });

      await createdOrder.save();

      await Activity.create({
        id: `act-${Date.now()}`,
        text: `Order ${orderNumber} confirmed! ${inquiry.sellerProfile.name} reserved ${agreedQty} ${listing.unit} of ${listing.title} for ${inquiry.buyerProfile.name}`,
        type: 'marketplace',
        statusClass: 'success'
      });

    } else if (action === 'counter') {
      const cQty = Number(counterQuantity || inquiry.requestedQuantity);
      const cPrice = Number(counterPrice || inquiry.proposedPrice);

      inquiry.status = 'Countered';
      inquiry.counterOffer = {
        quantity: cQty,
        price: cPrice,
        note: message || 'Seller proposed a revised quantity and price.',
        counteredAt: new Date(),
        counteredBy: 'seller'
      };
      await inquiry.save();

      await MarketplaceMessage.create({
        id: `msg-${Date.now()}`,
        inquiryId: inquiry.id,
        senderProfileId: inquiry.sellerProfileId,
        senderName: inquiry.sellerProfile.name,
        senderRole: 'seller',
        text: message || `Counter-offer proposed: ${cQty} ${listing.unit} at ₹${cPrice}/${listing.unit}.`,
        type: 'counter_offer',
        payload: { quantity: cQty, price: cPrice }
      });

      await Activity.create({
        id: `act-${Date.now()}`,
        text: `${inquiry.sellerProfile.name} sent counter-offer for ${listing.title} (${cQty} ${listing.unit} @ ₹${cPrice})`,
        type: 'marketplace',
        statusClass: 'info'
      });

    } else if (action === 'reject') {
      inquiry.status = 'Rejected';
      await inquiry.save();

      await MarketplaceMessage.create({
        id: `msg-${Date.now()}`,
        inquiryId: inquiry.id,
        senderProfileId: inquiry.sellerProfileId,
        senderName: inquiry.sellerProfile.name,
        senderRole: 'seller',
        text: message || 'Unfortunately, the seller cannot fulfill this request at this time.',
        type: 'offer_rejected'
      });

      await Activity.create({
        id: `act-${Date.now()}`,
        text: `${inquiry.sellerProfile.name} declined inquiry for ${listing.title}`,
        type: 'marketplace',
        statusClass: 'danger'
      });
    }

    res.json({
      message: `Inquiry successfully updated with action: ${action}`,
      inquiry,
      listing,
      order: createdOrder
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to inquiry', details: err.message });
  }
});

// GET messages for inquiry
router.get('/inquiries/:id/messages', async (req, res) => {
  try {
    const messages = await MarketplaceMessage.find({ inquiryId: req.params.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiry messages', details: err.message });
  }
});

// POST message to inquiry timeline
router.post('/inquiries/:id/messages', async (req, res) => {
  try {
    const { text, senderProfileId, senderName, senderRole, type } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text is required' });

    const message = new MarketplaceMessage({
      id: `msg-${Date.now()}`,
      inquiryId: req.params.id,
      senderProfileId: senderProfileId || 'prof-1',
      senderName: senderName || 'User',
      senderRole: senderRole || 'buyer',
      text,
      type: type || 'message',
      payload: req.body.payload || null
    });

    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post message', details: err.message });
  }
});

// ==========================================
// 4. ORDERS & TRACKING
// ==========================================

// GET orders
router.get('/orders', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.query;
    const filter = {};
    if (orderStatus && orderStatus !== 'All') filter.orderStatus = orderStatus;
    if (paymentStatus && paymentStatus !== 'All') filter.paymentStatus = paymentStatus;

    const orders = await MarketplaceOrder.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// GET single order
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await MarketplaceOrder.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order', details: err.message });
  }
});

// PATCH update order lifecycle status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, note, updatedBy } = req.body;
    const order = await MarketplaceOrder.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.orderStatus = status;

    // Add or update timeline step
    const stepTitleMap = {
      'Ready for Pickup': 'Material Ready for Pickup at Site Yard',
      'Picked Up': 'Material Dispatched / Picked Up by Buyer',
      'Completed': 'Transaction Completed & Closed',
      'Cancelled': 'Order Cancelled'
    };

    const newTimelineEvent = {
      step: status,
      title: stepTitleMap[status] || status,
      note: note || `Order updated to ${status}`,
      status: 'completed',
      updatedBy: updatedBy || 'Site Staff',
      timestamp: new Date()
    };

    order.timeline.push(newTimelineEvent);

    // If completed or cancelled, adjust listing state if appropriate
    if (status === 'Completed') {
      const listing = await MarketplaceListing.findOne({ id: order.listingId });
      if (listing) {
        listing.reservedQuantity = Math.max(0, (listing.reservedQuantity || 0) - order.quantity);
        if (listing.availableQuantity === 0 && listing.reservedQuantity === 0) {
          listing.status = 'Sold';
        }
        await listing.save();
      }
    } else if (status === 'Cancelled') {
      const listing = await MarketplaceListing.findOne({ id: order.listingId });
      if (listing) {
        listing.reservedQuantity = Math.max(0, (listing.reservedQuantity || 0) - order.quantity);
        listing.availableQuantity += order.quantity;
        listing.status = 'Available';
        await listing.save();
      }
    }

    const saved = await order.save();

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `Order ${order.orderNumber} status changed to "${status}"`,
      type: 'marketplace',
      statusClass: status === 'Completed' ? 'success' : 'info'
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// ==========================================
// 5. ROLE-AWARE DASHBOARD SUMMARY
// ==========================================

router.get('/dashboard-summary', async (req, res) => {
  try {
    const [listings, inquiries, orders] = await Promise.all([
      MarketplaceListing.find(),
      MarketplaceInquiry.find(),
      MarketplaceOrder.find()
    ]);

    const activeListings = listings.filter(l => l.status === 'Available');
    const totalListedValue = activeListings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
    const reservedItemsCount = listings.filter(l => (l.reservedQuantity || 0) > 0).length;
    const ordersAwaitingPickup = orders.filter(o => o.orderStatus === 'Ready for Pickup').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Completed');
    const completedSalesValue = completedOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const counterOffersCount = inquiries.filter(i => i.status === 'Countered').length;
    const confirmedOrdersCount = orders.filter(o => ['Confirmed', 'Ready for Pickup'].includes(o.orderStatus)).length;
    const totalEstimatedSavings = Math.round(completedSalesValue * 0.38); // 38% surplus market discount average

    res.json({
      sellerMetrics: {
        activeListingsCount: activeListings.length,
        totalListedValue,
        pendingInquiries,
        reservedItemsCount,
        ordersAwaitingPickup,
        completedSalesCount: completedOrders.length,
        completedSalesValue
      },
      buyerMetrics: {
        activeInquiriesCount: inquiries.filter(i => ['Pending', 'Countered'].includes(i.status)).length,
        counterOffersCount,
        confirmedOrdersCount,
        completedPurchasesCount: completedOrders.length,
        totalEstimatedSavings
      },
      recentOrders: orders.slice(0, 5),
      recentInquiries: inquiries.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate dashboard summary', details: err.message });
  }
});

export default router;
