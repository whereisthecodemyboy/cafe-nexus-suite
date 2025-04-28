
import { Customer, InventoryItem, Order, Product, Reservation, Shift, Table, User } from "./models";

// Sample users
export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@cafenexus.com",
    role: "admin",
    hireDate: "2023-01-15",
    status: "active",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@cafenexus.com",
    role: "manager",
    hireDate: "2023-02-10",
    status: "active",
  },
  {
    id: "u3",
    name: "Michael Johnson",
    email: "michael@cafenexus.com",
    role: "barista",
    hireDate: "2023-03-05",
    status: "active",
  },
  {
    id: "u4",
    name: "Sara Wilson",
    email: "sara@cafenexus.com",
    role: "cashier",
    hireDate: "2023-03-15",
    status: "active",
  },
  {
    id: "u5",
    name: "David Brown",
    email: "david@cafenexus.com",
    role: "chef",
    hireDate: "2023-04-01",
    status: "active",
  },
  {
    id: "u6",
    name: "Lisa Taylor",
    email: "lisa@cafenexus.com",
    role: "waiter",
    hireDate: "2023-04-10",
    status: "inactive",
  },
];

// Sample products
export const products: Product[] = [
  {
    id: "p1",
    name: "Espresso",
    description: "Strong black coffee brewed by forcing hot water through finely-ground coffee beans",
    category: "Coffee",
    price: 3.5,
    cost: 1.2,
    image: "/assets/espresso.jpg",
    available: true,
    preparationTime: 3,
    allergens: [],
    variants: [
      {
        id: "v1",
        name: "Single Shot",
        priceDelta: 0,
      },
      {
        id: "v2",
        name: "Double Shot",
        priceDelta: 1.5,
      },
    ],
    customizations: [
      {
        id: "c1",
        name: "Temperature",
        options: [
          {
            id: "o1",
            name: "Regular",
            priceDelta: 0,
          },
          {
            id: "o2",
            name: "Extra Hot",
            priceDelta: 0,
          },
        ],
        required: true,
        multiSelect: false,
      },
    ],
  },
  {
    id: "p2",
    name: "Cappuccino",
    description: "Coffee drink with espresso, hot milk, and steamed milk foam",
    category: "Coffee",
    price: 4.5,
    cost: 1.8,
    image: "/assets/cappuccino.jpg",
    available: true,
    preparationTime: 5,
    allergens: ["Milk"],
    variants: [
      {
        id: "v3",
        name: "Small",
        priceDelta: -0.5,
      },
      {
        id: "v4",
        name: "Regular",
        priceDelta: 0,
      },
      {
        id: "v5",
        name: "Large",
        priceDelta: 1,
      },
    ],
    customizations: [
      {
        id: "c2",
        name: "Milk",
        options: [
          {
            id: "o3",
            name: "Regular",
            priceDelta: 0,
          },
          {
            id: "o4",
            name: "Skimmed",
            priceDelta: 0,
          },
          {
            id: "o5",
            name: "Almond",
            priceDelta: 0.5,
          },
          {
            id: "o6",
            name: "Oat",
            priceDelta: 0.5,
          },
        ],
        required: true,
        multiSelect: false,
      },
      {
        id: "c3",
        name: "Sweetener",
        options: [
          {
            id: "o7",
            name: "None",
            priceDelta: 0,
          },
          {
            id: "o8",
            name: "Sugar",
            priceDelta: 0,
          },
          {
            id: "o9",
            name: "Honey",
            priceDelta: 0.3,
          },
        ],
        required: false,
        multiSelect: false,
      },
    ],
  },
  {
    id: "p3",
    name: "Breakfast Sandwich",
    description: "Egg, cheese, and bacon on a toasted English muffin",
    category: "Food",
    price: 6.5,
    cost: 2.5,
    image: "/assets/breakfast_sandwich.jpg",
    available: true,
    preparationTime: 8,
    allergens: ["Gluten", "Eggs", "Dairy"],
    customizations: [
      {
        id: "c4",
        name: "Protein",
        options: [
          {
            id: "o10",
            name: "Bacon",
            priceDelta: 0,
          },
          {
            id: "o11",
            name: "Sausage",
            priceDelta: 0.5,
          },
          {
            id: "o12",
            name: "No Meat",
            priceDelta: -1,
          },
        ],
        required: true,
        multiSelect: false,
      },
      {
        id: "c5",
        name: "Add-ons",
        options: [
          {
            id: "o13",
            name: "Extra Cheese",
            priceDelta: 1,
          },
          {
            id: "o14",
            name: "Avocado",
            priceDelta: 1.5,
          },
          {
            id: "o15",
            name: "Tomato",
            priceDelta: 0.5,
          },
        ],
        required: false,
        multiSelect: true,
      },
    ],
  },
  {
    id: "p4",
    name: "Avocado Toast",
    description: "Smashed avocado on artisanal sourdough toast with cherry tomatoes",
    category: "Food",
    price: 8.5,
    cost: 3.5,
    image: "/assets/avocado_toast.jpg",
    available: true,
    preparationTime: 6,
    allergens: ["Gluten"],
    customizations: [
      {
        id: "c6",
        name: "Add-ons",
        options: [
          {
            id: "o16",
            name: "Poached Egg",
            priceDelta: 1.5,
          },
          {
            id: "o17",
            name: "Feta Cheese",
            priceDelta: 1,
          },
          {
            id: "o18",
            name: "Smoked Salmon",
            priceDelta: 2.5,
          },
        ],
        required: false,
        multiSelect: true,
      },
    ],
    isSpecial: true,
  },
  {
    id: "p5",
    name: "Blueberry Muffin",
    description: "Freshly baked muffin loaded with blueberries",
    category: "Bakery",
    price: 3.5,
    cost: 1.2,
    image: "/assets/blueberry_muffin.jpg",
    available: true,
    preparationTime: 0,
    allergens: ["Gluten", "Eggs", "Dairy"],
  },
  {
    id: "p6",
    name: "Seasonal Fruit Smoothie",
    description: "Blend of seasonal fruits with yogurt",
    category: "Drinks",
    price: 5.5,
    cost: 2,
    image: "/assets/smoothie.jpg",
    available: true,
    preparationTime: 4,
    allergens: ["Dairy"],
    variants: [
      {
        id: "v6",
        name: "Regular",
        priceDelta: 0,
      },
      {
        id: "v7",
        name: "Large",
        priceDelta: 1.5,
      },
    ],
    customizations: [
      {
        id: "c7",
        name: "Base",
        options: [
          {
            id: "o19",
            name: "Yogurt",
            priceDelta: 0,
          },
          {
            id: "o20",
            name: "Almond Milk",
            priceDelta: 0.5,
          },
          {
            id: "o21",
            name: "Coconut Water",
            priceDelta: 0.5,
          },
        ],
        required: true,
        multiSelect: false,
      },
      {
        id: "c8",
        name: "Add-ins",
        options: [
          {
            id: "o22",
            name: "Protein Powder",
            priceDelta: 1.5,
          },
          {
            id: "o23",
            name: "Chia Seeds",
            priceDelta: 0.75,
          },
          {
            id: "o24",
            name: "Spinach",
            priceDelta: 0.5,
          },
        ],
        required: false,
        multiSelect: true,
      },
    ],
    isSpecial: true,
  },
];

