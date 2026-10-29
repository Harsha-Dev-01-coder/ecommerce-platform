"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

type FilterState = {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
};

type ProductSearchProps = {
  products: Product[];
};

const VALID_SORT_OPTIONS: SortOption[] = [
  "default",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
];

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "All",
  minPrice: "",
  maxPrice: "",
  sort: "default",
};

const URL_CHANGE_EVENT = "shopsphere:urlchange";

function getUrlSnapshot(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function getServerSnapshot(): string {
  return "/products";
}

function subscribeToUrlChanges(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  window.addEventListener(URL_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(URL_CHANGE_EVENT, callback);
  };
}

function parseFiltersFromUrl(currentUrl: string): FilterState {
  const queryIndex = currentUrl.indexOf("?");
  const queryString =
    queryIndex === -1 ? "" : currentUrl.slice(queryIndex + 1);

  const params = new URLSearchParams(queryString);
  const requestedSort = params.get("sort");

  return {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "All",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    sort: VALID_SORT_OPTIONS.includes(requestedSort as SortOption)
      ? (requestedSort as SortOption)
      : "default",
  };
}

function buildQueryString(filters: FilterState): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category !== "All") {
    params.set("category", filters.category);
  }

  if (filters.minPrice.trim()) {
    params.set("minPrice", filters.minPrice.trim());
  }

  if (filters.maxPrice.trim()) {
    params.set("maxPrice", filters.maxPrice.trim());
  }

  if (filters.sort !== "default") {
    params.set("sort", filters.sort);
  }

  return params.toString();
}

function updateUrl(filters: FilterState): void {
  const queryString = buildQueryString(filters);
  const pathname = window.location.pathname;

  const nextUrl = queryString
    ? `${pathname}?${queryString}`
    : pathname;

  const currentUrl = getUrlSnapshot();

  if (nextUrl === currentUrl) {
    return;
  }

  window.history.replaceState(null, "", nextUrl);
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

function updateFilterInUrl<K extends keyof FilterState>(
  currentFilters: FilterState,
  key: K,
  value: FilterState[K],
): void {
  const nextFilters: FilterState = {
    ...currentFilters,
    [key]: value,
  };

  updateUrl(nextFilters);
}

export default function ProductSearch({
  products,
}: ProductSearchProps) {
  const currentUrl = useSyncExternalStore(
    subscribeToUrlChanges,
    getUrlSnapshot,
    getServerSnapshot,
  );

  const filters = useMemo(
    () => parseFiltersFromUrl(currentUrl),
    [currentUrl],
  );

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(products.map((product) => product.category)),
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const minimum =
      filters.minPrice.trim() === ""
        ? null
        : Number(filters.minPrice);

    const maximum =
      filters.maxPrice.trim() === ""
        ? null
        : Number(filters.maxPrice);

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        filters.category === "All" ||
        product.category === filters.category;

      const matchesMinPrice =
        minimum === null ||
        (Number.isFinite(minimum) && product.price >= minimum);

      const matchesMaxPrice =
        maximum === null ||
        (Number.isFinite(maximum) && product.price <= maximum);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;

      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, filters]);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.category !== "All" ||
    filters.minPrice.trim() !== "" ||
    filters.maxPrice.trim() !== "" ||
    filters.sort !== "default";

  const hasInvalidPriceRange =
    filters.minPrice.trim() !== "" &&
    filters.maxPrice.trim() !== "" &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  function clearFilters(): void {
    updateUrl(DEFAULT_FILTERS);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Search products
          </label>

          <input
            id="product-search"
            type="search"
            value={filters.search}
            onChange={(event) =>
              updateFilterInUrl(
                filters,
                "search",
                event.target.value,
              )
            }
            placeholder="Search by product name or description..."
            autoComplete="off"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="product-category"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Filter by category
          </label>

          <select
            id="product-category"
            value={filters.category}
            onChange={(event) =>
              updateFilterInUrl(
                filters,
                "category",
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="min-price"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Minimum price (₹)
          </label>

          <input
            id="min-price"
            type="number"
            min="0"
            step="1"
            value={filters.minPrice}
            onChange={(event) =>
              updateFilterInUrl(
                filters,
                "minPrice",
                event.target.value,
              )
            }
            placeholder="e.g. 1000"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="max-price"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Maximum price (₹)
          </label>

          <input
            id="max-price"
            type="number"
            min="0"
            step="1"
            value={filters.maxPrice}
            onChange={(event) =>
              updateFilterInUrl(
                filters,
                "maxPrice",
                event.target.value,
              )
            }
            placeholder="e.g. 5000"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="product-sort"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Sort products
          </label>

          <select
            id="product-sort"
            value={filters.sort}
            onChange={(event) =>
              updateFilterInUrl(
                filters,
                "sort",
                event.target.value as SortOption,
              )
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="default">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest First</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-400" aria-live="polite">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {hasInvalidPriceRange && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          Minimum price cannot be greater than maximum price.
        </p>
      )}

      {filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-600 bg-gray-900 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-white">
            No matching products
          </h2>

          <p className="mt-3 text-sm text-gray-300">
            Try changing your search, category, or price range.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                unoptimized
                loading={index === 0 ? "eager" : "lazy"}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                  {product.category}
                </p>

                <h2 className="mt-2 text-lg font-semibold text-gray-900">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  <span className="text-sm text-gray-600">
                    ⭐ {product.rating}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}