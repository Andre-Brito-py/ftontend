import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos mínimos para páginas principais do admin
const resources = {
  'pt-BR': {
    translation: {
      profile: 'Perfil',
      logout: 'Sair',
      settings: 'Configurações',
      admin: 'Admin',
      superAdmin: 'Super Admin',
      adminProfileTitle: 'Zappy admin',
      editProfile: 'Editar perfil',
      changePassword: 'Alterar senha',
      saveChanges: 'Salvar alterações',
      name: 'Nome',
      email: 'Email',
      department: 'Departamento',
      role: 'Função',
      preferences: 'Preferências',
      notifications: 'Notificações',
      privacy: 'Privacidade',
      sessions: 'Sessões',
      // Sidebar / Menu labels
      dashboard: 'Dashboard',
      addItems: 'Adicionar Itens',
      listItems: 'Listar Itens',
      categories: 'Categorias',
      productSuggestions: 'Sugestões de Produtos',
      banners: 'Banners',
      orders: 'Pedidos',
      statistics: 'Estatísticas',
      payments: 'Pagamentos',
      tables: 'Mesas',
      coupons: 'Cupons',
      cashback: 'Cashback',
      customers: 'Clientes',
      analyticsLiza: 'Analytics Liza',
      waiter: 'Garçom',
      counterAttendants: 'Atendentes Balcão',
      paymentSettings: 'Config. Pagamento',
      storeLinks: 'Links da Loja',
      bluetoothPrinter: 'Impressora BT',
      whatsappSettings: 'WhatsApp Config',
      whatsappMessages: 'WhatsApp Mensagens',
      
      lizaChat: 'Chat com Liza'
      ,
      // Super Admin sidebar labels
      manageStores: 'Gerenciar Lojas',
      systemSettings: 'Config. Sistema',
      apiManagement: 'Gerenciar APIs',
      
      globalAnalytics: 'Analytics Global',
      manageUsers: 'Gerenciar Usuários',
      asaasDashboard: 'Dashboard Asaas',
      systemLogs: 'Logs do Sistema'
    }
  },
  'en-US': {
    translation: {
      profile: 'Profile',
      logout: 'Logout',
      settings: 'Settings',
      admin: 'Admin',
      superAdmin: 'Super Admin',
      adminProfileTitle: 'Zappy admin',
      editProfile: 'Edit profile',
      changePassword: 'Change password',
      saveChanges: 'Save changes',
      name: 'Name',
      email: 'Email',
      department: 'Department',
      role: 'Role',
      preferences: 'Preferences',
      notifications: 'Notifications',
      privacy: 'Privacy',
      sessions: 'Sessions',
      // Sidebar / Menu labels
      dashboard: 'Dashboard',
      addItems: 'Add Items',
      listItems: 'List Items',
      categories: 'Categories',
      productSuggestions: 'Product Suggestions',
      banners: 'Banners',
      orders: 'Orders',
      statistics: 'Statistics',
      payments: 'Payments',
      tables: 'Tables',
      coupons: 'Coupons',
      cashback: 'Cashback',
      customers: 'Customers',
      analyticsLiza: 'Liza Analytics',
      waiter: 'Waiter',
      counterAttendants: 'Counter Attendants',
      paymentSettings: 'Payment Settings',
      storeLinks: 'Store Links',
      bluetoothPrinter: 'Bluetooth Printer',
      whatsappSettings: 'WhatsApp Settings',
      whatsappMessages: 'WhatsApp Messages',
      
      lizaChat: 'Chat with Liza'
      ,
      // Super Admin sidebar labels
      manageStores: 'Manage Stores',
      systemSettings: 'System Settings',
      apiManagement: 'API Management',
      
      globalAnalytics: 'Global Analytics',
      manageUsers: 'Manage Users',
      asaasDashboard: 'Asaas Dashboard',
      systemLogs: 'System Logs'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: { escapeValue: false }
  });

export default i18n;