import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Site } from './models/Site.js';
import { Material } from './models/Material.js';
import { Leftover } from './models/Leftover.js';
import { MarketplaceListing } from './models/MarketplaceListing.js';
import { MarketplaceProfile } from './models/MarketplaceProfile.js';
import { MarketplaceInquiry } from './models/MarketplaceInquiry.js';
import { MarketplaceMessage } from './models/MarketplaceMessage.js';
import { MarketplaceOrder } from './models/MarketplaceOrder.js';
import { Worker } from './models/Worker.js';
import { Task } from './models/Task.js';
import { AttendanceLog } from './models/AttendanceLog.js';
import { Activity } from './models/Activity.js';
import { User } from './models/User.js';
import { AuditLog } from './models/AuditLog.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildwise';

export const seedUsers = [
  {
    id: 'user-builder-1',
    name: 'Rajesh Sharma',
    email: 'builder@buildwise.in',
    password: bcrypt.hashSync('Buildwise@2026', 10),
    role: 'builder',
    assignedSiteIds: ['site-1', 'site-2', 'site-3'],
    assignedProjectIds: ['proj-1', 'proj-2'],
    phone: '+91 98220 11223',
    company: 'Apex Infra & Developers',
    status: 'Active'
  },
  {
    id: 'user-manager-1',
    name: 'Suresh Deshmukh',
    email: 'manager@buildwise.in',
    password: bcrypt.hashSync('Buildwise@2026', 10),
    role: 'manager',
    assignedSiteIds: ['site-1'],
    assignedProjectIds: ['proj-1'],
    phone: '+91 98221 44556',
    company: 'Apex Infra & Developers',
    status: 'Active'
  },
  {
    id: 'user-worker-1',
    name: 'Amit Patil',
    email: 'worker@buildwise.in',
    password: bcrypt.hashSync('Buildwise@2026', 10),
    role: 'worker',
    workerId: 'w-1',
    assignedSiteIds: ['site-1'],
    phone: '+91 98224 55667',
    status: 'Active'
  }
];

export const seedSites = [
  {
    id: 'site-1',
    name: 'Sunrise Residency',
    subName: 'Tower A & B (18 Floors)',
    location: 'Nashik Road, Nashik',
    supervisor: 'Suresh Deshmukh (Site Eng.)',
    status: 'Active',
    progress: 68,
    workerCount: 24,
    totalBudget: '₹3.80 Cr',
    spent: '₹2.58 Cr',
    health: 'Good',
    alertCount: 1,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'site-2',
    name: 'Green Valley Hub',
    subName: 'Commercial Office Park',
    location: 'Hinjewadi Phase 1, Pune',
    supervisor: 'Kiran Salunkhe (Site Eng.)',
    status: 'Active',
    progress: 42,
    workerCount: 18,
    totalBudget: '₹6.20 Cr',
    spent: '₹2.60 Cr',
    health: 'Good',
    alertCount: 0,
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'site-3',
    name: 'Metro Line Depot',
    subName: 'Maintenance Hub Phase 2',
    location: 'Andheri East, Mumbai',
    supervisor: 'Vikram Rathi (Sr. Eng.)',
    status: 'Active',
    progress: 85,
    workerCount: 32,
    totalBudget: '₹12.50 Cr',
    spent: '₹10.60 Cr',
    health: 'Critical',
    alertCount: 2,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80'
  }
];

export const seedMaterials = [
  {
    id: 'mat-1',
    name: 'Ultratech Cement (PPC)',
    category: 'Cement',
    purchased: 500,
    used: 420,
    remaining: 80,
    unit: 'Bags',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    status: 'Low Stock',
    threshold: 100,
    required: 70,
    condition: 'Good',
    costPerUnit: 390,
    lastUpdated: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'mat-2',
    name: 'TMT 550D Steel Rebars 16mm',
    category: 'Steel',
    purchased: 20,
    used: 14.5,
    remaining: 5.5,
    unit: 'Tons',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    status: 'In Stock',
    threshold: 3,
    required: 4,
    condition: 'Like New',
    costPerUnit: 58000,
    lastUpdated: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'mat-3',
    name: 'Vitrified Floor Tiles 600x600',
    category: 'Tiles',
    purchased: 1200,
    used: 1120,
    remaining: 80,
    unit: 'Boxes',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    status: 'Low Stock',
    threshold: 100,
    required: 60,
    condition: 'Brand New',
    costPerUnit: 750,
    lastUpdated: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'mat-4',
    name: 'Finolex CPVC Pipes 1" (Schedule 40)',
    category: 'Plumbing',
    purchased: 300,
    used: 180,
    remaining: 120,
    unit: 'Lengths',
    siteId: 'site-2',
    siteName: 'Green Valley Hub',
    status: 'In Stock',
    threshold: 50,
    required: 100,
    condition: 'Good',
    costPerUnit: 420,
    lastUpdated: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'mat-5',
    name: 'Polycab Copper Cable 4 sq.mm',
    category: 'Electrical',
    purchased: 1500,
    used: 1350,
    remaining: 150,
    unit: 'Meters',
    siteId: 'site-3',
    siteName: 'Metro Line Depot',
    status: 'In Stock',
    threshold: 100,
    required: 120,
    condition: 'Brand New',
    costPerUnit: 85,
    lastUpdated: '1 day ago',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'mat-6',
    name: 'River Sand (Grade A)',
    category: 'Aggregates',
    purchased: 40,
    used: 38,
    remaining: 2,
    unit: 'Brass',
    siteId: 'site-2',
    siteName: 'Green Valley Hub',
    status: 'Low Stock',
    threshold: 5,
    required: 1,
    condition: 'Good',
    costPerUnit: 8200,
    lastUpdated: 'Today, 8:30 AM',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60'
  }
];

export const seedLeftovers = [
  {
    id: 'left-1',
    materialId: 'mat-3',
    title: 'Ceramic Floor Tiles',
    quantity: '250 pieces',
    estimatedValue: 4500,
    site: 'Sunrise Residency',
    condition: 'Unused / Surplus',
    category: 'Tiles',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60',
    description: 'Surplus boxes from Tower A lobby flooring. Completely intact in original packaging.'
  },
  {
    id: 'left-2',
    materialId: 'mat-2',
    title: 'TMT Steel Offcuts (12mm)',
    quantity: '1.2 Tons',
    estimatedValue: 62000,
    site: 'Metro Line Depot',
    condition: 'Clean Offcuts',
    category: 'Steel',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60',
    description: 'Leftover rebars from pier cage fabrication. Lengths 2.5m to 4m, rust-free.'
  },
  {
    id: 'left-3',
    materialId: null,
    title: 'Teak Wood Door Frames',
    quantity: '8 pieces',
    estimatedValue: 16000,
    site: 'Sunrise Residency',
    condition: 'Pristine / Uninstalled',
    category: 'Carpentry',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
    description: 'Standard 7ft x 3.5ft seasoned CP Teakwood frames with primer coat.'
  },
  {
    id: 'left-4',
    materialId: 'mat-4',
    title: 'CPVC Fittings & Elbows',
    quantity: '45 pieces',
    estimatedValue: 3200,
    site: 'Green Valley Hub',
    condition: 'Unopened Surplus',
    category: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    description: 'Astral Heavy Duty 1.5" brass threaded elbows and tees in factory packaging.'
  }
];

