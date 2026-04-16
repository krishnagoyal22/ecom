-- ==============================================================================
-- 1. PROFILES TABLE (Extended User Data)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text DEFAULT 'customer',
  full_name text,
  shipping_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile. Admins can read all.
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 2. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  image_url text,
  category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read them. Only admins can insert/update (logic handled via app UI).
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);


-- ==============================================================================
-- 3. ORDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'Pending',
  total_amount numeric(10, 2) NOT NULL DEFAULT 0,
  shipping_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders: Users can only see their own orders.
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- 4. ORDER ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_at_purchase numeric(10, 2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order Items: Users can see the items of their own orders
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE public.orders.id = public.order_items.order_id 
    AND public.orders.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE public.orders.id = public.order_items.order_id 
    AND public.orders.user_id = auth.uid()
  )
);


-- ==============================================================================
-- 5. MOCK DATA INITIALIZATION
-- ==============================================================================
-- Seed Mock Products
INSERT INTO public.products (title, description, price, stock_quantity, category) VALUES
  ('Premium Wireless Headphones', 'Noise-cancelling, 30hr battery', 299.99, 50, 'Electronics'),
  ('Mechanical Keyboard', 'RGB switches, aluminum body', 149.50, 120, 'Accessories'),
  ('Ergonomic Mouse', 'Vertical design to reduce strain', 79.00, 200, 'Accessories'),
  ('4K Monitor', '32-inch ultra-high definition display', 399.99, 30, 'Electronics')
ON CONFLICT DO NOTHING;

-- Synchronize any ALREADY EXISTING Auth users into the Profiles table
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;
