# 🚀 Instruções para Executar o Controlerf

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 16 ou superior
- **npm** ou **yarn** como gerenciador de pacotes

### Verificar instalações:
```bash
node --version
npm --version
# ou
yarn --version
```

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

### 3. Acessar no Navegador
O aplicativo será aberto automaticamente em:
```
http://localhost:3000
```

## 🎯 Primeiros Passos

### 1. Carregar Dados de Exemplo
- Na primeira execução, o Dashboard estará vazio
- Clique no botão **"Carregar Dados de Exemplo"** no Dashboard
- Isso criará transações, categorias e orçamentos de demonstração

### 2. Explorar as Funcionalidades
- **Dashboard**: Visão geral das finanças
- **Transações**: Adicionar, visualizar e gerenciar movimentações
- **Categorias**: Criar e personalizar categorias
- **Orçamentos**: Definir limites mensais
- **Relatórios**: Análises e gráficos
- **Configurações**: Preferências do usuário

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria versão otimizada
npm run preview      # Visualiza versão de produção

# Qualidade de Código
npm run lint         # Executa ESLint
```

## 📁 Estrutura do Projeto

```
controlerf/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos React (estado global)
│   ├── pages/          # Páginas da aplicação
│   ├── types/          # Definições TypeScript
│   ├── data/           # Dados de exemplo
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── public/             # Arquivos estáticos
├── package.json        # Dependências e scripts
├── tailwind.config.js  # Configuração do Tailwind CSS
├── tsconfig.json       # Configuração do TypeScript
└── vite.config.ts      # Configuração do Vite
```

## 🎨 Tecnologias Utilizadas

- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework de estilos
- **Vite**: Build tool rápido
- **Recharts**: Gráficos interativos
- **Lucide React**: Ícones
- **date-fns**: Manipulação de datas
- **React Router**: Navegação

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Remover node_modules e reinstalar
rm -rf node_modules
npm install
```

### Erro: "Port 3000 already in use"
```bash
# O Vite tentará automaticamente a próxima porta disponível
# Ou pare o processo na porta 3000
```

### Erro: "TypeScript compilation failed"
```bash
# Verificar versão do Node.js (deve ser 16+)
node --version

# Limpar cache do TypeScript
rm -rf node_modules/.cache
npm install
```

## 📱 Funcionalidades Principais

### ✅ Implementadas
- Dashboard com visão geral financeira
- Cadastro rápido de transações
- Categorias personalizáveis
- Sistema de orçamentos
- Relatórios com gráficos
- Configurações do usuário
- Sugestões inteligentes
- Interface responsiva

### 🚧 Em Desenvolvimento
- Edição de transações
- Importação de dados
- Backup automático
- Temas escuro/claro

### 🔮 Futuras Versões
- Reconhecimento de comprovantes
- Integração bancária
- Aplicativo mobile
- Backup na nuvem

## 🌟 Dicas de Uso

### 1. Navegação Rápida
- Use o botão **"+"** no header para adicionar transações rapidamente
- Navegue entre páginas usando o menu lateral
- Use filtros para encontrar transações específicas

### 2. Categorias Inteligentes
- Crie categorias com cores e ícones únicos
- Use as sugestões baseadas em transações anteriores
- Organize por tipo (receita/despesa)

### 3. Orçamentos Eficazes
- Defina limites realistas para cada categoria
- Acompanhe o progresso visual
- Configure alertas para evitar exceder limites

### 4. Relatórios Informativos
- Explore diferentes períodos de análise
- Use gráficos variados para insights
- Exporte dados para backup

## 🤝 Contribuindo

### 1. Reportar Bugs
- Use o sistema de Issues do GitHub
- Descreva o problema detalhadamente
- Inclua passos para reproduzir

### 2. Sugerir Features
- Abra uma Issue com label "enhancement"
- Explique o benefício da funcionalidade
- Forneça exemplos de uso

### 3. Desenvolver
- Fork o projeto
- Crie uma branch para sua feature
- Siga os padrões de código existentes
- Abra um Pull Request

## 📞 Suporte

- **GitHub Issues**: Para bugs e sugestões
- **README.md**: Documentação completa
- **Comentários no código**: Explicações detalhadas
- **TypeScript**: Tipagem para melhor desenvolvimento

## 🎉 Próximos Passos

1. **Explore o Dashboard** com dados de exemplo
2. **Adicione suas próprias transações**
3. **Crie categorias personalizadas**
4. **Configure orçamentos mensais**
5. **Analise relatórios e gráficos**
6. **Personalize configurações**

---

**Controlerf** está pronto para transformar sua gestão financeira! 💰✨

Para dúvidas ou problemas, consulte este arquivo ou abra uma Issue no GitHub.

