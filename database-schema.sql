
-- Enable Row Level Security
ALTER TABLE IF EXISTS public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create cafes table
CREATE TABLE IF NOT EXISTS public.cafes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    logo TEXT,
    subscription_active BOOLEAN DEFAULT true,
    subscription_plan TEXT CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')) DEFAULT 'basic',
    subscription_expiry TIMESTAMPTZ,
    is_vip BOOLEAN DEFAULT false,
    vip_reason TEXT
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('superAdmin', 'admin', 'manager', 'cashier', 'waiter', 'chef', 'barista')) NOT NULL,
    avatar TEXT,
    phone TEXT,
    hire_date DATE NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    cafe_id UUID REFERENCES public.cafes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    image TEXT,
    available BOOLEAN DEFAULT true,
    preparation_time INTEGER NOT NULL,
    allergens TEXT[],
    is_special BOOLEAN DEFAULT false,
    cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL,
    type TEXT CHECK (type IN ('dine-in', 'takeaway', 'delivery', 'online')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled', 'out-for-delivery', 'delivered')) DEFAULT 'pending',
    table_id TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES public.users(id) ON DELETE SET NULL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    served_time TIMESTAMPTZ,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile', 'online')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2),
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    delivery_address TEXT,
    delivery_fee DECIMAL(10,2),
    cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    join_date DATE NOT NULL,
    last_visit DATE NOT NULL,
    total_spent DECIMAL(10,2) DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    preferences TEXT[],
    allergies TEXT[],
    notes TEXT,
    birthdate DATE,
    address TEXT,
    marketing_consent BOOLEAN DEFAULT false,
    cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    current_stock DECIMAL(10,2) NOT NULL,
    minimum_stock DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    supplier TEXT,
    location TEXT,
    expiry_date DATE,
    last_restock_date DATE NOT NULL,
    barcode TEXT,
    cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies

-- Cafes policies
CREATE POLICY "Super admins can view all cafes" ON public.cafes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'superAdmin'
        )
    );

CREATE POLICY "Users can view their own cafe" ON public.cafes
    FOR SELECT USING (
        id IN (
            SELECT cafe_id FROM public.users 
            WHERE users.id = auth.uid()
        )
    );

-- Users policies
CREATE POLICY "Super admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'superAdmin'
        )
    );

CREATE POLICY "Users can view users from their cafe" ON public.users
    FOR SELECT USING (
        cafe_id IN (
            SELECT cafe_id FROM public.users 
            WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (id = auth.uid());

-- Products policies
CREATE POLICY "Super admins can view all products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'superAdmin'
        )
    );

CREATE POLICY "Users can view products from their cafe" ON public.products
    FOR SELECT USING (
        cafe_id IN (
            SELECT cafe_id FROM public.users 
            WHERE users.id = auth.uid()
        )
    );

-- Orders policies  
CREATE POLICY "Super admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'superAdmin'
        )
    );

CREATE POLICY "Users can view orders from their cafe" ON public.orders
    FOR SELECT USING (
        cafe_id IN (
            SELECT cafe_id FROM public.users 
            WHERE users.id = auth.uid()
        )
    );

-- Customers policies
CREATE POLICY "Super admins can view all customers" ON public.customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'superAdmin'
        )
    );

CREATE POLICY "Users can view customers from their cafe" ON public.customers
    FOR SELECT USING (
        cafe_id IN (
            SELECT cafe_id FROM public.users 
            WHERE users.id = auth.uid()
        )
    );

-- Inventory policies
CREATE POLICY "Super admins can view all inventory" ON public.inventory_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'superAdmin'
        )
    );

CREATE POLICY "Users can view inventory from their cafe" ON public.inventory_items
    FOR SELECT USING (
        cafe_id IN (
            SELECT cafe_id FROM public.users 
            WHERE users.id = auth.uid()
        )
    );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