// Sample tables
export const tables: Table[] = [
  {
    id: "t1",
    name: "Table 1",
    capacity: 2,
    status: "available",
    shape: "circle",
    positionX: 50,
    positionY: 50,
    width: 80,
    height: 80,
    section: "Main Area",
  },
  {
    id: "t2",
    name: "Table 2",
    capacity: 2,
    status: "occupied",
    shape: "circle",
    positionX: 150,
    positionY: 50,
    width: 80,
    height: 80,
    section: "Main Area",
    currentOrderId: "o1",
  },
  {
    id: "t3",
    name: "Table 3",
    capacity: 4,
    status: "available",
    shape: "rectangle",
    positionX: 250,
    positionY: 50,
    width: 100,
    height: 80,
    section: "Main Area",
  },
  {
    id: "t4",
    name: "Table 4",
    capacity: 4,
    status: "reserved",
    shape: "rectangle",
    positionX: 50,
    positionY: 150,
    width: 100,
    height: 80,
    section: "Main Area",
    reservationId: "r1",
  },
  {
    id: "t5",
    name: "Table 5",
    capacity: 6,
    status: "available",
    shape: "rectangle",
    positionX: 170,
    positionY: 150,
    width: 130,
    height: 80,
    section: "Main Area",
  },
  {
    id: "t6",
    name: "Window 1",
    capacity: 2,
    status: "occupied",
    shape: "rectangle",
    positionX: 320,
    positionY: 150,
    width: 80,
    height: 60,
    section: "Window",
    currentOrderId: "o2",
  },
  {
    id: "t7",
    name: "Window 2",
    capacity: 2,
    status: "cleaning",
    shape: "rectangle",
    positionX: 420,
    positionY: 150,
    width: 80,
    height: 60,
    section: "Window",
  },
  {
    id: "t8",
    name: "Booth 1",
    capacity: 4,
    status: "available",
    shape: "rectangle",
    positionX: 50,
    positionY: 250,
    width: 100,
    height: 100,
    section: "Booth Area",
  },
  {
    id: "t9",
    name: "Booth 2",
    capacity: 4,
    status: "occupied",
    shape: "rectangle",
    positionX: 170,
    positionY: 250,
    width: 100,
    height: 100,
    section: "Booth Area",
    currentOrderId: "o3",
  },
];

