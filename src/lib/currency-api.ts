import axios from 'axios';

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  flag: string;
}

// Мапинг валют для флагов и названий
const currencyMapping: Record<string, { name: string; flag: string }> = {
  USD: { name: "Доллар США", flag: "🇺🇸" },
  EUR: { name: "Евро", flag: "🇪🇺" },
  AED: { name: "Дирхам ОАЭ", flag: "🇦🇪" },
  GBP: { name: "Фунт стерлингов", flag: "🇬🇧" },
  JPY: { name: "Японская иена", flag: "🇯🇵" },
  CNY: { name: "Китайский юань", flag: "🇨🇳" },
  CHF: { name: "Швейцарский франк", flag: "🇨🇭" },
  CAD: { name: "Канадский доллар", flag: "🇨🇦" },
  AUD: { name: "Австралийский доллар", flag: "🇦🇺" },
  KRW: { name: "Южнокорейская вона", flag: "🇰🇷" },
  TRY: { name: "Турецкая лира", flag: "🇹🇷" },
  INR: { name: "Индийская рупия", flag: "🇮🇳" },
  BYN: { name: "Белорусский рубль", flag: "🇧🇾" },
  KZT: { name: "Казахстанский тенге", flag: "🇰🇿" },
  UZS: { name: "Узбекский сум", flag: "🇺🇿" },
};

interface CBRFResponse {
  ValCurs: {
    Valute: Array<{
      CharCode: string;
      Nominal: string;
      Name: string;
      Value: string;
    }>;
  };
}

export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
  try {
    // Используем ExchangeRate-API - бесплатное рыночное API
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/RUB');
    
    const rates: CurrencyRate[] = [];
    const exchangeRates = response.data.rates;
    
    // Конвертируем курсы из RUB в другие валюты (обратные курсы)
    Object.entries(currencyMapping).forEach(([code, data]) => {
      if (exchangeRates[code]) {
        const rate = 1 / exchangeRates[code]; // Обратный курс для получения цены в рублях
        rates.push({
          code,
          name: data.name,
          rate: Math.round(rate * 100) / 100,
          flag: data.flag,
        });
      }
    });
    
    return rates;
  } catch (error) {
    console.error('Ошибка при получении курсов ExchangeRate-API:', error);
    
    // Fallback на мокированные данные при ошибке
    const fallbackRates: Record<string, { name: string; rate: number; flag: string }> = {
      USD: { name: "Доллар США", rate: 95.50, flag: "🇺🇸" },
      EUR: { name: "Евро", rate: 103.20, flag: "🇪🇺" },
      AED: { name: "Дирхам ОАЭ", rate: 26.00, flag: "🇦🇪" },
      GBP: { name: "Фунт стерлингов", rate: 119.80, flag: "🇬🇧" },
      JPY: { name: "Японская иена", rate: 0.64, flag: "🇯🇵" },
      CNY: { name: "Китайский юань", rate: 13.20, flag: "🇨🇳" },
      CHF: { name: "Швейцарский франк", rate: 107.30, flag: "🇨🇭" },
      CAD: { name: "Канадский доллар", rate: 70.40, flag: "🇨🇦" },
    };
    
    return Object.entries(fallbackRates).map(([code, data]) => ({
      code,
      name: data.name,
      rate: data.rate,
      flag: data.flag,
    }));
  }
};

export const convertCurrency = (amount: number, rate: number): number => {
  return Math.round(amount * rate * 100) / 100;
};