// ==========================================
// 8+ REALISTIC BUYER & SELLER PROFILES
// ==========================================
export const seedMarketplaceProfiles = [
  {
    id: 'prof-1',
    name: 'Rajesh Sharma',
    companyName: 'Buildwise Infra Ltd.',
    role: 'builder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98220 12345',
    email: 'rajesh@buildwise.in',
    city: 'Nashik',
    rating: 4.9,
    completedTransactions: 34,
    isVerified: true,
    organizationId: 'org-1',
    siteId: 'site-1',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'prof-2',
    name: 'Suresh Deshmukh',
    companyName: 'Sunrise Residency Site',
    role: 'engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 44321',
    email: 'suresh@sunriseinfra.in',
    city: 'Nashik',
    rating: 4.8,
    completedTransactions: 19,
    isVerified: true,
    organizationId: 'org-1',
    siteId: 'site-1',
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'prof-3',
    name: 'Vikram Rathi',
    companyName: 'Metro Infra JV',
    role: 'builder',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98901 88765',
    email: 'vikram@metroinfra.in',
    city: 'Mumbai',
    rating: 4.8,
    completedTransactions: 52,
    isVerified: true,
    organizationId: 'org-2',
    siteId: 'site-3',
    createdAt: new Date('2023-11-20')
  },
  {
    id: 'prof-4',
    name: 'Kiran Salunkhe',
    companyName: 'Green Valley Hub Developers',
    role: 'engineer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+91 97654 33210',
    email: 'kiran@greenvalley.co.in',
    city: 'Pune',
    rating: 4.7,
    completedTransactions: 23,
    isVerified: true,
    organizationId: 'org-3',
    siteId: 'site-2',
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'prof-5',
    name: 'Priya Shah',
    companyName: 'Apex Construction & Formworks',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98233 44556',
    email: 'priya@apexbuilders.in',
    city: 'Pune',
    rating: 4.9,
    completedTransactions: 41,
    isVerified: true,
    organizationId: 'org-4',
    siteId: 'site-2',
    createdAt: new Date('2023-09-12')
  },
  {
    id: 'prof-6',
    name: 'Sunil Patil',
    companyName: 'Deccan Electro-Power Systems',
    role: 'supplier',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98451 99887',
    email: 'sunil@deccanelectro.com',
    city: 'Bangalore',
    rating: 4.8,
    completedTransactions: 28,
    isVerified: true,
    organizationId: 'org-5',
    siteId: 'site-3',
    createdAt: new Date('2024-01-28')
  },
  {
    id: 'prof-7',
    name: 'Manish Chawla',
    companyName: 'Cityline Plumbing & Sanitary Ltd.',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98200 66554',
    email: 'manish@citylineinfra.in',
    city: 'Mumbai',
    rating: 4.6,
    completedTransactions: 15,
    isVerified: true,
    organizationId: 'org-6',
    siteId: 'site-3',
    createdAt: new Date('2024-04-05')
  },
  {
    id: 'prof-8',
    name: 'Anand Kulkarni',
    companyName: 'Sahyadri Cement & ReadyMix',
    role: 'supplier',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98211 44332',
    email: 'anand@sahyadricement.in',
    city: 'Nashik',
    rating: 5.0,
    completedTransactions: 60,
    isVerified: true,
    organizationId: 'org-7',
    siteId: 'site-1',
    createdAt: new Date('2023-08-19')
  }
];

