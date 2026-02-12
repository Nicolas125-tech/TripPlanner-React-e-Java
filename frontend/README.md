# TripPlanner Frontend

Aplicação React moderna com Tailwind CSS para exploração e reserva de viagens.

## 📋 Estrutura

```
src/
├── main.jsx                       # Entry point
├── App.jsx                        # Componente principal
├── index.css                      # Estilos Tailwind
├── assets/
│   └── logo.svg                   # Logo (opcional)
```

## 🛠️ Tecnologias

- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Local Storage** - Persistência

## 🎯 Funcionalidades

### Principais

- ✅ **Exploração de Destinos** - Visualize todas as viagens disponíveis
- ✅ **Busca e Filtros** - Procure por cidade ou filtre por categoria
- ✅ **Sistema de Favoritos** - Salve seus destinos preferidos
- ✅ **Autenticação Local** - Faça login com seu nome e email
- ✅ **Gerenciar Reservas** - Visualize suas viagens reservadas
- ✅ **Responsive Design** - Funciona em desktop, tablet e mobile

### Interface

- 🎨 **Modais Modernos** - Detalhes, login e confirmação de reserva
- 🔔 **Notificações** - Feedback visual para ações
- 🌐 **Compatibilidade** - Funciona com dados mockados se backend não estiver disponível

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Instalação e execução

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# A aplicação abrirá em http://localhost:3000
```

### Build para produção

```bash
# Gerar build otimizado
npm run build

# Visualizar build localmente
npm run preview
```

## 🏗️ Arquitetura

### Componentes

#### `App.jsx` - Componente Principal

Contém toda a lógica e interface da aplicação.

**Estados principais:**
```javascript
const [activeTab, setActiveTab] = useState('home');        // Aba ativa
const [search, setSearch] = useState("");                  // Termo de busca
const [categoryFilter, setCategoryFilter] = useState("Todos"); // Filtro
const [destinations, setDestinations] = useState([]);      // Viagens
const [user, setUser] = useState(null);                    // Usuário
const [myTrips, setMyTrips] = useState([]);               // Reservas
const [favorites, setFavorites] = useState([]);           // Favoritos
```

#### `CategoryPill` - Componente de Filtro

Botão reutilizável para filtrar destinos por categoria.

```jsx
<CategoryPill 
  icon={<Sun size={16} />} 
  label="Praia" 
  active={categoryFilter === "Praia"}
  onClick={() => setCategoryFilter("Praia")}
/>
```

#### `Modal` - Componente de Modal

Modal reutilizável para exibir diferentes conteúdos (login, detalhes, reserva).

```jsx
<Modal 
  isOpen={showAuthModal} 
  onClose={() => setShowAuthModal(false)} 
  title="Acesse sua conta"
>
  {/* Conteúdo */}
</Modal>
```

## 💾 Persistência Local

Usa `localStorage` para armazenar dados:

```javascript
// Usuário autenticado
localStorage.setItem('trip_user', JSON.stringify(user));

// Reservas confirmadas
localStorage.setItem('trip_bookings', JSON.stringify(myTrips));

// Destinos favoritos
localStorage.setItem('trip_favorites', JSON.stringify(favorites));
```

Os dados persistem até o usuário limpar o cache do navegador.

## 🔌 Integração com Backend

### API URL

```javascript
fetch('http://localhost:8080/api/trips')
```

### Fluxo de Dados

1. **Carregamento** - App faz fetch ao montar
2. **Erro** - Se backend não responde, usa dados mockados
3. **Renderização** - Exibe destinos na grid

```javascript
useEffect(() => {
  fetch('http://localhost:8080/api/trips')
    .then(res => res.json())
    .then(data => setDestinations(data))
    .catch(err => setDestinations(mockDestinations));
}, []);
```

## 🎨 Estilos

### Tailwind CSS

Configurado em `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Classes Personalizadas

Em `index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-in {
    animation: fadeIn 0.2s ease-in;
  }
}
```

## 📱 Responsividade

A aplicação é desenvolvida "mobile-first":

- **Móvel** - Toque, telas pequenas
- **Tablet** - Grid 2 colunas
- **Desktop** - Grid 3 colunas

```jsx
<div className="grid md:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

## 🔐 Autenticação Local

Não usa backend real, apenas localStorage:

```javascript
const handleLogin = (e) => {
  const userData = {
    name: authForm.name,
    email: authForm.email,
    avatar: `https://ui-avatars.com/api/?name=${authForm.name}`
  };
  setUser(userData);
};
```

## 📋 Fluxos Principais

### 1. Exploração de Destinos

1. Usuário acessa "Explorar"
2. Vê grid de destinos
3. Pode filtrar por categoria ou buscar por nome
4. Clica em um card para ver detalhes

### 2. Adição de Favoritos

1. Clica no ícone de coração
2. Destino é adicionado ao `favorites`
3. Salva em localStorage
4. Notificação visual confirma

### 3. Reserva de Viagem

1. Clica "Reservar Agora"
2. Se não estiver logado, leva para login
3. Seleciona datas de ida/volta e número de hóspedes
4. Confirma pagamento
5. Viagem aparece em "Minhas Viagens"

## 🚀 Boas Práticas

### Performance

- Uso de `useEffect` com dependências corretas
- `map()` com `key` único para listas
- Evita re-renderizações desnecessárias

### Código Limpo

- Componentes pequenos e reutilizáveis
- Nomes descritivos
- Sem lógica complexa em JSX

### Accessibility

- Cores contrastantes
- Ícones com labels
- Navegação intuitiva

## 🛠️ Desenvolvimento

### Adicionar Nova Funcionalidade

1. Crie novo estado com `useState`
2. Adicione handlers de evento
3. Crie componentes reutilizáveis se necessário
4. Estilize com Tailwind

### Debug

Use React DevTools:

```bash
npm install -D react-devtools
```

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.1",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.2"
  }
}
```

## 🚨 Troubleshooting

### Porta 3000 já em uso

```bash
# Mudar porta em vite.config.js
export default defineConfig({
  server: {
    port: 3001,
  }
})
```

### Estilos não aparecem

```bash
# Reconstruir Tailwind
npm run build
npm run dev
```

### API não conecta

```bash
# Verificar se backend está rodando
curl http://localhost:8080/api/trips

# Se não responder, usar dados mockados (automático)
```

## 📖 Referências

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Frontend com ❤️**
