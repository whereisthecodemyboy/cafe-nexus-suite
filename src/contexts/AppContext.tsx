import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  User, 
  Product, 
  Order, 
  Table, 
  InventoryItem, 
  Customer, 
  Reservation, 
  PaymentDetails,
  OrderItem,
  Cafe
} from '@/data/models';
import { 
  users, 
  products, 
  orders, 
  tables, 
  inventoryItems, 
  customers, 
  reservations, 
  salesData, 
  hourlyTraffic, 
  popularItems 
} from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  // User related
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: User, password: string) => void;
  updateUser: (user: User) => void;
  deleteUser?: (id: string) => void;
  
  // Permission checks
  canAccess: (feature: string) => boolean;
  
  // Cafe related
  cafes: Cafe[];
  currentCafe: Cafe | null;
  addCafe: (cafe: Cafe) => void;
  updateCafe: (cafe: Cafe) => void;
  deleteCafe: (id: string) => void;
  switchCafe: (cafeId: string) => void;
  
  // Products related
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Orders related
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  updateOrderItem: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  
  // Tables related
  tables: Table[];
  addTable: (table: Table) => void;
  updateTable: (table: Table) => void;
  deleteTable: (id: string) => void;
  
  // Inventory related
  inventoryItems: InventoryItem[];
  updateInventoryItem: (item: InventoryItem) => void;
  addInventoryItem: (item: InventoryItem) => void;
  
  // Customer related
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  
  // Reservation related
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (reservation: Reservation) => void;
  deleteReservation: (id: string) => void;

  // Analytics related
  salesData: any[];
  hourlyTraffic: any[];
  popularItems: any[];

  // Payment related
  paymentDetails: PaymentDetails[];
  addPaymentDetails: (details: PaymentDetails) => void;
  updatePaymentDetails: (details: PaymentDetails) => void;

  // Settings related
  businessInfo: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
  };
  taxSettings: {
    taxRate: number;
    taxIncluded: boolean;
  };
  updateBusinessInfo: (info: any) => void;
  updateTaxSettings: (settings: any) => void;

  // Subscription related
  isCafeSubscriptionActive: () => boolean;
  grantVipAccess: (cafeId: string, reason: string) => void;
  revokeVipAccess: (cafeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Sample cafes data - representing multiple cafes in the platform
  const initialCafes: Cafe[] = [
    {
      id: "cafe-001",
      name: "Café Nexus Downtown",
      address: "123 Main Street, Downtown",
      phone: "+1 (555) 123-4567",
      email: "downtown@cafenexus.com",
      status: "active",
      createdAt: "2023-01-01",
      logo: "/assets/logo-1.png",
      subscription: {
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        plan: "premium",
        lastPaymentDate: new Date().toISOString(),
        amount: 199,
        isVip: false
      }
    },
    {
      id: "cafe-002",
      name: "Café Nexus Uptown",
      address: "456 High Street, Uptown",
      phone: "+1 (555) 987-6543",
      email: "uptown@cafenexus.com",
      status: "active",
      createdAt: "2023-02-15",
      logo: "/assets/logo-2.png",
      subscription: {
        isActive: false,
        expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        plan: "basic",
        lastPaymentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 99,
        isVip: false
      }
    },
    {
      id: "cafe-003",
      name: "Brew & Bean Coffee",
      address: "789 Coffee Lane, Midtown",
      phone: "+1 (555) 456-7890",
      email: "contact@brewandbean.com",
      status: "active",
      createdAt: "2023-03-20",
      logo: "/assets/logo-3.png",
      subscription: {
        isActive: false,
        expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        plan: "basic",
        lastPaymentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 99,
        isVip: true,
        vipReason: "Partner cafe - complimentary access"
      }
    },
    {
      id: "cafe-004",
      name: "Urban Grind",
      address: "321 Urban Street, City Center",
      phone: "+1 (555) 654-3210",
      email: "info@urbangrind.com",
      status: "active",
      createdAt: "2023-04-10",
      logo: "/assets/logo-4.png",
      subscription: {
        isActive: true,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        plan: "enterprise",
        lastPaymentDate: new Date().toISOString(),
        amount: 299,
        isVip: false
      }
    }
  ];

  // Initialize with a superAdmin user and cafe-specific users
  const initialUsers = [
    // Super Admin - has access to all cafes
    {
      id: uuidv4(),
      name: "System Administrator",
      email: "admin@cafeplatform.com",
      role: "superAdmin" as User['role'],
      avatar: "/assets/admin-avatar.png",
      phone: "+1 (555) 987-6543",
      hireDate: "2023-01-01",
      status: "active" as User['status'],
      // SuperAdmin doesn't belong to any specific cafe
    },
    // Cafe Admin for Downtown location
    {
      id: uuidv4(),
      name: "Downtown Admin",
      email: "admin@cafenexus.com",
      role: "admin" as User['role'],
      avatar: "/assets/admin-avatar.png",
      phone: "+1 (555) 123-4567",
      hireDate: "2023-01-01",
      status: "active" as User['status'],
      cafeId: "cafe-001"
    },
    // Cafe Nexus Downtown users
    ...users.map(user => ({ ...user, cafeId: "cafe-001" })),
    // Additional cafe admins
    {
      id: uuidv4(),
      name: "Emma Rodriguez",
      email: "emma@brewandbean.com",
      role: "admin" as User['role'],
      avatar: "/assets/admin-avatar.png",
      phone: "+1 (555) 789-0123",
      hireDate: "2023-03-20",
      status: "active" as User['status'],
      cafeId: "cafe-003"
    },
    {
      id: uuidv4(),
      name: "Alex Chen",
      email: "alex@urbangrind.com",
      role: "admin" as User['role'],
      avatar: "/assets/admin-avatar.png",
      phone: "+1 (555) 321-0987",
      hireDate: "2023-04-10",
      status: "active" as User['status'],
      cafeId: "cafe-004"
    }
  ];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUsers, setAppUsers] = useState<User[]>(initialUsers);
  const [appCafes, setAppCafes] = useState<Cafe[]>(initialCafes);
  const [currentCafe, setCurrentCafe] = useState<Cafe | null>(null);
  const [appProducts, setAppProducts] = useState<Product[]>(products.map(p => ({ ...p, cafeId: "cafe-001" })));
  const [appOrders, setAppOrders] = useState<Order[]>(orders.map(o => ({ ...o, cafeId: "cafe-001" })));
  const [appTables, setAppTables] = useState<Table[]>(tables);
  const [appInventoryItems, setAppInventoryItems] = useState<InventoryItem[]>(inventoryItems);
  const [appCustomers, setAppCustomers] = useState<Customer[]>(customers);
  const [appReservations, setAppReservations] = useState<Reservation[]>(reservations);
  const [appSalesData] = useState(salesData);
  const [appHourlyTraffic] = useState(hourlyTraffic);
  const [appPopularItems] = useState(popularItems);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails[]>([]);

  // Store passwords in memory (in a real app this would be handled by backend)
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>({
    // Super Admin
    'admin@cafeplatform.com': 'admin123',
    // Cafe Admin for Downtown
    'admin@cafenexus.com': 'admin123',
    // Staff users from mock data
    'john@cafenexus.com': 'password123',
    'jane@cafenexus.com': 'password123',
    'michael@cafenexus.com': 'password123',
    'sara@cafenexus.com': 'password123',
    'david@cafenexus.com': 'password123',
    'lisa@cafenexus.com': 'password123',
    // Other cafe admins
    'downtown@cafenexus.com': 'cafe123',
    'uptown@cafenexus.com': 'cafe456',
    'emma@brewandbean.com': 'cafe789',
    'alex@urbangrind.com': 'cafe012'
  });

  // Permission system based on roles
  const rolePermissions = {
    superAdmin: ['all'],
    admin: ['dashboard', 'employees', 'menu', 'orders', 'tables', 'inventory', 'customers', 'reservations', 'analytics', 'settings', 'pos', 'kitchen', 'delivery', 'cashflow'],
    manager: ['dashboard', 'employees', 'menu', 'orders', 'tables', 'inventory', 'customers', 'reservations', 'analytics', 'pos', 'kitchen', 'delivery', 'cashflow'],
    cashier: ['dashboard', 'pos', 'orders', 'customers', 'cashflow'],
    waiter: ['dashboard', 'pos', 'orders', 'tables', 'customers', 'reservations'],
    chef: ['dashboard', 'kitchen', 'orders', 'inventory'],
    barista: ['dashboard', 'pos', 'orders', 'menu']
  };

  const canAccess = (feature: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'superAdmin') return true;
    
    const permissions = rolePermissions[currentUser.role] || [];
    return permissions.includes(feature) || permissions.includes('all');
  };

  // Settings state - now represents platform-wide default settings
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Cafe Management Platform',
    logo: '/assets/logo.png',
    address: 'Platform Headquarters',
    phone: '+1 (555) 100-2000',
    email: 'info@cafeplatform.com',
  });
  
  const [taxSettings, setTaxSettings] = useState({
    taxRate: 8.5,
    taxIncluded: false,
  });
  
  // Authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Attempting login with:', email, password);
        console.log('Available users:', appUsers.map(u => u.email));
        console.log('Password check for', email, ':', userPasswords[email]);
        
        const foundUser = appUsers.find(user => user.email === email && user.status === 'active');
        
        // Check if password matches
        if (foundUser && userPasswords[email] === password) {
          setCurrentUser(foundUser);
          
          // Set current cafe for this user
          if (foundUser.cafeId) {
            const userCafe = appCafes.find(cafe => cafe.id === foundUser.cafeId);
            if (userCafe) setCurrentCafe(userCafe);
          }
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentCafe(null);
  };

  // User management functions
  const addUser = (user: User, password: string) => {
    setAppUsers([...appUsers, user]);
    setUserPasswords({...userPasswords, [user.email]: password});
  };

  const updateUser = (user: User) => {
    setAppUsers(appUsers.map(u => u.id === user.id ? user : u));
    
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
    }
  };

  const deleteUser = (id: string) => {
    const userToDelete = appUsers.find(u => u.id === id);
    if (userToDelete) {
      setAppUsers(appUsers.filter(u => u.id !== id));
      
      if (userToDelete.email) {
        const { [userToDelete.email]: _, ...rest } = userPasswords;
        setUserPasswords(rest);
      }
    }
  };

  // Cafe management functions
  const addCafe = (cafe: Cafe) => {
    setAppCafes([...appCafes, cafe]);
  };

  const updateCafe = (cafe: Cafe) => {
    setAppCafes(appCafes.map(c => c.id === cafe.id ? cafe : c));
    
    if (currentCafe && currentCafe.id === cafe.id) {
      setCurrentCafe(cafe);
    }
  };

  const deleteCafe = (id: string) => {
    setAppCafes(appCafes.filter(cafe => cafe.id !== id));
    
    if (currentCafe && currentCafe.id === id) {
      setCurrentCafe(null);
    }
    
    setAppUsers(appUsers.map(user => 
      user.cafeId === id ? { ...user, cafeId: undefined, status: 'inactive' as const } : user
    ));
  };

  const switchCafe = (cafeId: string) => {
    const cafe = appCafes.find(c => c.id === cafeId);
    if (cafe) {
      setCurrentCafe(cafe);
    }
  };

  // Product functions
  const addProduct = (product: Product) => {
    setAppProducts([...appProducts, product]);
  };

  const updateProduct = (product: Product) => {
    setAppProducts(appProducts.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setAppProducts(appProducts.filter(p => p.id !== id));
  };

  // Order functions
  const addOrder = (order: Order) => {
    setAppOrders([...appOrders, order]);
  };

  const updateOrder = (order: Order) => {
    setAppOrders(appOrders.map(o => o.id === order.id ? order : o));
  };

  const deleteOrder = (id: string) => {
    setAppOrders(appOrders.filter(o => o.id !== id));
  };
  
  // New function to update order item status
  const updateOrderItem = (orderId: string, itemId: string, status: OrderItem['status']) => {
    setAppOrders(appOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            return { ...item, status };
          }
          return item;
        });
        return { ...order, items: updatedItems };
      }
      return order;
    }));
  };

  // Table functions
  const addTable = (table: Table) => {
    setAppTables([...appTables, table]);
  };

  const updateTable = (table: Table) => {
    setAppTables(appTables.map(t => t.id === table.id ? table : t));
  };

  const deleteTable = (id: string) => {
    setAppTables(appTables.filter(t => t.id !== id));
  };

  // Inventory functions
  const updateInventoryItem = (item: InventoryItem) => {
    setAppInventoryItems(appInventoryItems.map(i => i.id === item.id ? item : i));
  };
  
  const addInventoryItem = (item: InventoryItem) => {
    setAppInventoryItems([...appInventoryItems, item]);
  };

  // Customer functions
  const addCustomer = (customer: Customer) => {
    setAppCustomers([...appCustomers, customer]);
  };

  const updateCustomer = (customer: Customer) => {
    setAppCustomers(appCustomers.map(c => c.id === customer.id ? customer : c));
  };

  // Reservation functions
  const addReservation = (reservation: Reservation) => {
    setAppReservations([...appReservations, reservation]);
  };

  const updateReservation = (reservation: Reservation) => {
    setAppReservations(appReservations.map(r => r.id === reservation.id ? reservation : r));
  };

  const deleteReservation = (id: string) => {
    setAppReservations(appReservations.filter(r => r.id !== id));
  };

  const addPaymentDetails = (details: PaymentDetails) => {
    setPaymentDetails([...paymentDetails, details]);
  };

  const updatePaymentDetails = (details: PaymentDetails) => {
    setPaymentDetails(paymentDetails.map(p => 
      p.id === details.id ? details : p
    ));
  };

  // Settings functions
  const updateBusinessInfo = (info: any) => {
    setBusinessInfo({...businessInfo, ...info});
  };
  
  const updateTaxSettings = (settings: any) => {
    setTaxSettings({...taxSettings, ...settings});
  };

  // Check if current cafe has active subscription - IMPROVED VERSION
  const isCafeSubscriptionActive = (): boolean => {
    // Super admin always has access
    if (currentUser?.role === 'superAdmin') return true;
    
    // If no current cafe, default to false
    if (!currentCafe) return false;
    
    const subscription = currentCafe.subscription;
    
    // No subscription means no access
    if (!subscription) return false;
    
    // VIP access bypasses all other checks
    if (subscription.isVip) return true;
    
    // Check if subscription is active and not expired
    if (!subscription.isActive) return false;
    
    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();
    
    return expiryDate > now;
  };

  // VIP access management functions
  const grantVipAccess = (cafeId: string, reason: string) => {
    const cafe = appCafes.find(c => c.id === cafeId);
    if (cafe) {
      const updatedCafe = {
        ...cafe,
        subscription: {
          ...cafe.subscription!,
          isVip: true,
          vipReason: reason
        }
      };
      updateCafe(updatedCafe);
    }
  };

  const revokeVipAccess = (cafeId: string) => {
    const cafe = appCafes.find(c => c.id === cafeId);
    if (cafe) {
      const updatedCafe = {
        ...cafe,
        subscription: {
          ...cafe.subscription!,
          isVip: false,
          vipReason: undefined
        }
      };
      updateCafe(updatedCafe);
    }
  };

  // Update the context value
  const value = {
    // User
    currentUser,
    users: appUsers,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    
    // Permissions
    canAccess,
    
    // Cafe
    cafes: appCafes,
    currentCafe,
    addCafe,
    updateCafe,
    deleteCafe,
    switchCafe,
    
    // Products - Filter by current cafe if user is not superAdmin
    products: currentUser?.role === 'superAdmin' ? appProducts : appProducts.filter(p => !currentCafe || !p.cafeId || p.cafeId === currentCafe.id),
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Orders - Filter by current cafe if user is not superAdmin
    orders: currentUser?.role === 'superAdmin' ? appOrders : appOrders.filter(o => !currentCafe || !o.cafeId || o.cafeId === currentCafe.id),
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderItem,
    
    // Tables
    tables: appTables,
    addTable,
    updateTable,
    deleteTable,
    
    // Inventory
    inventoryItems: appInventoryItems,
    updateInventoryItem,
    addInventoryItem,
    
    // Customers
    customers: appCustomers,
    addCustomer,
    updateCustomer,
    
    // Reservations
    reservations: appReservations,
    addReservation,
    updateReservation,
    deleteReservation,

    // Analytics
    salesData: appSalesData,
    hourlyTraffic: appHourlyTraffic,
    popularItems: appPopularItems,

    // Payment Details
    paymentDetails,
    addPaymentDetails,
    updatePaymentDetails,
    
    // Settings
    businessInfo,
    taxSettings,
    updateBusinessInfo,
    updateTaxSettings,

    // Subscription
    isCafeSubscriptionActive,
    grantVipAccess,
    revokeVipAccess,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
