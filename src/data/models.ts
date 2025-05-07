// Types for our data models

export type User = {
  id: string;
  name: string;
  email: string;
  role: "superAdmin" | "admin" | "manager" | "cashier" | "waiter" | "chef" | "barista";
  avatar?: string;
  phone?: string;
  hireDate: string;
  status: "active" | "inactive";
  cafeId?: string; // To identify which cafe this user belongs to
};

export type Cafe = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: "active" | "inactive";
  createdAt: string;
  logo?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  image?: string;
  available: boolean;
  preparationTime: number; // in minutes
  allergens?: string[];
  variants?: ProductVariant[];
  customizations?: ProductCustomization[];
  isSpecial?: boolean;
  cafeId?: string; // Added this property to associate products with cafes
};

export type ProductVariant = {
  id: string;
  name: string;
  priceDelta: number;
};

export type ProductCustomization = {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    priceDelta: number;
  }[];
  required: boolean;
  multiSelect: boolean;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  variantId?: string;
  variantName?: string;
  customizations?: {
    name: string;
    option: string;
    priceDelta: number;
  }[];
  notes?: string;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  preparationStartTime?: string;
  preparationEndTime?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  type: "dine-in" | "takeaway" | "delivery" | "online";
  status: "pending" | "confirmed" | "preparing" | "ready" | "served" | "completed" | "cancelled" | "out-for-delivery" | "delivered";
  tableId?: string;
  customerId?: string;
  employeeId: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  servedTime?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "cash" | "card" | "mobile" | "online";
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  notes?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  deliveryInfo?: {
    customerName: string;
    phone: string;
    address: string;
    estimatedDeliveryTime?: number;
  };
  cafeId?: string; // To identify which cafe this order belongs to
};

export type Table = {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  shape: "square" | "rectangle" | "circle" | "custom";
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  currentOrderId?: string;
  reservationId?: string;
  section: string;
  combinedWith?: string[];
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  cost: number;
  supplier?: string;
  location?: string;
  expiryDate?: string;
  lastRestockDate: string;
  barcode?: string;
};

export type Reservation = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  duration: number;
  partySize: number;
  tableIds: string[];
  status: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no-show";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  preOrders?: OrderItem[];
  specialRequests?: string;
  deposit?: number;
  depositPaid?: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  loyaltyPoints: number;
  joinDate: string;
  lastVisit: string;
  totalSpent: number;
  visitCount: number;
  preferences?: string[];
  allergies?: string[];
  notes?: string;
  birthdate?: string;
  address?: string;
  marketingConsent: boolean;
};

export type Shift = {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  status: "scheduled" | "confirmed" | "completed" | "absent";
  hoursWorked?: number;
  breakMinutes?: number;
  notes?: string;
};

export type PaymentStatus = 'paid' | 'due' | 'partially_paid';

export type PaymentDetails = {
  id: string;
  orderId: string;
  tableId?: string;
  customerName?: string;
  amount: number;
  amountPaid: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'online';
  paymentStatus: PaymentStatus;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cafeId?: string; // To identify which cafe this payment belongs to
};