// ==========================================
// 12+ ENRICHED MARKETPLACE LISTINGS
// ==========================================
export const seedMarketplace = [
  {
    id: 'mkt-1',
    title: 'Vitrified Ceramic Floor Tiles 600x600',
    materialName: 'Vitrified Ceramic Floor Tiles 600x600',
    category: 'Tiles',
    totalQuantity: 250,
    availableQuantity: 150,
    reservedQuantity: 100, // partially reserved
    unit: 'boxes',
    quantity: '250 boxes (1,000 sq.ft)',
    price: 650,
    totalPrice: 162500,
    location: 'Sunrise Residency, Nashik Road',
    city: 'Nashik',
    condition: 'Unused / Mint',
    status: 'Available',
    availableUntil: '25 Days',
    description: 'Surplus double-charged vitrified floor tiles from Tower A lobby. High gloss finish, factory packed.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60',
    seller: 'Rajesh Infra Projects',
    sellerProfileId: 'prof-1',
    sellerProfile: {
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      email: 'rajesh@buildwise.in',
      city: 'Nashik',
      rating: 4.9,
      completedTransactions: 34,
      isVerified: true
    },
    sellerRating: 4.9,
    postedTime: '10 mins ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-2',
    title: 'Fe 550D TMT Rebar Offcuts 16mm & 12mm',
    materialName: 'TMT 550D Steel Rebars',
    category: 'Steel',
    totalQuantity: 1200,
    availableQuantity: 400,
    reservedQuantity: 800, // partially reserved
    unit: 'kg',
    quantity: '1,200 kg (lengths 2.8m - 4.5m)',
    price: 48,
    totalPrice: 57600,
    location: 'Metro Line Pier Yard, Andheri East',
    city: 'Mumbai',
    condition: 'Clean Surplus',
    status: 'Available',
    availableUntil: '15 Days',
    description: 'Freshly cut structural rebars from pier reinforcement. Rust-free, tested grade Fe 550D with test certificates.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60',
    seller: 'Metro Infra JV',
    sellerProfileId: 'prof-3',
    sellerProfile: {
      name: 'Vikram Rathi',
      companyName: 'Metro Infra JV',
      phone: '+91 98901 88765',
      email: 'vikram@metroinfra.in',
      city: 'Mumbai',
      rating: 4.8,
      completedTransactions: 52,
      isVerified: true
    },
    sellerRating: 4.8,
    postedTime: '2 hours ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-3',
    title: 'Teak Wood Solid Door Frames (7x3.5ft)',
    materialName: 'Seasoned CP Teak Frames',
    category: 'Carpentry',
    totalQuantity: 8,
    availableQuantity: 8,
    reservedQuantity: 0,
    unit: 'pieces',
    quantity: '8 pieces',
    price: 1950,
    totalPrice: 15600,
    location: 'Indira Nagar Site Depot, Nashik',
    city: 'Nashik',
    condition: 'Brand New',
    status: 'Available',
    availableUntil: '20 Days',
    description: 'Pre-seasoned CP Teak door frames with red oxide primer. Standard 5"x2.5" rebate section.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
    seller: 'Sunrise Developers',
    sellerProfileId: 'prof-2',
    sellerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      email: 'suresh@sunriseinfra.in',
      city: 'Nashik',
      rating: 4.8,
      completedTransactions: 19,
      isVerified: true
    },
    sellerRating: 5.0,
    postedTime: '5 hours ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-4',
    title: 'Heavy Duty Film-Faced Shuttering Plywood 18mm',
    materialName: '18mm Marine Shuttering Plywood',
    category: 'Wood & Formwork',
    totalQuantity: 40,
    availableQuantity: 0,
    reservedQuantity: 40, // fully reserved
    unit: 'sheets',
    quantity: '40 sheets (8x4 ft)',
    price: 850,
    totalPrice: 34000,
    location: 'Green Valley Hub, Hinjewadi Phase 1',
    city: 'Pune',
    condition: '1-time Used (Good)',
    status: 'Reserved',
    availableUntil: '10 Days',
    description: '1-time cast column shuttering sheets. Edges sealed with acrylic sealant. Mirror finish concrete surface yield.',
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&auto=format&fit=crop&q=60',
    seller: 'Apex Construction',
    sellerProfileId: 'prof-5',
    sellerProfile: {
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      email: 'priya@apexbuilders.in',
      city: 'Pune',
      rating: 4.9,
      completedTransactions: 41,
      isVerified: true
    },
    sellerRating: 4.7,
    postedTime: '1 day ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-5',
    title: 'Polycab FRLS Copper Cable 4 sq.mm (Single Core)',
    materialName: 'Polycab 4 sq.mm FRLS Wire',
    category: 'Electrical',
    totalQuantity: 6,
    availableQuantity: 6,
    reservedQuantity: 0,
    unit: 'coils',
    quantity: '6 Coils (90m each)',
    price: 1400,
    totalPrice: 8400,
    location: 'Electronic City Phase 2, Bangalore',
    city: 'Bangalore',
    condition: 'Brand New In Box',
    status: 'Available',
    availableUntil: '40 Days',
    description: 'Unopened factory sealed coils in Red and Black. ISI marked, Flame Retardant Low Smoke (FRLS).',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    seller: 'Volt Electricals',
    sellerProfileId: 'prof-6',
    sellerProfile: {
      name: 'Sunil Patil',
      companyName: 'Deccan Electro-Power Systems',
      phone: '+91 98451 99887',
      email: 'sunil@deccanelectro.com',
      city: 'Bangalore',
      rating: 4.8,
      completedTransactions: 28,
      isVerified: true
    },
    sellerRating: 4.9,
    postedTime: '1 day ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-6',
    title: 'Astral Heavy Duty CPVC Pipes 1.5" (Schedule 80)',
    materialName: 'Astral Schedule 80 CPVC Pipes',
    category: 'Plumbing',
    totalQuantity: 35,
    availableQuantity: 15,
    reservedQuantity: 20,
    unit: 'lengths',
    quantity: '35 lengths (3m each)',
    price: 360,
    totalPrice: 12600,
    location: 'Baner High Street Site, Pune',
    city: 'Pune',
    condition: 'Unused / Surplus',
    status: 'Available',
    availableUntil: '30 Days',
    description: 'High temperature hot & cold water plumbing lines. Solvent cement compatible, pristine condition.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    seller: 'Cityline Homes',
    sellerProfileId: 'prof-7',
    sellerProfile: {
      name: 'Manish Chawla',
      companyName: 'Cityline Plumbing & Sanitary Ltd.',
      phone: '+91 98200 66554',
      email: 'manish@citylineinfra.in',
      city: 'Mumbai',
      rating: 4.6,
      completedTransactions: 15,
      isVerified: true
    },
    sellerRating: 4.8,
    postedTime: '2 days ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-7',
    title: 'Ultratech 53-Grade OPC Cement',
    materialName: 'Ultratech OPC 53 Grade',
    category: 'Cement',
    totalQuantity: 100,
    availableQuantity: 0,
    reservedQuantity: 0,
    unit: 'bags',
    quantity: '100 bags',
    price: 375,
    totalPrice: 37500,
    location: 'MIDC Ambad Yard, Nashik',
    city: 'Nashik',
    condition: 'Fresh Stock',
    status: 'Sold', // Sold demo
    availableUntil: 'Sold',
    description: 'Fresh batch less than 15 days from packing date. Moisture-controlled warehouse storage.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60',
    seller: 'Sahyadri Cement & ReadyMix',
    sellerProfileId: 'prof-8',
    sellerProfile: {
      name: 'Anand Kulkarni',
      companyName: 'Sahyadri Cement & ReadyMix',
      phone: '+91 98211 44332',
      email: 'anand@sahyadricement.in',
      city: 'Nashik',
      rating: 5.0,
      completedTransactions: 60,
      isVerified: true
    },
    sellerRating: 5.0,
    postedTime: '3 days ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-8',
    title: 'Washable Red Clay Kiln Bricks (Class 1)',
    materialName: 'Standard Red Burnt Bricks',
    category: 'Bricks & Blocks',
    totalQuantity: 4000,
    availableQuantity: 4000,
    reservedQuantity: 0,
    unit: 'pieces',
    quantity: '4,000 pieces (1 truckload)',
    price: 9.5,
    totalPrice: 38000,
    location: 'Dindori Road Brick Yard, Nashik',
    city: 'Nashik',
    condition: 'Brand New',
    status: 'Available',
    availableUntil: '14 Days',
    description: 'Uniform size 9"x4"x3", compressive strength > 10.5 N/mm². Clean edges, low efflorescence.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=60',
    seller: 'Rajesh Infra Projects',
    sellerProfileId: 'prof-1',
    sellerProfile: {
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      city: 'Nashik',
      rating: 4.9,
      isVerified: true
    },
    sellerRating: 4.9,
    postedTime: '4 days ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-9',
    title: 'Asian Paints Apex Ultima Exterior Emulsion',
    materialName: 'Apex Ultima White Emulsion',
    category: 'Paint & Finishes',
    totalQuantity: 12,
    availableQuantity: 12,
    reservedQuantity: 0,
    unit: 'buckets',
    quantity: '12 Buckets (20L each)',
    price: 4600,
    totalPrice: 55200,
    location: 'Viman Nagar Site Store, Pune',
    city: 'Pune',
    condition: 'Unopened / Sealed',
    status: 'Available',
    availableUntil: '45 Days',
    description: 'High performance exterior weather guard paint with anti-algae silicone additives. Brilliant White base.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60',
    seller: 'Apex Construction',
    sellerProfileId: 'prof-5',
    sellerProfile: {
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      city: 'Pune',
      rating: 4.9,
      isVerified: true
    },
    sellerRating: 4.8,
    postedTime: '5 days ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-10',
    title: 'Washed River Sand (Zone II Screened)',
    materialName: 'Zone II River Sand',
    category: 'Aggregates',
    totalQuantity: 8,
    availableQuantity: 8,
    reservedQuantity: 0,
    unit: 'brass',
    quantity: '8 Brass (approx. 24 tons)',
    price: 7800,
    totalPrice: 62400,
    location: 'Nashik Road Depot, Nashik',
    city: 'Nashik',
    condition: 'Good Quality',
    status: 'Available',
    availableUntil: '12 Days',
    description: 'Triple washed river sand ideal for structural plaster and slab concreting. Silt content under 3%.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60',
    seller: 'Sunrise Developers',
    sellerProfileId: 'prof-2',
    sellerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      city: 'Nashik',
      rating: 4.8,
      isVerified: true
    },
    sellerRating: 4.7,
    postedTime: '6 days ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-11',
    title: 'Schneider Acti9 32A Triple Pole MCBs',
    materialName: 'Schneider 32A TP MCB',
    category: 'Electrical',
    totalQuantity: 24,
    availableQuantity: 24,
    reservedQuantity: 0,
    unit: 'pieces',
    quantity: '24 pieces',
    price: 490,
    totalPrice: 11760,
    location: 'Andheri East Logistics, Mumbai',
    city: 'Mumbai',
    condition: 'Brand New In Box',
    status: 'Available',
    availableUntil: '60 Days',
    description: 'C-Curve 10kA breaking capacity miniature circuit breakers for distribution boards. Factory sealed cartons.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    seller: 'Volt Electricals',
    sellerProfileId: 'prof-6',
    sellerProfile: {
      name: 'Sunil Patil',
      companyName: 'Deccan Electro-Power Systems',
      phone: '+91 98451 99887',
      city: 'Bangalore',
      rating: 4.8,
      isVerified: true
    },
    sellerRating: 4.9,
    postedTime: '1 week ago',
    verifiedSeller: true
  },
  {
    id: 'mkt-12',
    title: 'Stainless Steel SS 304 Balcony Railing Pipes',
    materialName: 'SS 304 Railing Tubes 50mm',
    category: 'Hardware',
    totalQuantity: 18,
    availableQuantity: 18,
    reservedQuantity: 0,
    unit: 'lengths',
    quantity: '18 lengths (6m each)',
    price: 1850,
    totalPrice: 33300,
    location: 'Kothrud Construction Yard, Pune',
    city: 'Pune',
    condition: 'Clean Surplus',
    status: 'Available',
    availableUntil: '30 Days',
    description: 'Mirror polished 16-gauge grade 304 austenitic stainless steel seamless pipes. Wrapped in protective foil.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60',
    seller: 'Cityline Homes',
    sellerProfileId: 'prof-7',
    sellerProfile: {
      name: 'Manish Chawla',
      companyName: 'Cityline Plumbing & Sanitary Ltd.',
      phone: '+91 98200 66554',
      city: 'Mumbai',
      rating: 4.6,
      isVerified: true
    },
    sellerRating: 4.8,
    postedTime: '1 week ago',
    verifiedSeller: true
  }
];

