import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";

const CATEGORY_LABELS: Record<string, string> = {
  Fruits: "Fruits",
  Vegetables: "Vegetables",
  Dairy: "Dairy",
  CookedFood: "Cooked Food",
};

const CATEGORY_COLORS: Record<string, string> = {
  Fruits: "bg-orange-100 text-orange-700",
  Vegetables: "bg-green-100 text-green-700",
  Dairy: "bg-blue-100 text-blue-700",
  CookedFood: "bg-amber-100 text-amber-700",
};

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  const price = (Number(product.priceInCents) / 100).toFixed(2);
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const categoryColor =
    CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-700";

  return (
    <motion.div
      data-ocid={`product.item.${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-white text-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        <Badge
          className={`absolute top-2 left-2 text-xs font-medium border-0 ${categoryColor}`}
        >
          {categoryLabel}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-foreground text-base leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-display font-bold text-lg text-foreground">
            ${price}
          </span>
          <Button
            data-ocid={`product.add_button.${index}`}
            size="sm"
            disabled={!product.inStock}
            onClick={() => addItem(product)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
