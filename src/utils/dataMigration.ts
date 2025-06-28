
import { supabase } from '@/lib/supabase'
import { users, products, customers, inventoryItems, orders } from '@/data/mockData'

export const migrateMockDataToSupabase = async () => {
  try {
    console.log('Starting data migration...')
    
    // First, create a demo cafe
    const { data: cafeData, error: cafeError } = await supabase
      .from('cafes')
      .insert([
        {
          name: 'Demo Cafe',
          address: '123 Main Street, Downtown',
          phone: '555-0123',
          email: 'info@democafe.com',
          status: 'active',
          subscription_active: true,
          subscription_plan: 'premium',
          is_vip: true,
          vip_reason: 'Demo account'
        }
      ])
      .select()
      .single()

    if (cafeError) {
      console.error('Error creating demo cafe:', cafeError)
      return
    }

    const cafeId = cafeData.id
    console.log('Demo cafe created:', cafeId)

    // Migrate users (skip, as they need to be created through auth)
    console.log('Users need to be created through Supabase Auth manually')

    // Migrate products
    const productsToInsert = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      cost: product.cost,
      image: product.image,
      available: product.available,
      preparation_time: product.preparationTime,
      allergens: product.allergens,
      is_special: product.isSpecial || false,
      cafe_id: cafeId
    }))

    const { error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)

    if (productsError) {
      console.error('Error migrating products:', productsError)
    } else {
      console.log('Products migrated successfully')
    }

    // Migrate customers
    const customersToInsert = customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      loyalty_points: customer.loyaltyPoints,
      join_date: customer.joinDate,
      last_visit: customer.lastVisit,
      total_spent: customer.totalSpent,
      visit_count: customer.visitCount,
      preferences: customer.preferences,
      allergies: customer.allergies,
      notes: customer.notes,
      birthdate: customer.birthdate,
      address: customer.address,
      marketing_consent: customer.marketingConsent,
      cafe_id: cafeId
    }))

    const { error: customersError } = await supabase
      .from('customers')
      .insert(customersToInsert)

    if (customersError) {
      console.error('Error migrating customers:', customersError)
    } else {
      console.log('Customers migrated successfully')
    }

    // Migrate inventory items
    const inventoryToInsert = inventoryItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      current_stock: item.currentStock,
      minimum_stock: item.minimumStock,
      cost: item.cost,
      supplier: item.supplier,
      location: item.location,
      expiry_date: item.expiryDate,
      last_restock_date: item.lastRestockDate,
      barcode: item.barcode,
      cafe_id: cafeId
    }))

    const { error: inventoryError } = await supabase
      .from('inventory_items')
      .insert(inventoryToInsert)

    if (inventoryError) {
      console.error('Error migrating inventory:', inventoryError)
    } else {
      console.log('Inventory items migrated successfully')
    }

    console.log('Data migration completed!')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}
