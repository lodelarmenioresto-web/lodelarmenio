import { icons } from '../assets';
import type { SocialLink } from '../types';

export const site = {
  name: 'Lo del Armenio',
  legalName: 'Lo del Armenio S.R.L',
  email: 'lodelarmenioresto@gmail.com',
  phone: '+54 9 351 359 5304',
  address: ['Libertad 1544, Córdoba Capital, Argentina'],
};

export const socials: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/lodelarmenio.resto/', icon: icons.instagram },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@lo.del.armenio', icon: icons.tiktok },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/5493513595304', icon: icons.whatsapp },
];
