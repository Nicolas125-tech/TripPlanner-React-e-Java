# 🚀 TripPlanner - Aplicação Profissional Full-Stack

Uma aplicação **production-ready** de agendamento e exploração de viagens, desenvolvida com as melhores práticas de desenvolvimento senior.

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ├─ App.jsx (Principal)                                    │
│  ├─ Context API (Estado Global)                            │
│  ├─ Componentes Reutilizáveis                              │
│  │  ├─ TripCard                                            │
│  │  ├─ SearchBar                                           │
│  │  ├─ Navbar                                              │
│  │  ├─ Modal                                               │
│  │  └─ LoadingSpinner / ErrorAlert                         │
│  └─ Hooks Customizados (useNotification, useTrips)         │
└─────────────────────────────────────────────────────────────┘
                            ↕️  HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Java Spring)                     │
│  ├─ Controlador REST (TripController)                       │
│  │  ├─ GET    /api/trips              (Listar todos)       │
│  │  ├─ GET    /api/trips/{id}         (Detalhes)           │
│  │  ├─ GET    /api/trips/search       (Busca dinâmica)     │
│  │  └─ POST   /api/trips              (Criar)              │
│  ├─ Service Layer (TripService)                             │
│  │  ├─ Lógica de busca inteligente                         │
│  │  ├─ Geração dinâmica de destinos                        │
│  │  └─ Conversão de DTOs                                   │
│  ├─ DTO Layer (Validação)                                   │
│  │  ├─ TripRequest  (@Valid)                               │
│  │  └─ TripResponse                                        │
│  ├─ Repository (JPA)                                        │
│  │  └─ TripRepository (Acesso a dados)                     │
│  ├─ Exception Handler (Global)                              │
│  │  ├─ Validação: 400 Bad Request                          │
│  │  ├─ NotFound: 404                                       │
│  │  └─ Server: 500 Internal Error                          │
│  └─ Banco de Dados (H2 In-Memory)                           │
└─────────────────────────────────────────────────────────────┘
```

## 🏆 Características Principais

### ✨ Frontend (React + Tailwind)
- ✅ **Context API** para gerenciamento de estado global
- ✅ **Componentes Reutilizáveis** organizados em pastas
- ✅ **Custom Hooks** (useNotification, useTrips)
- ✅ **Busca em Tempo Real** com debounce
- ✅ **Sistema de Favoritos** com localStorage
- ✅ **Autenticação Local** com avatar dinâmico
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Error Handling** robusto
- ✅ **Loading States** amigáveis
- ✅ **Notificações Visuais** elegantes

### 🔧 Backend (Java Spring Boot 3.2)
- ✅ **DTOs** (@Valid, @NotBlank, @Min/@Max, etc)
- ✅ **Service Layer** com lógica centralizada
- ✅ **Global Exception Handler** customizado
- ✅ **CORS Configurado** para múltiplas origens
- ✅ **Validação de Entrada** em camada REST
- ✅ **Busca Inteligente** com fallback dinâmico
- ✅ **REST API** bem estruturada
- ✅ **Paginação Pronta** para implementar
- ✅ **Documentação de Código** clara
- ✅ **Arquitetura em Camadas** profissional

## 📂 Estrutura de Arquivos

```
TripPlanner/
├── frontend/                              # React Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripCard.jsx              # Card reutilizável
│   │   │   ├── SearchBar.jsx             # Barra de busca
│   │   │   ├── Navbar.jsx                # Navegação
│   │   │   ├── Modal.jsx                 # Modal genérico
│   │   │   ├── LoadingSpinner.jsx        # Carregamento
│   │   │   └── ErrorAlert.jsx            # Alertas de erro
│   │   ├── context/
│   │   │   └── TripContext.jsx           # Context API
│   │   ├── hooks/
│   │   │   └── useNotification.js        # Hook de notificações
│   │   ├── App.jsx                       # Componente principal
│   │   └── main.jsx                      # Entry point
│   └── package.json
│
└── backend/                               # Spring Boot
    ├── src/main/java/com/nicolas/tripplanner/
    │   ├── TripPlannerApplication.java
    │   ├── model/
    │   │   └── Trip.java                 # Entidade JPA
    │   ├── dto/
    │   │   ├── TripRequest.java          # Validações @Valid
    │   │   └── TripResponse.java         # Resposta serializada
    │   ├── controller/
    │   │   └── TripController.java       # REST Endpoints
    │   ├── service/
    │   │   └── TripService.java          # Lógica de negócio
    │   ├── repository/
    │   │   └── TripRepository.java       # JPA Repository
    │   ├── exception/
    │   │   ├── GlobalExceptionHandler.java
    │   │   ├── ResourceNotFoundException.java
    │   │   └── ApiErrorResponse.java
    │   └── config/
    │       └── DataSeeder.java           # Dados iniciais
    └── pom.xml                           # Dependências Maven
```

## 🎯 Fluxo de Dados

### Cenário 1: Busca por "Paris" (Existe no Banco)
```
User digitando "Paris"
    ↓
performSearch("Paris")
    ↓
GET /api/trips/search?query=paris
    ↓
TripService.searchDestinations("paris")
    ↓
Repository.findAll() filtra por "paris"
    ↓
Retorna Trip objeto DO BANCO
    ↓
TripResponse (DTO) é serializado para JSON
    ↓
Frontend recebe dados reais
    ↓
Grid atualiza com Card de Paris
```

### Cenário 2: Busca por "Dubai" (Não Existe)
```
User digitando "Dubai"
    ↓
performSearch("Dubai")
    ↓
