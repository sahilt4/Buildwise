import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  Site,
  User,
  Material,
  MaterialTransaction,
  ResaleListing,
  ConstructionTask,
  AttendanceRecord,
} from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Seed data based on Nashik regional construction infrastructure (PRD Project 14: BuildWise)
let sites: Site[] = [
  {
    id: "site-1",
    name: "KKW Tech Campus Expansion (Tower B)",
    location: "Amrutdham, Panchavati",
    city: "Nashik",
    builderId: "user-builder-1",
    engineerId: "user-eng-1",
    status: "active",
    budget: 45000000,
    budgetSpent: 28500000,
    startDate: "2026-01-10",
    targetEndDate: "2026-11-30",
    progressPercentage: 62,
  },
  {
    id: "site-2",
    name: "Godavari Riverside Residency",
    location: "Gangapur Road, Near Someshwar",
    city: "Nashik",
    builderId: "user-builder-1",
    engineerId: "user-eng-2",
    status: "active",
    budget: 68000000,
    budgetSpent: 51200000,
    startDate: "2025-08-15",
    targetEndDate: "2026-09-15",
    progressPercentage: 78,
  },
  {
    id: "site-3",
    name: "Panchavati Commercial Plaza",
    location: "Dwarka Circle High Street",
    city: "Nashik",
    builderId: "user-builder-1",
    engineerId: "user-eng-1",
    status: "nearing_completion",
    budget: 32000000,
    budgetSpent: 30400000,
    startDate: "2025-04-01",
    targetEndDate: "2026-08-30",
    progressPercentage: 94,
  },
];

let users: User[] = [
  {
    id: "user-builder-1",
    name: "Er. Rajesh K. Patil",
    role: "builder",
    email: "rajesh.patil@patilinfra.com",
    phone: "+91 98220 14589",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-1", "site-2", "site-3"],
    badgeId: "BW-BLD-01",
  },
  {
    id: "user-eng-1",
    name: "Sunil M. Deshmukh",
    role: "engineer",
    email: "sunil.deshmukh@buildwise.in",
    phone: "+91 94222 67890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-1", "site-3"],
    skillSpecialty: "Structural & RCC Engineer",
    badgeId: "BW-ENG-08",
  },
  {
    id: "user-eng-2",
    name: "Pooja V. Kulkarni",
    role: "engineer",
    email: "pooja.kulkarni@buildwise.in",
    phone: "+91 98901 23456",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-2"],
    skillSpecialty: "Quality & Safety Manager",
    badgeId: "BW-ENG-12",
  },
  {
    id: "user-worker-1",
    name: "Rameshwar G. Shinde",
    role: "worker",
    email: "ramesh.shinde@worker.in",
    phone: "+91 97654 32101",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-1", "site-3"],
    skillSpecialty: "Master Mason / Plaster Specialist",
    dailyRate: 950,
    hourlyRate: 120,
    badgeId: "BW-WRK-101",
  },
  {
    id: "user-worker-2",
    name: "Tukaram B. Jadhav",
    role: "worker",
    email: "tukaram.jadhav@worker.in",
    phone: "+91 98811 44552",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-1", "site-2"],
    skillSpecialty: "TMT Bar Bender & Steel Fixer",
    dailyRate: 900,
    hourlyRate: 115,
    badgeId: "BW-WRK-102",
  },
  {
    id: "user-worker-3",
    name: "Sunita D. Rathod",
    role: "worker",
    email: "sunita.rathod@worker.in",
    phone: "+91 91580 98765",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-2", "site-3"],
    skillSpecialty: "Tiling & Flooring Expert",
    dailyRate: 850,
    hourlyRate: 110,
    badgeId: "BW-WRK-103",
  },
  {
    id: "user-worker-4",
    name: "Ganesh K. Gaikwad",
    role: "worker",
    email: "ganesh.gaikwad@worker.in",
    phone: "+91 98600 77889",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    siteIds: ["site-1"],
    skillSpecialty: "Senior Electrician & Conduit",
    dailyRate: 1000,
    hourlyRate: 130,
    badgeId: "BW-WRK-104",
  },
  {
    id: "user-buyer-1",
    name: "Amit S. Verma (Contractor)",
    role: "buyer",
    email: "amit.vermaconstructions@gmail.com",
    phone: "+91 93701 55667",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    siteIds: [],
    badgeId: "BW-BYR-201",
  },
];

