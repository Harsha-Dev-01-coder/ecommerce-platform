ShopSphere 🛍️

A modern, full-stack e-commerce application built with Next.js, TypeScript, Tailwind CSS, Redux Toolkit, and Supabase.

ShopSphere provides a complete shopping experience with product discovery, cart management, wishlist functionality, secure authentication, checkout, order tracking, and an admin dashboard.

🌐 Live Application: https://ecommerce-platform-ten-gamma.vercel.app/

✨ Features

Customer Experience

* Browse products with responsive product cards.
* Search, filter, and sort products.
* View detailed product information.
* Add products to the shopping cart.
* Update product quantities and remove cart items.
* Save products to a wishlist.
* Persistent cart and wishlist state.
* Secure customer registration and login.
* Manage account profiles and shipping addresses.
* Complete checkout with saved shipping addresses.
* View order history and order details.
* Track order status.

Admin Dashboard

* Protected admin routes and role-based access.
* Dashboard with product, order, and customer statistics.
* Add new products.
* Edit existing products.
* Delete products with confirmation.
* View all customer orders.
* View detailed order information.
* Update order statuses.

Security

* Supabase authentication.
* PostgreSQL database with Row Level Security (RLS).
* Customer-specific data access.
* Admin-only product and order management.
* Server-side authorization checks.
* Secure database-side order creation.
* Atomic stock deduction during checkout.
* Protection against unauthorized role changes.

🛠️ Tech Stack

Technology	Purpose
Next.js	Full-stack React framework
React	User interface
TypeScript	Type safety
Tailwind CSS	Styling and responsive design
Redux Toolkit	Cart and wishlist state management
Supabase	Database and authentication
PostgreSQL	Relational database
React Hooks	Component state and lifecycle
Git & GitHub	Version control
Vercel	Deployment

📁 Project Structure

ecommerce-platform/
├── app/
│   ├── account/
│   │   ├── addresses/
│   │   ├── orders/
│   │   └── profile/
│   ├── admin/
│   │   ├── orders/
│   │   └── products/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   ├── orders/
│   ├── products/
│   ├── signup/
│   ├── wishlist/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── cart/
│   ├── layout/
│   ├── products/
│   └── ui/
├── features/
│   └── cart/
├── lib/
│   ├── auth/
│   ├── services/
│   └── supabase/
├── public/
├── types/
├── proxy.ts
├── package.json
└── README.md

🚀 Getting Started

Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git
* A Supabase account

1. Clone the repository

git clone https://github.com/Harsha-Dev-01-coder/ecommerce-platform.git

2. Navigate into the project

cd ecommerce-platform

3. Install dependencies

npm install

4. Configure environment variables

Create a .env.local file in the project root:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Get these values from your Supabase project’s API settings.

Important: Never commit .env.local or expose secret service-role keys in frontend code.

5. Configure Supabase

Create a Supabase project and configure the database tables and security policies required by the application.

The application uses the following tables:

* products
* profiles
* shipping_addresses
* orders
* order_items

Configure authentication, Row Level Security policies, and the order-creation database function before testing the complete application.

Assign administrator access through a trusted database-side process. Never allow users to assign themselves the admin role.

6. Start the development server

npm run dev

Open:

http://localhost:3000

🧪 Quality Checks

Run TypeScript checks:

npx tsc --noEmit

Create a production build:

npm run build

Start the production server locally:

npm start

🔐 Authentication and Authorization

ShopSphere supports two user roles:

Customer

* Manage personal account information.
* Manage shipping addresses.
* Browse and purchase products.
* Access personal order history.

Admin

* Access the admin dashboard.
* Manage products.
* View customer orders.
* Update order statuses.

Access is enforced through server-side authorization and Supabase Row Level Security.

🌐 Deployment

ShopSphere is deployed using Vercel.

Live Application: https://ecommerce-platform-ten-gamma.vercel.app/

GitHub Repository: https://github.com/Harsha-Dev-01-coder/ecommerce-platform

The project is connected to GitHub, and changes pushed to the main branch trigger automatic Vercel deployments.

👨‍💻 Developer

Built independently as a full-stack portfolio project to demonstrate practical skills in modern web development, authentication, database integration, state management, and application security.

📄 License

This project is intended for portfolio and educational purposes.