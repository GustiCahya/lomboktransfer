import React from 'react';
import Image from 'next/image';

export default function ReceiptVerifyPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const bookingId = params.bookingId;

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
              <div className="text-[9.5px] text-[#14A0A5] tracking-[0.12em] uppercase">Lombok's Premier Travel Experience</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[21px] font-light text-white leading-[1.1] mb-[5px]">Receipt</div>
            <div className="text-[10.5px] text-[#D4A843] font-medium tracking-[0.06em] mb-[6px]">#REC-2026-0038</div>
            {bookingId === 'LT-2026-0038' && (
              <div className="inline-block text-[9px] font-bold tracking-[0.1em] uppercase py-[3px] px-[10px] rounded-sm bg-[#D4A843] text-[#0B2545]">
                Deposit Received
              </div>
            )}
          </div>
        </div>

        {/* META */}
        <div className="bg-[#F7F9FC] border-b border-[#E8EEF5] py-[0.85rem] px-[2.2rem] flex gap-8 flex-wrap">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Date Issued</span>
            <span className="text-[12px] font-medium text-[#1a2332]">1 September 2026</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Trip Dates</span>
            <span className="text-[12px] font-medium text-[#1a2332]">16 &middot; 22 &middot; 27 September 2026</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Payment via</span>
            <span className="text-[12px] font-medium text-[#1a2332]">Wise</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Booking Ref</span>
            <span className="text-[12px] font-bold text-[#0B2545] tracking-[0.06em]">{bookingId}</span>
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
            <div className="text-[13px] font-semibold text-[#0B2545] mb-[4px]">Leslie LENORMAND</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">1 passenger &middot; 1 large suitcase</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">lenormand.leslie@laposte.net</div>
            <div className="text-[11px] text-[#556070] leading-[1.65]">+33 6 58 36 36 43</div>
          </div>
        </div>

        {/* SERVICES */}
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
            <tr>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5]">
                <div className="font-medium mb-[3px]">Airport Transfer &mdash; LOP &rarr; El Tropico Hotel, Kuta Lombok</div>
                <div className="text-[10.5px] text-[#8a9ab0] leading-[1.55]">
                  Flight: Super Air Jet IU762 &middot; Arrival 10:00 AM<br />
                  Driver with name sign &middot; Private car &middot; All-inclusive
                </div>
              </td>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] whitespace-nowrap">16 Sep</td>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] text-right font-medium whitespace-nowrap">IDR 450.000</td>
            </tr>
            <tr>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5]">
                <div className="font-medium mb-[3px]">Private Transfer &mdash; El Tropico Hotel &rarr; Gili Air</div>
                <div className="text-[10.5px] text-[#8a9ab0] leading-[1.55]">
                  Pickup: 09:30 AM &middot; Private car to Teluk Nare + private speedboat &rarr; Gili Air<br />
                  Arrival at main harbour &middot; Short cidomo/walk to PinkCoco
                </div>
              </td>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] whitespace-nowrap">22 Sep</td>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] text-right font-medium whitespace-nowrap">IDR 1.050.000</td>
            </tr>
            <tr>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5]">
                <div className="font-medium mb-[3px]">Private Transfer &mdash; Gili Air &rarr; LOP Airport</div>
                <div className="text-[10.5px] text-[#8a9ab0] leading-[1.55]">
                  Depart PinkCoco: 13:30 &middot; Speedboat &rarr; Teluk Nare + private car to LOP<br />
                  Est. airport arrival 16:00&ndash;16:15 &middot; Flight departs 18:00
                </div>
              </td>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] whitespace-nowrap">27 Sep</td>
              <td className="py-[0.85rem] px-[2.2rem] text-[12px] text-[#1a2332] border-b border-[#F0F4F8] align-top leading-[1.5] text-right font-medium whitespace-nowrap">IDR 900.000</td>
            </tr>
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="py-[0.9rem] px-[2.2rem] flex justify-end border-b border-[#E8EEF5]">
          <div className="min-w-[240px]">
            <div className="flex justify-between items-center py-[3.5px] text-[12px] border-t-[1.5px] border-[#0B2545] mt-[6px] pt-[9px]">
              <span className="font-semibold text-[#0B2545] text-[12.5px]">Total Package</span>
              <span className="font-bold text-[#0B2545] text-[15px]">IDR 2.400.000</span>
            </div>
            <div className="text-[10px] text-[#aab4c0] text-right mt-[3px]">&asymp; USD 135 &middot; for reference only, final price in IDR</div>
            <div className="border-t border-dashed border-[#e2e8f0] my-[8px]"></div>
            <div className="flex justify-between items-center py-[3.5px] text-[12px]">
              <span className="text-[#16a34a] font-medium">&#10003; Deposit paid (50%)</span>
              <span className="text-[#16a34a] font-semibold">IDR 1.200.000</span>
            </div>
            <div className="flex justify-between items-center py-[3.5px] text-[12px]">
              <span className="text-[#c27a00] font-semibold">Balance due at pickup &middot; 16 Sep</span>
              <span className="text-[#c27a00] font-bold">IDR 1.200.000</span>
            </div>
            <div className="text-[10px] text-[#aab4c0] text-right mt-[3px]">Balance to be paid in cash (IDR) upon first pickup</div>
          </div>
        </div>

        {/* DEPOSIT BANNER */}
        <div className="py-[0.75rem] px-[2.2rem] border-b border-[#E8EEF5]">
          <div className="bg-[#f0fdf4] border border-[#86efac] rounded px-[14px] py-[9px] text-[11.5px] text-[#166534] leading-[1.55]">
            <strong>Deposit of IDR 1.200.000 received via Wise.</strong> Booking is confirmed. Driver and boat contact details will be sent separately via WhatsApp.
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
          Payment Details
        </div>
        <div className="py-[1rem] px-[2.2rem] grid grid-cols-2 gap-y-[0.75rem] gap-x-[2rem] border-b border-[#E8EEF5]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Deposit Amount</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">IDR 1.200.000 (50%)</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Payment Method</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">Wise</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Recipient Name</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">Gusti Bagus Cahya Utama</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Bank Account</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">BCA &middot; 0561802016</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Payment Date</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">1 September 2026</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase">Balance Due</span>
            <span className="text-[12px] text-[#1a2332] font-medium leading-[1.4]">Cash (IDR) &middot; 16 Sep pickup</span>
          </div>
        </div>

        {/* CONFIRMED INCLUSIONS */}
        <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
          Confirmed Inclusions
        </div>
        <div className="py-[0.9rem] px-[2.2rem] border-b border-[#E8EEF5]">
          <div className="grid grid-cols-2 gap-y-[5px] gap-x-[1.5rem]">
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>Private car (AC) for all land transfers</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>Private speedboat (Teluk Nare &harr; Gili Air)</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>Driver with name sign at LOP arrivals</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>Fuel &amp; parking &mdash; fully included</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>Luggage assistance (1 large suitcase)</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>Harbour &harr; PinkCoco coordination (both ways)</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>WhatsApp contact throughout the trip</span></div>
            <div className="flex gap-[7px] items-start text-[11px] text-[#374151] py-[2px] leading-[1.45]"><span className="text-[#16a34a] font-bold shrink-0 mt-[1px]">&#10003;</span><span>No additional or hidden fees</span></div>
          </div>
        </div>

        {/* BOOKING REFERENCE + QR */}
        <div className="pt-[0.75rem] px-[2.2rem] pb-[0.4rem] text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase border-b border-[#E8EEF5]">
          Booking Verification
        </div>
        <div className="py-[1.2rem] px-[2.2rem] flex gap-[1.5rem] items-center border-b border-[#E8EEF5] bg-[#F7F9FC]">
          <div className="flex-1">
            <div className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.12em] uppercase mb-[8px]">Booking Reference (PNR)</div>
            <div className="text-[22px] font-bold text-[#0B2545] tracking-[0.12em] font-mono mb-[6px]">{bookingId}</div>
            <div className="text-[10.5px] text-[#556070] leading-[1.6]">
              Scan the QR code or visit<br />
              <strong className="text-[#0B2545]">lomboktransfer.com/verify/{bookingId}</strong><br />
              to verify the authenticity of this receipt.<br />
              Show this code to your driver upon pickup.
            </div>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAADeCAIAAADdBSngAAAE7UlEQVR4nO3dS44bNxRAUdvwMOvwUrzoLCXr8FyZp4yEIPi5Us4ZGt2SrL4g8FQl8uvr9foCPd9uvwD4PWkSJU2ipEmUNImSJlHSJEqaREmTKGkSJU2ivo/80B8/fu5+Hf/i119//uNfnq/n+TNPI/+Lkcc5ad9rrv1Nn6yaREmTKGkSJU2ipEnU0IT+tG+S3Tc5jkz6c+bm6LnPGfa987W/qVWTKGkSJU2ipEmUNImanNCf5qawk1PhqucaeeTnz4y8P3Pv4cn/6YhVz27VJEqaREmTKGkSJU2ilk3oJ81dj141yZ680j036X8GqyZR0iRKmkRJkyhpEvWWE/qqWXturn/a91t3P4u4y6pJlDSJkiZR0iRKmkQtm9BPzoD7JuJ919lX3cE+9zNz7s71Vk2ipEmUNImSJlHSJGpyQr97r/Wqa99PtWvWq17PiNr981ZNoqRJlDSJkiZR0iRqaEKv3SN9ch6fe5wR/fPO7rJqEiVNoqRJlDSJkiZRX1+v13/+0L7zx/c5+Y3yVU7uwT73Fzz5mYZVkyhpEiVNoqRJlDSJmryGfvIE8P7nA/teT21fuFWz/wirJlHSJEqaREmTKGkSNfk99FW7rp2c9EceeZW71+v7c71r6LwxaRIlTaKkSZQ0iVq2U9y+q+FP++4G3zel3j2RbdUjP+3bD9+qSZQ0iZImUdIkSppEDX0PfZVV14jvnn7et2pmn2NC58NJkyhpEiVNoqRJ1OROcU8np+ZV3/u+uzPbqkn2HafvEVZNoqRJlDSJkiZR0iRq4zX02l5tc/bdVb7q2ed+6+6nCiOsmkRJkyhpEiVNoqRJ1LIJ/e63qmvP9VQ7AW3f/vOr5nqrJlHSJEqaREmTKGkSNTmh75vd5h5nRP9K98jr6X9T3mlrfDhpEiVNoqRJlDSJyu0Ud/IU9ZM7193dJe9p1Q4A+z5jsWoSJU2ipEmUNImSJlHLTltb5eRZ3ncn6307xc3N0Se/vT7CqkmUNImSJlHSJEqaRA1N6Cfvaa/d1z3yeu6+P7VPJ5y2xoeTJlHSJEqaREmTqMlr6Kvutb67W/jJ6/Ujz77qcT7jr2PVJEqaREmTKGkSJU2iJif0fVZNhXM/s++q8cnvfe+b/U+yahIlTaKkSZQ0iZImUcsm9H37mc89V//a99OqTxVOnlhnpzj+d6RJlDSJkiZR0iRq4zX02gngJ09sr30+sOp9Pvn5gFWTKGkSJU2ipEmUNIkaOm3t5FXjkxPo3COf/ORhzt2/l/PQ+XDSJEqaREmTKGkSNXQNfd9uYHPPte+72Cf3Ra+9q0/2coffkCZR0iRKmkRJk6iNp62tsmpqPrnH2oh994evevY5rqHz4aRJlDSJkiZR0iTq8mlrT7UzyFY9zsm75edez4h93/d/smoSJU2ipEmUNImSJlEb93IfcfKb13dPWl/1WyfvV1/17HOsmkRJkyhpEiVNoqRJVO489JNqd3rvO/l93/l0+x7ZqkmUNImSJlHSJEqaRL3lhH5yR/ERd3dlf8c7AUZYNYmSJlHSJEqaREmTqGUT+smJeNWzr7pqvErtzLh9jzPCqkmUNImSJlHSJEqaRF0+D31E7Yr5090r3U93P0NYxapJlDSJkiZR0iRKmkQNTehwnlWTKGkSJU2ipEmUNImSJlHSJEqaREmTKGkSJU2i/gb/7MFHgWhFBgAAAABJRU5ErkJggg==" alt="QR Code Booking" className="w-[90px] h-[90px] block" />
            <div className="text-[8.5px] text-[#8a9ab0] tracking-[0.05em] text-center">Scan to verify</div>
          </div>
        </div>

        {/* NOTES */}
        <div className="py-[1rem] px-[2.2rem] bg-[#F7F9FC] border-b border-[#E8EEF5]">
          <div className="text-[9px] font-semibold text-[#8a9ab0] tracking-[0.1em] uppercase mb-[5px]">Terms &amp; Notes</div>
          <div className="text-[11px] text-[#556070] leading-[1.7]">
            This receipt confirms the deposit payment and booking of private transfer services as detailed above. The remaining balance of IDR 1.200.000 is to be paid in cash (IDR) upon first pickup on 16 September 2026. All services are all-inclusive with no additional fees. Free cancellation up to 48 hours before the first trip date. This document serves as official proof of your deposit and confirmed booking with Lombok Transfer.
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#0B2545] py-[0.9rem] px-[2.2rem] flex justify-between items-center">
          <div className="text-[10px] text-[#8a9ab0] leading-[1.6]">
            hello@lomboktransfer.com &nbsp;&middot;&nbsp; lomboktransfer.com &nbsp;&middot;&nbsp;
            <span className="text-[#14A0A5]">WA: +62 819-0739-7667</span>
          </div>
          <div className="text-[10.5px] text-[#D4A843] italic">Safe travels, Leslie!</div>
        </div>
        
        <div className="h-[3px] bg-gradient-to-r from-[#0D7377] to-[#D4A843]" />
      </div>
    </div>
  );
}
