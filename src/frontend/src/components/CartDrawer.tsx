import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = (Number(totalPrice) / 100).toFixed(2);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ocid="cart.panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-foreground">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground">
                  Add some fresh items from the store
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 px-5 py-4 scrollbar-thin">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            $
                            {(Number(item.product.priceInCents) / 100).toFixed(
                              2,
                            )}{" "}
                            each
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="font-display font-bold text-sm text-foreground">
                            $
                            {(
                              Number(
                                item.product.priceInCents *
                                  BigInt(item.quantity),
                              ) / 100
                            ).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t border-border p-5 space-y-3">
                  <Separator className="mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">
                      Subtotal
                    </span>
                    <span className="font-display font-bold text-xl text-foreground">
                      ${total}
                    </span>
                  </div>
                  <Button
                    data-ocid="cart.checkout_button"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