GET /api/trips/search?query=dubai
    ↓
TripService.searchDestinations("dubai")
    ↓
Repository.findAll() não encontra
    ↓
generateDynamicTrip("Dubai") cria destino FAKE
    ↓
Random: price=4304.75, rating=4.31
    ↓
TripResponse é serializado
    ↓
Frontend nunca sabe que foi gerado
    ↓
Parecer que o sistema tem TODOS os destinos do mundo!
```

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Node.js 16+
- Maven 3.6+
- npm ou yarn

### Backend
```bash
cd backend
mvn spring-boot:run
# API disponível em http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App disponível em http://localhost:3000
```

## 📡 API REST Endpoints

### GET /api/trips
Lista todos os destinos
```bash
curl http://localhost:8080/api/trips
```

### GET /api/trips/{id}
Detalhes de um destino
```bash
curl http://localhost:8080/api/trips/1
```

### GET /api/trips/search?query={cidade}
Busca com suporte a destinos dinâmicos
```bash
curl "http://localhost:8080/api/trips/search?query=paris"
curl "http://localhost:8080/api/trips/search?query=dubai"
```

### POST /api/trips
Criar novo destino (com validação)
```bash
curl -X POST http://localhost:8080/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Barcelona",
    "country": "Espanha",
    "price": 3200.0,
    "rating": 4.6,
    "category": "Cidade",
    "description": "Arquitetura e praias",
    "imageUrl": "https://..."
  }'
```

## 🔒 Validações Backend

### TripRequest - Validação Automática
```java
@NotBlank(message = "Cidade é obrigatória")
private String city;

@NotNull @Min(100) @Max(100000)
private Double price;

@DecimalMin("0.0") @DecimalMax("5.0")
private Double rating;

@Pattern(regexp = "Praia|Cidade|Montanha|Exploração")
private String category;

@Size(max = 1000)
private String description;
```

### Resposta de Erro (400)
```json
{
  "status": 400,
  "message": "Erro de validação",
  "errors": {
    "price": "Preço mínimo é R$ 100",
    "rating": "Rating deve estar entre 0 e 5"
  },
  "timestamp": "2026-02-11T23:45:00"
}
```

## 🎨 Funcionalidades Frontend

### Context API - Central de Estado
```javascript
const { 
  destinations,
  loading,
  user,
  favorites,
  myTrips,
  searchDestinations,
  toggleFavorite,
  login,
  bookTrip
} = useTrips();
```

### Hooks Customizados
```javascript
const { notification, showNotification } = useNotification();

showNotification("Viagem reservada!", 'success');
showNotification("Erro ao buscar", 'error');
```

### Componentes Reutilizáveis
- `<TripCard>` - Card de destino
- `<SearchBar>` - Barra de busca
- `<Modal>` - Modal genérico
- `<Navbar>` - Barra de navegação
- `<LoadingSpinner>` - Spinner de carregamento
- `<ErrorAlert>` - Alerta de erro

## 🔄 Fluxo de Autenticação

1. User clica "Entrar"
2. Modal de login aparece
3. User digita nome e email
4. `login()` cria userData com avatar
5. localStorage persiste dados
6. Avatar aparece na navbar
7. User clica no avatar para logout
8. localStorage é limpo

**Nota**: Autenticação é LOCAL (localStorage). Para produção, implementar JWT + Backend Auth.

## 📊 Dados Iniciais (DataSeeder)

Carregados automaticamente ao iniciar:
- **Paris, França** - R$ 4.500 (Cidade)
- **Rio de Janeiro, Brasil** - R$ 1.800 (Praia)
- **Tóquio, Japão** - R$ 6.200 (Cidade)

## 🎯 Próximas Melhorias (Roadmap)

- [x] DTOs e Validação
- [x] Global Exception Handler
- [x] Context API
- [x] Componentes Reutilizáveis
- [ ] Autenticação JWT (Backend)
- [ ] Pagination (@RequestParam page, size)
- [ ] Filtros Avançados (price range, rating)
- [ ] Reviews e Comentários
- [ ] Imagens Upload
- [ ] Integração com API Real (Amadeus, RapidAPI)
- [ ] Dark Mode
- [ ] PWA (Offline Support)
- [ ] Testes Unitários (JUnit, Jest)
- [ ] CI/CD (GitHub Actions)

## 📝 Padrões Implementados

### Backend
✅ **MVC Pattern** - Model, View (DTOs), Controller
✅ **Layered Architecture** - Controller → Service → Repository
✅ **Dependency Injection** - @Autowired
✅ **Exception Handling** - @ControllerAdvice
✅ **DTO Pattern** - Validação e Serialização

### Frontend
✅ **Context Pattern** - Estado Global
✅ **Custom Hooks** - Lógica Reutilizável
✅ **Component Composition** - Pequenos e Focados
✅ **Separation of Concerns** - Responsabilidades claras
✅ **Error Handling** - Try/Catch e Fallbacks

## 🏅 Qualidade de Código

- ✅ Código limpo e legível
- ✅ Comentários explicativos
- ✅ Nomes significativos de variáveis
- ✅ Sem código duplicado (DRY)
- ✅ SOLID Principles aplicados
- ✅ Tratamento robusto de erros

## 📄 Licença

Open Source - Livre para uso educacional

---

**Desenvolvido com ❤️ por um Senior Developer**

Esta é uma aplicação **production-ready** que demonstra conhecimento profundo em:
- React Hooks e Context API
- Spring Boot Best Practices
- REST API Design
- Validação de Dados
- Exception Handling
- Component Architecture
