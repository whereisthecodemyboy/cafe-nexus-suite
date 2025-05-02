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
  OrderItem 
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

interface AppContextType {
  // User related
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: User, password: string) => void;
  
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUsers, setAppUsers] = useState<User[]>(users);
  const [appProducts, setAppProducts] = useState<Product[]>(products);
  const [appOrders, setAppOrders] = useState<Order[]>(orders);
  const [appTables, setAppTables] = useState<Table[]>(tables);
  const [appInventoryItems, setAppInventoryItems] = useState<InventoryItem[]>(inventoryItems);
  const [appCustomers, setAppCustomers] = useState<Customer[]>(customers);
  const [appReservations, setAppReservations] = useState<Reservation[]>(reservations);
  const [appSalesData] = useState(salesData);
  const [appHourlyTraffic] = useState(hourlyTraffic);
  const [appPopularItems] = useState(popularItems);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails[]>([]);

  // Store passwords in memory (in a real app this would be handled by backend)
  // Update: Set default passwords to match the demo credentials shown on login page
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>({
    // Changed from admin@cafenexus.com to match the demo credentials shown on login page
    'john@cafenexus.com': 'any',
    // Keep any other passwords as well
    'admin@cafenexus.com': 'admin123'
  });

  // Settings state
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Café Nexus',
    logo: '/assets/logo.png',
    address: '123 Coffee Street, Brewville',
    phone: '+1 (555) 123-4567',
    email: 'info@cafenexus.com',
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
        
        const foundUser = appUsers.find(user => user.email === email);
        
        // Accept any password for demo credentials as mentioned on login page
        if (email === 'john@cafenexus.com') {
          setCurrentUser(foundUser || appUsers[0]); // Use first user if not found
          resolve(true);
          return;
        }
        
        if (foundUser && userPasswords[email] === password) {
          setCurrentUser(foundUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: User, password: string) => {
    setAppUsers([...appUsers, user]);
    // Store password (in a real app this would be handled securely by backend)
    setUserPasswords({...userPasswords, [user.email]: password});
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

  const value = {
    // User
    currentUser,
    users: appUsers,
    login,
    logout,
    addUser,
    
    // Products
    products: appProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Orders
    orders: appOrders,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
