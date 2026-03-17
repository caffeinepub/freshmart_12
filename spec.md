# FreshMart - Online Grocery & Food Store

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Product catalog with categories: Fruits, Vegetables, Dairy, Cooked Food (biryani, etc.)
- Each product has: name, description, price, category, image, stock availability
- Shopping cart (add/remove items, view total)
- Checkout flow (place order with name, address, phone)
- Admin panel (login required) to add, edit, delete products and view orders
- Authorization system for admin access
- Blob storage for product images

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Products (CRUD), Categories, Cart/Orders, Admin authorization
2. Frontend: Customer-facing store (browse by category, cart, checkout) + Admin panel (product management, order list)
3. Auth: Admin login gates the management panel
4. Blob storage: product image upload in admin panel
