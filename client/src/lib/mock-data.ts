import { 
  Lock, 
  CreditCard, 
  FileText, 
  Key, 
  Wifi, 
  Globe 
} from "lucide-react";

export type VaultItemType = 'login' | 'card' | 'note' | 'wifi' | 'identity';

export interface VaultItem {
  id: string;
  type: VaultItemType;
  title: string;
  subtitle: string;
  username?: string;
  password?: string;
  url?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  notes?: string;
  favorite?: boolean;
  category: string;
  lastUsed: string;
  strength?: 'weak' | 'medium' | 'strong';
}

export const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Lock },
  { id: 'login', label: 'Logins', icon: Globe },
  { id: 'card', label: 'Cards', icon: CreditCard },
  { id: 'note', label: 'Secure Notes', icon: FileText },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
];

export const MOCK_VAULT_ITEMS: VaultItem[] = [
  {
    id: '1',
    type: 'login',
    title: 'Google',
    subtitle: 'personal.email@gmail.com',
    username: 'personal.email@gmail.com',
    password: 'very-secure-password-123',
    url: 'google.com',
    favorite: true,
    category: 'Personal',
    lastUsed: '2 hours ago',
    strength: 'strong'
  },
  {
    id: '2',
    type: 'login',
    title: 'Netflix',
    subtitle: 'family.plan@gmail.com',
    username: 'family.plan@gmail.com',
    password: 'password123',
    url: 'netflix.com',
    favorite: false,
    category: 'Entertainment',
    lastUsed: '1 day ago',
    strength: 'weak'
  },
  {
    id: '3',
    type: 'card',
    title: 'Chase Sapphire',
    subtitle: '•••• 4242',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123',
    favorite: true,
    category: 'Finance',
    lastUsed: '3 days ago'
  },
  {
    id: '4',
    type: 'note',
    title: 'Social Security Number',
    subtitle: 'Secure Identity',
    notes: 'XXX-XX-XXXX',
    favorite: false,
    category: 'Personal',
    lastUsed: '1 week ago'
  },
  {
    id: '5',
    type: 'login',
    title: 'GitHub',
    subtitle: 'dev_wizard',
    username: 'dev_wizard',
    password: 'github-token-secure-hash',
    url: 'github.com',
    favorite: true,
    category: 'Work',
    lastUsed: 'Just now',
    strength: 'strong'
  },
  {
    id: '6',
    type: 'wifi',
    title: 'Home WiFi 5G',
    subtitle: 'Network Access',
    password: 'complex-wifi-password-99',
    favorite: false,
    category: 'Home',
    lastUsed: '1 month ago'
  },
  {
    id: '7',
    type: 'login',
    title: 'Amazon',
    subtitle: 'shopper@example.com',
    username: 'shopper@example.com',
    password: 'amazon-pass-phrase',
    url: 'amazon.com',
    favorite: false,
    category: 'Shopping',
    lastUsed: '2 days ago',
    strength: 'medium'
  }
];
