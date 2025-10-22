import { StoreInfo } from '../types';
import { colors } from '../theme';

export const STORES: Record<string, StoreInfo> = {
  amazon: {
    id: 'amazon',
    name: 'amazon',
    displayName: 'Amazon',
    color: colors.stores.amazon,
    url: 'https://www.amazon.in',
  },
  flipkart: {
    id: 'flipkart',
    name: 'flipkart',
    displayName: 'Flipkart',
    color: colors.stores.flipkart,
    url: 'https://www.flipkart.com',
  },
  myntra: {
    id: 'myntra',
    name: 'myntra',
    displayName: 'Myntra',
    color: colors.stores.myntra,
    url: 'https://www.myntra.com',
  },
  ajio: {
    id: 'ajio',
    name: 'ajio',
    displayName: 'AJIO',
    color: colors.stores.ajio,
    url: 'https://www.ajio.com',
  },
  alibaba: {
    id: 'alibaba',
    name: 'alibaba',
    displayName: 'Alibaba',
    color: colors.stores.alibaba,
    url: 'https://www.alibaba.com',
  },
};

export const STORE_LIST = Object.values(STORES);