let materials: Material[] = [
  {
    id: "mat-1",
    siteId: "site-1",
    name: "UltraTech Super OPC 53 Grade Cement",
    category: "cement",
    brand: "UltraTech",
    unit: "Bags (50kg)",
    totalPurchased: 1200,
    totalUsed: 1020,
    totalResold: 50,
    unitCost: 385,
    minThreshold: 100,
    lastUpdated: "2026-08-13T14:30:00Z",
    isSurplusMarked: true,
  },
  {
    id: "mat-2",
    siteId: "site-1",
    name: "Tata Tiscon 16mm TMT Fe-550D Rebars",
    category: "steel",
    brand: "Tata Steel",
    unit: "Metric Tonnes",
    totalPurchased: 45,
    totalUsed: 39.5,
    totalResold: 2.5,
    unitCost: 64500,
    minThreshold: 5,
    lastUpdated: "2026-08-12T10:15:00Z",
    isSurplusMarked: true,
  },
  {
    id: "mat-3",
    siteId: "site-1",
    name: "Red Kiln Baked First Class Clay Bricks",
    category: "bricks",
    brand: "Sinnar Kilns",
    unit: "Pieces",
    totalPurchased: 50000,
    totalUsed: 44000,
    totalResold: 0,
    unitCost: 9.5,
    minThreshold: 4000,
    lastUpdated: "2026-08-11T16:00:00Z",
  },
  {
    id: "mat-4",
    siteId: "site-2",
    name: "Kajaria 600x1200mm Glazed Vitrified Tiles",
    category: "tiles",
    brand: "Kajaria Ceramics",
    unit: "Boxes (4 pcs/box)",
    totalPurchased: 850,
    totalUsed: 710,
    totalResold: 60,
    unitCost: 1150,
    minThreshold: 50,
    lastUpdated: "2026-08-13T11:00:00Z",
    isSurplusMarked: true,
  },
  {
    id: "mat-5",
    siteId: "site-2",
    name: "Godavari Screened Washed River Sand",
    category: "sand_aggregates",
    brand: "Godavari Sands",
    unit: "Brass (100 cu.ft)",
    totalPurchased: 80,
    totalUsed: 74,
    totalResold: 0,
    unitCost: 6800,
    minThreshold: 8,
    lastUpdated: "2026-08-10T09:40:00Z",
  },
  {
    id: "mat-6",
    siteId: "site-3",
    name: "Asian Paints Apex Weatherproof Exterior Emulsion",
    category: "paint",
    brand: "Asian Paints",
    unit: "Buckets (20L)",
    totalPurchased: 120,
    totalUsed: 96,
    totalResold: 15,
    unitCost: 4600,
    minThreshold: 10,
    lastUpdated: "2026-08-12T17:20:00Z",
    isSurplusMarked: true,
  },
  {
    id: "mat-7",
    siteId: "site-3",
    name: "Astral CPVC Pro Pipes 1 Inch (3m)",
    category: "plumbing",
    brand: "Astral Pipes",
    unit: "Pipes (3m length)",
    totalPurchased: 400,
    totalUsed: 365,
    totalResold: 20,
    unitCost: 320,
    minThreshold: 25,
    lastUpdated: "2026-08-13T08:15:00Z",
    isSurplusMarked: true,
  },
];

let transactions: MaterialTransaction[] = [
  {
    id: "tx-101",
    materialId: "mat-1",
    siteId: "site-1",
    type: "purchase",
    quantity: 500,
    unitPrice: 385,
    totalCost: 192500,
    date: "2026-08-01T09:00:00Z",
    loggedBy: "Sunil M. Deshmukh",
    notes: "Direct procurement from UltraTech Authorized Depot Nashik Road",
    invoiceNumber: "UT-NSK-9921",
  },
  {
    id: "tx-102",
    materialId: "mat-1",
    siteId: "site-1",
    type: "usage",
    quantity: 120,
    date: "2026-08-10T15:30:00Z",
    loggedBy: "Sunil M. Deshmukh",
    notes: "Poured for 4th Floor Slab Concreting (Beam Grid B4-B9)",
    taskId: "task-1",
    taskTitle: "4th Floor Column & Slab Concreting",
  },
  {
    id: "tx-103",
    materialId: "mat-2",
    siteId: "site-1",
    type: "usage",
    quantity: 4.5,
    date: "2026-08-11T12:00:00Z",
    loggedBy: "Sunil M. Deshmukh",
    notes: "TMT mesh binding for Elevator Core Wall Reinforcement",
    taskId: "task-2",
    taskTitle: "Elevator Shaft Steel Reinforcement Binding",
  },
  {
    id: "tx-104",
    materialId: "mat-4",
    siteId: "site-2",
    type: "resale_deduction",
    quantity: 60,
    unitPrice: 920,
    totalCost: 55200,
    date: "2026-08-12T14:00:00Z",
    loggedBy: "Pooja V. Kulkarni",
    notes: "Transferred to Resale Marketplace - 60 unopened surplus tile boxes sold to Metro Interiors",
  },
  {
    id: "tx-105",
    materialId: "mat-6",
    siteId: "site-3",
    type: "usage",
    quantity: 24,
    date: "2026-08-13T10:30:00Z",
    loggedBy: "Sunil M. Deshmukh",
    notes: "2nd Coat exterior facade painting North Wing",
    taskId: "task-5",
    taskTitle: "Commercial Arcade Facade Primer & Paint",
  },
];

