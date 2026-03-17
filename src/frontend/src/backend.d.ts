import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type OrderId = string;
export interface OrderUpdate {
    status: string;
}
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
}
export type ProductId = string;
export interface Order {
    id: OrderId;
    customerName: string;
    status: string;
    total: bigint;
    customerPhone: string;
    customerAddress: string;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: ProductId;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    priceInCents: bigint;
    imageBlobId?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    associateBlobWithProduct(productId: ProductId, blobId: string): Promise<void>;
    createOrder(order: Order): Promise<OrderId>;
    deleteProduct(productId: ProductId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrderById(orderId: OrderId): Promise<Order>;
    getOrders(): Promise<Array<Order>>;
    getProductById(productId: ProductId): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrder(orderId: OrderId, update: OrderUpdate): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
