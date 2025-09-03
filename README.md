# Controlerf - Aplicativo de Controle Financeiro

Um aplicativo moderno e intuitivo para controle financeiro pessoal, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades Principais

### 📊 Dashboard Intuitivo
- **Visão geral clara**: Saldo atual, entradas e saídas do mês
- **Gráficos interativos**: Pizza para categorias, barras para evolução temporal
- **Indicadores de orçamento**: Progresso visual com alertas de limite
- **Transações recentes**: Lista das últimas movimentações

### 💰 Cadastro Rápido de Transações
- **Botão "+" destacado**: Acesso rápido para adicionar receitas/despesas
- **Campos simples**: Valor, categoria, forma de pagamento e data
- **Sugestões inteligentes**: Baseadas em transações anteriores
- **Validação automática**: Campos obrigatórios e formatos corretos

### 🏷️ Categorias Personalizáveis
- **Categorias padrão**: Alimentação, transporte, lazer, saúde, educação, moradia
- **Criação personalizada**: Adicione suas próprias categorias
- **Cores e ícones**: Identificação visual única para cada categoria
- **Organização por tipo**: Receitas e despesas separadas

### 📈 Orçamentos e Metas
- **Limites mensais**: Defina orçamentos por categoria
- **Indicadores de progresso**: Barras visuais com status (dentro/aviso/excedido)
- **Alertas inteligentes**: Notificações quando próximo do limite
- **Períodos flexíveis**: Mensal ou anual

### 📋 Gestão de Transações
- **Lista completa**: Todas as transações com filtros avançados
- **Busca inteligente**: Por categoria, descrição ou data
- **Filtros múltiplos**: Tipo, categoria, período
- **Edição e exclusão**: Modifique ou remova transações

### 📊 Relatórios Detalhados
- **Múltiplos períodos**: 1 mês, 3 meses, 6 meses, 1 ano
- **Gráficos variados**: Barras, pizza e linha
- **Análise temporal**: Evolução de receitas e despesas
- **Exportação**: Backup dos dados em JSON

### ⚙️ Configurações Avançadas
- **Perfil do usuário**: Informações pessoais e preferências
- **Moedas e idiomas**: Suporte a múltiplas localizações
- **Temas**: Claro, escuro ou automático
- **Backup automático**: Exportação e importação de dados
- **Segurança**: Alteração de senha e 2FA

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/controlerf.git
cd controlerf
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o aplicativo**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a versão de produção
- `npm run lint` - Executa o linter

## 📱 Como Usar

### 1. Primeiro Acesso
- O aplicativo já vem com categorias padrão configuradas
- Comece adicionando suas primeiras transações
- Configure orçamentos para suas categorias principais

### 2. Adicionando Transações
- Clique no botão "+" no header
- Escolha entre receita ou despesa
- Preencha valor, categoria e forma de pagamento
- Adicione descrição opcional
- Use as sugestões baseadas em transações anteriores

### 3. Gerenciando Categorias
- Acesse a página "Categorias"
- Crie novas categorias com cores e ícones personalizados
- Organize por tipo (receita/despesa)

### 4. Configurando Orçamentos
- Vá para "Orçamentos"
- Defina limites mensais para categorias de despesas
- Acompanhe o progresso visual
- Receba alertas quando próximo do limite

### 5. Analisando Relatórios
- Explore a página "Relatórios"
- Escolha diferentes períodos de análise
- Visualize gráficos de barras, pizza e linha
- Exporte dados para backup

## 🎨 Design e UX

### Interface Minimalista
- **Cores intuitivas**: Verde para receitas, vermelho para despesas
- **Ícones claros**: Identificação visual rápida
- **Navegação fluida**: Máximo 2 cliques para qualquer ação
- **Responsivo**: Funciona perfeitamente em desktop e mobile

### Componentes Reutilizáveis
- **Cards informativos**: Layout consistente para informações
- **Botões padronizados**: Estilos unificados para ações
- **Formulários intuitivos**: Validação e feedback visual
- **Modais elegantes**: Interações sem perder contexto

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal com navegação
│   └── AddTransactionModal.tsx  # Modal de adicionar transação
├── contexts/           # Contextos React
│   └── FinanceContext.tsx  # Estado global da aplicação
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Página principal
│   ├── Transactions.tsx # Lista de transações
│   ├── Categories.tsx  # Gerenciamento de categorias
│   ├── Budgets.tsx     # Configuração de orçamentos
│   ├── Reports.tsx     # Relatórios e gráficos
│   └── Settings.tsx    # Configurações do usuário
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🌟 Funcionalidades Futuras

### Modo Avançado
- **Relatórios detalhados**: Análises mais profundas
- **Exportação Excel**: Formato mais compatível
- **Integração bancária**: Open Finance para sincronização automática

### Reconhecimento Inteligente
- **Comprovantes PIX**: Leitura automática de valores e categorias
- **OCR avançado**: Reconhecimento de comprovantes físicos
- **Machine Learning**: Sugestões cada vez mais precisas

### Backup na Nuvem
- **Google Drive**: Sincronização automática
- **Supabase**: Banco de dados em nuvem
- **Múltiplos dispositivos**: Sincronização entre plataformas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Issues**: Reporte bugs ou solicite features no GitHub
- **Documentação**: Consulte este README e os comentários no código
- **Comunidade**: Participe das discussões e contribuições

## 🎯 Roadmap

### Versão 1.1
- [ ] Edição de transações
- [ ] Filtros avançados por data
- [ ] Notificações push no navegador

### Versão 1.2
- [ ] Importação de dados
- [ ] Backup automático
- [ ] Temas escuro/claro

### Versão 2.0
- [ ] Reconhecimento de comprovantes
- [ ] Integração bancária
- [ ] Aplicativo mobile nativo

---

**Controlerf** - Transformando o controle financeiro em uma experiência simples e eficiente! 💰✨