let listings: ResaleListing[] = [
  {
    id: "listing-1",
    materialId: "mat-1",
    sellerSiteId: "site-1",
    sellerName: "Patil Builders & Developers (Site: KKW Campus)",
    sellerPhone: "+91 94222 67890",
    sellerRole: "Site Engineer",
    title: "130 Bags UltraTech OPC 53 Grade Fresh Cement (Surplus)",
    category: "cement",
    quantity: 130,
    unit: "Bags (50kg)",
    pricePerUnit: 330,
    originalCostPerUnit: 385,
    condition: "Unopened / Factory Pack",
    description: "Factory sealed bags kept on dry wooden pallets under waterproof tarpaulin. Manufactured late July 2026. Ready for immediate pickup from Panchavati.",
    location: "Panchavati Site Yard, Nashik",
    city: "Nashik",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    status: "available",
    postedDate: "2026-08-12T10:00:00Z",
    inquiriesCount: 2,
    buyerInquiries: [
      {
        id: "inq-1",
        buyerName: "Amit Verma (Verma Constructions)",
        buyerPhone: "+91 93701 55667",
        buyerEmail: "amit.verma@gmail.com",
        offeredPrice: 320,
        quantityRequested: 100,
        status: "pending",
        message: "Need 100 bags for our CIDCO boundary wall project tomorrow morning. Can provide own mini-truck.",
        date: "2026-08-13T09:15:00Z",
      },
    ],
  },
  {
    id: "listing-2",
    materialId: "mat-2",
    sellerSiteId: "site-1",
    sellerName: "Patil Builders & Developers",
    sellerPhone: "+91 98220 14589",
    sellerRole: "Builder",
    title: "3.0 Metric Tonnes Tata Tiscon 16mm Fe-550D Rebars (Surplus Lot)",
    category: "steel",
    quantity: 3,
    unit: "Metric Tonnes",
    pricePerUnit: 58000,
    originalCostPerUnit: 64500,
    condition: "Surplus Leftover (Prime)",
    description: "Brand new full 12-meter lengths, test certificates available. Zero rust, stored in covered shed. Saved over budget requirements.",
    location: "Amrutdham Warehouse, Nashik",
    city: "Nashik",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    status: "available",
    postedDate: "2026-08-11T14:30:00Z",
    inquiriesCount: 1,
    buyerInquiries: [
      {
        id: "inq-2",
        buyerName: "Sanjay Shirode (Kalyan Infra)",
        buyerPhone: "+91 98230 44556",
        buyerEmail: "sanjay@kalyaninfra.co.in",
        offeredPrice: 57500,
        quantityRequested: 3,
        status: "accepted",
        message: "We will take the full 3 MT lot. Scheduling Hydra crane pickup on Friday.",
        date: "2026-08-12T16:20:00Z",
      },
    ],
  },
  {
    id: "listing-3",
    materialId: "mat-4",
    sellerSiteId: "site-2",
    sellerName: "Godavari Greens Project Office",
    sellerPhone: "+91 98901 23456",
    sellerRole: "Site Engineer",
    title: "80 Boxes Kajaria 600x1200mm Vitrified Calacatta Marble Tiles",
    category: "tiles",
    quantity: 80,
    unit: "Boxes (4 pcs/box)",
    pricePerUnit: 890,
    originalCostPerUnit: 1150,
    condition: "Unopened / Factory Pack",
    description: "High-end Italian marble look vitrified tiles. Perfect edge quality, same batch number #KJ-2026-B. Premium finish for living rooms or boutique offices.",
    location: "Gangapur Road Site, Nashik",
    city: "Nashik",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    status: "available",
    postedDate: "2026-08-10T16:00:00Z",
    inquiriesCount: 0,
    buyerInquiries: [],
  },
  {
    id: "listing-4",
    materialId: "mat-6",
    sellerSiteId: "site-3",
    sellerName: "Panchavati Plaza Site Ops",
    sellerPhone: "+91 94222 67890",
    sellerRole: "Engineer",
    title: "9 Buckets (20L) Asian Paints Apex Exterior White Emulsion",
    category: "paint",
    quantity: 9,
    unit: "Buckets (20L)",
    pricePerUnit: 3900,
    originalCostPerUnit: 4600,
    condition: "Unopened / Factory Pack",
    description: "Surplus buckets sealed from factory. Anti-fungal weatherproof exterior grade.",
    location: "Dwarka Circle Yard, Nashik",
    city: "Nashik",
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80",
    status: "available",
    postedDate: "2026-08-13T12:00:00Z",
    inquiriesCount: 1,
    buyerInquiries: [],
  },
];

