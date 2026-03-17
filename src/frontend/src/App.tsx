import { Toaster } from "@/components/ui/sonner";
import { Leaf } from "lucide-react";
import { useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { CartDrawer } from "./components/CartDrawer";
import { Header } from "./components/Header";
import { ShopPage } from "./components/ShopPage";
import { CartProvider } from "./context/CartContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

function AppContent() {
  const [view, setView] = useState<"shop" | "admin">("shop");
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;

  // If trying to view admin but not admin, force shop view
  const effectiveView =
    view === "admin" && isAdmin
      ? "admin"
      : view === "admin" && isAuthenticated && isAdmin === false
        ? "shop"
        : view;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        view={effectiveView}
        onViewChange={(v) => {
          if (v === "admin" && !isAdmin) return;
          setView(v);
        }}
      />

      <div className="flex-1">
        {effectiveView === "admin" ? <AdminPanel /> : <ShopPage />}
      </div>

      {/* Footer */}
      <footer className="bg-header-bg text-header-fg/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <Leaf className="w-3 h-3 text-accent-foreground" />
              </div>
              <span className="font-display font-semibold text-header-fg text-sm">
                FreshMart
              </span>
            </div>
            <p className="text-xs text-center">
              &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-header-fg transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
