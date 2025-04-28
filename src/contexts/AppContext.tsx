
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  User, 
  Product, 
  Order, 
  Table, 
  InventoryItem, 
  Customer, 
  Reservation 
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
  
  // Tables related
  tables: Table[];
  updateTable: (table: Table) => void;
  
  // Inventory related
  inventoryItems: InventoryItem[];
  updateInventoryItem: (item: InventoryItem) => void;
  
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

  // Authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = appUsers.find(user => user.email === email);
        if (foundUser) {
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

  // Table functions
  const updateTable = (table: Table) => {
    setAppTables(appTables.map(t => t.id === table.id ? table : t));
  };

  // Inventory functions
  const updateInventoryItem = (item: InventoryItem) => {
    setAppInventoryItems(appInventoryItems.map(i => i.id === item.id ? item : i));
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

  const value = {
    // User
    currentUser,
    users: appUsers,
    login,
    logout,
    
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
    
    // Tables
    tables: appTables,
    updateTable,
    
    // Inventory
    inventoryItems: appInventoryItems,
    updateInventoryItem,
    
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