let tasks: ConstructionTask[] = [
  {
    id: "task-1",
    siteId: "site-1",
    title: "4th Floor Column & Slab Concreting",
    description: "Mix and pump M25 grade concrete for Grid 4 to 8 columns and roof slab. Perform slump test and cube casting.",
    category: "Civil & Structural",
    priority: "urgent",
    status: "in_progress",
    assignedWorkerIds: ["user-worker-1", "user-worker-2"],
    dueDate: "2026-08-16",
    estimatedHours: 24,
    actualHours: 14,
    requiredMaterials: [
      {
        materialId: "mat-1",
        materialName: "UltraTech Super OPC 53 Grade Cement",
        estimatedQty: 150,
        actualUsedQty: 120,
        unit: "Bags (50kg)",
      },
      {
        materialId: "mat-2",
        materialName: "Tata Tiscon 16mm TMT Rebars",
        estimatedQty: 5.0,
        actualUsedQty: 4.5,
        unit: "Metric Tonnes",
      },
    ],
    createdBy: "Sunil M. Deshmukh",
    createdAt: "2026-08-12T08:00:00Z",
  },
  {
    id: "task-2",
    siteId: "site-1",
    title: "Elevator Shaft Steel Reinforcement Binding",
    description: "Double mesh vertical & horizontal reinforcement tying as per structural drawing Sheet ST-09.",
    category: "Rebar & Steel",
    priority: "high",
    status: "in_progress",
    assignedWorkerIds: ["user-worker-2"],
    dueDate: "2026-08-15",
    estimatedHours: 16,
    actualHours: 9,
    requiredMaterials: [
      {
        materialId: "mat-2",
        materialName: "Tata Tiscon 16mm TMT Rebars",
        estimatedQty: 2.0,
        actualUsedQty: 1.8,
        unit: "Metric Tonnes",
      },
    ],
    createdBy: "Sunil M. Deshmukh",
    createdAt: "2026-08-13T09:00:00Z",
  },
  {
    id: "task-3",
    siteId: "site-2",
    title: "Clubhouse Flooring & Vitrified Tile Laying",
    description: "Install 600x1200mm tiles with zero-lippage spacers in main lounge and corridor areas. Grouting with epoxy.",
    category: "Finishing & Tiling",
    priority: "medium",
    status: "in_progress",
    assignedWorkerIds: ["user-worker-3"],
    dueDate: "2026-08-18",
    estimatedHours: 32,
    actualHours: 18,
    requiredMaterials: [
      {
        materialId: "mat-4",
        materialName: "Kajaria 600x1200mm Vitrified Tiles",
        estimatedQty: 120,
        actualUsedQty: 95,
        unit: "Boxes",
      },
      {
        materialId: "mat-1",
        materialName: "UltraTech OPC 53 Grade Cement",
        estimatedQty: 30,
        actualUsedQty: 22,
        unit: "Bags",
      },
    ],
    createdBy: "Pooja V. Kulkarni",
    createdAt: "2026-08-10T10:00:00Z",
  },
  {
    id: "task-4",
    siteId: "site-1",
    title: "Electrical Sub-Distribution Board Wiring & Conduit",
    description: "Pull FRLS copper wires through PVC conduits on 3rd floor west wing. Install miniature circuit breakers.",
    category: "Electrical",
    priority: "medium",
    status: "todo",
    assignedWorkerIds: ["user-worker-4"],
    dueDate: "2026-08-19",
    estimatedHours: 20,
    actualHours: 0,
    createdBy: "Sunil M. Deshmukh",
    createdAt: "2026-08-13T11:00:00Z",
  },
  {
    id: "task-5",
    siteId: "site-3",
    title: "Commercial Arcade Facade Primer & Paint",
    description: "Scrape, apply exterior putty, 1 coat sealer primer and 2 coats weatherproof emulsion on frontage.",
    category: "Painting & Waterproofing",
    priority: "high",
    status: "completed",
    assignedWorkerIds: ["user-worker-1", "user-worker-3"],
    dueDate: "2026-08-13",
    estimatedHours: 28,
    actualHours: 26,
    requiredMaterials: [
      {
        materialId: "mat-6",
        materialName: "Asian Paints Apex Exterior Emulsion",
        estimatedQty: 25,
        actualUsedQty: 24,
        unit: "Buckets",
      },
    ],
    createdBy: "Sunil M. Deshmukh",
    createdAt: "2026-08-08T08:00:00Z",
    completedAt: "2026-08-13T17:00:00Z",
  },
];

