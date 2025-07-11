
-- Enable email authentication by ensuring auth settings are correct
-- Insert test users directly into auth.users table for immediate access

-- First, let's ensure we have the required test users in the auth.users table
-- These will be created with proper authentication that bypasses email confirmation

-- Create the superadmin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'superadmin@cafeplatform.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Create admin user for Downtown Cafe
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'admin@downtowncafe.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Create manager user for Uptown Bistro
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'manager@uptownbistro.com',
  crypt('manager123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Now insert corresponding records in the public.users table
INSERT INTO public.users (id, name, email, role, hire_date, status, cafe_id) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Administrator', 'superadmin@cafeplatform.com', 'superAdmin', '2024-01-01', 'active', NULL),
('00000000-0000-0000-0000-000000000002', 'Downtown Admin', 'admin@downtowncafe.com', 'admin', '2024-01-01', 'active', '123e4567-e89b-12d3-a456-426614174001'),
('00000000-0000-0000-0000-000000000003', 'Uptown Manager', 'manager@uptownbistro.com', 'manager', '2024-01-01', 'active', '123e4567-e89b-12d3-a456-426614174002')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  cafe_id = EXCLUDED.cafe_id;

-- Add some sample products for the cafes
INSERT INTO public.products (id, name, description, category, price, cost, preparation_time, available, cafe_id) VALUES
('prod-001', 'Espresso', 'Rich and bold espresso shot', 'Coffee', 3.50, 1.20, 2, true, '123e4567-e89b-12d3-a456-426614174001'),
('prod-002', 'Cappuccino', 'Creamy cappuccino with steamed milk', 'Coffee', 4.50, 1.80, 4, true, '123e4567-e89b-12d3-a456-426614174001'),
('prod-003', 'Croissant', 'Fresh baked buttery croissant', 'Pastry', 2.75, 1.00, 3, true, '123e4567-e89b-12d3-a456-426614174001'),
('prod-004', 'Latte', 'Smooth latte with steamed milk', 'Coffee', 5.00, 2.00, 5, true, '123e4567-e89b-12d3-a456-426614174002'),
('prod-005', 'Sandwich', 'Grilled chicken sandwich', 'Food', 8.50, 4.00, 12, true, '123e4567-e89b-12d3-a456-426614174002')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  cost = EXCLUDED.cost,
  available = EXCLUDED.available;

-- Add some sample customers
INSERT INTO public.customers (id, name, email, phone, join_date, last_visit, cafe_id) VALUES
('cust-001', 'John Smith', 'john.smith@email.com', '+1-555-0001', '2024-01-15', '2024-03-01', '123e4567-e89b-12d3-a456-426614174001'),
('cust-002', 'Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0002', '2024-02-01', '2024-03-05', '123e4567-e89b-12d3-a456-426614174001'),
('cust-003', 'Mike Davis', 'mike.davis@email.com', '+1-555-0003', '2024-01-20', '2024-03-03', '123e4567-e89b-12d3-a456-426614174002')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  last_visit = EXCLUDED.last_visit;

-- Add some sample orders
INSERT INTO public.orders (id, order_number, type, status, employee_id, subtotal, tax, total, cafe_id) VALUES
('order-001', 'ORD-001', 'dine-in', 'completed', '00000000-0000-0000-0000-000000000002', 12.50, 1.25, 13.75, '123e4567-e89b-12d3-a456-426614174001'),
('order-002', 'ORD-002', 'takeaway', 'completed', '00000000-0000-0000-0000-000000000003', 8.50, 0.85, 9.35, '123e4567-e89b-12d3-a456-426614174002'),
('order-003', 'ORD-003', 'dine-in', 'preparing', '00000000-0000-0000-0000-000000000002', 15.75, 1.58, 17.33, '123e4567-e89b-12d3-a456-426614174001')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  subtotal = EXCLUDED.subtotal,
  tax = EXCLUDED.tax,
  total = EXCLUDED.total;

-- Add some inventory items
INSERT INTO public.inventory_items (id, name, category, unit, current_stock, minimum_stock, cost, last_restock_date, cafe_id) VALUES
('inv-001', 'Coffee Beans', 'Ingredients', 'kg', 50.0, 10.0, 15.50, '2024-03-01', '123e4567-e89b-12d3-a456-426614174001'),
('inv-002', 'Milk', 'Ingredients', 'liters', 25.0, 5.0, 3.20, '2024-03-01', '123e4567-e89b-12d3-a456-426614174001'),
('inv-003', 'Sugar', 'Ingredients', 'kg', 20.0, 5.0, 2.50, '2024-02-28', '123e4567-e89b-12d3-a456-426614174002'),
('inv-004', 'Flour', 'Ingredients', 'kg', 30.0, 8.0, 4.00, '2024-03-01', '123e4567-e89b-12d3-a456-426614174002')
ON CONFLICT (id) DO UPDATE SET
  current_stock = EXCLUDED.current_stock,
  cost = EXCLUDED.cost,
  last_restock_date = EXCLUDED.last_restock_date;

-- Enable RLS policies for INSERT, UPDATE, DELETE operations
-- Users can manage data from their own cafe
CREATE POLICY IF NOT EXISTS "Users can insert data for their cafe" ON public.products FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = products.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can update data for their cafe" ON public.products FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = products.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can delete data for their cafe" ON public.products FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = products.cafe_id OR role = 'superAdmin')
);

-- Similar policies for other tables
CREATE POLICY IF NOT EXISTS "Users can insert customers for their cafe" ON public.customers FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = customers.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can update customers for their cafe" ON public.customers FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = customers.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can delete customers for their cafe" ON public.customers FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = customers.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can insert orders for their cafe" ON public.orders FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = orders.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can update orders for their cafe" ON public.orders FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = orders.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can delete orders for their cafe" ON public.orders FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = orders.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can insert inventory for their cafe" ON public.inventory_items FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = inventory_items.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can update inventory for their cafe" ON public.inventory_items FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = inventory_items.cafe_id OR role = 'superAdmin')
);

CREATE POLICY IF NOT EXISTS "Users can delete inventory for their cafe" ON public.inventory_items FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE cafe_id = inventory_items.cafe_id OR role = 'superAdmin')
);