// ==========================================
// 10+ SEEDED INQUIRIES ACROSS VARIOUS STATUSES
// ==========================================
export const seedMarketplaceInquiries = [
  {
    id: 'inq-101',
    listingId: 'mkt-1',
    listingTitle: 'Vitrified Ceramic Floor Tiles 600x600',
    unit: 'boxes',
    requestedQuantity: 100,
    proposedPrice: 620,
    totalProposedAmount: 62000,
    message: 'Can pick up tomorrow morning with our Tata Ace vehicle from Sunrise Residency. Please confirm if ₹620/box is acceptable.',
    preferredPickupDate: 'Tomorrow 10:00 AM',
    contactPreference: 'Phone',
    status: 'Accepted',
    buyerProfileId: 'prof-2',
    buyerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      email: 'suresh@sunriseinfra.in',
      city: 'Nashik',
      rating: 4.8,
      isVerified: true
    },
    sellerProfileId: 'prof-1',
    sellerProfile: {
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      email: 'rajesh@buildwise.in',
      city: 'Nashik',
      rating: 4.9,
      isVerified: true
    },
    createdAt: new Date('2024-04-10T09:30:00Z')
  },
  {
    id: 'inq-102',
    listingId: 'mkt-2',
    listingTitle: 'Fe 550D TMT Rebar Offcuts 16mm & 12mm',
    unit: 'kg',
    requestedQuantity: 800,
    proposedPrice: 45,
    totalProposedAmount: 36000,
    message: 'Urgent requirement for basement retaining wall stirrups. Can collect today afternoon.',
    preferredPickupDate: 'Today 2:00 PM',
    contactPreference: 'Phone',
    status: 'Countered',
    counterOffer: {
      quantity: 800,
      price: 47,
      note: 'Rebars are rust-free and tested grade. ₹47/kg is our lowest clearance rate.',
      counteredAt: new Date('2024-04-11T11:00:00Z'),
      counteredBy: 'seller'
    },
    buyerProfileId: 'prof-4',
    buyerProfile: {
      name: 'Kiran Salunkhe',
      companyName: 'Green Valley Hub Developers',
      phone: '+91 97654 33210',
      email: 'kiran@greenvalley.co.in',
      city: 'Pune',
      rating: 4.7,
      isVerified: true
    },
    sellerProfileId: 'prof-3',
    sellerProfile: {
      name: 'Vikram Rathi',
      companyName: 'Metro Infra JV',
      phone: '+91 98901 88765',
      email: 'vikram@metroinfra.in',
      city: 'Mumbai',
      rating: 4.8,
      isVerified: true
    },
    createdAt: new Date('2024-04-11T08:15:00Z')
  },
  {
    id: 'inq-103',
    listingId: 'mkt-4',
    listingTitle: 'Heavy Duty Film-Faced Shuttering Plywood 18mm',
    unit: 'sheets',
    requestedQuantity: 40,
    proposedPrice: 800,
    totalProposedAmount: 32000,
    message: 'Need the entire lot of 40 sheets for slab casting on Thursday.',
    preferredPickupDate: 'Thursday Morning',
    contactPreference: 'WhatsApp',
    status: 'Accepted',
    buyerProfileId: 'prof-1',
    buyerProfile: {
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      city: 'Nashik',
      rating: 4.9,
      isVerified: true
    },
    sellerProfileId: 'prof-5',
    sellerProfile: {
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      city: 'Pune',
      rating: 4.9,
      isVerified: true
    },
    createdAt: new Date('2024-04-09T14:20:00Z')
  },
  {
    id: 'inq-104',
    listingId: 'mkt-6',
    listingTitle: 'Astral Heavy Duty CPVC Pipes 1.5" (Schedule 80)',
    unit: 'lengths',
    requestedQuantity: 20,
    proposedPrice: 330,
    totalProposedAmount: 6600,
    message: 'Hi, are the pipes still with factory end caps intact? Offering ₹330/length.',
    preferredPickupDate: 'This Friday',
    contactPreference: 'In-App',
    status: 'Pending',
    buyerProfileId: 'prof-2',
    buyerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      city: 'Nashik',
      rating: 4.8,
      isVerified: true
    },
    sellerProfileId: 'prof-7',
    sellerProfile: {
      name: 'Manish Chawla',
      companyName: 'Cityline Plumbing & Sanitary Ltd.',
      phone: '+91 98200 66554',
      city: 'Mumbai',
      rating: 4.6,
      isVerified: true
    },
    createdAt: new Date('2024-04-12T10:00:00Z')
  },
  {
    id: 'inq-105',
    listingId: 'mkt-3',
    listingTitle: 'Teak Wood Solid Door Frames (7x3.5ft)',
    unit: 'pieces',
    requestedQuantity: 4,
    proposedPrice: 1500,
    totalProposedAmount: 6000,
    message: 'Would you consider ₹1,500/piece if we take 4 frames today?',
    preferredPickupDate: 'Immediate',
    contactPreference: 'Phone',
    status: 'Rejected',
    buyerProfileId: 'prof-4',
    buyerProfile: {
      name: 'Kiran Salunkhe',
      companyName: 'Green Valley Hub Developers',
      phone: '+91 97654 33210',
      city: 'Pune',
      rating: 4.7,
      isVerified: true
    },
    sellerProfileId: 'prof-2',
    sellerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      city: 'Nashik',
      rating: 4.8,
      isVerified: true
    },
    createdAt: new Date('2024-04-08T16:45:00Z')
  },
  {
    id: 'inq-106',
    listingId: 'mkt-5',
    listingTitle: 'Polycab FRLS Copper Cable 4 sq.mm (Single Core)',
    unit: 'coils',
    requestedQuantity: 6,
    proposedPrice: 1300,
    totalProposedAmount: 7800,
    message: 'Can take all 6 coils for Bangalore sub-station wiring. Let us know.',
    preferredPickupDate: 'Saturday',
    contactPreference: 'WhatsApp',
    status: 'Pending',
    buyerProfileId: 'prof-3',
    buyerProfile: {
      name: 'Vikram Rathi',
      companyName: 'Metro Infra JV',
      phone: '+91 98901 88765',
      city: 'Mumbai',
      rating: 4.8,
      isVerified: true
    },
    sellerProfileId: 'prof-6',
    sellerProfile: {
      name: 'Sunil Patil',
      companyName: 'Deccan Electro-Power Systems',
      phone: '+91 98451 99887',
      city: 'Bangalore',
      rating: 4.8,
      isVerified: true
    },
    createdAt: new Date('2024-04-12T15:30:00Z')
  },
  {
    id: 'inq-107',
    listingId: 'mkt-8',
    listingTitle: 'Washable Red Clay Kiln Bricks (Class 1)',
    unit: 'pieces',
    requestedQuantity: 2000,
    proposedPrice: 9.0,
    totalProposedAmount: 18000,
    message: 'Can send our open tipper truck tomorrow afternoon.',
    preferredPickupDate: 'Tomorrow 3 PM',
    contactPreference: 'Phone',
    status: 'Countered',
    counterOffer: {
      quantity: 2000,
      price: 9.2,
      note: 'Best price for 2,000 bricks is ₹9.20/brick with loading assistance included.',
      counteredAt: new Date('2024-04-11T16:00:00Z'),
      counteredBy: 'seller'
    },
    buyerProfileId: 'prof-2',
    buyerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      city: 'Nashik',
      rating: 4.8,
      isVerified: true
    },
    sellerProfileId: 'prof-1',
    sellerProfile: {
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      city: 'Nashik',
      rating: 4.9,
      isVerified: true
    },
    createdAt: new Date('2024-04-11T12:00:00Z')
  },
  {
    id: 'inq-108',
    listingId: 'mkt-9',
    listingTitle: 'Asian Paints Apex Ultima Exterior Emulsion',
    unit: 'buckets',
    requestedQuantity: 8,
    proposedPrice: 4300,
    totalProposedAmount: 34400,
    message: 'Looking for 8 buckets for building exterior touch-up.',
    preferredPickupDate: 'Next Monday',
    contactPreference: 'Email',
    status: 'Pending',
    buyerProfileId: 'prof-7',
    buyerProfile: {
      name: 'Manish Chawla',
      companyName: 'Cityline Plumbing & Sanitary Ltd.',
      phone: '+91 98200 66554',
      city: 'Mumbai',
      rating: 4.6,
      isVerified: true
    },
    sellerProfileId: 'prof-5',
    sellerProfile: {
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      city: 'Pune',
      rating: 4.9,
      isVerified: true
    },
    createdAt: new Date('2024-04-12T11:20:00Z')
  },
  {
    id: 'inq-109',
    listingId: 'mkt-10',
    listingTitle: 'Washed River Sand (Zone II Screened)',
    unit: 'brass',
    requestedQuantity: 4,
    proposedPrice: 7500,
    totalProposedAmount: 30000,
    message: 'Need 4 brass delivered or for direct tipper loading.',
    preferredPickupDate: 'Tomorrow Morning',
    contactPreference: 'Phone',
    status: 'Cancelled',
    buyerProfileId: 'prof-5',
    buyerProfile: {
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      city: 'Pune',
      rating: 4.9,
      isVerified: true
    },
    sellerProfileId: 'prof-2',
    sellerProfile: {
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      city: 'Nashik',
      rating: 4.8,
      isVerified: true
    },
    createdAt: new Date('2024-04-07T09:10:00Z')
  },
  {
    id: 'inq-110',
    listingId: 'mkt-11',
    listingTitle: 'Schneider Acti9 32A Triple Pole MCBs',
    unit: 'pieces',
    requestedQuantity: 24,
    proposedPrice: 470,
    totalProposedAmount: 11280,
    message: 'We will take all 24 MCBs. Can collect via Dunzo/courier.',
    preferredPickupDate: 'Immediate Dispatch',
    contactPreference: 'WhatsApp',
    status: 'Accepted',
    buyerProfileId: 'prof-1',
    buyerProfile: {
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      city: 'Nashik',
      rating: 4.9,
      isVerified: true
    },
    sellerProfileId: 'prof-6',
    sellerProfile: {
      name: 'Sunil Patil',
      companyName: 'Deccan Electro-Power Systems',
      phone: '+91 98451 99887',
      city: 'Bangalore',
      rating: 4.8,
      isVerified: true
    },
    createdAt: new Date('2024-04-10T11:00:00Z')
  }
];

