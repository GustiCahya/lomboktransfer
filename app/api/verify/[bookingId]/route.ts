import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  _req: Request,
  { params }: { params: { bookingId: string } }
) {
  const { bookingId } = params;

  if (!bookingId || bookingId.length < 3) {
    return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
  }

  const supabase = await createAdminClient();

  // Fetch booking with guest and trips
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      receipt_number,
      receipt_status,
      gross_price,
      deposit_amount,
      deposit_paid_at,
      deposit_method,
      balance_due,
      total_passengers,
      total_luggage,
      source,
      payment_method,
      payment_status,
      inclusions,
      terms_notes,
      notes,
      language_pref,
      created_at,
      guest:guests (
        id,
        full_name,
        email,
        phone_wa,
        nationality,
        language
      ),
      trips:booking_trips (
        id,
        booking_id,
        trip_order,
        trip_date,
        pickup_time,
        service_name,
        service_description,
        pickup_address,
        dropoff_address,
        price,
        status,
        notes
      )
    `)
    .eq('booking_code', bookingId.toUpperCase())
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  // Sort trips by trip_order
  if (booking.trips && Array.isArray(booking.trips)) {
    booking.trips.sort((a: { trip_order: number }, b: { trip_order: number }) => a.trip_order - b.trip_order);
  }

  return NextResponse.json(booking);
}
