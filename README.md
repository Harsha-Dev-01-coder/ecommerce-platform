# ShopSphere — Modern E-Commerce Platform

ShopSphere is a responsive e-commerce platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. It provides a modern storefront with a database-powered product catalog and a scalable foundation for shopping, checkout, and order management.

The project follows a modular architecture designed for maintainability, type safety, and future feature expansion.

## Features

### Product Catalog
- Dynamic product fetching from Supabase PostgreSQL.
- Reusable product card components.
- Responsive product grid for mobile, tablet, and desktop.
- Product images, names, categories, descriptions, prices, ratings, and stock availability.
- Loading fallback and empty-state UI.
- Error handling for product-related routes.
- Products displayed in alphabetical order.

### User Interface
- Responsive storefront layout.
- Shared navigation and footer components.
- Consistent styling with Tailwind CSS.
- Clean product cards with pricing and availability information.
- Dedicated application routes for shopping functionality.

### Database Integration
- Supabase client configuration using environment variables.
- TypeScript interface for product data.
- Reusable product retrieval service.
- PostgreSQL-backed product catalog.
- Row Level Security (RLS) for public product access.

### Application Structure
- Next.js App Router.
- TypeScript for type safety.
- Modular service layer for database operations.
- Dedicated routes for products, product details, cart, wishlist, and checkout.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Component-based user interface |
| TypeScript | Static typing and safer development |
| Tailwind CSS | Responsive styling |
| Supabase | PostgreSQL database and backend services |
| Supabase JavaScript Client | Database communication |
| npm | Package management |
| Git & GitHub | Version control and source code management |
| Vercel | Planned deployment platform |

## Application Routes

| Route | Description | Status |
|---|---|---|
| `/` | Storefront homepage | Implemented |
| `/products` | Product catalog | Connected to Supabase |
| `/products/[id]` | Individual product details | Route structure implemented |
| `/cart` | Shopping cart | Under development |
| `/wishlist` | Saved products | Under development |
| `/checkout` | Checkout experience | Under development |

## Getting Started

Follow these instructions to run ShopSphere locally.

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- Git
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

Navigate into the project directory:

```bash
cd ecommerce-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root, alongside `package.json`.

Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholder values with the URL and publishable key from your Supabase project settings.

**Security requirements:**

- Never commit `.env.local` to GitHub.
- Never expose Supabase secret or service-role keys in client-accessible code.
- Use a publishable key with appropriate Row Level Security policies.
- Keep privileged database operations on the server and protect them with proper authorization.

Restart the development server after changing environment variables.

### 4. Configure the Database

Create a `products` table in your Supabase PostgreSQL database with the following fields:

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Unique product identifier |
| `name` | TEXT | Product name |
| `description` | TEXT | Product description |
| `price` | NUMERIC | Product price |
| `category` | TEXT | Product category |
| `image` | TEXT | Product image URL |
| `rating` | NUMERIC | Product rating |
| `stock` | INTEGER | Available inventory |
| `createdAt` | TIMESTAMPTZ | Product creation timestamp |

The table should use appropriate defaults and constraints for product IDs, prices, ratings, stock quantities, and timestamps.

Enable Row Level Security and configure a read-only policy that allows the storefront to retrieve publicly available products.

If the table and policy have already been created, do not recreate them.

### 5. Run the Development Server

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

The application should now be available locally.

### 6. Create a Production Build

Run:

```bash
npm run build
```

This checks whether the application can be compiled for production.

The production build has successfully completed in the current development state.

## Project Structure

```text
ecommerce-platform/
├── app/
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── error.tsx
│   │   └── page.tsx
│   ├── wishlist/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── layout/
│       ├── Footer.tsx
│       └── Navbar.tsx
├── lib/
│   ├── services/
│   │   └── productService.ts
│   └── supabase.ts
├── types/
│   └── product.ts
├── public/
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

The project structure will evolve as additional features and modules are implemented.

**Note:** `.env.local` is listed to document local configuration. It must remain excluded from version control.

## Product Data Model

ShopSphere uses a shared TypeScript interface to represent product records.

```ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
  createdAt: string;
}
```

This interface provides a consistent expected data shape across product-related components and services.

The product service retrieves product records from Supabase and orders them by name.

## Current Implementation Status

The following capabilities are implemented:

- Responsive storefront interface.
- Supabase client configuration.
- Database-backed product retrieval.
- Product TypeScript interface.
- Reusable product card rendering.
- Responsive product grid.
- Product pricing and stock display.
- Product image rendering.
- Loading fallback and empty-state UI.
- Product route error handling.
- Successful production compilation.

The cart, wishlist, checkout, authentication, order management, and administrative functionality require further implementation before the platform can be considered a complete e-commerce application.

## Security Considerations

Security is an essential part of any application that handles customer information and transactions.

- Keep environment variables and credentials out of source control.
- Use Supabase Row Level Security to control database access.
- Never expose secret or service-role keys in browser code.
- Validate and authorize sensitive operations on the server.
- Protect customer records and order information with appropriate access policies.
- Validate checkout data before creating orders.
- Implement secure authentication and administrative authorization before releasing those features.

## Planned Improvements

Future development will expand ShopSphere with:

- Product search, filtering, and sorting.
- Database-backed product detail pages.
- Shopping cart with quantity management and automatic totals.
- Wishlist functionality with persistent storage.
- Checkout form validation and order submission.
- User authentication and profile management.
- Shipping address management.
- Order history and order tracking.
- Administrative product management.
- Administrative order management.
- Comprehensive loading, error, and empty-state testing.
- Production deployment and environment configuration.

## Deployment

ShopSphere is intended for deployment on Vercel.

Before deployment:

1. Verify that the production build succeeds.
2. Push the project to GitHub.
3. Import the repository into Vercel.
4. Configure the required Supabase environment variables.
5. Deploy the application.
6. Test the deployed routes and database connectivity.
7. Verify database access policies and production security settings.

Deployment should be marked complete only after the application has been published and verified.

## License

No open-source license has been specified for this project.

Unless a license is added, the repository should not be assumed to grant others permission to redistribute or reuse its code.

---