// ==========================================
// 18+ CONVERSATION MESSAGES BETWEEN BUYERS & SELLERS
// ==========================================
export const seedMarketplaceMessages = [
  // Conversation for inq-101
  {
    id: 'msg-1',
    inquiryId: 'inq-101',
    senderProfileId: 'prof-2',
    senderName: 'Suresh Deshmukh',
    senderRole: 'buyer',
    text: 'Hi Rajesh sir, we have a lobby flooring section ready for tiles at Sunrise Tower B. Offering ₹620/box for 100 boxes.',
    type: 'message',
    createdAt: new Date('2024-04-10T09:30:00Z')
  },
  {
    id: 'msg-2',
    inquiryId: 'inq-101',
    senderProfileId: 'prof-1',
    senderName: 'Rajesh Sharma',
    senderRole: 'seller',
    text: 'Hello Suresh, boxes are sealed in original packing from Somany. Can you arrange pickup by tomorrow 11 AM?',
    type: 'message',
    createdAt: new Date('2024-04-10T10:15:00Z')
  },
  {
    id: 'msg-3',
    inquiryId: 'inq-101',
    senderProfileId: 'prof-2',
    senderName: 'Suresh Deshmukh',
    senderRole: 'buyer',
    text: 'Yes sir, our site Mahindra Bolero pickup will reach with two helpers to load.',
    type: 'message',
    createdAt: new Date('2024-04-10T10:30:00Z')
  },
  {
    id: 'msg-4',
    inquiryId: 'inq-101',
    senderProfileId: 'prof-1',
    senderName: 'Rajesh Sharma',
    senderRole: 'seller',
    text: 'Agreed! Accepted your offer for 100 boxes at ₹620/box. Quantity reserved in warehouse.',
    type: 'offer_accepted',
    createdAt: new Date('2024-04-10T10:45:00Z')
  },

  // Conversation for inq-102
  {
    id: 'msg-5',
    inquiryId: 'inq-102',
    senderProfileId: 'prof-4',
    senderName: 'Kiran Salunkhe',
    senderRole: 'buyer',
    text: 'Vikram, we need 800 kg of 16mm rebars for Hinjewadi Phase 1 pier cap stirrups. Offering ₹45/kg.',
    type: 'message',
    createdAt: new Date('2024-04-11T08:15:00Z')
  },
  {
    id: 'msg-6',
    inquiryId: 'inq-102',
    senderProfileId: 'prof-3',
    senderName: 'Vikram Rathi',
    senderRole: 'seller',
    text: 'Current market rate for new Tata Tiscon is ₹58/kg. Our offcuts are primary steel with test reports. The lowest clearance rate is ₹47/kg.',
    type: 'counter_offer',
    payload: { quantity: 800, price: 47 },
    createdAt: new Date('2024-04-11T11:00:00Z')
  },
  {
    id: 'msg-7',
    inquiryId: 'inq-102',
    senderProfileId: 'prof-4',
    senderName: 'Kiran Salunkhe',
    senderRole: 'buyer',
    text: 'Reviewing with our structural engineer. If rust-free as shown in photos, ₹47/kg is fair.',
    type: 'message',
    createdAt: new Date('2024-04-11T11:30:00Z')
  },

  // Conversation for inq-103
  {
    id: 'msg-8',
    inquiryId: 'inq-103',
    senderProfileId: 'prof-1',
    senderName: 'Rajesh Sharma',
    senderRole: 'buyer',
    text: 'Priya, can take all 40 sheets of the 18mm shuttering plywood for our slab casting. Offering ₹800/sheet.',
    type: 'message',
    createdAt: new Date('2024-04-09T14:20:00Z')
  },
  {
    id: 'msg-9',
    inquiryId: 'inq-103',
    senderProfileId: 'prof-5',
    senderName: 'Priya Shah',
    senderRole: 'seller',
    text: 'Deal Rajesh. Total ₹32,000. All sheets are stacked on pallets at Hinjewadi site ready for dispatch.',
    type: 'offer_accepted',
    createdAt: new Date('2024-04-09T15:00:00Z')
  },

  // Conversation for inq-104
  {
    id: 'msg-10',
    inquiryId: 'inq-104',
    senderProfileId: 'prof-2',
    senderName: 'Suresh Deshmukh',
    senderRole: 'buyer',
    text: 'Manish, are the Astral pipes Schedule 80 or Schedule 40? Can offer ₹330/length for 20 lengths.',
    type: 'message',
    createdAt: new Date('2024-04-12T10:00:00Z')
  },
  {
    id: 'msg-11',
    inquiryId: 'inq-104',
    senderProfileId: 'prof-7',
    senderName: 'Manish Chawla',
    senderRole: 'seller',
    text: 'They are heavy duty Schedule 80, tested up to 28 kg/cm² pressure. Factory wrapped.',
    type: 'message',
    createdAt: new Date('2024-04-12T10:45:00Z')
  },

  // Conversation for inq-105
  {
    id: 'msg-12',
    inquiryId: 'inq-105',
    senderProfileId: 'prof-4',
    senderName: 'Kiran Salunkhe',
    senderRole: 'buyer',
    text: 'Offering ₹1,500/piece for 4 CP teak door frames.',
    type: 'message',
    createdAt: new Date('2024-04-08T16:45:00Z')
  },
  {
    id: 'msg-13',
    inquiryId: 'inq-105',
    senderProfileId: 'prof-2',
    senderName: 'Suresh Deshmukh',
    senderRole: 'seller',
    text: 'Sorry Kiran, ₹1,500 is too low for seasoned CP Teak. The raw timber cost alone was ₹2,400. Request declined.',
    type: 'offer_rejected',
    createdAt: new Date('2024-04-08T17:15:00Z')
  },

  // Conversation for inq-107
  {
    id: 'msg-14',
    inquiryId: 'inq-107',
    senderProfileId: 'prof-2',
    senderName: 'Suresh Deshmukh',
    senderRole: 'buyer',
    text: 'Rajesh sir, need 2,000 red clay bricks for partition walls. Offering ₹9.0/brick.',
    type: 'message',
    createdAt: new Date('2024-04-11T12:00:00Z')
  },
  {
    id: 'msg-15',
    inquiryId: 'inq-107',
    senderProfileId: 'prof-1',
    senderName: 'Rajesh Sharma',
    senderRole: 'seller',
    text: 'Can do ₹9.20/brick if you bring your vehicle. We will provide 2 laborers to load.',
    type: 'counter_offer',
    payload: { quantity: 2000, price: 9.2 },
    createdAt: new Date('2024-04-11T16:00:00Z')
  },

  // Conversation for inq-110
  {
    id: 'msg-16',
    inquiryId: 'inq-110',
    senderProfileId: 'prof-1',
    senderName: 'Rajesh Sharma',
    senderRole: 'buyer',
    text: 'Sunil, will take the complete lot of 24 Schneider MCBs for our panel retrofit. Offering ₹470 each.',
    type: 'message',
    createdAt: new Date('2024-04-10T11:00:00Z')
  },
  {
    id: 'msg-17',
    inquiryId: 'inq-110',
    senderProfileId: 'prof-6',
    senderName: 'Sunil Patil',
    senderRole: 'seller',
    text: 'Accepted Rajesh! Will pack securely in original cartons and provide invoice.',
    type: 'offer_accepted',
    createdAt: new Date('2024-04-10T11:45:00Z')
  },
  {
    id: 'msg-18',
    inquiryId: 'inq-110',
    senderProfileId: 'prof-1',
    senderName: 'Rajesh Sharma',
    senderRole: 'buyer',
    text: 'Payment advance confirmed via site account. Logistics pickup booked.',
    type: 'message',
    createdAt: new Date('2024-04-10T12:30:00Z')
  }
];

