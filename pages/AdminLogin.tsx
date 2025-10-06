
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Card } from '../components/ui';
import { UserRole } from '../types';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('adminpass');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password) {
      login(email, UserRole.ADMIN);
      navigate('/admin/dashboard');
    } else {
      setError('유효하지 않은 관리자 계정입니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="관리자 이메일" 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="관리자 비밀번호" 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            관리자 로그인
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
            <Link to="/" className="text-text-secondary hover:underline">판매자 로그인으로 돌아가기</Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
