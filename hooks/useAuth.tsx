
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, SubscriptionStatus } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, role: UserRole) => User | null;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUserSubscription: (userId: string, status: SubscriptionStatus) => void;
  requestPaymentConfirmation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ADMIN_USER: User = {
  id: 'admin01',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
  subscriptionStatus: SubscriptionStatus.ACTIVE,
  createdAt: '2024-01-01'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

  const login = (email: string, role: UserRole): User | null => {
    let userToLogin: User | null = null;
    if (role === UserRole.ADMIN && email === MOCK_ADMIN_USER.email) {
      userToLogin = MOCK_ADMIN_USER;
    } else if (role === UserRole.SELLER) {
      const foundUser = allUsers.find(u => u.email === email && u.role === UserRole.SELLER);
      if(foundUser) {
        userToLogin = foundUser;
      }
    }

    if (userToLogin) {
      setLoggedInUser(userToLogin);
      return userToLogin;
    }
    return null;
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
        ...user,
        id: `user${allUsers.length + 2}`, // Simple unique ID generation
        createdAt: new Date().toISOString().split('T')[0],
    };
    setAllUsers(prev => [...prev, newUser]);
  }
  
  const updateUserSubscription = (userId: string, status: SubscriptionStatus) => {
    setAllUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? {...u, subscriptionStatus: status} : u)
    );
    // If the updated user is the currently logged-in user, update their state too
    if (loggedInUser && loggedInUser.id === userId) {
        setLoggedInUser(prev => prev ? {...prev, subscriptionStatus: status} : null);
    }
  };

  const requestPaymentConfirmation = () => {
    if (loggedInUser) {
      updateUserSubscription(loggedInUser.id, SubscriptionStatus.PENDING);
    }
  };


  return (
    <AuthContext.Provider value={{ 
        user: loggedInUser, 
        users: allUsers,
        login, 
        logout, 
        addUser,
        updateUserSubscription,
        requestPaymentConfirmation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
