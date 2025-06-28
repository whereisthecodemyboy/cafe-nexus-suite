
import React, { createContext, useContext, ReactNode } from 'react'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { useSupabaseData } from '@/hooks/useSupabaseData'
import type { 
  User, 
  Product, 
  Order, 
  Customer, 
  InventoryItem, 
  Cafe,
  Table,
  Reservation,
  PaymentDetails 
} from '@/data/models'

// Mock data for tables, reservations, and payments (will be migrated later)
import { tables, reservations, salesData, hourlyTraffic, popularItems } from '@/data/mockData'

interface AppContextType {
  // Auth
  currentUser: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  
  // Data from Supabase
  cafes: Cafe[]
  users: User[]
  products: Product[]
  orders: Order[]
  customers: Customer[]
  inventoryItems: InventoryItem[]
  
  // Mock data (to be migrated)
  tables: Table[]
  reservations: Reservation[]
  paymentDetails: PaymentDetails[]
  salesData: any[]
  hourlyTraffic: any[]
  popularItems: any[]
  
  // Current cafe info
  currentCafe: Cafe | null
  
  // Utility functions
  canAccess: (feature: string) => boolean
  isCafeSubscriptionActive: () => boolean
  loading: boolean
  refetchData: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile: currentUser, login, logout, loading: authLoading } = useAuth()
  const { 
    cafes, 
    users, 
    products, 
    orders, 
    customers, 
    inventoryItems, 
    loading: dataLoading,
    refetch: refetchData
  } = useSupabaseData()

  const loading = authLoading || dataLoading

  // Mock payment details (will be moved to Supabase later)
  const paymentDetails: PaymentDetails[] = []

  // Get current cafe based on user's cafeId
  const currentCafe = currentUser?.cafeId 
    ? cafes.find(cafe => cafe.id === currentUser.cafeId) || null
    : null

  const canAccess = (feature: string): boolean => {
    if (!currentUser) return false
    
    // Super admin can access everything
    if (currentUser.role === 'superAdmin') return true
    
    // Feature access based on role
    const rolePermissions: Record<string, string[]> = {
      admin: ['pos', 'menu', 'kitchen', 'employees', 'reservations', 'cashflow', 'customers', 'analytics', 'settings', 'inventory', 'tables', 'delivery'],
      manager: ['pos', 'menu', 'kitchen', 'employees', 'reservations', 'cashflow', 'customers', 'analytics', 'inventory', 'tables', 'delivery'],
      cashier: ['pos', 'customers', 'cashflow'],
      waiter: ['pos', 'reservations', 'tables'],
      chef: ['kitchen', 'inventory'],
      barista: ['pos', 'kitchen', 'inventory'],
    }
    
    return rolePermissions[currentUser.role]?.includes(feature) || false
  }

  const isCafeSubscriptionActive = (): boolean => {
    if (!currentUser || currentUser.role === 'superAdmin') return true
    
    if (currentCafe) {
      if (currentCafe.subscription?.isVip) return true
      return currentCafe.subscription?.isActive || false
    }
    
    return false
  }

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      cafes,
      users,
      products,
      orders,
      customers,
      inventoryItems,
      tables,
      reservations,
      paymentDetails,
      salesData,
      hourlyTraffic,
      popularItems,
      currentCafe,
      canAccess,
      isCafeSubscriptionActive,
      loading,
      refetchData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

const SupabaseAppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </AuthProvider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a SupabaseAppProvider')
  }
  return context
}

export { SupabaseAppProvider }
