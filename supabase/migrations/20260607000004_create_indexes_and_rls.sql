-- Migration: Create Indexes and configure basic RLS policies

-- 1. INDEXES (for performance)
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_datetime ON public.bookings(pickup_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON public.bookings(source);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings(guest_id);

CREATE INDEX IF NOT EXISTS idx_driver_docs_expiry ON public.driver_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_docs_expiry ON public.vehicle_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_company_docs_expiry ON public.company_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_guests_nationality ON public.guests(nationality);

-- 2. HELPER FUNCTION for RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
  SELECT role::text FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. RLS POLICIES (Implementation of Step 03 logic)

-- Bookings RLS
-- Drivers: only SELECT their own bookings
CREATE POLICY "drivers_own_bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.drivers WHERE id = bookings.driver_id)
    OR public.get_user_role() IN ('owner', 'admin', 'dispatcher')
  );

-- Admin/Owner/Dispatcher: full access
CREATE POLICY "admin_all_bookings" ON public.bookings
  FOR ALL USING (
    public.get_user_role() IN ('owner', 'admin', 'dispatcher')
  );

-- Expenses RLS
CREATE POLICY "accounting_access" ON public.expenses
  FOR ALL USING (
    public.get_user_role() IN ('owner', 'accountant')
  );

-- Drivers RLS
-- Driver: only their own profile
CREATE POLICY "drivers_select_own_profile" ON public.drivers
  FOR SELECT USING (
    user_id = auth.uid() OR public.get_user_role() IN ('owner', 'admin', 'dispatcher')
  );

CREATE POLICY "admin_all_drivers" ON public.drivers
  FOR ALL USING (
    public.get_user_role() IN ('owner', 'admin')
  );

-- Vehicles RLS
CREATE POLICY "driver_select_vehicles" ON public.vehicles
  FOR SELECT USING (
    public.get_user_role() IN ('owner', 'admin', 'dispatcher', 'driver')
  );

CREATE POLICY "admin_all_vehicles" ON public.vehicles
  FOR ALL USING (
    public.get_user_role() IN ('owner', 'admin', 'dispatcher')
  );

-- Payroll RLS
CREATE POLICY "payroll_accounting_access" ON public.payroll
  FOR ALL USING (
    public.get_user_role() IN ('owner', 'accountant')
  );

CREATE POLICY "driver_select_own_payroll" ON public.payroll
  FOR SELECT USING (
    driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid())
  );
