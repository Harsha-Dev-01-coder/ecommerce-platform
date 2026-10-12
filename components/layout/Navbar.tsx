import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Shop<span className="text-indigo-600">Sphere</span>
        </Link>

        {/* Navigation links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Products
          </Link>

          <Link
            href="/wishlist"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
          >
            Wishlist
          </Link>
        </div>

        {/* Cart */}
        <Link
          href="/cart"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Cart
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;