import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, SubscriptionStatus, Product, Order, OrderStatus, User, Template, TemplateCategory, Deposit } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_TEMPLATES, MOCK_DEPOSITS } from '../constants';
import * as Icons from '../components/icons';
import { Button, Card, Input, Modal, Table } from '../components/ui';
// FIX: Module '"../services/geminiService"' has no exported member 'extractOrderFromText'.
import { verifyPaymentFromImage } from '../services/geminiService';
import * as XLSX from 'xlsx';

// --- Sub-components defined outside main Dashboard component ---

const PaymentPage: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => (
    <div className="text-center p-8">
        <Card className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">구독 결제 안내</h2>
            <p className="text-text-secondary mb-6">서비스를 이용하시려면 구독료를 결제해주세요.</p>
            <div className="bg-primary-light p-4 rounded-md text-left mb-6">
                <p><strong>은행:</strong> 가상 은행</p>
                <p><strong>계좌번호:</strong> 123-456-7890</p>
                <p><strong>예금주:</strong> 라이브커머스 도우미</p>
                <p className="font-bold mt-2"><strong>금액:</strong> 50,000원</p>
            </div>
            <p className="text-sm text-text-secondary mb-6">입금 후 아래 '결제 확인 요청' 버튼을 눌러주세요. 관리자가 확인 후 승인해드립니다.</p>
            <Button onClick={onConfirm}>
                결제 확인 요청
            </Button>
        </Card>
    </div>
);

const DashboardView: React.FC = () => {
    const totalOrders = MOCK_ORDERS.length;
    const totalSales = MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = MOCK_ORDERS.filter(o => o.status !== OrderStatus.PAID).length;
    const outOfStock = MOCK_PRODUCTS.filter(p => p.stock === 0).length;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">대시보드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">총 주문 수</h3>
                    <p className="text-3xl font-bold">{totalOrders}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">총 매출액</h3>
                    <p className="text-3xl font-bold">{totalSales.toLocaleString()}원</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">미확인 주문</h3>
                    <p className="text-3xl font-bold text-red-500">{pendingOrders}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">품절 상품</h3>
                    <p className="text-3xl font-bold">{outOfStock}</p>
                </Card>
            </div>
            <div className="mt-8">
                <Card title="최근 주문">
                    <Table headers={['주문번호', '고객명', '총액', '상태', '주문일']}>
                        {MOCK_ORDERS.slice(0, 5).map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.totalAmount.toLocaleString()}원</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.orderDate}</td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            </div>
        </div>
    );
};

const InventoryView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = (updatedProduct: Product) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const ProductEditModal: React.FC<{ product: Product; onSave: (product: Product) => void; onClose: () => void; }> = ({ product, onSave, onClose }) => {
        const [formData, setFormData] = useState(product);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value, type } = e.target;
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave(formData);
        };

        return (
            <Modal isOpen={true} onClose={onClose} title="상품 정보 수정">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="상품명" name="name" value={formData.name} onChange={handleChange} />
                    <Input label="가격" name="price" type="number" value={formData.price} onChange={handleChange} />
                    <Input label="재고" name="stock" type="number" value={formData.stock} onChange={handleChange} />
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
                        <Button type="submit">저장</Button>
                    </div>
                </form>
            </Modal>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">재고 관리</h2>
            <Card>
                <Table headers={['상품번호', '상품 이미지', '상품명', '가격', '재고', '관리']}>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{product.price.toLocaleString()}원</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={product.stock === 0 ? 'text-red-500 font-bold' : ''}>
                                    {product.stock > 0 ? `${product.stock}개` : '품절'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Button size="sm" onClick={() => handleEdit(product)}>수정</Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
            {isModalOpen && editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
                />
            )}
        </div>
    );
};

