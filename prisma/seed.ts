import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating & Seeding Weddora Platform Data with 21 Unique Templates & Varied Couple Names...');

  // Clean duplicate music entries & deleted kedinasan category/template
  await prisma.music.deleteMany({});
  await prisma.invitation.deleteMany({ where: { template: { slug: 'navy-floral-officer' } } });
  await prisma.template.deleteMany({ where: { slug: 'navy-floral-officer' } });
  await prisma.category.deleteMany({ where: { slug: 'kedinasan' } });

  // 1. System Users (4 Roles)
  // Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@weddora.com' },
    update: {
      name: 'Super Admin Weddora',
      password: 'adminpassword',
      role: 'ADMIN',
      package: 'LUXURY',
      maxInvitations: 999,
    },
    create: {
      email: 'admin@weddora.com',
      name: 'Super Admin Weddora',
      password: 'adminpassword',
      role: 'ADMIN',
      package: 'LUXURY',
      maxInvitations: 999,
    },
  });

  // Dedicated Operator
  const operator = await prisma.user.upsert({
    where: { email: 'operator@weddora.com' },
    update: {
      name: 'Staf Operator Weddora',
      password: 'operatorpassword',
      role: 'OPERATOR',
      package: 'LUXURY',
      maxInvitations: 100,
    },
    create: {
      email: 'operator@weddora.com',
      name: 'Staf Operator Weddora',
      password: 'operatorpassword',
      role: 'OPERATOR',
      package: 'LUXURY',
      maxInvitations: 100,
    },
  });

  // Regular User Client
  const clientUser = await prisma.user.upsert({
    where: { email: 'dudububu@gmail.com' },
    update: {
      name: 'Dudu & Bubu (Client)',
      password: 'password123',
      role: 'USER',
      package: 'PREMIUM',
      maxInvitations: 5,
    },
    create: {
      email: 'dudububu@gmail.com',
      name: 'Dudu & Bubu (Client)',
      password: 'password123',
      role: 'USER',
      package: 'PREMIUM',
      maxInvitations: 5,
    },
  });

  // Demo Account
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@weddora.com' },
    update: {
      name: 'Akun Demo Weddora',
      password: 'demopassword',
      role: 'DEMO',
      package: 'PREMIUM',
      maxInvitations: 3,
    },
    create: {
      email: 'demo@weddora.com',
      name: 'Akun Demo Weddora',
      password: 'demopassword',
      role: 'DEMO',
      package: 'PREMIUM',
      maxInvitations: 3,
    },
  });

  // 2. Categories
  const categoriesData = [
    { name: 'Luxury', slug: 'luxury', description: 'Desain mewah dengan nuansa emas, marble, & perhiasan', icon: 'Sparkles' },
    { name: 'Elegant', slug: 'elegant', description: 'Anggun dan timeless dengan warna pastel & champagne', icon: 'Crown' },
    { name: 'Modern', slug: 'modern', description: 'Desain terkini dengan tipografi kuat & layout bersih', icon: 'LayoutGrid' },
    { name: 'Floral', slug: 'floral', description: 'Sentuhan bunga mawar, sakura, & dedaunan segar', icon: 'Flower2' },
    { name: 'Traditional', slug: 'traditional', description: 'Nuansa adat Jawa, Sunda, Minang, Bali, & Melayu', icon: 'Feather' },
    { name: 'Islamic', slug: 'islamic', description: 'Nuansa Islami dengan ornamen kaligrafi & doa', icon: 'Heart' },
    { name: 'Minimalist', slug: 'minimalist', description: 'Simpel, rapi, dengan fokus pada ruang dan cerita', icon: 'Minimize2' },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }

  // 3. Audio Music Tracks (Exclusively from public/uploads/music)
  const musicList = [
    {
      title: 'Westlife - Beautiful in White',
      artist: 'Westlife',
      audioUrl: '/uploads/music/1788003073611_Westlife_-__Beautiful_in_white_Lyrics.mp3',
      duration: '3:50',
      genre: 'Wedding Anthem',
      isRoyaltyFree: true,
    },
    {
      title: 'Christina Perri - A Thousand Years',
      artist: 'Christina Perri',
      audioUrl: '/uploads/music/1787996162038_Christina_Perri_-_A_Thousand_Years_Official_Music_Video.mp3',
      duration: '4:45',
      genre: 'Romantic Wedding',
      isRoyaltyFree: true,
    },
    {
      title: 'The Carpenters - Close To You',
      artist: 'The Carpenters',
      audioUrl: '/uploads/music/1787996157058_Carpenters_-_Close_to_you.mp3',
      duration: '3:40',
      genre: 'Classic Love',
      isRoyaltyFree: true,
    },
    {
      title: 'Alex Warren - Ordinary',
      artist: 'Alex Warren',
      audioUrl: '/uploads/music/1787996152443_Alex_Warren_-_Ordinary__Official_Video_.mp3',
      duration: '3:10',
      genre: 'Acoustic Pop',
      isRoyaltyFree: true,
    },
    {
      title: 'Feby Putri - Bernaung',
      artist: 'Feby Putri',
      audioUrl: '/uploads/music/1787996166919_Feby_Putri_-_Bernaung__From_Setetes_Embun_Cinta_Niyala__.mp3',
      duration: '3:30',
      genre: 'Indie Acoustic',
      isRoyaltyFree: true,
    },
    {
      title: 'Nadin Amizah - Di Akhir Perang',
      artist: 'Nadin Amizah',
      audioUrl: '/uploads/music/1788003105498_Nadin_Amizah_-_Di_Akhir_Perang__Official_Lyric_Video_.mp3',
      duration: '3:58',
      genre: 'Romantic Folk',
      isRoyaltyFree: true,
    },
  ];

  const createdMusicList = [];
  for (const m of musicList) {
    const created = await prisma.music.create({ data: m });
    createdMusicList.push(created);
  }

  const defaultMusicTrack = createdMusicList[0]; // Westlife - Beautiful in White

  // 4. Distinct Curated Top 12 Templates Data
  const templatesData = [
    {
      name: 'Classic Java Bronze Earthy',
      slug: 'classic-java-bronze',
      categoryId: categoriesMap['traditional'],
      previewImage: '/templates/classic-java-bronze.png',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Kehangatan tradisi adat Jawa klasik bertema studio bronze/olive earthy dengan nuansa beskap & kebaya eksklusif.',
      designSchema: JSON.stringify({
        theme: { primary: '#C9A66B', secondary: '#E5C158', background: '#3D3222', cardBg: '#2A2217', textPrimary: '#FDE68A', textSecondary: '#D97706', accent: '#E5C158' },
        fonts: { heading: 'Pinyon Script', body: 'Bodoni Moda', accent: 'Pinyon Script' },
        ornamentStyle: 'gold-floral',
        animation: 'gold-dust',
        photoShape: 'circle',
        photoPosition: 'object-center',
        coverCardBgColor: '#2A2217',
        coverCardCornerShape: 'rounded',
        coverCardBorderStyle: 'double-gold',
        cardCornerShape: 'rounded',
        cardBorderStyle: 'double-gold',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        enableWatermarkTypography: true,
        watermarkText: 'D & A',
        enableAutoScroll: true,
      }),
    },
    {
      name: 'Pink Botanical Arch Peacock',
      slug: 'pink-botanical-arch',
      categoryId: categoriesMap['floral'],
      previewImage: '/templates/pink-botanical-arch.jpg',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Latar ilustrasi tropis burung merak dengan bingkai kubah Arch Dome warna pink rose romantis nan anggun.',
      designSchema: JSON.stringify({
        theme: { primary: '#D87D8A', secondary: '#E8A2AB', background: '#2D1520', cardBg: '#4A2032', textPrimary: '#FFF0F5', textSecondary: '#F472B6', accent: '#F472B6' },
        fonts: { heading: 'Great Vibes', body: 'Montserrat', accent: 'Great Vibes' },
        ornamentStyle: 'gold-floral',
        animation: 'cherry-blossoms',
        photoShape: 'arch',
        photoPosition: 'object-top',
        coverCardBgColor: '#4A2032',
        coverCardCornerShape: 'arch',
        coverCardBorderStyle: 'solid-gold',
        cardCornerShape: 'arch',
        cardBorderStyle: 'solid-gold',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        enableWatermarkTypography: true,
        watermarkText: 'W & B',
        enableAutoScroll: true,
      }),
    },
    {
      name: 'Garden Glasshouse Minimalist',
      slug: 'garden-glasshouse',
      categoryId: categoriesMap['modern'],
      previewImage: '/templates/garden-glasshouse.jpg',
      price: 89000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Keindahan taman rumah kaca (Glasshouse) dengan arsitektur botani hijau merambat dan tipografi modern minimalis.',
      designSchema: JSON.stringify({
        theme: { primary: '#FFFFFF', secondary: '#E2E8F0', background: '#0F171A', cardBg: '#1A2426', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#10B981' },
        fonts: { heading: 'Playfair Display', body: 'Jost', accent: 'Great Vibes' },
        ornamentStyle: 'minimalist-line',
        animation: 'sparkles',
        photoShape: 'square',
        photoPosition: 'object-center',
        coverCardBgColor: '#1A2426',
        coverCardCornerShape: 'sharp',
        coverCardBorderStyle: 'glassmorphism',
        cardCornerShape: 'rounded',
        cardBorderStyle: 'glassmorphism',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        enableWatermarkTypography: true,
        watermarkText: 'Y & N',
        enableAutoScroll: true,
        layoutType: 'story_slides',
        eventStyle: 'boarding_pass',
        couplePhotoStyle: 'arch',
        galleryStyle: 'film_strip',
        loveStoryStyle: 'chat_message',
      }),
    },
    {
      name: 'Luxury Gold Marble VIP',
      slug: 'luxury-gold-marble',
      categoryId: categoriesMap['luxury'],
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Kombinasi emas perhiasan royal 24K dan tekstur marmer putih yang memberikan kemewahan istana VIP tertinggi.',
      designSchema: JSON.stringify({
        theme: { primary: '#C9A66B', secondary: '#E6D3A9', background: '#0F172A', cardBg: '#1E293B', textPrimary: '#F8FAFC', textSecondary: '#94A3B8', accent: '#D7BA7D' },
        fonts: { heading: 'Cinzel', body: 'Montserrat', accent: 'Great Vibes' },
        ornament: 'gold-gold',
        animation: 'sparkles',
        photoShape: 'circle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'B & C',
        cardStyle: 'rounded-3xl border-gold',
        layoutType: 'standard_scroll',
        coverStyle: 'wax_seal_envelope',
        navigationStyle: 'bottom_dock',
        eventStyle: 'boarding_pass',
        couplePhotoStyle: 'polaroid',
        loveStoryStyle: 'chat_message',
        galleryStyle: 'film_strip',
      }),
    },
    {
      name: 'Javanese Royal Kraton VIP',
      slug: 'javanese-royal-kraton',
      categoryId: categoriesMap['traditional'],
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Desain mahkota wayang emas sakral dan batik prada keraton Jawa kelas bangsawan.',
      designSchema: JSON.stringify({
        theme: { primary: '#F59E0B', secondary: '#FDE68A', background: '#1E1B4B', cardBg: '#312E81', textPrimary: '#FEF3C7', textSecondary: '#FCD34D', accent: '#F59E0B' },
        fonts: { heading: 'Pinyon Script', body: 'Bodoni Moda', accent: 'Pinyon Script' },
        ornament: 'javanese-kraton',
        animation: 'sparkles',
        photoShape: 'arch',
        photoPosition: 'object-top',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'D & S',
        cardStyle: 'traditional-arch',
        coverStyle: 'minimalist_1',
      }),
    },
    {
      name: 'Sapphire Midnight Starlight VIP',
      slug: 'sapphire-midnight-stars',
      categoryId: categoriesMap['luxury'],
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Keindahan gemerlap bintang sapphire biru malam dengan pendaran cahaya emas permata.',
      designSchema: JSON.stringify({
        theme: { primary: '#3B82F6', secondary: '#93C5FD', background: '#0B132B', cardBg: '#1C2541', textPrimary: '#F0F9FF', textSecondary: '#60A5FA', accent: '#60A5FA' },
        fonts: { heading: 'Cinzel Decorative', body: 'Jost', accent: 'Great Vibes' },
        ornament: 'sparkle-star',
        animation: 'gold-dust',
        photoShape: 'oval',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'R & N',
        cardStyle: 'rounded-3xl border-gold',
        coverStyle: 'minimalist_2',
      }),
    },
    {
      name: 'Golden Palace Baroque VIP',
      slug: 'golden-palace-baroque',
      categoryId: categoriesMap['luxury'],
      previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Kemewahan gaya baroque istana Eropa abad pertengahan dengan aksen ukiran emas bernilai seni tinggi.',
      designSchema: JSON.stringify({
        theme: { primary: '#EAB308', secondary: '#FEF08A', background: '#18181B', cardBg: '#27272A', textPrimary: '#FAFAFA', textSecondary: '#FACC15', accent: '#EAB308' },
        fonts: { heading: 'Bodoni Moda', body: 'Raleway', accent: 'Pinyon Script' },
        ornament: 'baroque-gold',
        animation: 'sparkles',
        photoShape: 'oval',
        photoPosition: 'object-top',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'R & S',
        cardStyle: 'rounded-3xl border-gold',
      }),
    },
    {
      name: 'Minang Rumah Gadang Luxury VIP',
      slug: 'minang-rumah-gadang-luxury',
      categoryId: categoriesMap['traditional'],
      previewImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
      price: 100000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Kemegahan mahkota suntiang Minangkabau dan ukiran ukir jubah songket emas khas Sumatra Barat.',
      designSchema: JSON.stringify({
        theme: { primary: '#EF4444', secondary: '#FCA5A5', background: '#450A0A', cardBg: '#7F1D1D', textPrimary: '#FEF2F2', textSecondary: '#F87171', accent: '#EF4444' },
        fonts: { heading: 'Cinzel Decorative', body: 'Montserrat', accent: 'Alex Brush' },
        ornament: 'minang-suntiang',
        animation: 'gold-dust',
        photoShape: 'arch',
        photoPosition: 'object-top',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'I & R',
        cardStyle: 'traditional-arch',
      }),
    },
    {
      name: 'Emerald Forest Botanical AI',
      slug: 'emerald-forest-botanical',
      categoryId: categoriesMap['floral'],
      previewImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
      price: 89000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Nuansa hijau zamrud botani nan megah dengan rimbunan dedaunan dan aksen studio visual.',
      designSchema: JSON.stringify({
        theme: { primary: '#10B981', secondary: '#A7F3D0', background: '#064E3B', cardBg: '#022C22', textPrimary: '#ECFDF5', textSecondary: '#6EE7B7', accent: '#34D399' },
        fonts: { heading: 'Cormorant Garamond', body: 'Montserrat', accent: 'Great Vibes' },
        ornament: 'emerald-leaf',
        animation: 'falling-leaves',
        photoShape: 'arch',
        photoPosition: 'object-top',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'A & M',
        cardStyle: 'traditional-arch',
      }),
    },
    {
      name: 'Islamic Crescent Gold AI',
      slug: 'islamic-crescent-gold',
      categoryId: categoriesMap['islamic'],
      previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
      price: 89000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Elegan Islami dengan ornamen kubah masjid syar’i, kaligrafi, dan fitur studio visual.',
      designSchema: JSON.stringify({
        theme: { primary: '#D97706', secondary: '#FDE68A', background: '#0F172A', cardBg: '#1E293B', textPrimary: '#F8FAFC', textSecondary: '#94A3B8', accent: '#F59E0B' },
        fonts: { heading: 'Cinzel Decorative', body: 'Montserrat', accent: 'Great Vibes' },
        ornament: 'islamic-dome',
        animation: 'islamic-stars',
        photoShape: 'arch',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'F & A',
        cardStyle: 'islamic-dome',
      }),
    },
    {
      name: 'Rose Crimson Romance AI',
      slug: 'rose-crimson-romance',
      categoryId: categoriesMap['elegant'],
      previewImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
      price: 89000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Nuansa warna mawar beludru merah crimson nan romantis dengan tipografi cantik.',
      designSchema: JSON.stringify({
        theme: { primary: '#FB7185', secondary: '#FECDD3', background: '#2D121B', cardBg: '#4A1D2C', textPrimary: '#FFF1F2', textSecondary: '#FDA4AF', accent: '#F43F5E' },
        fonts: { heading: 'Alex Brush', body: 'Raleway', accent: 'Alex Brush' },
        ornament: 'rose-petal',
        animation: 'rose-petals',
        photoShape: 'oval',
        photoPosition: 'object-top',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: true,
        watermarkText: 'D & A',
        cardStyle: 'rounded-3xl border-gold',
        coverStyle: 'minimalist_3',
      }),
    },
    {
      name: 'Minimal Monochrome Black',
      slug: 'minimal-monochrome-black',
      categoryId: categoriesMap['minimalist'],
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      price: 89000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Tampilan monokrom hitam putih kontras tinggi yang tegas, modern, & tajam.',
      designSchema: JSON.stringify({
        theme: { primary: '#F8FAFC', secondary: '#E2E8F0', background: '#020617', cardBg: '#0F172A', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#F8FAFC' },
        fonts: { heading: 'Playfair Display', body: 'Montserrat', accent: 'Great Vibes' },
        ornament: 'minimal-line',
        animation: 'fade',
        photoShape: 'rectangle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: true,
        backgroundSilhouetteOpacity: 0.85,
        backgroundSilhouetteStyle: 'full',
        enableWatermarkTypography: false,
        watermarkText: 'A & V',
        cardStyle: 'sharp-minimal',
        layoutType: 'magazine_editorial',
        couplePhotoStyle: 'polaroid',
        galleryStyle: 'masonry',
        coverStyle: 'standard',
      }),
    },
    {
      name: 'Cinema Premiere Noir (Movie Trailer VIP)',
      slug: 'cinema-premiere-noir',
      categoryId: categoriesMap['luxury'],
      previewImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
      price: 129000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Undangan bergaya rilis film layar lebar Netflix dengan billboard hero 21:9, pemeran bintang, dan tiket bioskop VIP.',
      designSchema: JSON.stringify({
        theme: { primary: '#E50914', secondary: '#F59E0B', background: '#111315', cardBg: '#18181B', textPrimary: '#FFFFFF', textSecondary: '#A1A1AA', accent: '#E50914' },
        fonts: { heading: 'Cinzel', body: 'Montserrat', accent: 'Playfair Display' },
        ornament: 'sparkle-star',
        animation: 'gold-dust',
        photoShape: 'rectangle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: false,
        enableWatermarkTypography: false,
        cardStyle: 'cinema-ticket',
        layoutType: 'cinematic_trailer',
        coverStyle: 'standard',
      }),
    },
    {
      name: 'Vintage Scrapbook & Memory Album',
      slug: 'vintage-scrapbook-memories',
      categoryId: categoriesMap['elegant'],
      previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
      price: 119000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Buku kenangan fisik dengan fisika membalik halaman 3D, foto polaroid washi tape, bunga kering, dan kartu pos RSVP.',
      designSchema: JSON.stringify({
        theme: { primary: '#D97706', secondary: '#FDE68A', background: '#1c1815', cardBg: '#fbf7ee', textPrimary: '#2B2118', textSecondary: '#78350F', accent: '#B45309' },
        fonts: { heading: 'Playfair Display', body: 'Lora', accent: 'Great Vibes' },
        ornament: 'flower-vintage',
        animation: 'fade',
        photoShape: 'polaroid',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: false,
        enableWatermarkTypography: false,
        cardStyle: 'scrapbook',
        layoutType: '3d_flipbook',
        coverStyle: 'standard',
      }),
    },
    {
      name: 'Grand Vernissage Art Gallery',
      slug: 'grand-vernissage-art',
      categoryId: categoriesMap['luxury'],
      previewImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
      price: 139000,
      tier: 'LUXURY',
      status: 'PUBLISHED',
      description: 'Pameran seni privat museum dengan navigasi scroll menyamping (side-scrolling), lampu sorot karya, dan plakat kurator.',
      designSchema: JSON.stringify({
        theme: { primary: '#C9A66B', secondary: '#E6D3A9', background: '#121417', cardBg: '#1c1f24', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#D4AF37' },
        fonts: { heading: 'Cinzel', body: 'Montserrat', accent: 'Playfair Display' },
        ornament: 'classic-frame',
        animation: 'fade',
        photoShape: 'rectangle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: false,
        enableWatermarkTypography: false,
        cardStyle: 'museum-plaque',
        layoutType: 'horizontal_gallery',
        coverStyle: 'gatefold_ribbon',
      }),
    },
    {
      name: 'Our Journey Love Line Map',
      slug: 'love-island-miniworld',
      categoryId: categoriesMap['modern'],
      previewImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800',
      price: 129000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Peta rute transit neon rose-gold vertikal ala "Our Journey" dengan foto polaroid selang-seling, stasiun cincin bercahaya, dan pin penanda hati.',
      designSchema: JSON.stringify({
        theme: { primary: '#10B981', secondary: '#F59E0B', background: '#0c141f', cardBg: '#132030', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#34D399' },
        fonts: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', accent: 'Great Vibes' },
        ornament: 'fairy-lights',
        animation: 'sparkles',
        photoShape: 'circle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: false,
        enableWatermarkTypography: false,
        cardStyle: 'island-marker',
        layoutType: 'isometric_map',
        coverStyle: 'standard',
      }),
    },
    {
      name: 'Celestial Radial Constellation',
      slug: 'celestial-radial-hub',
      categoryId: categoriesMap['modern'],
      previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
      price: 139000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Navigasi radial satu layar penuh dengan Inti Gravitasi Cinta di tengah dan 6 nodus satelit interaktif mengitari cincin orbit bintang.',
      designSchema: JSON.stringify({
        theme: { primary: '#F59E0B', secondary: '#EC4899', background: '#050811', cardBg: '#0b101f', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#FBBF24' },
        fonts: { heading: 'Cinzel', body: 'Plus Jakarta Sans', accent: 'Great Vibes' },
        ornament: 'celestial-stars',
        animation: 'sparkles',
        photoShape: 'circle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: false,
        enableWatermarkTypography: false,
        cardStyle: 'radial-hub',
        layoutType: 'radial_constellation',
        coverStyle: 'standard',
      }),
    },
    {
      name: 'The Metro Love Express',
      slug: 'metro-love-express',
      categoryId: categoriesMap['modern'],
      previewImage: '/templates/metro-love-express.jpg',
      price: 139000,
      tier: 'PREMIUM',
      status: 'PUBLISHED',
      description: 'Peta rute transit kereta cepat modern ala MRT / Tokyo Metro dengan 7 stasiun, tiket transit pass, dan rel bercahaya.',
      designSchema: JSON.stringify({
        theme: { primary: '#F59E0B', secondary: '#0EA5E9', background: '#070b14', cardBg: '#0f172a', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#FBBF24' },
        fonts: { heading: 'Cinzel', body: 'Plus Jakarta Sans', accent: 'Great Vibes' },
        ornament: 'metro-track',
        animation: 'sparkles',
        photoShape: 'circle',
        photoPosition: 'object-center',
        enableBackgroundSilhouette: false,
        enableWatermarkTypography: false,
        cardStyle: 'metro-pass',
        layoutType: 'metro_express',
        coverStyle: 'standard',
      }),
    },
  ];

  const keptSlugs = templatesData.map((t) => t.slug);
  await prisma.invitation.deleteMany({ where: { template: { slug: { notIn: keptSlugs } } } });
  await prisma.template.deleteMany({ where: { slug: { notIn: keptSlugs } } });

  for (const t of templatesData) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }

  // Clean temporary draft invitations created during testing
  await prisma.invitation.deleteMany({
    where: {
      slug: {
        startsWith: 'undangan-',
      },
    },
  });

  // Restore Complete Demo Invitation Web Data (andi-sinta)
  const luxuryTemplate = await prisma.template.findUnique({ where: { slug: 'luxury-gold-marble' } });

  if (luxuryTemplate) {
    const demoInvitation = await prisma.invitation.upsert({
      where: { slug: 'andi-sinta' },
      update: {
        userId: demoUser.id,
        templateId: luxuryTemplate.id,
        title: 'Pernikahan Andi Pratama & Sinta Nurhaliza',
        slug: 'andi-sinta',
        isPublished: true,
        designConfig: luxuryTemplate.designSchema,
        groomName: 'Andi Pratama, S.T.',
        groomParents: 'Putra Pertama dari Bapak H. Budi Santoso & Ibu Hj. Ani Wijaya',
        groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        groomInstagram: '@andipratama',
        brideName: 'Sinta Nurhaliza, S.Ked.',
        brideParents: 'Putri Kedua dari Bapak Dr. H. Rahmad Hidayat & Ibu Hj. Siti Aminah',
        bridePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
        brideInstagram: '@sintanurhaliza',
        weddingDate: new Date('2026-12-12T08:00:00.000Z'),
        coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
        youtubeUrl: 'https://www.youtube.com/watch?v=-ARVwU58l7A',
        quoteText: 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
        quoteSource: 'QS. Ar-Rum: 21',
        musicId: defaultMusicTrack.id, // Westlife - Beautiful in White
        loveStory: JSON.stringify([
          { year: '2021', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu saat mengikuti seminar teknologi di Jakarta.' },
          { year: '2023', title: 'Momen Berkomitmen', description: 'Memutuskan untuk melangkah bersama dalam ikatan persahabatan & kasih sayang.' },
          { year: '2025', title: 'Acara Lamaran', description: 'Momen sakral pertemuan dua keluarga besar melamar calon pengantin.' },
          { year: '2026', title: 'Hari Pernikahan', description: 'Akad nikah & resepsi pernikahan bertema Luxury Gold Marble.' },
        ]),
        galleryPhotos: JSON.stringify([
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
          'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
        ]),
        digitalGifts: JSON.stringify([
          { bankName: 'Bank BCA', accountName: 'Andi Pratama', accountNumber: '8830192841' },
          { bankName: 'Bank Mandiri', accountName: 'Sinta Nurhaliza', accountNumber: '1370019284712' },
        ]),
      },
      create: {
        userId: demoUser.id,
        templateId: luxuryTemplate.id,
        title: 'Pernikahan Andi Pratama & Sinta Nurhaliza',
        slug: 'andi-sinta',
        isPublished: true,
        designConfig: luxuryTemplate.designSchema,
        groomName: 'Andi Pratama, S.T.',
        groomParents: 'Putra Pertama dari Bapak H. Budi Santoso & Ibu Hj. Ani Wijaya',
        groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        groomInstagram: '@andipratama',
        brideName: 'Sinta Nurhaliza, S.Ked.',
        brideParents: 'Putri Kedua dari Bapak Dr. H. Rahmad Hidayat & Ibu Hj. Siti Aminah',
        bridePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
        brideInstagram: '@sintanurhaliza',
        weddingDate: new Date('2026-12-12T08:00:00.000Z'),
        coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
        youtubeUrl: 'https://www.youtube.com/watch?v=-ARVwU58l7A',
        quoteText: 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
        quoteSource: 'QS. Ar-Rum: 21',
        musicId: defaultMusicTrack.id, // Westlife - Beautiful in White
        loveStory: JSON.stringify([
          { year: '2021', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu saat mengikuti seminar teknologi di Jakarta.' },
          { year: '2023', title: 'Momen Berkomitmen', description: 'Memutuskan untuk melangkah bersama dalam ikatan persahabatan & kasih sayang.' },
          { year: '2025', title: 'Acara Lamaran', description: 'Momen sakral pertemuan dua keluarga besar melamar calon pengantin.' },
          { year: '2026', title: 'Hari Pernikahan', description: 'Akad nikah & resepsi pernikahan bertema Luxury Gold Marble.' },
        ]),
        galleryPhotos: JSON.stringify([
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
          'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
        ]),
        digitalGifts: JSON.stringify([
          { bankName: 'Bank BCA', accountName: 'Andi Pratama', accountNumber: '8830192841' },
          { bankName: 'Bank Mandiri', accountName: 'Sinta Nurhaliza', accountNumber: '1370019284712' },
        ]),
      },
    });

    // Seed Demo RSVPs for andi-sinta
    await prisma.rsvp.deleteMany({ where: { invitationId: demoInvitation.id } });
    await prisma.rsvp.createMany({
      data: [
        {
          invitationId: demoInvitation.id,
          guestName: 'Budi Santoso & Keluarga',
          status: 'ATTENDING',
          guestCount: 2,
          message: 'Selamat untuk Andi dan Sinta! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin!',
        },
        {
          invitationId: demoInvitation.id,
          guestName: 'Rizky & Maya',
          status: 'ATTENDING',
          guestCount: 2,
          message: 'Happy wedding brother! Lancar terus sampai hari H yaa.',
        },
        {
          invitationId: demoInvitation.id,
          guestName: 'Dinda Lestari',
          status: 'ATTENDING',
          guestCount: 1,
          message: 'Selamat Sinta sayang! Cantik banget undangannya, gak sabar mau dateng.',
        },
      ],
    });
  }

  // Update ALL existing invitations in database to use Westlife - Beautiful in White as default music
  await prisma.invitation.updateMany({
    data: {
      musicId: defaultMusicTrack.id,
    },
  });

  console.log('Seeding completed successfully with 21 unique templates & varied couple sample names!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
