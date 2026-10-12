import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Shop<span className="text-indigo-600">Sphere</span>
        </Link>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-6 text-sm text-gray-600"
        >
          <Link href="/" className="transition-colors hover:text-indigo-600">
            Home
          </Link>

          <Link
            href="/products"
            className="transition-colors hover:text-indigo-600"
          >
            Products
          </Link>

          <Link
            href="/wishlist"
            className="transition-colors hover:text-indigo-600"
          >
            Wishlist
          </Link>
        </nav>

        <p className="text-sm text-gray-500">
          © 2026 ShopSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;