const OrderManagementView: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [deposits, setDeposits] = useState<Deposit[]>(MOCK_DEPOSITS);
    const [isMatching, setIsMatching] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [activeTab, setActiveTab] = useState<'orders' | 'deposits'>('orders');

    const matchDeposits = () => {
        setIsMatching(true);
        setTimeout(() => {
            const updatedOrders = [...orders];
            const unmatchedDeposits = [...deposits];

            updatedOrders.forEach(order => {
                if (order.status === OrderStatus.PENDING || order.status === OrderStatus.UNDERPAID) {
                    const depositIndex = unmatchedDeposits.findIndex(d => d.depositorName === order.customerName && d.amount >= order.totalAmount);
                    if (depositIndex !== -1) {
                        const matchedDeposit = unmatchedDeposits[depositIndex];
                        order.status = OrderStatus.PAID;
                        order.depositedAmount = matchedDeposit.amount;
                        order.depositorName = matchedDeposit.depositorName;
                        unmatchedDeposits.splice(depositIndex, 1);
                    }
                }
            });
            setOrders(updatedOrders);
            setDeposits(unmatchedDeposits);
            setIsMatching(false);
        }, 1500);
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError('');

        try {
            // This would call the backend service
            const { depositorName, depositedAmount } = await verifyPaymentFromImage(file);
            const newDeposit: Deposit = {
                id: `DEP${(Math.random() * 1000).toFixed(0)}`,
                depositorName,
                amount: depositedAmount,
                date: new Date().toISOString().split('T')[0],
            };
            setDeposits(prev => [newDeposit, ...prev]);
        } catch (error) {
            console.error(error);
            setUploadError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setUploading(false);
        }
    };
    
    const exportToExcel = (data: (Order|Deposit)[], fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">주문 관리</h2>
                 <Button onClick={() => exportToExcel(activeTab === 'orders' ? orders : deposits, activeTab === 'orders' ? '주문_목록' : '입금_내역')}>
                    <Icons.DownloadIcon className="w-4 h-4 mr-2"/>
                    엑셀로 내보내기
                </Button>
            </div>
            
             <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        주문 목록
                    </button>
                    <button
                        onClick={() => setActiveTab('deposits')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'deposits' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        입금 내역 확인
                    </button>
                </nav>
            </div>

            {activeTab === 'orders' ? (
                 <Card>
                    <Table headers={['주문번호', '고객명', '총액', '입금액', '입금자명', '상태', '주문일']}>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.totalAmount.toLocaleString()}원</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.depositedAmount.toLocaleString()}원</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.depositorName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.orderDate}</td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card title="AI 입금 자동 대사">
                        <div className="flex items-center space-x-4">
                            <p className="text-text-secondary">AI를 사용하여 입금 내역과 주문을 자동으로 대조합니다.</p>
                            <Button onClick={matchDeposits} disabled={isMatching}>
                                {isMatching ? '대사 진행중...' : '자동 대사 시작'}
                            </Button>
                        </div>
                    </Card>
                    <Card title="AI 입금 내역 분석 (이미지/텍스트)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">이체내역 스크린샷 업로드</h3>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Icons.UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭</p>
                                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileUpload} />
                                    </label>
                                </div>
                                {uploading && <p className="mt-2 text-sm text-primary">AI가 이미지를 분석중입니다...</p>}
                                {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">이체내역 텍스트 입력</h3>
                                <textarea rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="예: 김민준 59000원 입금"></textarea>
                                <Button className="mt-2">텍스트로 분석 요청</Button>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <Table headers={['입금자명', '입금액', '입금일', '주문 연결 상태']}>
                            {deposits.map(deposit => (
                                <tr key={deposit.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{deposit.depositorName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{deposit.amount.toLocaleString()}원</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{deposit.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="text-gray-500">미연결</span>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </Card>
                </div>
            )}
        </div>
    );
};


const AIChatbotView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'simulator' | 'youtube'>('simulator');
    
    // State for YouTube connect tab
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [messages, setMessages] = useState<{ id: number, user: string, text: string, type: 'user' | 'bot' }[]>([]);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    const handleConnect = () => {
        if (!youtubeUrl) return;
        setConnectionStatus('connecting');
        setMessages([]);
        setTimeout(() => {
            setConnectionStatus('connected');
        }, 2000);
    };

    const handleDisconnect = () => {
        setConnectionStatus('disconnected');
        setYoutubeUrl('');
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    
    useEffect(() => {
        if (connectionStatus === 'connected') {
            const simulatedUserMessages = [
                { user: '스타일퀸', text: '1번 스웨터 얼마에요?' },
                { user: '패피언니', text: '3번 코트 사이즈 뭐있나요? 상세 설명좀요~' },
                { user: '쇼핑중독', text: '2번이랑 6번 주문할게요! 주문서 주세요.' },
                { user: '데일리룩', text: '배송은 보통 얼마나 걸려요?' },
                { user: '블링블링', text: '5번 부츠 재고 있나요??' },
            ];

            let messageIndex = 0;
            intervalRef.current = window.setInterval(() => {
                if (messageIndex < simulatedUserMessages.length) {
                    const userMessage = simulatedUserMessages[messageIndex];
                    setMessages(prev => [...prev, { id: Date.now(), ...userMessage, type: 'user' }]);

                    // Simulate AI response
                    setTimeout(() => {
                        let botResponse = '';
                        if (userMessage.text.includes('얼마에요')) {
                            botResponse = MOCK_TEMPLATES.find(t => t.category === TemplateCategory.PRICE_QUERY)?.content.replace('[상품번호]', '1번').replace('[가격]', '59,000원') || '';
                        } else if (userMessage.text.includes('상세 설명')) {
                             botResponse = MOCK_TEMPLATES.find(t => t.category === TemplateCategory.PRODUCT_DETAILS)?.content || '';
                        } else if (userMessage.text.includes('주문서')) {
                            botResponse = MOCK_TEMPLATES.find(t => t.category === TemplateCategory.ORDER_FORM)?.content.replace('[계좌번호]', '가상은행 123-456').replace('[예금주]', '셀러').replace('[택배비]', '3,000') || '';
                        } else if (userMessage.text.includes('배송')) {
                            botResponse = MOCK_TEMPLATES.find(t => t.category === TemplateCategory.SHIPPING_INFO)?.content || '';
                        } else if (userMessage.text.includes('재고')) {
                             botResponse = MOCK_TEMPLATES.find(t => t.category === TemplateCategory.OUT_OF_STOCK)?.content.replace('[상품번호]', '5번') || '';
                        }
                        
                        if(botResponse) {
                            setMessages(prev => [...prev, { id: Date.now() + 1, user: 'AI Assistant', text: botResponse, type: 'bot' }]);
                        }

                    }, 1000);

                    messageIndex++;
                } else {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 3000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [connectionStatus]);
    
     useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);


    const LiveChatInterface = () => (
        <div className="flex flex-col h-[600px]">
            <div ref={messageContainerRef} className="flex-1 p-4 bg-gray-50 rounded-t-lg overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.type === 'bot' ? 'justify-start' : 'justify-start'}`}>
                       {msg.type === 'bot' ? (
                            <div className="p-2 bg-primary rounded-full text-white">
                                <Icons.BotIcon className="w-5 h-5" />
                            </div>
                       ) : (
                            <div className="p-2 bg-gray-200 rounded-full">
                                <Icons.UserIcon className="w-5 h-5 text-gray-600" />
                            </div>
                       )}
                       <div>
                            <p className="font-bold text-sm">{msg.user}</p>
                            <div className={`mt-1 p-3 rounded-lg max-w-lg ${msg.type === 'bot' ? 'bg-primary-light text-text-primary' : 'bg-white'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                       </div>
                    </div>
                ))}
                 {messages.length === 0 && connectionStatus === 'connected' && (
                     <p className="text-center text-gray-500">라이브 채팅을 기다리는 중...</p>
                 )}
            </div>
            <div className="p-4 bg-white border-t rounded-b-lg flex items-center">
                 <Input type="text" placeholder="AI가 자동으로 응답합니다..." className="flex-1" disabled/>
                 <Button className="ml-2" disabled>전송</Button>
            </div>
        </div>
    );


    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">AI 챗봇</h2>
            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('simulator')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'simulator' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        라이브 방송 시뮬레이터
                    </button>
                    <button onClick={() => setActiveTab('youtube')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'youtube' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        실제 YouTube 방송 연동
                    </button>
                </nav>
            </div>
            {activeTab === 'simulator' && (
                <Card>
                    <p className="text-text-secondary mb-4">시뮬레이터를 통해 라이브 방송 중 AI 챗봇의 자동 응답 기능을 테스트해볼 수 있습니다.</p>
                     <Button>
                        <Icons.PlayIcon className="w-4 h-4 mr-2" />
                        시뮬레이션 시작하기
                    </Button>
                </Card>
            )}
            {activeTab === 'youtube' && (
                 <Card>
                    {connectionStatus === 'disconnected' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">YouTube 라이브 스트림 연결</h3>
                            <p className="text-text-secondary mb-4">라이브 방송 URL 또는 ID를 입력하여 AI 챗봇을 연결하세요.</p>
                            <div className="flex items-center space-x-2">
                                <Input 
                                    value={youtubeUrl} 
                                    onChange={(e) => setYoutubeUrl(e.target.value)} 
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                <Button onClick={handleConnect}>연결하기</Button>
                            </div>
                        </div>
                    )}
                    {connectionStatus === 'connecting' && (
                        <div className="text-center py-8">
                            <p className="text-lg font-semibold">YouTube 라이브에 연결하는 중...</p>
                            <p className="text-text-secondary">잠시만 기다려주세요.</p>
                        </div>
                    )}
                    {connectionStatus === 'connected' && (
                        <div>
                             <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center"><Icons.CheckCircleIcon className="w-5 h-5 mr-2 text-green-500"/>연결됨</h3>
                                    <p className="text-sm text-text-secondary truncate max-w-md">연결된 방송: {youtubeUrl}</p>
                                </div>
                                <Button variant="danger" onClick={handleDisconnect}>연결 해제</Button>
                            </div>
                            <LiveChatInterface />
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

const SettingsView: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

    const handleEdit = (template: Template) => {
        setEditingTemplate(template);
    };

    const handleSave = (updatedTemplate: Template) => {
        setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setEditingTemplate(null);
    };

    const TemplateEditModal: React.FC<{ template: Template; onSave: (template: Template) => void; onClose: () => void }> = ({ template, onSave, onClose }) => {
        const [content, setContent] = useState(template.content);
        return (
            <Modal isOpen={true} onClose={onClose} title={`'${template.title}' 템플릿 수정`}>
                <div className="space-y-4">
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={onClose}>취소</Button>
                        <Button onClick={() => onSave({ ...template, content })}>저장</Button>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">설정</h2>
            <Card title="응답 템플릿 관리">
                <p className="mb-4 text-text-secondary">AI 챗봇이 사용하는 응답 메시지를 상황별로 수정할 수 있습니다.</p>
                <div className="space-y-4">
                    {Object.values(TemplateCategory).map(category => (
                        <div key={category}>
                            <h3 className="font-semibold text-lg mb-2">{category}</h3>
                            <div className="divide-y divide-gray-200 border rounded-md">
                                {templates.filter(t => t.category === category).map(template => (
                                    <div key={template.id} className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{template.title}</p>
                                            <p className="text-sm text-text-secondary truncate max-w-lg">{template.content}</p>
                                        </div>
                                        <Button size="sm" onClick={() => handleEdit(template)}>수정</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            {editingTemplate && <TemplateEditModal template={editingTemplate} onSave={handleSave} onClose={() => setEditingTemplate(null)} />}
        </div>
    );
};

const AdminDashboardView: React.FC = () => {
     const { users } = useAuth();
     const totalSellers = users.length;
     const activeSellers = users.filter(u => u.subscriptionStatus === SubscriptionStatus.ACTIVE).length;
     const pendingSellers = users.filter(u => u.subscriptionStatus === SubscriptionStatus.PENDING).length;

     return (
        <div>
            <h2 className="text-2xl font-bold mb-6">관리자 대시보드</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">총 셀러 수</h3>
                    <p className="text-3xl font-bold">{totalSellers}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">활성 구독 셀러</h3>
                    <p className="text-3xl font-bold text-green-500">{activeSellers}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-text-secondary">결제 승인 대기</h3>
                    <p className="text-3xl font-bold text-yellow-500">{pendingSellers}</p>
                </Card>
            </div>
        </div>
     );
};


const UserManagementView: React.FC = () => {
    const { users, updateUserSubscription } = useAuth();
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">셀러 회원 관리</h2>
            <Card>
                <Table headers={['셀러 ID', '이메일', '구독 상태', '가입일', '관리']}>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                                    user.subscriptionStatus === SubscriptionStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {user.subscriptionStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                {user.subscriptionStatus === SubscriptionStatus.PENDING && (
                                     <Button size="sm" onClick={() => updateUserSubscription(user.id, SubscriptionStatus.ACTIVE)}>
                                        승인
                                    </Button>
                                )}
                                <Button size="sm" variant="danger">삭제</Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

const TotalOrderManagementView: React.FC = () => {
    const [orders] = useState<Order[]>(MOCK_ORDERS);
    const { users } = useAuth();
    const [selectedSeller, setSelectedSeller] = useState<string>('all');

    const allSellers = [{id: 'all', email: '모든 셀러'}, ...users];

    const filteredOrders = selectedSeller === 'all' 
        ? orders 
        : orders.filter(order => order.sellerId === selectedSeller);
        
    const exportToExcel = (data: Order[], fileName: string) => {
        const worksheetData = data.map(order => ({
            '주문번호': order.id,
            '셀러 ID': order.sellerId,
            '손님이름': order.customerName,
            '연락처': order.contact,
            '주소': order.address,
            '구매품목(번호)': order.productIds.join(', '),
            '입금금액': order.totalAmount,
            '입금완료여부': order.status,
            '주문일': order.orderDate,
        }));
        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">전체 주문 관리</h2>
                 <Button onClick={() => exportToExcel(filteredOrders, '전체_주문_목록')}>
                    <Icons.DownloadIcon className="w-4 h-4 mr-2"/>
                    엑셀로 내보내기
                </Button>
            </div>
            <div className="mb-4">
                 <select
                    id="sellerFilter"
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    className="block w-52 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    {allSellers.map(seller => (
                        <option key={seller.id} value={seller.id}>{seller.email}</option>
                    ))}
                </select>
            </div>
            <Card>
                <Table headers={['주문번호', '셀러 ID', '손님이름', '연락처', '주소', '구매품목(번호)', '입금금액', '입금완료여부']}>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.id}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.sellerId}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customerName}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.contact}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.address}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.productIds.join(', ')}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">{order.totalAmount.toLocaleString()}원</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' :
                                    order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};


// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  const { user, logout, requestPaymentConfirmation } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = user?.role === UserRole.ADMIN;
  const [activeView, setActiveView] = useState(isAdmin ? 'dashboard' : 'dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin' : '/');
  };

  const handlePaymentConfirm = () => {
    requestPaymentConfirmation();
    setIsModalOpen(true);
  };
  
  if (user?.subscriptionStatus === SubscriptionStatus.EXPIRED && !isAdmin) {
      return <PaymentPage onConfirm={handlePaymentConfirm} />;
  }
  
  if (user?.subscriptionStatus === SubscriptionStatus.PENDING && !isAdmin) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-center p-4">
            <Card className="max-w-lg">
                <h2 className="text-2xl font-bold mb-4">결제 확인 중입니다.</h2>
                <p className="text-text-secondary">관리자가 입금 내역을 확인하고 있습니다. 잠시만 기다려주세요.</p>
                <p className="text-sm mt-4">문제가 있는 경우 고객센터로 문의해주세요.</p>
                 <Button onClick={handleLogout} className="mt-6" variant="secondary">로그아웃</Button>
            </Card>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="결제 확인 요청 완료">
                <p>결제 확인 요청이 정상적으로 접수되었습니다. 관리자 확인 후 서비스 이용이 가능합니다.</p>
                <div className="flex justify-end mt-4">
                    <Button onClick={() => setIsModalOpen(false)}>확인</Button>
                </div>
            </Modal>
        </div>
    );
  }

  const sellerNavItems = [
      { id: 'dashboard', label: '대시보드', icon: Icons.DashboardIcon },
      { id: 'inventory', label: '재고 관리', icon: Icons.InventoryIcon },
      { id: 'orders', label: '주문 관리', icon: Icons.OrderIcon },
      { id: 'chatbot', label: 'AI 챗봇', icon: Icons.ChatIcon },
      { id: 'settings', label: '설정', icon: Icons.SettingsIcon },
  ];

  const adminNavItems = [
      { id: 'dashboard', label: '관리자 대시보드', icon: Icons.DashboardIcon },
      { id: 'users', label: '셀러 회원 관리', icon: Icons.UserIcon },
      { id: 'totalOrders', label: '전체 주문 관리', icon: Icons.FileTextIcon },
  ];

  const navItems = isAdmin ? adminNavItems : sellerNavItems;

  const renderView = () => {
    if (isAdmin) {
        switch (activeView) {
            case 'dashboard': return <AdminDashboardView />;
            case 'users': return <UserManagementView />;
            case 'totalOrders': return <TotalOrderManagementView />;
            default: return <AdminDashboardView />;
        }
    } else {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'inventory': return <InventoryView />;
            case 'orders': return <OrderManagementView />;
            case 'chatbot': return <AIChatbotView />;
            case 'settings': return <SettingsView />;
            default: return <DashboardView />;
        }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-surface text-text-primary flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-bold text-primary">
          Seller.AI
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center px-4 py-2 text-left text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeView === item.id 
                        ? 'bg-primary-light text-primary' 
                        : 'hover:bg-gray-100'
                    }`}
                >
                    <item.icon className="w-5 h-5 mr-3"/>
                    {item.label}
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {user?.email[0].toUpperCase()}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold">{user?.email}</p>
                    <p className="text-xs text-text-secondary">{isAdmin ? '관리자' : '셀러'}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-text-secondary hover:bg-gray-100 rounded-md">
                <Icons.LogoutIcon className="w-5 h-5 mr-2"/>
                로그아웃
            </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="결제 확인 요청 완료">
        <p>결제 확인 요청이 정상적으로 접수되었습니다. 관리자 확인 후 서비스 이용이 가능합니다.</p>
        <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)}>확인</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;