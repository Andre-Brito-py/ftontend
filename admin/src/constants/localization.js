// Constantes para idiomas e moedas suportados

export const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' },
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷' },
  { code: 'it-IT', name: 'Italiano (Italia)', flag: '🇮🇹' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)', flag: '🇩🇪' }
];

export const SUPPORTED_CURRENCIES = [
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', country: 'Brasil' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'Argentina' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', country: 'Chile' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'Colombia' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', country: 'Peru' }
];

// Países suportados com defaults recomendados
export const SUPPORTED_COUNTRIES = [
  { name: 'Brasil', language: 'pt-BR', currency: 'BRL', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { name: 'United States', language: 'en-US', currency: 'USD', timezone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Portugal', language: 'pt-PT', currency: 'EUR', timezone: 'Europe/Lisbon', flag: '🇵🇹' },
  { name: 'Spain', language: 'es-ES', currency: 'EUR', timezone: 'Europe/Madrid', flag: '🇪🇸' },
  { name: 'France', language: 'fr-FR', currency: 'EUR', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { name: 'Italy', language: 'it-IT', currency: 'EUR', timezone: 'Europe/Rome', flag: '🇮🇹' },
  { name: 'Germany', language: 'de-DE', currency: 'EUR', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { name: 'United Kingdom', language: 'en-US', currency: 'GBP', timezone: 'Europe/London', flag: '🇬🇧' },
  { name: 'Canada', language: 'en-US', currency: 'CAD', timezone: 'America/Toronto', flag: '🇨🇦' },
  { name: 'Australia', language: 'en-US', currency: 'AUD', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { name: 'Japan', language: 'ja-JP', currency: 'JPY', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'Switzerland', language: 'de-DE', currency: 'CHF', timezone: 'Europe/Zurich', flag: '🇨🇭' },
  { name: 'China', language: 'zh-CN', currency: 'CNY', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
  { name: 'Mexico', language: 'es-ES', currency: 'MXN', timezone: 'America/Mexico_City', flag: '🇲🇽' },
  { name: 'Argentina', language: 'es-ES', currency: 'ARS', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { name: 'Chile', language: 'es-ES', currency: 'CLP', timezone: 'America/Santiago', flag: '🇨🇱' },
  { name: 'Colombia', language: 'es-ES', currency: 'COP', timezone: 'America/Bogota', flag: '🇨🇴' },
  { name: 'Peru', language: 'es-ES', currency: 'PEN', timezone: 'America/Lima', flag: '🇵🇪' }
];

// Função para obter idioma por código
export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

// Função para obter moeda por código
export const getCurrencyByCode = (code) => {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code);
};

// Combinações recomendadas de idioma/moeda por região
export const REGIONAL_DEFAULTS = {
  'pt-BR': { currency: 'BRL', timezone: 'America/Sao_Paulo' },
  'pt-PT': { currency: 'EUR', timezone: 'Europe/Lisbon' },
  'en-US': { currency: 'USD', timezone: 'America/New_York' },
  'es-ES': { currency: 'EUR', timezone: 'Europe/Madrid' },
  'fr-FR': { currency: 'EUR', timezone: 'Europe/Paris' },
  'it-IT': { currency: 'EUR', timezone: 'Europe/Rome' },
  'de-DE': { currency: 'EUR', timezone: 'Europe/Berlin' }
};

// Função para obter configurações padrão por idioma
export const getRegionalDefaults = (languageCode) => {
  return REGIONAL_DEFAULTS[languageCode] || REGIONAL_DEFAULTS['pt-BR'];
};

// Defaults por país
export const getRegionalDefaultsByCountry = (countryName) => {
  const found = SUPPORTED_COUNTRIES.find(c => c.name === countryName);
  if (found) {
    return { language: found.language, currency: found.currency, timezone: found.timezone };
  }
  // Fallback para Brasil
  return { language: 'pt-BR', currency: 'BRL', timezone: 'America/Sao_Paulo' };
};