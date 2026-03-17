import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, Product } from "../backend";
import {
  useDeleteProduct,
  useGetOrders,
  useGetProducts,
  useUpdateOrder,
} from "../hooks/useQueries";
import { ProductFormModal } from "./ProductFormModal";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  Fruits: "Fruits",
  Vegetables: "Vegetables",
  Dairy: "Dairy",
  CookedFood: "Cooked Food",
};

export function AdminPanel() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();
  const deleteProduct = useDeleteProduct();
  const updateOrder = useUpdateOrder();

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrder.mutateAsync({ orderId, update: { status } });
      toast.success(`Order status updated to ${status}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your products and orders
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger
            data-ocid="admin.products_tab"
            value="products"
            className="gap-2"
          >
            <Package className="w-4 h-4" />
            Products
            {products && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {products.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            data-ocid="admin.orders_tab"
            value="orders"
            className="gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Orders
            {orders && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {orders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg font-semibold">All Products</h2>
            <Button
              data-ocid="admin.add_product_button"
              onClick={() => {
                setEditingProduct(null);
                setProductFormOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          {productsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, i) => (
                    <TableRow
                      key={product.id}
                      data-ocid={`product.item.${i + 1}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {CATEGORY_LABELS[product.category] ??
                            product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-display font-bold">
                        ${(Number(product.priceInCents) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border-0 ${
                            product.inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-destructive" />
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &ldquo;
                                  {product.name}&rdquo;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div
              data-ocid="admin.products.empty_state"
              className="bg-card rounded-xl shadow-card py-16 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">
                  No products yet
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Start by adding your first product to the store
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setProductFormOpen(true);
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                Add First Product
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold">All Orders</h2>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order, i: number) => (
                    <TableRow key={order.id} data-ocid={`order.item.${i + 1}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customerPhone}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
                            {order.customerAddress}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="font-display font-bold">
                        ${(Number(order.total) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(val) =>
                            handleStatusChange(order.id, val)
                          }
                        >
                          <SelectTrigger
                            data-ocid={`order.status_select.${i + 1}`}
                            className={`w-36 h-8 text-xs font-medium border-0 ${
                              STATUS_COLORS[order.status] ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div
              data-ocid="admin.orders.empty_state"
              className="bg-card rounded-xl shadow-card py-16 flex flex-col items-center gap-3 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">
                  No orders yet
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Orders from customers will appear here
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProductFormModal
        open={productFormOpen}
        onOpenChange={(open) => {
          setProductFormOpen(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </div>
  );
}
