
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { 
  User, 
  Product, 
  Order, 
  Customer, 
  InventoryItem, 
  Cafe,
  Table,
  Reservation 
} from '@/data/models'

export const useSupabaseData = () => {
  const { userProfile } = useAuth()
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchAllData()
    }
  }, [userProfile])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchCafes(),
        fetchUsers(),
        fetchProducts(),
        fetchOrders(),
        fetchCustomers(),
        fetchInventoryItems(),
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCafes = async () => {
    try {
      const { data, error } = await supabase
        .from('cafes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const transformedCafes: Cafe[] = data?.map(cafe => ({
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        phone: cafe.phone,
        email: cafe.email,
        status: cafe.status,
        createdAt: cafe.created_at,
        logo: cafe.logo,
        subscription: {
          isActive: cafe.subscription_active,
          plan: cafe.subscription_plan,
          expiryDate: cafe.subscription_expiry || '',
          isVip: cafe.is_vip,
          vipReason: cafe.vip_reason,
        }
      })) || []

      setCafes(transformedCafes)
    } catch (error) {
      console.error('Error fetching cafes:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      let query = supabase.from('users').select('*')
      
      // If not super admin, only fetch users from the same cafe
      if (userProfile?.role !== 'superAdmin' && userProfile?.cafeId) {
        query = query.eq('cafe_id', userProfile.cafeId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const transformedUsers: User[] = data?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        hireDate: user.hire_date,
        status: user.status,
        cafeId: user.cafe_id,
      })) || []

      setUsers(transformedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*')
      
      // If not super admin, only fetch products from the same cafe
      if (userProfile?.role !== 'superAdmin' && userProfile?.cafeId) {
        query = query.eq('cafe_id', userProfile.cafeId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const transformedProducts: Product[] = data?.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        cost: product.cost,
        image: product.image,
        available: product.available,
        preparationTime: product.preparation_time,
        allergens: product.allergens,
        isSpecial: product.is_special,
        cafeId: product.cafe_id,
        variants: [], // TODO: Implement variants table
        customizations: [], // TODO: Implement customizations table
      })) || []

      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select('*')
      
      // If not super admin, only fetch orders from the same cafe
      if (userProfile?.role !== 'superAdmin' && userProfile?.cafeId) {
        query = query.eq('cafe_id', userProfile.cafeId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const transformedOrders: Order[] = data?.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        type: order.type,
        status: order.status,
        tableId: order.table_id,
        customerId: order.customer_id,
        employeeId: order.employee_id,
        items: [], // TODO: Implement order_items table
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        servedTime: order.served_time,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        notes: order.notes,
        deliveryAddress: order.delivery_address,
        deliveryFee: order.delivery_fee,
        cafeId: order.cafe_id,
      })) || []

      setOrders(transformedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      let query = supabase.from('customers').select('*')
      
      // If not super admin, only fetch customers from the same cafe
      if (userProfile?.role !== 'superAdmin' && userProfile?.cafeId) {
        query = query.eq('cafe_id', userProfile.cafeId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const transformedCustomers: Customer[] = data?.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        loyaltyPoints: customer.loyalty_points,
        joinDate: customer.join_date,
        lastVisit: customer.last_visit,
        totalSpent: customer.total_spent,
        visitCount: customer.visit_count,
        preferences: customer.preferences,
        allergies: customer.allergies,
        notes: customer.notes,
        birthdate: customer.birthdate,
        address: customer.address,
        marketingConsent: customer.marketing_consent,
      })) || []

      setCustomers(transformedCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchInventoryItems = async () => {
    try {
      let query = supabase.from('inventory_items').select('*')
      
      // If not super admin, only fetch inventory from the same cafe
      if (userProfile?.role !== 'superAdmin' && userProfile?.cafeId) {
        query = query.eq('cafe_id', userProfile.cafeId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const transformedInventory: InventoryItem[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        currentStock: item.current_stock,
        minimumStock: item.minimum_stock,
        cost: item.cost,
        supplier: item.supplier,
        location: item.location,
        expiryDate: item.expiry_date,
        lastRestockDate: item.last_restock_date,
        barcode: item.barcode,
      })) || []

      setInventoryItems(transformedInventory)
    } catch (error) {
      console.error('Error fetching inventory items:', error)
    }
  }

  return {
    cafes,
    users,
    products,
    orders,
    customers,
    inventoryItems,
    loading,
    refetch: fetchAllData,
  }
}