let attendance: AttendanceRecord[] = [
  {
    id: "att-1",
    workerId: "user-worker-1",
    workerName: "Rameshwar G. Shinde",
    workerRole: "Master Mason",
    siteId: "site-1",
    siteName: "KKW Tech Campus Expansion",
    date: "2026-08-14",
    checkInTime: "08:05 AM",
    status: "checked_in",
    method: "qr_scan",
    verifiedBy: "Gate #1 QR Kiosk Scanner",
    dailyWageEarned: 950,
  },
  {
    id: "att-2",
    workerId: "user-worker-2",
    workerName: "Tukaram B. Jadhav",
    workerRole: "Bar Bender",
    siteId: "site-1",
    siteName: "KKW Tech Campus Expansion",
    date: "2026-08-14",
    checkInTime: "07:55 AM",
    status: "checked_in",
    method: "qr_scan",
    verifiedBy: "Site Supervisor QR Scanner",
    dailyWageEarned: 900,
  },
  {
    id: "att-3",
    workerId: "user-worker-3",
    workerName: "Sunita D. Rathod",
    workerRole: "Tiling Specialist",
    siteId: "site-2",
    siteName: "Godavari Riverside Residency",
    date: "2026-08-14",
    checkInTime: "08:15 AM",
    status: "checked_in",
    method: "digital_badge",
    verifiedBy: "Pooja V. Kulkarni (Eng)",
    dailyWageEarned: 850,
  },
  {
    id: "att-4",
    workerId: "user-worker-4",
    workerName: "Ganesh K. Gaikwad",
    workerRole: "Electrician",
    siteId: "site-1",
    siteName: "KKW Tech Campus Expansion",
    date: "2026-08-14",
    checkInTime: "08:30 AM",
    status: "checked_in",
    method: "qr_scan",
    verifiedBy: "Gate #1 QR Kiosk Scanner",
    dailyWageEarned: 1000,
  },
  // Yesterday's records
  {
    id: "att-old-1",
    workerId: "user-worker-1",
    workerName: "Rameshwar G. Shinde",
    workerRole: "Master Mason",
    siteId: "site-1",
    siteName: "KKW Tech Campus Expansion",
    date: "2026-08-13",
    checkInTime: "08:00 AM",
    checkOutTime: "06:30 PM",
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: "overtime",
    method: "qr_scan",
    verifiedBy: "Sunil M. Deshmukh",
    dailyWageEarned: 1130,
  },
  {
    id: "att-old-2",
    workerId: "user-worker-2",
    workerName: "Tukaram B. Jadhav",
    workerRole: "Bar Bender",
    siteId: "site-1",
    siteName: "KKW Tech Campus Expansion",
    date: "2026-08-13",
    checkInTime: "08:00 AM",
    checkOutTime: "05:00 PM",
    totalHours: 8,
    overtimeHours: 0,
    status: "present",
    method: "qr_scan",
    verifiedBy: "Sunil M. Deshmukh",
    dailyWageEarned: 900,
  },
  {
    id: "att-old-3",
    workerId: "user-worker-3",
    workerName: "Sunita D. Rathod",
    workerRole: "Tiling Specialist",
    siteId: "site-3",
    siteName: "Panchavati Commercial Plaza",
    date: "2026-08-13",
    checkInTime: "08:15 AM",
    checkOutTime: "05:15 PM",
    totalHours: 8,
    overtimeHours: 0,
    status: "present",
    method: "qr_scan",
    verifiedBy: "Sunil M. Deshmukh",
    dailyWageEarned: 850,
  },
];

// Helper to compute overall metrics
function computeSustainabilityMetrics() {
  // 1 bag cement ~ 50kg, 1 tonne steel ~ 1000kg, 1 box tiles ~ 25kg, 1 bucket paint ~ 25kg
  let totalKg = 0;
  let totalRevenue = 0;

  listings.forEach((l) => {
    let weightKg = 0;
    if (l.category === "cement") weightKg = l.quantity * 50;
    else if (l.category === "steel") weightKg = l.quantity * 1000;
    else if (l.category === "tiles") weightKg = l.quantity * 25;
    else if (l.category === "paint") weightKg = l.quantity * 25;
    else if (l.category === "bricks") weightKg = l.quantity * 3;
    else weightKg = l.quantity * 10;

    totalKg += weightKg;
    totalRevenue += l.quantity * l.pricePerUnit;
  });

  // Carbon factor: approx 0.85 kg CO2 per kg cement/steel diverted/recycled
  const carbonOffsetKg = Math.round(totalKg * 0.82);

  return {
    totalWasteDivertedKg: Math.round(totalKg),
    carbonOffsetKg,
    financialValueRecoveredInr: totalRevenue,
    surplusReuseRate: 88.4,
    materialsSavedCount: listings.length + 18,
  };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. BOOTSTRAP / INITIAL DATA
app.get("/api/bootstrap", (req, res) => {
  res.json({
    sites,
    users,
    materials,
    transactions,
    listings,
    tasks,
    attendance,
    sustainability: computeSustainabilityMetrics(),
  });
});

// 2. SITES
app.get("/api/sites", (req, res) => {
  res.json(sites);
});

app.post("/api/sites", (req, res) => {
  const newSite: Site = {
    id: `site-${Date.now()}`,
    name: req.body.name || "New Construction Project",
    location: req.body.location || "Nashik",
    city: req.body.city || "Nashik",
    builderId: req.body.builderId || "user-builder-1",
    engineerId: req.body.engineerId || "user-eng-1",
    status: req.body.status || "active",
    budget: Number(req.body.budget) || 10000000,
    budgetSpent: 0,
    startDate: req.body.startDate || new Date().toISOString().split("T")[0],
    targetEndDate: req.body.targetEndDate || "2027-01-01",
    progressPercentage: 5,
  };
  sites.unshift(newSite);
  res.status(201).json(newSite);
});

// 3. MATERIALS & TRANSACTIONS
app.get("/api/materials", (req, res) => {
  const { siteId, category } = req.query;
  let list = [...materials];
  if (siteId && siteId !== "all") {
    list = list.filter((m) => m.siteId === siteId);
  }
  if (category && category !== "all") {
    list = list.filter((m) => m.category === category);
  }
  res.json(list);
});

app.post("/api/materials", (req, res) => {
  const { siteId, name, category, brand, unit, initialQuantity, unitCost, minThreshold } = req.body;
  const newMaterial: Material = {
    id: `mat-${Date.now()}`,
    siteId: siteId || "site-1",
    name,
    category,
    brand: brand || "Standard Grade",
    unit,
    totalPurchased: Number(initialQuantity) || 0,
    totalUsed: 0,
    totalResold: 0,
    unitCost: Number(unitCost) || 0,
    minThreshold: Number(minThreshold) || 10,
    lastUpdated: new Date().toISOString(),
  };
  materials.unshift(newMaterial);

  if (initialQuantity > 0) {
    const tx: MaterialTransaction = {
      id: `tx-${Date.now()}`,
      materialId: newMaterial.id,
      siteId: newMaterial.siteId,
      type: "purchase",
      quantity: Number(initialQuantity),
      unitPrice: Number(unitCost),
      totalCost: Number(initialQuantity) * Number(unitCost),
      date: new Date().toISOString(),
      loggedBy: req.body.loggedBy || "Site Engineer",
      notes: req.body.notes || "Initial stock procurement entry",
      invoiceNumber: req.body.invoiceNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    transactions.unshift(tx);
  }

  res.status(201).json(newMaterial);
});

// Log Purchase / Usage / Surplus Resale deduction
app.post("/api/materials/transactions", (req, res) => {
  const { materialId, siteId, type, quantity, unitPrice, loggedBy, notes, invoiceNumber, taskId } = req.body;
  const numQty = Number(quantity);

  const mat = materials.find((m) => m.id === materialId);
  if (!mat) {
    return res.status(404).json({ error: "Material not found" });
  }

  if (type === "purchase") {
    mat.totalPurchased += numQty;
    if (unitPrice) mat.unitCost = Number(unitPrice);
  } else if (type === "usage") {
    mat.totalUsed += numQty;
    // Update task material if linked
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.requiredMaterials) {
        const reqMat = task.requiredMaterials.find((rm) => rm.materialId === materialId);
        if (reqMat) {
          reqMat.actualUsedQty = (reqMat.actualUsedQty || 0) + numQty;
        }
      }
    }
  } else if (type === "resale_deduction") {
    mat.totalResold += numQty;
  }

  mat.lastUpdated = new Date().toISOString();

  let taskTitle = undefined;
  if (taskId) {
    const t = tasks.find((item) => item.id === taskId);
    if (t) taskTitle = t.title;
  }

  const newTx: MaterialTransaction = {
    id: `tx-${Date.now()}`,
    materialId,
    siteId: siteId || mat.siteId,
    type,
    quantity: numQty,
    unitPrice: unitPrice ? Number(unitPrice) : mat.unitCost,
    totalCost: numQty * (unitPrice ? Number(unitPrice) : mat.unitCost),
    date: new Date().toISOString(),
    loggedBy: loggedBy || "Site Engineer",
    notes: notes || `Recorded ${type} of ${numQty} ${mat.unit}`,
    invoiceNumber,
    taskId,
    taskTitle,
  };

  transactions.unshift(newTx);
  res.status(201).json({ transaction: newTx, updatedMaterial: mat });
});

