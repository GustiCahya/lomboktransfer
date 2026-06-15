/**
 * Single Source of Truth for all static images used across the application.
 * Update these URLs to change the images globally.
 */

export const IMAGES = {
  // Hero section background
  HERO_BACKGROUND: "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?q=80&w=2000&auto=format&fit=crop",
  
  // Default fallback image for destinations
  DEFAULT_DESTINATION: "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?q=80&w=600&auto=format&fit=crop",

  // Specific destination images mapped by keywords
  DESTINATIONS: {
    gili: "https://gilivoyages.com/wp-content/uploads/2019/12/Gili-Meno.jpg",
    bangsal: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
    senggigi: "https://homeiswhereyourbagis.com/wp-content/uploads/2019/06/lombok-mustsees-senggigi-beach.jpg",
    kuta: "https://carolinerosetravel.com/wp-content/uploads/2020/04/kutalombok-8.jpg",
    mataram: "https://static.wixstatic.com/media/735b16_6ec1314c725b4c4b8f32b58123da678b~mv2_d_5760_3840_s_4_2.jpg/v1/fill/w_654,h_363,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/735b16_6ec1314c725b4c4b8f32b58123da678b~mv2_d_5760_3840_s_4_2.jpg",
    selong: "https://authentic-indonesia.com/wp-content/uploads/2020/07/selong-belanak-is-surfer-heaven-for-beginners.jpg",
    mandalika: "https://www.itdc.co.id/file/page/20200213143056KApfITU4kiAUdG0SsSFKCQUjW8ToHX.jpg",
    rinjani: "https://4.bp.blogspot.com/-soPBQYZTG6Q/Tb5rSE5TdVI/AAAAAAAABdI/ZpffadQRr0g/s1600/gunung-rinjani.jpg",
    //TODO: Need to update these
    tetebatu: "https://www.holidify.com/images/cmsuploads/compressed/Tetebatu-13-1024x576_20220624203331.jpg",
    sembalun: "https://lombokpersada.com/wp-content/uploads/2023/03/Explore-Wisata-Alam-Sembalun-Lombok-Timur-1-1024x480.jpg",
    sire: "https://cdn.audleytravel.com/1920/1371/60/343437-sire-beach-lombok.jpg",
    tour: "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?q=80&w=600&auto=format&fit=crop",
  } as Record<string, string>,
};
