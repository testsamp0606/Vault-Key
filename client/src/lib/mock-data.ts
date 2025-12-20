import { 
  Lock, 
  CreditCard, 
  FileText, 
  Key, 
  Wifi, 
  Globe,
  Landmark
} from "lucide-react";

export type VaultItemType = 'login' | 'card' | 'note' | 'wifi' | 'bank' | 'identity';

export interface VaultItem {
  id: string;
  type: VaultItemType;
  title: string;
  subtitle: string;
  username?: string;
  password?: string;
  url?: string;
  account?: string;
  cardNumber?: string;
  nameOnCard?: string;
  expiry?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType?: string;
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
  { id: 'bank', label: 'Bank', icon: Landmark },
  { id: 'note', label: 'Secure Notes', icon: FileText },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
];

export const MOCK_VAULT_ITEMS: VaultItem[] = [
  {
    id: '1',
    type: 'login',
    title: 'Google',
    subtitle: 'personal.email@gmail.com',
    account: 'personal',
    username: 'personal.email@gmail.com',
    password: 'very-secure-password-123',
    url: 'google.com',
    favorite: true,
    category: 'Personal',
    lastUsed: '2 hours ago',
    strength: 'strong'
  },
  {
    id: '1-work',
    type: 'login',
    title: 'Google',
    subtitle: 'work.email@company.com',
    account: 'work',
    username: 'work.email@company.com',
    password: 'company-secure-password-456',
    url: 'google.com',
    favorite: true,
    category: 'Work',
    lastUsed: '30 mins ago',
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
    nameOnCard: 'John Doe',
    expiry: '12/28',
    cvv: '123',
    favorite: true,
    category: 'Finance',
    lastUsed: '3 days ago'
  },
  {
    id: '4',
    type: 'bank',
    title: 'Primary Bank Account',
    subtitle: 'Checking Account',
    bankName: 'Chase Bank',
    accountNumber: '****5678',
    routingNumber: '021000021',
    accountType: 'Checking',
    favorite: true,
    category: 'Finance',
    lastUsed: '2 days ago'
  },
  {
    id: '5',
    type: 'note',
    title: 'Social Security Number',
    subtitle: 'Secure Identity',
    notes: 'XXX-XX-XXXX',
    favorite: false,
    category: 'Personal',
    lastUsed: '1 week ago'
  },
  {
    id: '6',
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
    id: '7',
    type: 'wifi',
    title: 'Home WiFi 5G',
    subtitle: 'Network Access',
    password: 'complex-wifi-password-99',
    favorite: false,
    category: 'Home',
    lastUsed: '1 month ago'
  },
  {
    id: '8',
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
