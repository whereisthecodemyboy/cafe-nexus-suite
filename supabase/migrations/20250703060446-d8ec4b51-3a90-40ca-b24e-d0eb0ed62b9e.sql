
-- Insert the required cafes that the test users will be assigned to
INSERT INTO public.cafes (id, name, address, email, phone, status, subscription_active, is_vip, subscription_plan, created_at) VALUES
('123e4567-e89b-12d3-a456-426614174001', 'Downtown Cafe', '123 Main Street, Downtown', 'info@downtowncafe.com', '+1-555-0101', 'active', true, false, 'premium', now()),
('123e4567-e89b-12d3-a456-426614174002', 'Uptown Bistro', '456 Oak Avenue, Uptown', 'contact@uptownbistro.com', '+1-555-0102', 'active', true, true, 'enterprise', now()),
('123e4567-e89b-12d3-a456-426614174003', 'VIP Lounge Cafe', '789 Elite Boulevard, VIP District', 'hello@viploungecafe.com', '+1-555-0103', 'active', true, true, 'enterprise', now());