// 4. RESALE MARKETPLACE
app.get("/api/marketplace", (req, res) => {
  const { category, condition, status, query } = req.query;
  let result = [...listings];

  if (category && category !== "all") {
    result = result.filter((l) => l.category === category);
  }
  if (condition && condition !== "all") {
    result = result.filter((l) => l.condition === condition);
  }
  if (status && status !== "all") {
    result = result.filter((l) => l.status === status);
  }
  if (query) {
    const q = String(query).toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.post("/api/marketplace", (req, res) => {
  const {
    materialId,
    sellerSiteId,
    sellerName,
    sellerPhone,
    sellerRole,
    title,
    category,
    quantity,
    unit,
    pricePerUnit,
    originalCostPerUnit,
    condition,
    description,
    location,
    city,
    imageUrl,
  } = req.body;

  const newListing: ResaleListing = {
    id: `listing-${Date.now()}`,
    materialId: materialId || "custom",
    sellerSiteId: sellerSiteId || "site-1",
    sellerName: sellerName || "BuildWise Partner Site",
    sellerPhone: sellerPhone || "+91 98220 00000",
    sellerRole: sellerRole || "Site Engineer",
    title,
    category: category || "cement",
    quantity: Number(quantity),
    unit: unit || "Units",
    pricePerUnit: Number(pricePerUnit),
    originalCostPerUnit: Number(originalCostPerUnit) || Number(pricePerUnit) * 1.2,
    condition: condition || "Surplus Leftover (Prime)",
    description,
    location: location || "Nashik Construction Hub",
    city: city || "Nashik",
    imageUrl:
      imageUrl ||
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    status: "available",
    postedDate: new Date().toISOString(),
    inquiriesCount: 0,
    buyerInquiries: [],
  };

  listings.unshift(newListing);

  // If tied to a material, mark as surplus
  if (materialId) {
    const mat = materials.find((m) => m.id === materialId);
    if (mat) {
      mat.isSurplusMarked = true;
    }
  }

  res.status(201).json(newListing);
});

// Buyer sends inquiry / reservation
app.post("/api/marketplace/:id/inquiry", (req, res) => {
  const { id } = req.params;
  const { buyerName, buyerPhone, buyerEmail, offeredPrice, quantityRequested, message } = req.body;

  const item = listings.find((l) => l.id === id);
  if (!item) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const inquiry = {
    id: `inq-${Date.now()}`,
    buyerName: buyerName || "Anonymous Buyer",
    buyerPhone: buyerPhone || "+91 99999 88888",
    buyerEmail: buyerEmail || "buyer@construction.in",
    offeredPrice: Number(offeredPrice) || item.pricePerUnit,
    quantityRequested: Number(quantityRequested) || item.quantity,
    status: "pending" as const,
    message: message || "Interested in purchasing surplus stock. Please confirm pickup time.",
    date: new Date().toISOString(),
  };

  item.buyerInquiries.unshift(inquiry);
  item.inquiriesCount = item.buyerInquiries.length;

  res.status(201).json({ listing: item, newInquiry: inquiry });
});

// Seller updates listing status (available, reserved, sold)
app.patch("/api/marketplace/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const item = listings.find((l) => l.id === id);
  if (!item) {
    return res.status(404).json({ error: "Listing not found" });
  }

  item.status = status;

  // If marked as sold and tied to a material, create a resale_deduction transaction
  if (status === "sold" && item.materialId && item.materialId !== "custom") {
    const mat = materials.find((m) => m.id === item.materialId);
    if (mat) {
      mat.totalResold += item.quantity;
      transactions.unshift({
        id: `tx-${Date.now()}`,
        materialId: mat.id,
        siteId: item.sellerSiteId,
        type: "resale_deduction",
        quantity: item.quantity,
        unitPrice: item.pricePerUnit,
        totalCost: item.quantity * item.pricePerUnit,
        date: new Date().toISOString(),
        loggedBy: item.sellerName,
        notes: `Sold on BuildWise Resale Marketplace: ${item.title}`,
      });
    }
  }

  res.json(item);
});

// 5. TASKS & WORK ASSIGNMENTS
app.get("/api/tasks", (req, res) => {
  const { siteId, status, workerId } = req.query;
  let list = [...tasks];

  if (siteId && siteId !== "all") {
    list = list.filter((t) => t.siteId === siteId);
  }
  if (status && status !== "all") {
    list = list.filter((t) => t.status === status);
  }
  if (workerId && workerId !== "all") {
    list = list.filter((t) => t.assignedWorkerIds.includes(String(workerId)));
  }

  res.json(list);
});

app.post("/api/tasks", (req, res) => {
  const {
    siteId,
    title,
    description,
    category,
    priority,
    assignedWorkerIds,
    dueDate,
    estimatedHours,
    requiredMaterials,
    createdBy,
  } = req.body;

  const newTask: ConstructionTask = {
    id: `task-${Date.now()}`,
    siteId: siteId || "site-1",
    title,
    description: description || "",
    category: category || "General Construction",
    priority: priority || "medium",
    status: "todo",
    assignedWorkerIds: Array.isArray(assignedWorkerIds) ? assignedWorkerIds : [],
    dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    estimatedHours: Number(estimatedHours) || 8,
    actualHours: 0,
    requiredMaterials: requiredMaterials || [],
    createdBy: createdBy || "Site Engineer",
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch("/api/tasks/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, actualHours } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.status = status;
  if (actualHours !== undefined) task.actualHours = Number(actualHours);
  if (status === "completed") {
    task.completedAt = new Date().toISOString();
  }

  res.json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[index] = {
    ...tasks[index],
    ...req.body,
  };

  res.json(tasks[index]);
});

// 6. ATTENDANCE & DIGITAL QR VERIFICATION
app.get("/api/attendance", (req, res) => {
  const { date, siteId, workerId } = req.query;
  let list = [...attendance];

  if (date) {
    list = list.filter((a) => a.date === date);
  }
  if (siteId && siteId !== "all") {
    list = list.filter((a) => a.siteId === siteId);
  }
  if (workerId && workerId !== "all") {
    list = list.filter((a) => a.workerId === workerId);
  }

  res.json(list);
});

// Digital Check-in (supports QR Scan payload or manual override)
app.post("/api/attendance/check-in", (req, res) => {
  const { workerId, siteId, method, verifiedBy } = req.body;

  const worker = users.find((u) => u.id === workerId);
  if (!worker) {
    return res.status(404).json({ error: "Worker not found" });
  }

  const site = sites.find((s) => s.id === siteId) || sites[0];
  const today = new Date().toISOString().split("T")[0];

  // Check if already checked in today
  const existing = attendance.find((a) => a.workerId === workerId && a.date === today);
  if (existing) {
    return res.status(400).json({ error: `Worker ${worker.name} is already checked in for today (${today}) at ${existing.checkInTime}` });
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const record: AttendanceRecord = {
    id: `att-${Date.now()}`,
    workerId: worker.id,
    workerName: worker.name,
    workerRole: worker.skillSpecialty || "Skilled Laborer",
    siteId: site.id,
    siteName: site.name,
    date: today,
    checkInTime: timeStr,
    status: "checked_in",
    method: method || "qr_scan",
    verifiedBy: verifiedBy || "Site Manager Scan",
    dailyWageEarned: worker.dailyRate || 850,
  };

  attendance.unshift(record);
  res.status(201).json(record);
});

// Check-out
app.post("/api/attendance/check-out", (req, res) => {
  const { id, checkOutTime, totalHours, notes } = req.body;

  const record = attendance.find((a) => a.id === id);
  if (!record) {
    return res.status(404).json({ error: "Attendance record not found" });
  }

  const now = new Date();
  const outTimeStr = checkOutTime || now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  record.checkOutTime = outTimeStr;

  const hours = Number(totalHours) || 8.5;
  record.totalHours = hours;
  const overtime = hours > 8 ? Number((hours - 8).toFixed(1)) : 0;
  record.overtimeHours = overtime;
  record.status = overtime > 0 ? "overtime" : hours < 6 ? "half_day" : "present";
  if (notes) record.notes = notes;

  // Recalculate wage with overtime
  const worker = users.find((u) => u.id === record.workerId);
  const baseWage = worker?.dailyRate || 850;
  const hourlyRate = worker?.hourlyRate || Math.round(baseWage / 8);
  record.dailyWageEarned = baseWage + Math.round(overtime * hourlyRate * 1.5);

  res.json(record);
});

// Payroll calculation endpoint
app.get("/api/attendance/payroll", (req, res) => {
  const workerStats: Record<
    string,
    {
      worker: User;
      daysPresent: number;
      totalHours: number;
      overtimeHours: number;
      totalEarnings: number;
      records: AttendanceRecord[];
    }
  > = {};

  const workerUsers = users.filter((u) => u.role === "worker");
  workerUsers.forEach((w) => {
    workerStats[w.id] = {
      worker: w,
      daysPresent: 0,
      totalHours: 0,
      overtimeHours: 0,
      totalEarnings: 0,
      records: [],
    };
  });

  attendance.forEach((rec) => {
    if (workerStats[rec.workerId]) {
      const stats = workerStats[rec.workerId];
      stats.daysPresent += 1;
      stats.totalHours += rec.totalHours || 8;
      stats.overtimeHours += rec.overtimeHours || 0;
      stats.totalEarnings += rec.dailyWageEarned || 850;
      stats.records.push(rec);
    }
  });

  res.json(Object.values(workerStats));
});

// 7. USERS
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { name, role, email, phone, skillSpecialty, dailyRate, hourlyRate, siteIds } = req.body;
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    role: role || "worker",
    email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@buildwise.in`,
    phone: phone || "+91 90000 00000",
    avatar:
      role === "worker"
        ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    siteIds: siteIds || ["site-1"],
    skillSpecialty,
    dailyRate: Number(dailyRate) || 850,
    hourlyRate: Number(hourlyRate) || 110,
    badgeId: `BW-${role.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 8. AI SURPLUS OPTIMIZER / MATERIAL RECOMMENDATIONS
app.post("/api/ai/surplus-optimizer", async (req, res) => {
  try {
    const { siteId } = req.body;
    const targetSite = sites.find((s) => s.id === siteId) || sites[0];
    const siteMaterials = materials.filter((m) => m.siteId === targetSite.id);

    const analysis = siteMaterials.map((m) => {
      const leftover = m.totalPurchased - m.totalUsed - m.totalResold;
      const leftoverValue = leftover * m.unitCost;
      const isHighSurplus = leftover > m.minThreshold * 2;
      const isCriticalLow = leftover < m.minThreshold;

      let recommendation = "";
      if (isCriticalLow) {
        recommendation = `Reorder needed immediately! Stock (${leftover} ${m.unit}) is below safety threshold (${m.minThreshold}).`;
      } else if (isHighSurplus) {
        recommendation = `High surplus detected (${leftover} ${m.unit} worth ₹${leftoverValue.toLocaleString("en-IN")}). Recommend listing 60-80% on BuildWise Resale Marketplace or transferring to ${sites.find((s) => s.id !== targetSite.id)?.name || "sister site"}.`;
      } else {
        recommendation = `Optimal stock buffer for ongoing scheduled tasks.`;
      }

      return {
        materialId: m.id,
        materialName: m.name,
        category: m.category,
        purchased: m.totalPurchased,
        used: m.totalUsed,
        resold: m.totalResold,
        leftover,
        unit: m.unit,
        unitCost: m.unitCost,
        leftoverValue,
        status: isCriticalLow ? "critical_low" : isHighSurplus ? "surplus_excess" : "balanced",
        recommendation,
      };
    });

    res.json({
      siteName: targetSite.name,
      analyzedAt: new Date().toISOString(),
      materialsAnalysis: analysis,
      totalSurplusValueRecoverable: analysis
        .filter((a) => a.status === "surplus_excess")
        .reduce((sum, a) => sum + a.leftoverValue, 0),
      actionableInsights: [
        "Listing 130 Bags of OPC Cement on the marketplace will recover ₹42,900 within 48 hours for Panchavati operations.",
        "Rebar scrap and prime cutoff reuse can save ~2.4 tonnes of carbon footprint.",
        "QR attendance adherence on this site is 96%, minimizing payroll over-disbursements by ~12%.",
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to analyze surplus" });
  }
});

// Vite Middleware for development & Static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BuildWise server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
