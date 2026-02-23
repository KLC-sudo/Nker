
import React from 'react';

export interface Service {
  icon: string;
  title: string;
  description: string;
  subItems?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface Approach {
  title: string;
  description: string;
  icon: string;
}

export interface Partner {
  name: string;
  icon: string;
}

export interface ContactItem {
  label: string;      // e.g. "Email", "WhatsApp", "Address"
  value: string;      // Display value
  href?: string;      // Optional link: mailto:, tel:, https://wa.me/...
  icon?: string;      // Custom uploaded image URL
  iconSvg?: string;  // Built-in key: mail | phone | map | whatsapp | globe | instagram
}

export interface GalleryImage {
  image: string;
  caption?: string;
  alt: string;
}

export interface Branding {
  logoTop: string;
  logoBottom: string;
  logoTopSize: number;      // Size in pixels (32-250)
  logoBottomSize: number;   // Size in pixels (32-250)
  brandName?: string;       // Text beside logo e.g. "ANKER CHICKEN"
}

export interface About {
  title: string;
  subtitle: string;
  whoWeAre: string;
  mission: string;
  vision: string;
}

// Hero slide — supports multiple slides (carousel)
export interface HeroSlide {
  bgType?: 'image' | 'svg';  // 'image' = uploaded photo, 'svg' = built-in/custom pattern
  bgImage?: string;          // Upload path (used when bgType='image')
  svgPatternIndex?: number;  // 0-5 for built-in SVG patterns (used when bgType='svg')
  customSvg?: string;        // Raw SVG markup override (used when bgType='svg')
  badge?: string;            // e.g. "FRESH QUALITY SINCE 2018"
  heading: string;           // Main headline
  headingAccent?: string;    // Second line shown in red italic
  subtext?: string;          // Short tagline below heading
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface TrustBadge {
  icon: string;             // emoji or icon name
  title: string;
  subtitle: string;
}

export interface QualityBullet {
  title: string;
  description: string;
}

export interface QualitySection {
  heading: string;
  subheading?: string;
  image: string;            // CMS upload
  imageBadge?: string;      // Overlay text e.g. "4+ Weeks Old"
  imageBadgeSubtext?: string;
  bullets: QualityBullet[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface Product {
  name: string;
  image: string;            // CMS upload
  price: string;            // e.g. "UGX 15,000"
  badge?: string;           // e.g. "POPULAR"
}

export interface BestSellers {
  title: string;
  products: Product[];
}



export interface Content {
  // Section metadata
  servicesTitle: string;
  servicesSubtitle: string;
  approachTitle: string;
  approachSubtitle: string;
  partnersTitle: string;
  partnersSubtitle: string;
  partnersVisible: boolean;
  teamTitle: string;
  teamSubtitle: string;
  teamVisible: boolean;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryVisible: boolean;

  // New sections
  shopNowHref: string;
  heroSlides: HeroSlide[];
  trustBadges: TrustBadge[];
  qualitySection: QualitySection;
  bestSellers: BestSellers;

  // Content arrays
  navLinks: { name: string; href: string }[];
  branding: Branding;
  about: About;
  services: Service[];
  team: TeamMember[];
  approach: Approach[];
  partners: Partner[];
  gallery: GalleryImage[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  contactItems?: ContactItem[];

  // Checkout Configuration
  checkoutWhatsApp?: string;
  checkoutEmail?: string;
}
