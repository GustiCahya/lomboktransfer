import React from 'react';
import { createAdminClient } from '@/lib/supabase/server';
import type { BookingReceipt, BookingTrip } from '@/lib/types/booking-receipt';
import { format } from 'date-fns';

// ----------- HELPERS -----------

function formatIDR(amount: number): string {
  return 'IDR ' + new Intl.NumberFormat('id-ID').format(amount).replace(/\./g, '.');
}

function formatDepositMethod(method: string | null): string {
  if (!method) return '-';
  const map: Record<string, string> = {
    wise: 'Wise', bank_transfer: 'Bank Transfer', cash: 'Cash', ota: 'OTA Settlement',
  };
  return map[method] || method;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'd MMMM yyyy');
}

function formatTripDate(dateStr: string): string {
  return format(new Date(dateStr), 'd MMM');
}

function formatPickupTime(timeStr: string | null): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayH = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayH}:${m} ${ampm}`;
}

function formatTripDates(trips: BookingTrip[]): string {
  return trips.map((t) => format(new Date(t.trip_date), 'd')).join(' · ') + ' ' + format(new Date(trips[0].trip_date), 'MMMM yyyy');
}

function getStatusLabel(status: string): { label: string; bg: string; color: string } {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    deposit_received: { label: 'Deposit Received', bg: '#D4A843', color: '#0B2545' },
    fully_paid: { label: 'Fully Paid', bg: '#16a34a', color: '#fff' },
    pending: { label: 'Pending', bg: '#94a3b8', color: '#fff' },
    cancelled: { label: 'Cancelled', bg: '#ef4444', color: '#fff' },
  };
  return map[status] || { label: status, bg: '#94a3b8', color: '#fff' };
}

// ----------- NOT FOUND -----------
function NotFound({ bookingId }: { bookingId: string }) {
  return (
    <div className="min-h-screen bg-[#EEF2F7] py-16 px-4 flex items-center justify-center font-sans text-center">
      <div className="bg-white p-8 rounded shadow-[0_2px_16px_rgba(11,37,69,0.10)] max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0D7377] to-[#D4A843]" />
        <h1 className="text-[20px] font-semibold text-[#0B2545] mb-2 mt-2">Booking Not Found</h1>
        <p className="text-[#556070] text-[13px] leading-relaxed">
          We could not find a booking with the reference{' '}
          <strong className="text-[#0B2545]">{bookingId}</strong>.<br />
          Please check the code and try again.
        </p>
      </div>
    </div>
  );
}

// ----------- PAGE -----------
export default async function ReceiptVerifyPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const bookingId = params.bookingId?.toUpperCase();

  if (!bookingId || bookingId.length < 3) {
    return <NotFound bookingId={bookingId} />;
  }

  const supabase = await createAdminClient();
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id, booking_code, receipt_number, receipt_status,
      gross_price, deposit_amount, deposit_paid_at, deposit_method,
      balance_due, total_passengers, total_luggage,
      source, payment_method, payment_status,
      inclusions, terms_notes, notes, language_pref, created_at,
      guest:guests (id, full_name, email, phone_wa, nationality, language),
      trips:booking_trips (
        id, booking_id, trip_order, trip_date, pickup_time,
        service_name, service_description,
        pickup_address, dropoff_address, price, status, notes
      )
    `)
    .eq('booking_code', bookingId)
    .single();

  if (error || !booking) {
    return <NotFound bookingId={bookingId} />;
  }

  // Sort trips
  const b = booking as unknown as BookingReceipt;
  const trips = [...(b.trips || [])].sort((a, b) => a.trip_order - b.trip_order);
  // Safely handle if guest is returned as an array or object
  const guest = Array.isArray(b.guest) ? b.guest[0] : b.guest;
  const status = getStatusLabel(b.receipt_status);
  const depositPct = b.gross_price > 0 ? Math.round((b.deposit_amount / b.gross_price) * 100) : 0;
  const firstTripDate = trips[0]?.trip_date;

  return (
    <div className="min-h-screen bg-[#EEF2F7] py-8 px-4 text-[#1a2332] text-[13px] leading-relaxed font-sans">
      <div className="max-w-[680px] mx-auto bg-white rounded overflow-hidden shadow-[0_2px_16px_rgba(11,37,69,0.10)]">
        <div className="h-[3px] bg-gradient-to-r from-[#0D7377] to-[#D4A843]" />

        {/* HEADER */}
        <div className="bg-[#0B2545] pt-[1.8rem] px-[2.2rem] pb-[1.5rem] flex justify-between items-start">
          <div className="flex items-center gap-[13px]">
            <svg width="42" height="46" viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg">
              <defs><clipPath id="ic"><rect x="0" y="1" width="44" height="44" rx="9" /></clipPath></defs>
              <rect x="0" y="1" width="44" height="44" rx="9" fill="rgba(255,255,255,0.12)" />
              <path d="M -2,32 Q 10,27 22,30 Q 34,33 46,28 L 46,48 L -2,48 Z" fill="#0D7377" opacity="0.7" clipPath="url(#ic)" />
              <path d="M 13,47 L 20,11 L 26,11 L 19,47 Z" fill="rgba(255,255,255,0.90)" clipPath="url(#ic)" />
              <circle cx="23" cy="8" r="4" fill="#D4A843" />
              <circle cx="23" cy="8" r="1.8" fill="#0B2545" />
            </svg>
            <div>
              <div className="text-[17px] font-semibold text-white tracking-[0.02em] leading-[1.2] mb-[3px]">LOMBOK TRANSFER</div>
              <div className="text-[9.5px] text-[#14A0A5] tracking-[0.12em] uppercase">Lombok&apos;s Premier Travel Experience</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[21px] font-light text-white leading-[1.1] mb-[5px]">Receipt</div>
            {b.receipt_number && (
              <div className="text-[10.5px] text-[#D4A843] font-medium tracking-[0.06em] mb-[6px]">#{b.receipt_number}</div>
            )}
            <div
              className="inline-block text-[9px] font-bold tracking-[0.1em] uppercase py-[3px] px-[10px] rounded-sm"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </div>
          </div>
        </div>

        {/* META */}
        <div className="bg-[#F7F9FC] border-b border-[#E8EEF5] py-[0.85rem] px-[2.2rem] flex gap-8 flex-wrap">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Date Issued</span>
            <span className="text-[12px] font-medium text-[#1a2332]">{formatDate(b.deposit_paid_at || b.created_at)}</span>
          </div>
          {trips.length > 0 && (
            <div className="flex flex-col gap-[2px]">
              <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Trip Dates</span>
              <span className="text-[12px] font-medium text-[#1a2332]">{formatTripDates(trips)}</span>
            </div>
          )}
          {b.deposit_method && (
            <div className="flex flex-col gap-[2px]">
              <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Payment via</span>
              <span className="text-[12px] font-medium text-[#1a2332]">{formatDepositMethod(b.deposit_method)}</span>
            </div>
          )}
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Booking Ref</span>
            <span className="text-[12px] font-bold text-[#0B2545] tracking-[0.06em]">{b.booking_code}</span>
          </div>
        </div>

        {/* PARTIES */}
        <div className="grid grid-cols-2 border-b border-[#E8EEF5]">
          <div className="py-[1.1rem] px-[2.2rem] border-r border-[#E8EEF5]">
            <div className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase mb-[6px]">Received by</div>
            <div className="text-[13px] font-semibold text-[#0B2545] mb-[4px]">Lombok Transfer</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">Lombok, Nusa Tenggara Barat, Indonesia</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">hello@lomboktransfer.com</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">WA: +62 819-0739-7667</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">lomboktransfer.com</div>
          </div>
          <div className="py-[1.1rem] px-[2.2rem]">
            <div className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase mb-[6px]">Paid by</div>
            <div className="text-[13px] font-semibold text-[#0B2545] mb-[4px]">{guest.full_name}</div>
            {(b.total_passengers || b.total_luggage) && (
              <div className="text-[11px] text-[#556070] leading-[1.65]">
                {b.total_passengers} passenger{b.total_passengers !== 1 ? 's' : ''}
                {b.total_luggage ? ` · ${b.total_luggage} large suitcase${b.total_luggage !== 1 ? 's' : ''}` : ''}
              </div>
            )}
            {guest.email && <div className="text-[11px] text-[#556070] leading-[1.65]">{guest.email}</div>}
            {guest.phone_wa && <div className="text-[11px] text-[#556070] leading-[1.65]">{guest.phone_wa}</div>}
          </div>
        </div>

        {/* SERVICES */}
        {trips.length > 0 && (
          <>
            <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
              Services Booked
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-[#E8EEF5]">
                  <th className="w-[54%] py-[0.55rem] px-[2.2rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase text-left">Service</th>
                  <th className="py-[0.55rem] px-[2.2rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase text-left">Date</th>
                  <th className="py-[0.55rem] px-[2.2rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5]">
                      <div className="font-medium mb-[3px]">{trip.service_name}</div>
                      {trip.service_description && (
                        <div className="text-[10.5px] text-[#8a9ab0] leading-[1.55]" style={{ whiteSpace: 'pre-line' }}>
                          {trip.service_description}
                          {trip.pickup_time && ` · ${formatPickupTime(trip.pickup_time)}`}
                        </div>
                      )}
                    </td>
                    <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] whitespace-nowrap">
                      {formatTripDate(trip.trip_date)}
                    </td>
                    <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] text-right font-medium whitespace-nowrap">
                      {formatIDR(trip.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* TOTALS */}
        <div className="py-[0.9rem] px-[2.2rem] flex justify-end border-b border-[#E8EEF5]">
          <div className="min-w-[240px]">
            <div className="flex justify-between items-center text-[12px] border-t-[1.5px] border-[#0B2545] mt-[6px] pt-[9px] pb-[3.5px]">
              <span className="font-semibold text-[#0B2545] text-[12.5px]">Total Package</span>
              <span className="font-bold text-[#0B2545] text-[15px]">{formatIDR(b.gross_price)}</span>
            </div>
            <div className="border-t border-dashed border-[#e2e8f0] my-[8px]" />
            {b.deposit_amount > 0 && (
              <div className="flex justify-between items-center py-[3.5px] text-[12px]">
                <span className="text-[#16a34a] font-medium">&#10003; Deposit paid ({depositPct}%)</span>
                <span className="text-[#16a34a] font-semibold">{formatIDR(b.deposit_amount)}</span>
              </div>
            )}
            {b.balance_due > 0 && (
              <>
                <div className="flex justify-between items-center py-[3.5px] text-[12px]">
                  <span className="text-[#c27a00] font-semibold">
                    Balance due at pickup{firstTripDate ? ` · ${formatTripDate(firstTripDate)}` : ''}
                  </span>
                  <span className="text-[#c27a00] font-bold">{formatIDR(b.balance_due)}</span>
                </div>
                <div className="text-[10px] text-[#aab4c0] text-right mt-[3px]">Balance to be paid in cash (IDR) upon first pickup</div>
              </>
            )}
          </div>
        </div>

        {/* DEPOSIT BANNER */}
        {b.receipt_status === 'deposit_received' && (
          <div className="py-[0.75rem] px-[2.2rem] border-b border-[#E8EEF5]">
            <div className="bg-[#f0fdf4] border border-[#86efac] rounded px-[14px] py-[9px] text-[11.5px] text-[#166534] leading-[1.55]">
              <strong>Deposit of {formatIDR(b.deposit_amount)} received via {formatDepositMethod(b.deposit_method)}.</strong>{' '}
              Booking is confirmed. Driver and boat contact details will be sent separately via WhatsApp.
            </div>
          </div>
        )}

        {/* PAYMENT DETAILS */}
        <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
          Payment Details
        </div>
        <div className="py-[1rem] px-[2.2rem] grid grid-cols-2 gap-y-[0.75rem] gap-x-[2rem] border-b border-[#E8EEF5]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Deposit Amount</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">{formatIDR(b.deposit_amount)} ({depositPct}%)</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Payment Method</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">{formatDepositMethod(b.deposit_method)}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Recipient Name</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">Gusti Bagus Cahya Utama</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Bank Account</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">BCA &middot; 0561802016</span>
          </div>
          {b.deposit_paid_at && (
            <div className="flex flex-col gap-[2px]">
              <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Payment Date</span>
              <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">{formatDate(b.deposit_paid_at)}</span>
            </div>
          )}
          {b.balance_due > 0 && firstTripDate && (
            <div className="flex flex-col gap-[2px]">
              <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Balance Due</span>
              <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">Cash (IDR) &middot; {formatTripDate(firstTripDate)} pickup</span>
            </div>
          )}
        </div>

        {/* CONFIRMED INCLUSIONS */}
        {b.inclusions && b.inclusions.length > 0 && (
          <>
            <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
              Confirmed Inclusions
            </div>
            <div className="py-[0.9rem] px-[2.2rem] border-b border-[#E8EEF5]">
              <div className="grid grid-cols-2 gap-y-[5px] gap-x-[1.5rem]">
                {b.inclusions.map((item, i) => (
                  <div key={i} className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]">
                    <span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* BOOKING REFERENCE + QR */}
        <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
          Booking Verification
        </div>
        <div className="py-[1.2rem] px-[2.2rem] flex gap-[1.5rem] items-center border-b border-[#E8EEF5] bg-[#F7F9FC]">
          <div className="flex-1">
            <div className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase mb-[8px]">Booking Reference (PNR)</div>
            <div className="text-[22px] font-bold text-[#0B2545] tracking-[0.12em] font-mono mb-[6px]">{b.booking_code}</div>
            <div className="text-[10.5px] text-[#556070] leading-[1.6]">
              Scan the QR code or visit<br />
              <strong className="text-[#0B2545]">lomboktransfer.com/verify/{b.booking_code}</strong><br />
              to verify the authenticity of this receipt.<br />
              Show this code to your driver upon pickup.
            </div>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://lomboktransfer.com/verify/${b.booking_code}`)}`} 
              alt="QR Code Booking" 
              className="w-[90px] h-[90px] block" 
            />
            <div className="text-[8.5px] text-[#8a9ab0] tracking-[0.05em] text-center">Scan to verify</div>
          </div>
        </div>

        {/* NOTES */}
        {b.terms_notes && (
          <div className="py-[1rem] px-[2.2rem] bg-[#F7F9FC] border-b border-[#E8EEF5]">
            <div className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase mb-[5px]">Terms &amp; Notes</div>
            <div className="text-[11px] text-[#556070] leading-[1.7]">{b.terms_notes}</div>
          </div>
        )}

        {/* FOOTER */}
        <div className="bg-[#0B2545] py-[0.9rem] px-[2.2rem] flex justify-between items-center">
          <div className="text-[10px] text-[#8a9ab0] leading-[1.6]">
            hello@lomboktransfer.com &nbsp;&middot;&nbsp; lomboktransfer.com &nbsp;&middot;&nbsp;
            <span className="text-[#14A0A5]">WA: +62 819-0739-7667</span>
          </div>
          <div className="text-[10.5px] text-[#D4A843] italic">Safe travels, {guest.full_name.split(' ')[0]}!</div>
        </div>

        <div className="h-[3px] bg-gradient-to-r from-[#0D7377] to-[#D4A843]" />
      </div>
    </div>
  );
}