// Sample orders
export const orders: Order[] = [
  {
    id: "o1",
    orderNumber: "ORD-2023-0001",
    type: "dine-in",
    status: "serving",
    tableId: "t2",
    employeeId: "u6",
    items: [
      {
        id: "oi1",
        productId: "p2",
        productName: "Cappuccino",
        quantity: 2,
        unitPrice: 4.5,
        variantId: "v4",
        variantName: "Regular",
        customizations: [
          {
            name: "Milk",
            option: "Oat",
            priceDelta: 0.5,
          },
        ],
        status: "ready",
      },
      {
        id: "oi2",
        productId: "p3",
        productName: "Breakfast Sandwich",
        quantity: 1,
        unitPrice: 6.5,
        customizations: [
          {
            name: "Protein",
            option: "Bacon",
            priceDelta: 0,
          },
        ],
        status: "served",
      },
    ],
    createdAt: "2023-06-15T09:30:00Z",
    updatedAt: "2023-06-15T09:45:00Z",
    paymentStatus: "pending",
    subtotal: 15.5,
    tax: 1.55,
    total: 17.05,
  },
  {
    id: "o2",
    orderNumber: "ORD-2023-0002",
    type: "dine-in",
    status: "completed",
    tableId: "t6",
    employeeId: "u4",
    items: [
      {
        id: "oi3",
        productId: "p1",
        productName: "Espresso",
        quantity: 1,
        unitPrice: 3.5,
        variantId: "v2",
        variantName: "Double Shot",
        status: "served",
      },
      {
        id: "oi4",
        productId: "p5",
        productName: "Blueberry Muffin",
        quantity: 1,
        unitPrice: 3.5,
        status: "served",
      },
    ],
    createdAt: "2023-06-15T10:15:00Z",
    updatedAt: "2023-06-15T10:45:00Z",
    servedTime: "2023-06-15T10:25:00Z",
    paymentStatus: "paid",
    paymentMethod: "card",
    subtotal: 8.5,
    tax: 0.85,
    total: 9.35,
  },
  {
    id: "o3",
    orderNumber: "ORD-2023-0003",
    type: "dine-in",
    status: "preparing",
    tableId: "t9",
    employeeId: "u6",
    items: [
      {
        id: "oi5",
        productId: "p4",
        productName: "Avocado Toast",
        quantity: 1,
        unitPrice: 8.5,
        customizations: [
          {
            name: "Add-ons",
            option: "Poached Egg",
            priceDelta: 1.5,
          },
          {
            name: "Add-ons",
            option: "Feta Cheese",
            priceDelta: 1,
          },
        ],
        status: "preparing",
      },
      {
        id: "oi6",
        productId: "p6",
        productName: "Seasonal Fruit Smoothie",
        quantity: 1,
        unitPrice: 5.5,
        variantId: "v6",
        variantName: "Regular",
        customizations: [
          {
            name: "Base",
            option: "Almond Milk",
            priceDelta: 0.5,
          },
        ],
        status: "pending",
      },
    ],
    createdAt: "2023-06-15T11:00:00Z",
    updatedAt: "2023-06-15T11:05:00Z",
    paymentStatus: "pending",
    subtotal: 17,
    tax: 1.7,
    total: 18.7,
  },
  {
    id: "o4",
    orderNumber: "ORD-2023-0004",
    type: "takeaway",
    status: "ready",
    employeeId: "u4",
    customerId: "c1",
    items: [
      {
        id: "oi7",
        productId: "p2",
        productName: "Cappuccino",
        quantity: 1,
        unitPrice: 4.5,
        variantId: "v5",
        variantName: "Large",
        status: "ready",
      },
    ],
    createdAt: "2023-06-15T11:30:00Z",
    updatedAt: "2023-06-15T11:40:00Z",
    paymentStatus: "paid",
    paymentMethod: "cash",
    subtotal: 5.5,
    tax: 0.55,
    total: 6.05,
  },
];

