/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, { mutate } from "swr";
import { createClient } from "@/lib/supabase/client";

export function useGuests(filters?: { search?: string, status?: string }) {
  const fetcher = async () => {
    const supabase = createClient();
    let query = supabase.from("guests").select("*, bookings(id, net_price, pickup_datetime)").order("full_name", { ascending: true });

    if (filters?.search) {
      query = query.ilike("full_name", `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Aggregating metrics
    const enrichedData = data.map(guest => {
      const allBookings = guest.bookings || [];
      const totalBookings = allBookings.length;
      const totalSpend = allBookings.reduce((sum: number, b: any) => sum + (Number(b.net_price) || 0), 0);
      
      const sortedBookings = [...allBookings].sort((a: any, b: any) => 
        new Date(b.pickup_datetime).getTime() - new Date(a.pickup_datetime).getTime()
      );
      const lastBookingDate = sortedBookings.length > 0 ? sortedBookings[0].pickup_datetime : null;

      let status = "active";
      if (lastBookingDate) {
        const monthsSinceLast = (new Date().getTime() - new Date(lastBookingDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (monthsSinceLast > 6) status = "dormant";
      } else {
        status = "dormant";
      }

      return {
        ...guest,
        totalBookings,
        totalSpend,
        lastBookingDate,
        status
      };
    });

    let finalData = enrichedData;
    if (filters?.status) {
      finalData = finalData.filter(g => g.status === filters.status);
    }

    return finalData;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["guests_crm", filters], fetcher);

  return { guests: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useGuest(id: string) {
  const fetcher = async () => {
    if (!id) return null;
    const supabase = createClient();
    const { data, error } = await supabase.from("guests").select("*, guest_tags(tag_name), guest_notes(*)").eq("id", id).single();
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(id ? ["guest_detail", id] : null, fetcher);

  return { guest: data, isLoading, isError: error, mutate: boundMutate };
}

export function useGuestBookings(id: string) {
  const fetcher = async () => {
    if (!id) return [];
    const supabase = createClient();
    const { data, error } = await supabase.from("bookings").select("*, routes(name), drivers(full_name)").eq("guest_id", id).order("pickup_datetime", { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading } = useSWR(id ? ["guest_bookings", id] : null, fetcher);

  return { bookings: data || [], isLoading, isError: error };
}

export function useReviews(filters?: { platform?: string, status?: string }) {
  const fetcher = async () => {
    const supabase = createClient();
    let query = supabase.from("reviews").select("*, guests(full_name), drivers(full_name)").order("created_at", { ascending: false });

    if (filters?.platform) query = query.eq("platform", filters.platform);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["reviews", filters], fetcher);

  return { reviews: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useAddGuestNote() {
  const addNote = async (guest_id: string, noteData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("guest_notes").insert([{ guest_id, ...noteData }]).select().single();
    if (error) throw error;
    mutate(["guest_detail", guest_id]);
    return data;
  };

  return { addNote };
}
