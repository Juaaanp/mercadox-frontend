export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  created_at: string;
}