// ==========================================
// 6+ REALISTIC MARKETPLACE ORDERS ACROSS VARIOUS STATUSES
// ==========================================
export const seedMarketplaceOrders = [
  {
    id: 'ord-101',
    orderNumber: 'BW-ORD-8821',
    listingId: 'mkt-1',
    inquiryId: 'inq-101',
    materialName: 'Vitrified Ceramic Floor Tiles 600x600',
    category: 'Tiles',
    quantity: 100,
    unit: 'boxes',
    unitPrice: 620,
    totalAmount: 62000,
    pickupLocation: 'Sunrise Residency Site Yard, Nashik Road',
    city: 'Nashik',
    scheduledPickupDate: 'Tomorrow, 10:30 AM',
    orderStatus: 'Ready for Pickup',
    paymentStatus: 'Paid',
    buyerProfile: {
      id: 'prof-2',
      name: 'Suresh Deshmukh',
      companyName: 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      email: 'suresh@sunriseinfra.in',
      city: 'Nashik',
      isVerified: true
    },
    sellerProfile: {
      id: 'prof-1',
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      email: 'rajesh@buildwise.in',
      city: 'Nashik',
      isVerified: true
    },
    reservationExpiry: '7 days from confirmation',
    timeline: [
      {
        step: 'Inquiry Submitted',
        title: 'Inquiry Submitted',
        note: 'Buyer requested 100 boxes @ ₹620/box',
        status: 'completed',
        updatedBy: 'Suresh Deshmukh',
        timestamp: new Date('2024-04-10T09:30:00Z')
      },
      {
        step: 'Seller Responded',
        title: 'Seller Accepted Offer',
        note: 'Offer accepted; stock held for site pickup',
        status: 'completed',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-10T10:45:00Z')
      },
      {
        step: 'Quantity Reserved',
        title: 'Stock Reserved & Order Confirmed',
        note: '100 boxes reserved from Sunrise Residency inventory',
        status: 'completed',
        updatedBy: 'Buildwise System',
        timestamp: new Date('2024-04-10T10:45:00Z')
      },
      {
        step: 'Ready for Pickup',
        title: 'Material Packed & Ready at Gate 2',
        note: 'Boxes palletized and shrink-wrapped with supervisor pass',
        status: 'completed',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-10T14:00:00Z')
      },
      {
        step: 'Picked Up',
        title: 'Site Transport Handshake',
        note: 'Awaiting buyer vehicle arrival at site loading dock',
        status: 'current',
        updatedBy: 'Suresh Deshmukh',
        timestamp: new Date('2024-04-11T09:00:00Z')
      },
      {
        step: 'Completed',
        title: 'Transaction Closed',
        note: 'Delivery signoff and material muster entry',
        status: 'pending',
        updatedBy: 'System',
        timestamp: new Date('2024-04-11T12:00:00Z')
      }
    ],
    createdAt: new Date('2024-04-10T10:45:00Z')
  },
  {
    id: 'ord-102',
    orderNumber: 'BW-ORD-8822',
    listingId: 'mkt-4',
    inquiryId: 'inq-103',
    materialName: 'Heavy Duty Film-Faced Shuttering Plywood 18mm',
    category: 'Wood & Formwork',
    quantity: 40,
    unit: 'sheets',
    unitPrice: 800,
    totalAmount: 32000,
    pickupLocation: 'Green Valley Hub, Hinjewadi Phase 1, Pune',
    city: 'Pune',
    scheduledPickupDate: 'Thursday 11:00 AM',
    orderStatus: 'Confirmed',
    paymentStatus: 'Partial Advance Paid',
    buyerProfile: {
      id: 'prof-1',
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      email: 'rajesh@buildwise.in',
      city: 'Nashik',
      isVerified: true
    },
    sellerProfile: {
      id: 'prof-5',
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      email: 'priya@apexbuilders.in',
      city: 'Pune',
      isVerified: true
    },
    reservationExpiry: '7 days from confirmation',
    timeline: [
      {
        step: 'Inquiry Submitted',
        title: 'Inquiry Submitted',
        note: 'Buyer requested entire lot of 40 sheets @ ₹800',
        status: 'completed',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-09T14:20:00Z')
      },
      {
        step: 'Seller Responded',
        title: 'Seller Accepted Offer',
        note: 'Priya Shah accepted total ₹32,000',
        status: 'completed',
        updatedBy: 'Priya Shah',
        timestamp: new Date('2024-04-09T15:00:00Z')
      },
      {
        step: 'Quantity Reserved',
        title: 'Stock Reserved & Order Confirmed',
        note: 'All 40 sheets marked Reserved in inventory',
        status: 'completed',
        updatedBy: 'Buildwise System',
        timestamp: new Date('2024-04-09T15:00:00Z')
      },
      {
        step: 'Ready for Pickup',
        title: 'Awaiting Seller Stacking',
        note: 'Seller bundling sheets on loading platform',
        status: 'current',
        updatedBy: 'Priya Shah',
        timestamp: new Date('2024-04-09T15:00:00Z')
      },
      {
        step: 'Picked Up',
        title: 'Transport Dispatch',
        note: 'Scheduled for Thursday with transport partner',
        status: 'pending',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-10T10:00:00Z')
      },
      {
        step: 'Completed',
        title: 'Site Delivery Verification',
        note: 'Inspection of sheet edges upon arrival',
        status: 'pending',
        updatedBy: 'System',
        timestamp: new Date('2024-04-11T18:00:00Z')
      }
    ],
    createdAt: new Date('2024-04-09T15:00:00Z')
  },
  {
    id: 'ord-103',
    orderNumber: 'BW-ORD-8790',
    listingId: 'mkt-7',
    inquiryId: null,
    materialName: 'Ultratech 53-Grade OPC Cement',
    category: 'Cement',
    quantity: 100,
    unit: 'bags',
    unitPrice: 375,
    totalAmount: 37500,
    pickupLocation: 'MIDC Ambad Yard, Nashik',
    city: 'Nashik',
    scheduledPickupDate: 'Completed',
    orderStatus: 'Completed',
    paymentStatus: 'Paid',
    buyerProfile: {
      id: 'prof-1',
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      city: 'Nashik',
      isVerified: true
    },
    sellerProfile: {
      id: 'prof-8',
      name: 'Anand Kulkarni',
      companyName: 'Sahyadri Cement & ReadyMix',
      phone: '+91 98211 44332',
      city: 'Nashik',
      isVerified: true
    },
    reservationExpiry: 'Completed',
    timeline: [
      {
        step: 'Inquiry Submitted',
        title: 'Inquiry Submitted',
        note: 'Emergency requirement for high-strength column concrete',
        status: 'completed',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-04T08:00:00Z')
      },
      {
        step: 'Seller Responded',
        title: 'Instant Confirmation',
        note: 'Direct supplier clearance',
        status: 'completed',
        updatedBy: 'Anand Kulkarni',
        timestamp: new Date('2024-04-04T08:30:00Z')
      },
      {
        step: 'Quantity Reserved',
        title: '100 Bags Reserved',
        note: 'Stored in moisture-controlled godown',
        status: 'completed',
        updatedBy: 'System',
        timestamp: new Date('2024-04-04T08:30:00Z')
      },
      {
        step: 'Ready for Pickup',
        title: 'Loaded onto Delivery Truck',
        note: 'Dispatched with e-way bill',
        status: 'completed',
        updatedBy: 'Anand Kulkarni',
        timestamp: new Date('2024-04-04T11:00:00Z')
      },
      {
        step: 'Picked Up',
        title: 'Delivered at Sunrise Residency',
        note: 'Verified by Site Supervisor Suresh Deshmukh',
        status: 'completed',
        updatedBy: 'Suresh Deshmukh',
        timestamp: new Date('2024-04-04T14:30:00Z')
      },
      {
        step: 'Completed',
        title: 'Order Finalized',
        note: 'Bags utilized in Tower A 12th floor pour',
        status: 'completed',
        updatedBy: 'System',
        timestamp: new Date('2024-04-05T09:00:00Z')
      }
    ],
    createdAt: new Date('2024-04-04T08:30:00Z')
  },
  {
    id: 'ord-104',
    orderNumber: 'BW-ORD-8815',
    listingId: 'mkt-11',
    inquiryId: 'inq-110',
    materialName: 'Schneider Acti9 32A Triple Pole MCBs',
    category: 'Electrical',
    quantity: 24,
    unit: 'pieces',
    unitPrice: 470,
    totalAmount: 11280,
    pickupLocation: 'Andheri East Logistics Depot, Mumbai',
    city: 'Mumbai',
    scheduledPickupDate: 'Today 5:00 PM',
    orderStatus: 'Picked Up',
    paymentStatus: 'Paid',
    buyerProfile: {
      id: 'prof-1',
      name: 'Rajesh Sharma',
      companyName: 'Buildwise Infra Ltd.',
      phone: '+91 98220 12345',
      city: 'Nashik',
      isVerified: true
    },
    sellerProfile: {
      id: 'prof-6',
      name: 'Sunil Patil',
      companyName: 'Deccan Electro-Power Systems',
      phone: '+91 98451 99887',
      city: 'Bangalore',
      isVerified: true
    },
    reservationExpiry: '7 days from confirmation',
    timeline: [
      {
        step: 'Inquiry Submitted',
        title: 'Inquiry Submitted',
        note: '24 MCBs requested @ ₹470',
        status: 'completed',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-10T11:00:00Z')
      },
      {
        step: 'Order Confirmed',
        title: 'Order Confirmed',
        note: 'Seller confirmed stock and packing',
        status: 'completed',
        updatedBy: 'Sunil Patil',
        timestamp: new Date('2024-04-10T11:45:00Z')
      },
      {
        step: 'Ready for Pickup',
        title: 'Ready at Logistics Hub',
        note: 'Parcel sealed with barcode',
        status: 'completed',
        updatedBy: 'Sunil Patil',
        timestamp: new Date('2024-04-10T16:00:00Z')
      },
      {
        step: 'Picked Up',
        title: 'Picked Up by Site Driver',
        note: 'Collected and en-route to electrical room',
        status: 'completed',
        updatedBy: 'Rajesh Sharma',
        timestamp: new Date('2024-04-11T10:15:00Z')
      },
      {
        step: 'Completed',
        title: 'Installation Inspection',
        note: 'Electrician Ramesh Kumar inspecting terminal contacts',
        status: 'current',
        updatedBy: 'System',
        timestamp: new Date('2024-04-11T11:00:00Z')
      }
    ],
    createdAt: new Date('2024-04-10T11:45:00Z')
  },
  {
    id: 'ord-105',
    orderNumber: 'BW-ORD-8774',
    listingId: 'mkt-6',
    inquiryId: null,
    materialName: 'Astral Heavy Duty CPVC Pipes 1.5"',
    category: 'Plumbing',
    quantity: 20,
    unit: 'lengths',
    unitPrice: 350,
    totalAmount: 7000,
    pickupLocation: 'Baner High Street Site, Pune',
    city: 'Pune',
    scheduledPickupDate: 'Completed',
    orderStatus: 'Completed',
    paymentStatus: 'Paid',
    buyerProfile: {
      id: 'prof-4',
      name: 'Kiran Salunkhe',
      companyName: 'Green Valley Hub Developers',
      phone: '+91 97654 33210',
      city: 'Pune',
      isVerified: true
    },
    sellerProfile: {
      id: 'prof-7',
      name: 'Manish Chawla',
      companyName: 'Cityline Plumbing & Sanitary Ltd.',
      phone: '+91 98200 66554',
      city: 'Mumbai',
      isVerified: true
    },
    reservationExpiry: 'Completed',
    timeline: [
      {
        step: 'Order Confirmed',
        title: 'Direct Purchase Agreed',
        note: '20 lengths @ ₹350/length',
        status: 'completed',
        updatedBy: 'Manish Chawla',
        timestamp: new Date('2024-04-02T10:00:00Z')
      },
      {
        step: 'Ready for Pickup',
        title: 'Ready at Yard',
        note: 'Bundled with tape',
        status: 'completed',
        updatedBy: 'Manish Chawla',
        timestamp: new Date('2024-04-02T13:00:00Z')
      },
      {
        step: 'Picked Up',
        title: 'Collected',
        note: 'Transported to Green Valley plumbing shaft',
        status: 'completed',
        updatedBy: 'Kiran Salunkhe',
        timestamp: new Date('2024-04-03T11:00:00Z')
      },
      {
        step: 'Completed',
        title: 'Installed',
        note: 'Fitted by plumber Imran Khan',
        status: 'completed',
        updatedBy: 'System',
        timestamp: new Date('2024-04-03T16:00:00Z')
      }
    ],
    createdAt: new Date('2024-04-02T10:00:00Z')
  },
  {
    id: 'ord-106',
    orderNumber: 'BW-ORD-8830',
    listingId: 'mkt-2',
    inquiryId: null,
    materialName: 'Fe 550D TMT Rebar Offcuts 16mm',
    category: 'Steel',
    quantity: 400,
    unit: 'kg',
    unitPrice: 47,
    totalAmount: 18800,
    pickupLocation: 'Metro Line Pier Yard, Andheri East',
    city: 'Mumbai',
    scheduledPickupDate: 'Friday 9:00 AM',
    orderStatus: 'Pending Confirmation',
    paymentStatus: 'Pending',
    buyerProfile: {
      id: 'prof-5',
      name: 'Priya Shah',
      companyName: 'Apex Construction & Formworks',
      phone: '+91 98233 44556',
      city: 'Pune',
      isVerified: true
    },
    sellerProfile: {
      id: 'prof-3',
      name: 'Vikram Rathi',
      companyName: 'Metro Infra JV',
      phone: '+91 98901 88765',
      city: 'Mumbai',
      isVerified: true
    },
    reservationExpiry: '3 days from booking',
    timeline: [
      {
        step: 'Inquiry Submitted',
        title: 'Booking Placed',
        note: 'Direct reservation for 400 kg',
        status: 'completed',
        updatedBy: 'Priya Shah',
        timestamp: new Date('2024-04-12T09:00:00Z')
      },
      {
        step: 'Order Confirmed',
        title: 'Awaiting Seller Dispatch Slot',
        note: 'Crane operator scheduling offcut weighment',
        status: 'current',
        updatedBy: 'Vikram Rathi',
        timestamp: new Date('2024-04-12T09:30:00Z')
      },
      {
        step: 'Ready for Pickup',
        title: 'Yard Weighbridge Slip',
        note: 'Pending gross/tare weighment slip generation',
        status: 'pending',
        updatedBy: 'Metro Infra JV',
        timestamp: new Date('2024-04-12T10:00:00Z')
      }
    ],
    createdAt: new Date('2024-04-12T09:00:00Z')
  }
];

