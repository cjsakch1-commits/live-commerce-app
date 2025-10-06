
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Card } from '../components/ui';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('seller@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      const loggedInUser = login(email, UserRole.SELLER);
      if (loggedInUser) {
        navigate('/dashboard');
      } else {
        setError('이메일을 찾을 수 없거나 계정 정보가 일치하지 않습니다.');
      }
    } else {
      setError('이메일과 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">라이브 커머스 판매자 로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="이메일" 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="seller@example.com"
            required 
          />
          <Input 
            label="비밀번호" 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-text-secondary">
          <p>계정이 없으신가요? <a href="#" className="text-primary hover:underline">회원가입</a></p>
          <p className="mt-2"><Link to="/admin" className="hover:underline">관리자 로그인</Link></p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
