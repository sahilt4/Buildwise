export type UserRole = 'builder' | 'engineer' | 'worker' | 'buyer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
  siteIds: string[];
  skillSpecialty?: string;
  hourlyRate?: number; // In INR
  dailyRate?: number;
  badgeId: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  city: string;
  builderId: string;
  engineerId: string;
  status: 'active' | 'nearing_completion' | 'completed' | 'planning';
  budget: number;
  budgetSpent: number;
  startDate: string;
  targetEndDate: string;
  progressPercentage: number;
}

export type MaterialCategory =
  | 'cement'
  | 'steel'
  | 'bricks'
  | 'tiles'
  | 'sand_aggregates'
  | 'paint'
  | 'plumbing'
  | 'electrical'
  | 'wood_timber'
  | 'other';

export interface Material {
  id: string;
  siteId: string;
  name: string;
  category: MaterialCategory;
  brand: string;
  unit: string; // 'Bags (50kg)', 'Metric Tonnes', 'Pieces', 'Sq. Ft.', 'Brass/Cubic Ft', 'Litres'
  totalPurchased: number;
  totalUsed: number;
  totalResold: number;
  unitCost: number; // Cost in INR per unit
  minThreshold: number; // Low stock alert threshold
  lastUpdated: string;
  isSurplusMarked?: boolean;
}

export interface MaterialTransaction {
  id: string;
  materialId: string;
  siteId: string;
  type: 'purchase' | 'usage' | 'wastage_adjustment' | 'resale_deduction';
  quantity: number;
  unitPrice?: number;
  totalCost?: number;
  date: string;
  loggedBy: string;
  notes: string;
  invoiceNumber?: string;
  taskId?: string;
  taskTitle?: string;
}

export interface ResaleListing {
  id: string;
  materialId: string;
  sellerSiteId: string;
  sellerName: string;
  sellerPhone: string;
  sellerRole: string;
  title: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  originalCostPerUnit: number;
  condition: 'Unopened / Factory Pack' | 'Surplus Leftover (Prime)' | 'Good Usable Condition' | 'Partial Lot';
  description: string;
  location: string;
  city: string;
  imageUrl: string;
  status: 'available' | 'reserved' | 'sold';
  postedDate: string;
  inquiriesCount: number;
  buyerInquiries: Array<{
    id: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    offeredPrice: number;
    quantityRequested: number;
    status: 'pending' | 'accepted' | 'declined';
    message: string;
    date: string;
  }>;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface ConstructionTask {
  id: string;
  siteId: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedWorkerIds: string[];
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  requiredMaterials?: Array<{
    materialId: string;
    materialName: string;
    estimatedQty: number;
    actualUsedQty: number;
    unit: string;
  }>;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerRole: string;
  siteId: string;
  siteName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  totalHours?: number;
  overtimeHours?: number;
  status: 'present' | 'half_day' | 'overtime' | 'checked_in';
  method: 'qr_scan' | 'manual_override' | 'digital_badge';
  notes?: string;
  verifiedBy?: string;
  dailyWageEarned?: number;
}

export interface SustainabilityMetrics {
  totalWasteDivertedKg: number;
  carbonOffsetKg: number;
  financialValueRecoveredInr: number;
  surplusReuseRate: number;
  materialsSavedCount: number;
}