export const seedWorkers = [
  {
    id: 'w-1',
    name: 'Amit Patil',
    trade: 'Master Mason',
    category: 'Masonry',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    attendanceRate: 94,
    currentTask: 'Brick Wall — Ground Floor',
    status: 'Active',
    isCheckedIn: true,
    checkInTime: '09:04 AM',
    phone: '+91 98234 11201',
    wagePerDay: 850,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w-2',
    name: 'Rajesh Gurjar',
    trade: 'Bar Bender (Steel Fixer)',
    category: 'Steel',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    attendanceRate: 96,
    currentTask: 'Slab Reinforcement Grid',
    status: 'Active',
    isCheckedIn: true,
    checkInTime: '08:50 AM',
    phone: '+91 98901 22340',
    wagePerDay: 900,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w-3',
    name: 'Suresh Mhatre',
    trade: 'Formwork Carpenter',
    category: 'Carpentry',
    siteId: 'site-2',
    siteName: 'Green Valley Hub',
    attendanceRate: 88,
    currentTask: 'Column Formwork Boxing',
    status: 'Active',
    isCheckedIn: true,
    checkInTime: '09:12 AM',
    phone: '+91 97654 33410',
    wagePerDay: 850,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w-4',
    name: 'Ramesh Kumar',
    trade: 'Licensed Electrician',
    category: 'Electrical',
    siteId: 'site-3',
    siteName: 'Metro Line Depot',
    attendanceRate: 92,
    currentTask: 'Main Switchboard Conduit',
    status: 'Active',
    isCheckedIn: true,
    checkInTime: '08:45 AM',
    phone: '+91 98451 88712',
    wagePerDay: 950,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w-5',
    name: 'Imran Khan',
    trade: 'Plumber & Pipefitter',
    category: 'Plumbing',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    attendanceRate: 90,
    currentTask: 'Shaft Vertical Drainage Stack',
    status: 'Active',
    isCheckedIn: true,
    checkInTime: '09:15 AM',
    phone: '+91 98220 55678',
    wagePerDay: 850,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'w-6',
    name: 'Sunil Gawande',
    trade: 'General Site Laborer',
    category: 'Labor',
    siteId: 'site-2',
    siteName: 'Green Valley Hub',
    attendanceRate: 85,
    currentTask: 'Material Unloading & Mixing',
    status: 'On Leave',
    isCheckedIn: false,
    checkInTime: null,
    phone: '+91 98334 99012',
    wagePerDay: 600,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  }
];

