# ArticulosDelSur E-commerce Demo Implementation Plan

## Goal Description
Create a professional, modern, and high-performance e-commerce demo for "ArticulosDelSur" within the `wavesystem-next` project. The demo will feature a dedicated route (`/articulos-del-sur`), a distinct visual identity (Blue/Grey/Orange), and fluid animations using Framer Motion.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context / Hooks

## Design & UI/UX
- **Palette**:
    - Primary: Navy Blue (`bg-slate-900` / `text-slate-900`)
    - Secondary: Light Grey/White (`bg-gray-50`)
    - Accent: Burnt Orange (`text-orange-500` / `bg-orange-600`)
- **Typography**: Inter (already configured)
- **Visuals**: Minimalist, card-based layout, smooth fade-in animations.

## Proposed Changes

### [Dependencies]
- Install `framer-motion` if not present.

### [Structure]
Create a new route group or directory `src/app/articulos-del-sur` to isolate this demo.

#### [NEW] [src/app/articulos-del-sur/layout.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/layout.tsx)
- Dedicated layout with a specific Navbar and Footer for "ArticulosDelSur".
- Global font and color settings for this subtree.

#### [NEW] [src/app/articulos-del-sur/page.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/page.tsx)
- **Hero Section**: Full-width banner with product carousel and CTA.
- **Featured Categories**: Visual cards for TVs, Fridges, ACs.
- **New Arrivals**: Grid of product cards with hover effects.

#### [NEW] [src/app/articulos-del-sur/components/Navbar.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/components/Navbar.tsx)
- Logo "ArticulosDelSur".
- Navigation links (Home, Products, About).
- Cart icon with badge.

#### [NEW] [src/app/articulos-del-sur/components/ProductCard.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/components/ProductCard.tsx)
- Reusable component using **Framer Motion**.
- Props: `image`, `title`, `price`, `category`.
- Animations: `whileHover={{ scale: 1.05 }}` and `initial={{ opacity: 0, y: 20 }}`.

#### [NEW] [src/app/articulos-del-sur/productos/page.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/productos/page.tsx)
- Sidebar with filters (mocked).
- Responsive grid of `ProductCard` components.

#### [NEW] [src/app/articulos-del-sur/carrito/page.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/carrito/page.tsx)
- **Summary List**: Display added items with images, titles, and prices.
- **Quantity Controls**: +/- buttons to adjust quantity.
- **Order Summary**: Subtotal, Shipping (Free/Cost), Total.
- **Coupon Input**: Field to apply discounts.
- **Checkout Button**: Link to `/checkout`.

#### [NEW] [src/app/articulos-del-sur/checkout/page.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/checkout/page.tsx)
- **Multi-step Form**:
    1.  **Personal Info**: Name, Email, Phone.
    2.  **Shipping**: Address, City, Zip.
    3.  **Payment**: Credit Card form (visual only), Installments selector.
- **Validation**: Basic field validation.
- **Success State**: "Thank you for your purchase" confirmation.

### Main Landing Page Responsiveness
#### [MODIFY] [src/components/Navbar.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/components/Navbar.tsx)
- Increase container max-width to `1920px`.
- Adjust padding for larger screens.

#### [MODIFY] [src/components/Hero.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/components/Hero.tsx)
- Increase container max-width to `1920px`.
- Scale typography for 4K/ultrawide monitors (`xl:text-7xl`, `2xl:text-8xl`).
- Adjust spacing and layout for wider viewports.

#### [MODIFY] [src/components/Features.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/components/Features.tsx)
- Increase container max-width to `1920px`.
- Adjust grid columns for large screens (up to 4 or 5 columns).

#### [MODIFY] [src/app/page.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/page.tsx)
- Ensure any page-level containers also respect the new max-width.

### Mobile Refinement (iPhone 14 Pro Max)
#### [MODIFY] [src/components/Hero.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/components/Hero.tsx)
- Ensure text sizes are readable on mobile (not too huge, not too small).
- Verify padding for smaller screens.
- Ensure images/visuals don't cause overflow.

#### [MODIFY] [src/app/articulos-del-sur/page.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/page.tsx)
- Check Hero section on mobile.
- Ensure product cards are fully responsive (1 column on mobile).

#### [MODIFY] [src/app/layout.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/layout.tsx)
- Add `viewport` export to ensure `width=device-width, initial-scale=1`.

#### [MODIFY] [src/app/articulos-del-sur/layout.tsx](file:///home/claudio/carpeta-remota1/wavesystem/wavesystem-next/src/app/articulos-del-sur/layout.tsx)
- Add `viewport` export.

## Verification Plan
### Automated Tests
- Build verification: `npm run build` to ensure no type errors.

### Manual Verification
- Navigate to `https://wavesystem.online/next/articulos-del-sur`.
- Verify the "ArticulosDelSur" branding (colors, logo).
- Test the Hero carousel (if interactive) or static layout.
- Hover over product cards to verify Framer Motion animations.
- Check responsiveness on mobile view.
