import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ProductId = Text;
  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    imageUrl : Text;
    inStock : Bool;
    imageBlobId : ?Text;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.id, product2.id);
    };
  };

  type OrderId = Text;
  type Order = {
    id : OrderId;
    customerName : Text;
    customerPhone : Text;
    customerAddress : Text;
    items : [OrderItem];
    total : Nat;
    status : Text;
  };

  type OrderItem = {
    productId : ProductId;
    quantity : Nat;
  };

  type OrderUpdate = {
    status : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public shared ({ caller }) func associateBlobWithProduct(productId : ProductId, blobId : Text) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct = { product with imageBlobId = ?blobId };
        products.add(productId, updatedProduct);
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(product.id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_) {
        products.add(product.id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductById(productId : ProductId) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  // Order Management
  public shared ({ caller }) func createOrder(order : Order) : async OrderId {
    let orderId = order.id;
    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrderById(orderId : OrderId) : async Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };

  public shared ({ caller }) func updateOrder(orderId : OrderId, update : OrderUpdate) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : Order = {
          order with
          status = update.status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };
};