export const seedTasks = [
  {
    id: 'task-1',
    title: 'Brick Wall — Ground Floor Outer Wing',
    description: 'Construct 9-inch load bearing exterior wall in cement mortar 1:6 up to lintel height.',
    workerId: 'w-1',
    workerName: 'Amit Patil',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    priority: 'High',
    dueDate: 'Today',
    progress: 70,
    status: 'In Progress'
  },
  {
    id: 'task-2',
    title: 'Slab Reinforcement Grid 3rd Floor',
    description: 'Bind top and bottom mats using 12mm and 16mm TMT bars per structural drawing S-04.',
    workerId: 'w-2',
    workerName: 'Rajesh Gurjar',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    priority: 'High',
    dueDate: 'Tomorrow',
    progress: 45,
    status: 'In Progress',
    prerequisiteId: 'task-1'
  },
  {
    id: 'task-3',
    title: 'Column Formwork Boxing C12-C16',
    description: 'Erect shuttering plates with vertical props and lateral bracing for concrete pour.',
    workerId: 'w-3',
    workerName: 'Suresh Mhatre',
    siteId: 'site-2',
    siteName: 'Green Valley Hub',
    priority: 'High',
    dueDate: 'Aug 22',
    progress: 15,
    status: 'To Do',
    prerequisiteId: 'task-6'
  },
  {
    id: 'task-4',
    title: 'Main Switchboard Conduit & Earth Wire',
    description: 'Run heavy-duty PVC conduit and 8 SWG GI earth wire from sub-station to panel.',
    workerId: 'w-4',
    workerName: 'Ramesh Kumar',
    siteId: 'site-3',
    siteName: 'Metro Line Depot',
    priority: 'Medium',
    dueDate: 'Aug 23',
    progress: 90,
    status: 'Review'
  },
  {
    id: 'task-5',
    title: 'Shaft Vertical Drainage Stack Installation',
    description: 'Fix 110mm SWR pipes with acoustic rubber clamps on shaft wall.',
    workerId: 'w-5',
    workerName: 'Imran Khan',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    priority: 'Low',
    dueDate: 'Aug 24',
    progress: 0,
    status: 'To Do'
  },
  {
    id: 'task-6',
    title: 'Move 16mm Steel to Tower B Basement',
    description: 'Transport 4 metric tons of reinforcement bars from central yard to Tower B.',
    workerId: 'w-6',
    workerName: 'Sunil Gawande',
    siteId: 'site-1',
    siteName: 'Sunrise Residency',
    priority: 'Medium',
    dueDate: 'Yesterday',
    progress: 100,
    status: 'Completed'
  }
];

export const seedActivities = [
  {
    id: 'act-1',
    text: 'Order BW-ORD-8821 confirmed: Suresh Deshmukh reserved 100 boxes of Vitrified Tiles',
    time: '10m ago',
    type: 'marketplace',
    statusClass: 'success'
  },
  {
    id: 'act-2',
    text: 'Amit Patil scanned Site QR & checked in at Sunrise Residency',
    time: '45m ago',
    type: 'attendance',
    statusClass: 'info'
  },
  {
    id: 'act-3',
    text: 'Vikram Rathi countered inquiry for TMT Steel Rebar Offcuts at ₹47/kg',
    time: '1h ago',
    type: 'marketplace',
    statusClass: 'info'
  },
  {
    id: 'act-4',
    text: 'Suresh Deshmukh recorded usage of 40 bags Ultratech Cement',
    time: '2h ago',
    type: 'material',
    statusClass: 'info'
  },
  {
    id: 'act-5',
    text: 'Low stock warning triggered for Vitrified Floor Tiles (80 boxes remaining)',
    time: '3h ago',
    type: 'alert',
    statusClass: 'danger'
  }
];

export const seedAttendanceLogs = [
  { id: 'att-1', workerId: 'w-1', workerName: 'Amit Patil', trade: 'Mason', siteName: 'Sunrise Residency', time: '09:04 AM', date: 'Today', status: 'Present', method: 'Site QR Scan' },
  { id: 'att-2', workerId: 'w-2', workerName: 'Rajesh Gurjar', trade: 'Bar Bender', siteName: 'Sunrise Residency', time: '08:50 AM', date: 'Today', status: 'Present', method: 'One-Click Punch' },
  { id: 'att-3', workerId: 'w-3', workerName: 'Suresh Mhatre', trade: 'Carpenter', siteName: 'Green Valley Hub', time: '09:12 AM', date: 'Today', status: 'Present', method: 'Site QR Scan' },
  { id: 'att-4', workerId: 'w-4', workerName: 'Ramesh Kumar', trade: 'Electrician', siteName: 'Metro Line Depot', time: '08:45 AM', date: 'Today', status: 'Present', method: 'One-Click Punch' },
  { id: 'att-5', workerId: 'w-5', workerName: 'Imran Khan', trade: 'Plumber', siteName: 'Sunrise Residency', time: '09:15 AM', date: 'Today', status: 'Present', method: 'Site QR Scan' },
  { id: 'att-6', workerId: 'w-6', workerName: 'Sunil Gawande', trade: 'Laborer', siteName: 'Green Valley Hub', time: '-', date: 'Today', status: 'Absent', method: '-' }
];

export async function runSeed(additive = false) {
  if (mongoose.connection.readyState !== 1) {
    console.log(`[Seed] Connecting to ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
  }

  if (!additive) {
    console.log('[Seed] Clearing old collections...');
    await Promise.all([
      Site.deleteMany({}),
      Material.deleteMany({}),
      Leftover.deleteMany({}),
      MarketplaceListing.deleteMany({}),
      MarketplaceProfile.deleteMany({}),
      MarketplaceInquiry.deleteMany({}),
      MarketplaceMessage.deleteMany({}),
      MarketplaceOrder.deleteMany({}),
      Worker.deleteMany({}),
      Task.deleteMany({}),
      AttendanceLog.deleteMany({}),
      Activity.deleteMany({}),
      User.deleteMany({})
    ]);
  }

  console.log('[Seed] Inserting seed records...');
  await Promise.all([
    Site.insertMany(seedSites),
    Material.insertMany(seedMaterials),
    Leftover.insertMany(seedLeftovers),
    MarketplaceProfile.insertMany(seedMarketplaceProfiles),
    MarketplaceListing.insertMany(seedMarketplace),
    MarketplaceInquiry.insertMany(seedMarketplaceInquiries),
    MarketplaceMessage.insertMany(seedMarketplaceMessages),
    MarketplaceOrder.insertMany(seedMarketplaceOrders),
    Worker.insertMany(seedWorkers),
    Task.insertMany(seedTasks),
    AttendanceLog.insertMany(seedAttendanceLogs),
    Activity.insertMany(seedActivities),
    User.insertMany(seedUsers)
  ]);

  console.log('✅ Database seeded successfully with Buildwise construction management & marketplace data!');
  return {
    success: true,
    message: 'Database seeded successfully with Buildwise demo data',
    counts: {
      users: seedUsers.length,
      sites: seedSites.length,
      materials: seedMaterials.length,
      leftovers: seedLeftovers.length,
      marketplaceProfiles: seedMarketplaceProfiles.length,
      marketplaceListings: seedMarketplace.length,
      marketplaceInquiries: seedMarketplaceInquiries.length,
      marketplaceMessages: seedMarketplaceMessages.length,
      marketplaceOrders: seedMarketplaceOrders.length,
      workers: seedWorkers.length,
      tasks: seedTasks.length,
      attendance: seedAttendanceLogs.length,
      activities: seedActivities.length
    }
  };
}

if (process.argv[1]?.endsWith('seed.js')) {
  runSeed(false)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err.message);
      process.exit(1);
    });
}
