import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "../backend";
import { useGetProducts } from "../hooks/useQueries";
import { ProductCard } from "./ProductCard";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "Fruits", label: "🍎 Fruits" },
  { value: "Vegetables", label: "🥦 Vegetables" },
  { value: "Dairy", label: "🥛 Dairy" },
  { value: "CookedFood", label: "🍛 Cooked Food" },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

const SEED_PRODUCTS: Product[] = [
  {
    id: "seed-1",
    name: "Alphonso Mangoes",
    description: "Premium sweet mangoes, freshly harvested from Ratnagiri",
    priceInCents: BigInt(150),
    category: "Fruits",
    imageUrl: "/assets/generated/product-mango.dim_400x400.jpg",
    inStock: true,
  },
  {
    id: "seed-2",
    name: "Fresh Tomatoes",
    description: "Farm-fresh vine-ripened tomatoes, perfect for cooking",
    priceInCents: BigInt(80),
    category: "Vegetables",
    imageUrl: "/assets/generated/product-tomatoes.dim_400x400.jpg",
    inStock: true,
  },
  {
    id: "seed-3",
    name: "Full Cream Milk 1L",
    description: "Fresh full cream milk, sourced from local dairy farms",
    priceInCents: BigInt(120),
    category: "Dairy",
    imageUrl: "/assets/generated/product-milk.dim_400x400.jpg",
    inStock: true,
  },
  {
    id: "seed-4",
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice with tender chicken, dum-cooked to perfection",
    priceInCents: BigInt(800),
    category: "CookedFood",
    imageUrl: "/assets/generated/product-biryani.dim_400x400.jpg",
    inStock: true,
  },
  {
    id: "seed-5",
    name: "Baby Spinach",
    description: "Tender baby spinach leaves, washed and ready to cook",
    priceInCents: BigInt(60),
    category: "Vegetables",
    imageUrl: "/assets/generated/product-spinach.dim_400x400.jpg",
    inStock: true,
  },
  {
    id: "seed-6",
    name: "Greek Yogurt",
    description: "Thick and creamy Greek-style yogurt, rich in protein",
    priceInCents: BigInt(250),
    category: "Dairy",
    imageUrl: "/assets/generated/product-yogurt.dim_400x400.jpg",
    inStock: true,
  },
];

export function ShopPage() {
  const { data: products, isLoading } = useGetProducts();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const displayProducts = useMemo(() => {
    const source =
      products && products.length > 0
        ? products
        : isLoading
          ? []
          : SEED_PRODUCTS;
    return source.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, isLoading, activeCategory, search]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/70 p-8 text-primary-foreground relative"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">
              Fresh &amp; Local
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Farm to Your Table
          </h1>
          <p className="text-primary-foreground/80 text-base max-w-md">
            Fresh fruits, vegetables, dairy, and home-cooked meals delivered to
            your door.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 hidden sm:block" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/5 hidden sm:block" />
      </motion.div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="shop.search_input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            data-ocid="shop.category.tab"
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div
          data-ocid="shop.loading_state"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="bg-card rounded-xl overflow-hidden shadow-card"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i + 1} />
          ))}
        </div>
      ) : (
        <div data-ocid="shop.empty_state" className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="font-display font-semibold text-lg">
            No products found
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </main>
  );
}