// Sample inventory items
export const inventoryItems: InventoryItem[] = [
  {
    id: "i1",
    name: "Coffee Beans (Arabica)",
    category: "Ingredients",
    unit: "kg",
    currentStock: 15,
    minimumStock: 5,
    cost: 20,
    supplier: "Coffee Suppliers Inc.",
    lastRestockDate: "2023-06-01",
  },
  {
    id: "i2",
    name: "Whole Milk",
    category: "Ingredients",
    unit: "liter",
    currentStock: 25,
    minimumStock: 10,
    cost: 1.5,
    supplier: "Local Dairy Farm",
    location: "Fridge 1",
    expiryDate: "2023-06-20",
    lastRestockDate: "2023-06-12",
  },
  {
    id: "i3",
    name: "Almond Milk",
    category: "Ingredients",
    unit: "liter",
    currentStock: 8,
    minimumStock: 5,
    cost: 2.5,
    supplier: "Health Foods Co.",
    location: "Fridge 1",
    expiryDate: "2023-07-01",
    lastRestockDate: "2023-06-10",
  },
  {
    id: "i4",
    name: "English Muffins",
    category: "Ingredients",
    unit: "pack",
    currentStock: 12,
    minimumStock: 5,
    cost: 3.5,
    supplier: "Bakery Supplies Ltd.",
    location: "Shelf 2",
    expiryDate: "2023-06-25",
    lastRestockDate: "2023-06-05",
  },
  {
    id: "i5",
    name: "Paper Cups (12oz)",
    category: "Supplies",
    unit: "box",
    currentStock: 5,
    minimumStock: 2,
    cost: 15,
    supplier: "Eco Supplies Inc.",
    location: "Storage Room",
    lastRestockDate: "2023-05-20",
  },
  {
    id: "i6",
    name: "Napkins",
    category: "Supplies",
    unit: "pack",
    currentStock: 20,
    minimumStock: 10,
    cost: 2,
    supplier: "Eco Supplies Inc.",
    location: "Storage Room",
    lastRestockDate: "2023-05-15",
  },
  {
    id: "i7",
    name: "Avocados",
    category: "Ingredients",
    unit: "pieces",
    currentStock: 15,
    minimumStock: 8,
    cost: 1.2,
    supplier: "Fresh Produce Co.",
    location: "Fridge 2",
    expiryDate: "2023-06-18",
    lastRestockDate: "2023-06-12",
  },
  {
    id: "i8",
    name: "Bacon",
    category: "Ingredients",
    unit: "kg",
    currentStock: 3,
    minimumStock: 2,
    cost: 8,
    supplier: "Meat Suppliers Ltd.",
    location: "Fridge 3",
    expiryDate: "2023-06-20",
    lastRestockDate: "2023-06-08",
  },
];

