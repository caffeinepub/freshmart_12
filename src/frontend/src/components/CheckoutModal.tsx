import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, totalPrice, clearCart, setIsOpen: setCartOpen } = useCart();
  const createOrder = useCreateOrder();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = (Number(totalPrice) / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    const order: Order = {
      id: "",
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerAddress: address.trim(),
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: BigInt(i.quantity),
      })),
      total: totalPrice,
      status: "Pending",
    };

    try {
      const id = await createOrder.mutateAsync(order);
      setOrderId(id);
      clearCart();
      setCartOpen(false);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setOrderId(null);
      setName("");
      setPhone("");
      setAddress("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent data-ocid="checkout.dialog" className="max-w-md">
        {orderId ? (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Order Placed!
              </DialogTitle>
              <DialogDescription>Thank you for your order.</DialogDescription>
            </DialogHeader>
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-bold text-foreground break-all text-sm mt-1">
                {orderId}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll prepare your order and deliver it to you soon.
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              onClick={() => handleClose(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-4">
              <DialogTitle className="font-display text-xl">
                Checkout
              </DialogTitle>
              <DialogDescription>
                Fill in your delivery details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="checkout-name">Full Name</Label>
                <Input
                  id="checkout-name"
                  data-ocid="checkout.name_input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Smith"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-phone">Phone Number</Label>
                <Input
                  id="checkout-phone"
                  data-ocid="checkout.phone_input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                  type="tel"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-address">Delivery Address</Label>
                <Textarea
                  id="checkout-address"
                  data-ocid="checkout.address_textarea"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  rows={3}
                  required
                />
              </div>

              {/* Order Summary */}
              <div className="bg-secondary rounded-xl p-4 space-y-2">
                <p className="font-semibold text-sm text-foreground">
                  Order Summary
                </p>
                <Separator />
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      $
                      {(
                        Number(
                          item.product.priceInCents * BigInt(item.quantity),
                        ) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total}</span>
                </div>
              </div>

              <Button
                data-ocid="checkout.submit_button"
                type="submit"
                disabled={createOrder.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing
                    Order...
                  </>
                ) : (
                  `Place Order — $${total}`
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
