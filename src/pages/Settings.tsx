import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Database, 
  Shield, 
  Download,
  Upload,
  Trash2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { exportToJSON, exportToCSV, exportToExcel, ExportData } from '../utils/exportUtils';

const Settings: React.FC = () => {
  const { state } = useFinance();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'light',
    timezone: 'America/Sao_Paulo',
    autoBackup: true,
    pushNotifications: true,
    budgetAlerts: true,
    billReminders: true,
    goalNotifications: true,
  });

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'preferences', name: 'Preferências', icon: SettingsIcon },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'data', name: 'Dados', icon: Database },
    { id: 'security', name: 'Segurança', icon: Shield },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = (format: 'json' | 'csv' | 'excel') => {
    const data: ExportData = {
      transactions: state.transactions,
      categories: state.categories,
      budgets: state.budgets,
      paymentMethods: state.paymentMethods,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    switch (format) {
      case 'json':
        exportToJSON(data);
        break;
      case 'csv':
        exportToCSV(data.transactions);
        break;
      case 'excel':
        exportToExcel(data);
        break;
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // TODO: Implementar importação de dados
        alert('Funcionalidade de importação será implementada em breve!');
      } catch (error) {
        alert('Erro ao ler o arquivo. Verifique se é um arquivo válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      // TODO: Implementar reset de dados
      alert('Funcionalidade de reset será implementada em breve!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da aplicação</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      <div className="space-y-6">
        {/* Perfil */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className="input-field"
                  defaultValue="Usuário Controlerf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="input-field"
                  defaultValue="usuario@controlerf.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="input-field"
                  defaultValue="(11) 99999-9999"
                />
              </div>
              <div className="pt-4">
                <button className="btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferências */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moeda
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="input-field"
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="input-field"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="input-field"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuso Horário
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="input-field"
                  >
                    <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                    <option value="America/Manaus">Manaus (UTC-4)</option>
                    <option value="America/Belem">Belém (UTC-3)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Automático</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Backup automático</p>
                    <p className="text-sm text-gray-600">Fazer backup automático dos dados</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                {settings.autoBackup && (
                  <div className="pl-4 border-l-2 border-primary-200">
                    <p className="text-sm text-gray-600">
                      Os dados serão exportados automaticamente a cada 7 dias
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notificações */}
        {activeTab === 'notifications' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notificações push</p>
                  <p className="text-sm text-gray-600">Receber notificações no navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Alertas de orçamento</p>
                  <p className="text-sm text-gray-600">Notificar quando estiver próximo do limite</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.budgetAlerts}
                    onChange={(e) => handleSettingChange('budgetAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Lembretes de contas</p>
                  <p className="text-sm text-gray-600">Notificar sobre contas recorrentes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.billReminders}
                    onChange={(e) => handleSettingChange('billReminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notificações de metas</p>
                  <p className="text-sm text-gray-600">Notificar sobre progresso das metas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.goalNotifications}
                    onChange={(e) => handleSettingChange('goalNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Dados */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Dados</h3>
              <p className="text-gray-600 mb-4">
                Faça backup dos seus dados financeiros em diferentes formatos
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleExportData('json')}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="font-medium text-gray-900">JSON</span>
                  <span className="text-sm text-gray-600">Backup completo</span>
                </button>
                
                <button
                  onClick={() => handleExportData('csv')}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="font-medium text-gray-900">CSV</span>
                  <span className="text-sm text-gray-600">Transações</span>
                </button>
                
                <button
                  onClick={() => handleExportData('excel')}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <FileSpreadsheet className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="font-medium text-gray-900">Excel</span>
                  <span className="text-sm text-gray-600">Relatórios</span>
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Importar Dados</h3>
              <p className="text-gray-600 mb-4">
                Restaure seus dados de um backup anterior
              </p>
              
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="btn-secondary flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                  Selecionar Arquivo
                </label>
                <span className="text-sm text-gray-500">
                  Apenas arquivos .json são suportados
                </span>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciar Dados</h3>
              <p className="text-gray-600 mb-4">
                Ações irreversíveis para gerenciar seus dados
              </p>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleResetData}
                  className="btn-secondary flex items-center gap-2 text-danger-600 hover:text-danger-700 border-danger-200 hover:border-danger-300"
                >
                  <Trash2 className="h-5 w-5" />
                  Resetar Todos os Dados
                </button>
                <span className="text-sm text-gray-500">
                  ⚠️ Esta ação não pode ser desfeita
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Segurança */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    placeholder="Digite sua senha atual"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Digite a nova senha"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Confirme a nova senha"
                    className="input-field"
                  />
                </div>
                <div className="pt-4">
                  <button className="btn-primary">
                    Alterar Senha
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Autenticação de Dois Fatores</h3>
              <p className="text-gray-600 mb-4">
                Adicione uma camada extra de segurança à sua conta
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">2FA Ativado</p>
                  <p className="text-sm text-gray-600">Requer código adicional para login</p>
                </div>
                <button className="btn-secondary">
                  Configurar 2FA
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessões Ativas</h3>
              <p className="text-gray-600 mb-4">
                Gerencie suas sessões ativas em diferentes dispositivos
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Chrome - Windows</p>
                    <p className="text-sm text-gray-600">Ativo agora • IP: 192.168.1.100</p>
                  </div>
                  <button className="text-sm text-danger-600 hover:text-danger-700">
                    Encerrar
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Safari - iPhone</p>
                    <p className="text-sm text-gray-600">Último acesso: há 2 horas</p>
                  </div>
                  <button className="text-sm text-danger-600 hover:text-danger-700">
                    Encerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