// Sample customers
export const customers: Customer[] = [
  {
    id: "c1",
    name: "Emily Johnson",
    email: "emily@example.com",
    phone: "555-1234",
    loyaltyPoints: 120,
    joinDate: "2023-01-10",
    lastVisit: "2023-06-14",
    totalSpent: 358.5,
    visitCount: 15,
    preferences: ["Almond Milk", "Strong Coffee"],
    allergies: ["Gluten"],
    marketingConsent: true,
  },
  {
    id: "c2",
    name: "Robert Smith",
    email: "robert@example.com",
    phone: "555-5678",
    loyaltyPoints: 85,
    joinDate: "2023-02-05",
    lastVisit: "2023-06-10",
    totalSpent: 210.75,
    visitCount: 9,
    preferences: ["Oat Milk", "Window Seat"],
    marketingConsent: false,
  },
  {
    id: "c3",
    name: "Sophia Lee",
    phone: "555-9012",
    loyaltyPoints: 45,
    joinDate: "2023-03-20",
    lastVisit: "2023-05-30",
    totalSpent: 95.25,
    visitCount: 4,
    preferences: [],
    allergies: ["Dairy", "Nuts"],
    marketingConsent: true,
  },
];

// Sample reservations
export const reservations: Reservation[] = [
  {
    id: "r1",
    customerName: "William Davis",
    customerPhone: "555-3456",
    customerEmail: "william@example.com",
    date: "2023-06-15",
    time: "18:00",
    duration: 90,
    partySize: 4,
    tableIds: ["t4"],
    status: "confirmed",
    notes: "Birthday celebration",
    createdAt: "2023-06-10T14:30:00Z",
    updatedAt: "2023-06-10T14:30:00Z",
    specialRequests: "Window seat if possible",
  },
  {
    id: "r2",
    customerName: "Maria Garcia",
    customerPhone: "555-7890",
    date: "2023-06-16",
    time: "12:30",
    duration: 60,
    partySize: 2,
    tableIds: ["t1"],
    status: "pending",
    createdAt: "2023-06-12T09:15:00Z",
    updatedAt: "2023-06-12T09:15:00Z",
  },
  {
    id: "r3",
    customerName: "James Wilson",
    customerPhone: "555-2345",
    customerEmail: "james@example.com",
    date: "2023-06-16",
    time: "19:00",
    duration: 120,
    partySize: 6,
    tableIds: ["t5"],
    status: "confirmed",
    createdAt: "2023-06-11T16:45:00Z",
    updatedAt: "2023-06-12T10:20:00Z",
    preOrders: [
      {
        id: "poi1",
        productId: "p4",
        productName: "Avocado Toast",
        quantity: 2,
        unitPrice: 8.5,
        status: "pending",
      },
      {
        id: "poi2",
        productId: "p6",
        productName: "Seasonal Fruit Smoothie",
        quantity: 3,
        unitPrice: 5.5,
        status: "pending",
      },
    ],
    deposit: 20,
    depositPaid: true,
  },
];

