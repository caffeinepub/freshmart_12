import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Leaf, ShoppingCart, Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

interface HeaderProps {
  view: "shop" | "admin";
  onViewChange: (view: "shop" | "admin") => void;
}

export function Header({ view, onViewChange }: HeaderProps) {
  const { totalItems, setIsOpen } = useCart();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsAdmin();
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
    } else {
      await login();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-header-bg text-header-fg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => onViewChange("shop")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Leaf className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-header-fg">
              FreshMart
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                type="button"
                data-ocid="nav.admin_link"
                onClick={() =>
                  onViewChange(view === "admin" ? "shop" : "admin")
                }
                className="flex items-center gap-1.5 text-sm font-medium text-header-fg/70 hover:text-header-fg transition-colors px-2 py-1 rounded-md hover:bg-white/10"
              >
                {view === "admin" ? (
                  <>
                    <Store className="w-4 h-4" />
                    <span className="hidden sm:inline">Shop</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                )}
              </button>
            )}

            {view === "shop" && (
              <button
                type="button"
                data-ocid="nav.cart_button"
                onClick={() => setIsOpen(true)}
                className="relative flex items-center gap-1.5 text-header-fg hover:opacity-80 transition-opacity px-2 py-1.5 rounded-md hover:bg-white/10"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground border-0">
                    {totalItems}
                  </Badge>
                )}
              </button>
            )}

            <Button
              size="sm"
              variant={isAuthenticated ? "secondary" : "default"}
              onClick={handleAuth}
              disabled={isLoggingIn}
              className={`text-xs font-medium ${
                isAuthenticated
                  ? "bg-white/15 text-header-fg border-white/20 hover:bg-white/25 border"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              }`}
            >
              {isLoggingIn
                ? "Signing in..."
                : isAuthenticated
                  ? "Sign Out"
                  : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
