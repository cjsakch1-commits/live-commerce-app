export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
}

export enum SubscriptionStatus {
  ACTIVE = '활성',
  PENDING = '결제 대기중',
  EXPIRED = '만료',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export enum OrderStatus {
  PAID = '입금 완료',
  PENDING = '입금 미확인',
  UNDERPAID = '입금 부족',
}

export interface Order {
  id: string;
  customerName: string;
  productIds: number[];
  totalAmount: number;
  depositedAmount: number;
  depositorName: string;
  status: OrderStatus;
  orderDate: string;
  contact?: string;
  address?: string;
  sellerId: string;
}

export interface Deposit {
  id: string;
  depositorName: string;
  amount: number;
  date: string;
}

export enum TemplateCategory {
  GREETING = '인사말',
  PRICE_QUERY = '가격 문의',
  ORDER_FORM = '주문서 안내',
  OUT_OF_STOCK = '품절 안내',
  SHIPPING_INFO = '배송 안내',
  PRODUCT_DETAILS = '상세 설명 안내',
  CLOSING = '마무리',
}

export interface Template {
  id: string;
  category: TemplateCategory;
  title: string;
  content: string;
}