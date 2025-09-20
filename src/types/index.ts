export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  friends?: string[];
  isAdmin?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: string;
  participants: string[];
  category?: string;
  image?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
