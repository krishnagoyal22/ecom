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
  image_url text,
  category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read them. Only admins can insert/update (logic handled via app UI).
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);


-- Remove old order tables if they exist.
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;


-- ==============================================================================
-- 3. WISHLIST TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON public.wishlist (user_id);
CREATE INDEX IF NOT EXISTS wishlist_product_id_idx ON public.wishlist (product_id);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Wishlist: Users can manage only their own saved products.
CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add own wishlist items" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist items" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);


-- ==============================================================================
-- 5. MOCK DATA INITIALIZATION
-- ==============================================================================
-- Seed Mock Products
INSERT INTO public.products (title, description, category) VALUES
  ('Premium Wireless Headphones', 'Noise-cancelling, 30hr battery', 'Electronics'),
  ('Mechanical Keyboard', 'RGB switches, aluminum body', 'Accessories'),
  ('Ergonomic Mouse', 'Vertical design to reduce strain', 'Accessories'),
  ('4K Monitor', '32-inch ultra-high definition display', 'Electronics')
ON CONFLICT DO NOTHING;

-- Synchronize any ALREADY EXISTING Auth users into the Profiles table
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;
