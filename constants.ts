import { Product, Order, User, OrderStatus, UserRole, SubscriptionStatus, Template, TemplateCategory, Deposit } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: '프리미엄 니트 스웨터', price: 59000, stock: 15, imageUrl: 'https://i.imgur.com/gJ92A5V.jpeg' },
  { id: 2, name: '데님 와이드 팬츠', price: 45000, stock: 8, imageUrl: 'https://i.imgur.com/k2p9o5T.jpeg' },
  { id: 3, name: '오버핏 롱 코트', price: 129000, stock: 5, imageUrl: 'https://i.imgur.com/Gj2YEb1.jpeg' },
  { id: 4, name: '실크 블라우스', price: 72000, stock: 20, imageUrl: 'https://i.imgur.com/rX16h3p.jpeg' },
  { id: 5, name: '가죽 앵클 부츠', price: 98000, stock: 0, imageUrl: 'https://i.imgur.com/hVQQ27m.jpeg' },
  { id: 6, name: '미니 크로스백', price: 35000, stock: 12, imageUrl: 'https://i.imgur.com/a4a8E2j.jpeg' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', sellerId: 'user01', customerName: '김민준', productIds: [1], totalAmount: 59000, depositedAmount: 59000, depositorName: '김민준', status: OrderStatus.PAID, orderDate: '2024-07-28', contact: '010-1234-5678', address: '서울특별시 강남구 테헤란로 123' },
  { id: 'ORD002', sellerId: 'user01', customerName: '이서아', productIds: [2, 6], totalAmount: 80000, depositedAmount: 80000, depositorName: '이서아', status: OrderStatus.PAID, orderDate: '2024-07-28', contact: '010-2345-6789', address: '부산광역시 해운대구 마린시티로 456' },
  { id: 'ORD003', sellerId: 'user02', customerName: '박도윤', productIds: [3], totalAmount: 129000, depositedAmount: 100000, depositorName: '박도윤', status: OrderStatus.UNDERPAID, orderDate: '2024-07-29', contact: '010-3456-7890', address: '대구광역시 중구 동성로 789' },
  { id: 'ORD004', sellerId: 'user03', customerName: '최은우', productIds: [4], totalAmount: 72000, depositedAmount: 0, depositorName: '', status: OrderStatus.PENDING, orderDate: '2024-07-29', contact: '010-4567-8901', address: '인천광역시 연수구 송도국제대로 10' },
];

export const MOCK_DEPOSITS: Deposit[] = [
  { id: 'DEP001', depositorName: '김민준', amount: 59000, date: '2024-07-28' }, // Matches ORD001
  { id: 'DEP002', depositorName: '이서아', amount: 80000, date: '2024-07-28' }, // Matches ORD002
  { id: 'DEP003', depositorName: '박도윤', amount: 100000, date: '2024-07-29' }, // Matches ORD003
  { id: 'DEP004', depositorName: '박서준', amount: 72000, date: '2024-07-30' }, // Unmatched
  { id: 'DEP005', depositorName: '최은우', amount: 72000, date: '2024-07-29' }, // Matches ORD004
  { id: 'DEP006', depositorName: '강지후', amount: 35000, date: '2024-07-30' }, // Unmatched
];


export const MOCK_USERS: User[] = [
  { id: 'user01', email: 'seller@example.com', role: UserRole.SELLER, subscriptionStatus: SubscriptionStatus.ACTIVE, createdAt: '2024-07-01' },
  { id: 'user02', email: 'newseller@example.com', role: UserRole.SELLER, subscriptionStatus: SubscriptionStatus.PENDING, createdAt: '2024-07-28' },
  { id: 'user03', email: 'expired@example.com', role: UserRole.SELLER, subscriptionStatus: SubscriptionStatus.EXPIRED, createdAt: '2024-05-15' },
];

export const MOCK_TEMPLATES: Template[] = [
    {
        id: 'TPL001',
        category: TemplateCategory.PRICE_QUERY,
        title: '기본 가격 안내',
        content: '안녕하세요! 문의하신 [상품번호] 상품의 가격은 [가격] 입니다. 구매를 원하시면 "주문서 요청"이라고 말씀해주세요!',
    },
    {
        id: 'TPL002',
        category: TemplateCategory.ORDER_FORM,
        title: '기본 주문서 양식',
        content: '주문 감사합니다! [계좌번호], 예금주 [예금주]로 입금 부탁드립니다.\n택배비 [택배비]원을 포함하여 입금 후, 아래 양식에 맞춰 주문서를 보내주세요.\n\n- 성함:\n- 연락처:\n- 주소:\n- 주문상품번호(중복가능):\n- 총 입금액:\n- 입금자성함:',
    },
    {
        id: 'TPL003',
        category: TemplateCategory.OUT_OF_STOCK,
        title: '품절 안내',
        content: '죄송합니다. 문의하신 [상품번호] 상품은 현재 품절입니다. ㅠㅠ 다음 라이브를 기대해주세요!',
    },
     {
        id: 'TPL004',
        category: TemplateCategory.GREETING,
        title: '라이브 시작 인사',
        content: '안녕하세요! [상점명] 라이브에 오신 것을 환영합니다. 편하게 질문해주세요!',
    },
    {
        id: 'TPL005',
        category: TemplateCategory.SHIPPING_INFO,
        title: '기본 배송 안내',
        content: '배송은 보통 영업일 기준 2~3일 정도 소요됩니다. 주문량이 많을 경우 조금 더 걸릴 수 있는 점 양해 부탁드립니다!',
    },
    {
        id: 'TPL006',
        category: TemplateCategory.PRODUCT_DETAILS,
        title: '상세 설명 안내',
        content: '자세한 상품 설명은 잠시 후 방송에서 직접 보여드리면서 설명해드릴게요! 조금만 기다려주세요~',
    },
];