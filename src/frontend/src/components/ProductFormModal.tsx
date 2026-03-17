import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useImageUpload } from "../hooks/useImageUpload";
import { useAddProduct, useUpdateProduct } from "../hooks/useQueries";

const CATEGORIES = [
  { value: "Fruits", label: "Fruits" },
  { value: "Vegetables", label: "Vegetables" },
  { value: "Dairy", label: "Dairy" },
  { value: "CookedFood", label: "Cooked Food" },
];

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
}: ProductFormModalProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const { uploadImage, isUploading, uploadProgress } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [inStock, setInStock] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Reset/populate form whenever dialog opens or product changes
    if (!open) return;
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPriceStr((Number(product.priceInCents) / 100).toFixed(2));
      setCategory(product.category);
      setImageUrl(product.imageUrl);
      setInStock(product.inStock);
      setImagePreview(product.imageUrl || null);
    } else {
      setName("");
      setDescription("");
      setPriceStr("");
      setCategory("");
      setImageUrl("");
      setInStock(true);
      setImagePreview(null);
    }
  }, [product, open]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed. You can enter a URL manually.");
      setImageUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = BigInt(Math.round(Number.parseFloat(priceStr) * 100));
    const productData: Product = {
      id: product?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      priceInCents,
      category,
      imageUrl: imageUrl.trim(),
      inStock,
    };
    try {
      if (product) {
        await updateProduct.mutateAsync(productData);
        toast.success("Product updated!");
      } else {
        await addProduct.mutateAsync(productData);
        toast.success("Product added!");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save product");
    }
  };

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="product_form.dialog"
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Product Name</Label>
            <Input
              id="pf-name"
              data-ocid="product_form.name_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alphonso Mangoes"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-description">Description</Label>
            <Textarea
              id="pf-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pf-price">Price ($)</Label>
              <Input
                id="pf-price"
                data-ocid="product_form.price_input"
                type="number"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger data-ocid="product_form.category_select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label>Product Image</Label>
            <div className="flex gap-3">
              {imagePreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="product_form.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Uploading {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 mr-2" /> Upload Image
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px bg-border flex-1" />
                </div>
                <Input
                  placeholder="Paste image URL"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value || null);
                  }}
                  className="text-xs"
                />
              </div>
            </div>
            {!imagePreview && (
              <div className="w-full h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground">
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs">No image selected</span>
              </div>
            )}
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">In Stock</p>
              <p className="text-xs text-muted-foreground">
                Customers can add this to cart
              </p>
            </div>
            <Switch checked={inStock} onCheckedChange={setInStock} />
          </div>

          <Button
            data-ocid="product_form.save_button"
            type="submit"
            disabled={isPending || isUploading || !category}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : product ? (
              "Save Changes"
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