// Sample shifts
export const shifts: Shift[] = [
  {
    id: "s1",
    employeeId: "u3",
    date: "2023-06-15",
    startTime: "08:00",
    endTime: "16:00",
    role: "barista",
    status: "confirmed",
  },
  {
    id: "s2",
    employeeId: "u4",
    date: "2023-06-15",
    startTime: "08:00",
    endTime: "16:00",
    role: "cashier",
    status: "confirmed",
  },
  {
    id: "s3",
    employeeId: "u5",
    date: "2023-06-15",
    startTime: "10:00",
    endTime: "18:00",
    role: "chef",
    status: "confirmed",
  },
  {
    id: "s4",
    employeeId: "u6",
    date: "2023-06-15",
    startTime: "10:00",
    endTime: "18:00",
    role: "waiter",
    status: "confirmed",
  },
  {
    id: "s5",
    employeeId: "u2",
    date: "2023-06-15",
    startTime: "09:00",
    endTime: "17:00",
    role: "manager",
    status: "confirmed",
  },
  {
    id: "s6",
    employeeId: "u3",
    date: "2023-06-16",
    startTime: "08:00",
    endTime: "16:00",
    role: "barista",
    status: "scheduled",
  },
  {
    id: "s7",
    employeeId: "u4",
    date: "2023-06-16",
    startTime: "08:00",
    endTime: "16:00",
    role: "cashier",
    status: "scheduled",
  },
  {
    id: "s8",
    employeeId: "u5",
    date: "2023-06-16",
    startTime: "10:00",
    endTime: "18:00",
    role: "chef",
    status: "scheduled",
  },
  {
    id: "s9",
    employeeId: "u6",
    date: "2023-06-16",
    startTime: "10:00",
    endTime: "18:00",
    role: "waiter",
    status: "scheduled",
  },
];

// Generate sales data for analytics
export const generateSalesData = (days = 30) => {
  const data = [];
  const categories = ["Coffee", "Food", "Bakery", "Drinks"];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];
    
    const dailyData: any = {
      date: dateStr,
      total: 0,
    };
    
    // Generate revenue for each category
    categories.forEach(category => {
      // Randomize sales but with a realistic pattern
      let sales = 0;
      if (category === "Coffee") {
        // Coffee has highest sales
        sales = 150 + Math.random() * 100;
        // Weekend boost
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          sales *= 1.3;
        }
      } else if (category === "Food") {
        // Food is second highest
        sales = 120 + Math.random() * 80;
        // Weekend boost
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          sales *= 1.4;
        }
      } else if (category === "Bakery") {
        sales = 80 + Math.random() * 40;
      } else {
        // Drinks
        sales = 60 + Math.random() * 50;
        // Higher on hot days (simulate with modulo for demo)
        if (i % 5 === 0) {
          sales *= 1.4;
        }
      }
      
      // Round to 2 decimal places
      sales = Math.round(sales * 100) / 100;
      dailyData[category] = sales;
      dailyData.total += sales;
    });
    
    // Round total
    dailyData.total = Math.round(dailyData.total * 100) / 100;
    
    data.push(dailyData);
  }
  
  return data;
};

export const salesData = generateSalesData();

// Generate hourly traffic data
export const generateHourlyTraffic = () => {
  const data = [];
  for (let hour = 6; hour <= 22; hour++) {
    let traffic;
    
    // Morning rush
    if (hour >= 7 && hour <= 10) {
      traffic = 70 + Math.random() * 30;
    }
    // Lunch rush
    else if (hour >= 11 && hour <= 14) {
      traffic = 85 + Math.random() * 15;
    }
    // Afternoon lull
    else if (hour >= 15 && hour <= 16) {
      traffic = 40 + Math.random() * 20;
    }
    // Evening rush
    else if (hour >= 17 && hour <= 19) {
      traffic = 65 + Math.random() * 25;
    }
    // Late evening
    else if (hour >= 20) {
      traffic = 30 + Math.random() * 20;
    }
    // Early morning
    else {
      traffic = 10 + Math.random() * 20;
    }
    
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? 'AM' : 'PM';
    
    data.push({
      hour: `${displayHour}${amPm}`,
      traffic: Math.round(traffic),
    });
  }
  return data;
};

export const hourlyTraffic = generateHourlyTraffic();

// Generate popular items data
export const popularItems = [
  { name: "Cappuccino", sales: 145, revenue: 652.5 },
  { name: "Espresso", sales: 120, revenue: 420 },
  { name: "Breakfast Sandwich", sales: 95, revenue: 617.5 },
  { name: "Avocado Toast", sales: 85, revenue: 722.5 },
  { name: "Blueberry Muffin", sales: 80, revenue: 280 },
  { name: "Seasonal Fruit Smoothie", sales: 60, revenue: 330 },
];
