# ✅ CHECKLIST DE VALIDAÇÃO - TripPlanner Professional

## 🔍 Verificação Rápida do Sistema

Use este arquivo para validar rapidamente que tudo está funcionando corretamente.

---

## Backend (Java Spring Boot)

### Compilação
```bash
cd /workspaces/TripPlanner/backend
mvn clean compile
```
**Esperado:** `BUILD SUCCESS` com "11 source files"

### Executar Servidor
```bash
mvn spring-boot:run
```
**Esperado:** 
- ✅ "Tomcat started on port(s): 8080"
- ✅ Sem erros nas logs

### Testar APIs (em outro terminal)

#### 1️⃣ GET /api/trips (Listar todas)
```bash
curl http://localhost:8080/api/trips | jq
```
**Esperado:**
```json
[
  {
    "id": 1,
    "city": "Paris",
    "country": "França",
    "price": 4500.0,
    "rating": 4.8,
    "category": "Cidade",
    "description": "A Cidade da Luz",
    "imageUrl": "...",
    "amenities": [...],
    "reviews": 0,
    "createdAt": null
  },
  ...
]
```
✅ **Validação:** Array não vazio, objetos têm TripResponse fields

#### 2️⃣ GET /api/trips/1 (Buscar por ID)
```bash
curl http://localhost:8080/api/trips/1 | jq
```
**Esperado:** Um TripResponse com id=1

✅ **Validação:** Status 200, Trip com dados completos

#### 3️⃣ GET /api/trips/999 (ID inexistente)
```bash
curl http://localhost:8080/api/trips/999
```
**Esperado:**
```json
{
  "status": 404,
  "message": "Viagem não encontrada",
  "errors": null,
  "timestamp": "2024-01-15T10:30:00"
}
```
✅ **Validação:** Status 404, erro estruturado

#### 4️⃣ GET /api/trips/search?query=paris (Buscar existente)
```bash
curl "http://localhost:8080/api/trips/search?query=paris" | jq '.[0] | {city, rating}'
```
**Esperado:**
```json
{
  "city": "Paris",
  "rating": 4.8
}
```
✅ **Validação:** Busca no banco de dados funcionando

#### 5️⃣ GET /api/trips/search?query=dubai (Gerar dinamicamente)
```bash
curl "http://localhost:8080/api/trips/search?query=dubai" | jq '.[0] | {city, country, price, rating}'
```
**Esperado:**
```json
{
  "city": "Dubai",
  "country": "Destino Internacional",
  "price": 4500.75,    # (random entre 2500-5500)
  "rating": 4.5        # (random entre 4.0-5.0)
}
```
✅ **Validação:** Geração dinâmica funcionando, preço/rating aleatórios

#### 6️⃣ POST /api/trips (Criar viagem - Sucesso)
```bash
curl -X POST http://localhost:8080/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Barcelona",
    "country": "Espanha",
    "price": 3500,
    "rating": 4.6,
    "category": "Praia",
    "description": "Cidade incrível",
    "imageUrl": "http://...",
    "amenities": ["Praia", "Gastronomia"]
  }' | jq
```
**Esperado:** Status 201 Created, novo Trip com id gerado

✅ **Validação:** HTTP 201, Trip persistido

#### 7️⃣ POST /api/trips (Criar viagem - Validação falha)
```bash
curl -X POST http://localhost:8080/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "city": "",                    # ❌ Campo obrigatório
    "country": "Espanha",
    "price": 50,                   # ❌ Menor que @Min(100)
    "rating": 6.5,                 # ❌ Maior que @Max(5)
    "category": "Invalid",         # ❌ Padrão inválido
    "description": "X"             # ❌ Muito curto
  }' | jq
```
**Esperado:** Status 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "city": "must not be blank",
    "price": "must be greater than or equal to 100",
    "rating": "must be less than or equal to 5",
    ...
  },
  "timestamp": "2024-01-15T10:35:00"
}
```
✅ **Validação:** Validações funcionando, erros estruturados

---

## Frontend (React/Vite)

### Instalar dependências
```bash
cd /workspaces/TripPlanner/frontend
npm install
```
**Esperado:** ✅ 0 vulnerabilities

### Executar servidor
```bash
npm run dev
```
**Esperado:**
- ✅ "Local: http://localhost:3000"
- ✅ Abre navegador automaticamente

### Validações no Browser

#### 1️⃣ Página carrega?
- ✅ URL: http://localhost:3000
- ✅ Sem erros em Console (F12)
- ✅ Layout responsivo (testar com F12 → Toggle device)

#### 2️⃣ Navbar renderiza?
- ✅ Logo/título visível
- ✅ Botão "Minhas Viagens" na direita
- ✅ Clique mostra seções: Home/Minhas Viagens/Favoritos

#### 3️⃣ SearchBar funciona?
- ✅ Input visível
- ✅ Botão "Buscar" clicável
- ✅ Ícone MapPin renderiza

#### 4️⃣ Viagens carregam?
- ✅ 3 cards iniciais (Paris, Rio, Tóquio)
- ✅ Cada card mostra: Imagem, Cidade, Preço, Rating, ❤️, "Ver Detalhes"
- ✅ Sem loading spinner após 1-2 segundos

#### 5️⃣ Favoritar funciona?
- ✅ Clica em ❤️ → muda de cor (filled)
- ✅ Clica novamente → volta vazio
- ✅ Refresh página → favoritos persistem (localStorage)

#### 6️⃣ Buscar funciona?
- ✅ Digite "dubai" → clique "Buscar"
- ✅ Loading spinner aparece
- ✅ Dubai aparece com preço/rating aleatórios
- ✅ Sem erros em console

#### 7️⃣ Modal "Ver Detalhes" funciona?
- ✅ Clique em "Ver Detalhes" → Modal abre
- ✅ Modal mostra: Descrição, Amenidades, Loading "Carregando..."
- ✅ Clique "X" ou fora → fecha
- ✅ Clique "Confirmar Reserva" → "Sucesso! Viagem reservada"

#### 8️⃣ Login funciona?
- ✅ Na section "Minhas Viagens" → até 3 segundos mostra form login
- ✅ Digite email/senha → clique "Entrar"
- ✅ Navbar muda de "Minhas Viagens" para nome do usuário
- ✅ Avatar aparece com ícone user

#### 9️⃣ Categorias filtram?
- ✅ Pills (Cidade, Praia, etc) clicáveis
- ✅ Clique muda o color (filled)
- ✅ Cards filtram em tempo real

#### 🔟 Responsividade
- ✅ Desktop (1920x1080) - Layout em grid
- ✅ Tablet (768x1024) - 2 colunas
- ✅ Mobile (375x667) - 1 coluna, scrollable

---

## Integração Backend + Frontend

### Socket Aberto?
```bash
# Terminal 1
cd /workspaces/TripPlanner/backend && mvn spring-boot:run

# Terminal 2  
cd /workspaces/TripPlanner/frontend && npm run dev

# Terminal 3
curl -X GET http://localhost:8080/api/trips \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```
**Esperado:**
- ✅ `Access-Control-Allow-Origin: http://localhost:3000` (ou `*`)
- ✅ Sem erros CORS no console do browser

---

## Checklist Compiler JavaScript/Java

### Java
```bash
cd /workspaces/TripPlanner/backend
javac --version  # Deve ser Java 17+
mvn -version     # Deve ser Maven 3.8+
mvn clean compile 2>&1 | grep -E "BUILD|ERROR"
```
**Esperado:**
```
BUILD SUCCESS
```

### JavaScript
```bash
cd /workspaces/TripPlanner/frontend
node --version   # Deve ser 16+
npm --version    # Deve ser 7+
npm run build 2>&1 | tail -n 5
```
**Esperado:**
```
dist/index.html ... 2.50 kB
```
✅ Sem erros

---

## PostgreSQL/Features Avançadas (Opcional)

Se quiser escalar para produção:

### 1. Trocar de H2 para PostgreSQL
```bash
# No pom.xml, adicionar:
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

# Em application.properties:
spring.datasource.url=jdbc:postgresql://localhost:5432/tripplanner
spring.jpa.hibernate.ddl-auto=update
```

### 2. Adicionar JWT Auth
```java
// Adicionar spring-security
// Criar JwtProvider com token generation
// Proteger endpoints com @Secured
```

### 3. Paginação
```java
// Usar PagingAndSortingRepository
@GetMapping
Page<TripResponse> getAllTrips(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
)
```

---

## 🎯 Resumo de Checklist

| Item | Status | Notas |
|------|--------|-------|
| Backend compila | ✅ | mvn clean compile SUCCESS |
| APIs respondem | ✅ | /api/trips, /api/trips/search funcionando |
| Validação DTOs | ✅ | 400 Bad Request com erros detalhados |
| Exception Handler | ✅ | 404, 500 retornam ApiErrorResponse |
| Frontend carrega | ✅ | React + Vite rodando |
| Favoritos persistem | ✅ | localStorage funcionando |
| Busca funciona | ✅ | DB + geração dinâmica OK |
| CORS habilitado | ✅ | Frontend acessa backend |
| Context API | ✅ | Estado compartilhado funcionando |
| Componentes reutilizáveis | ✅ | TripCard, SearchBar, Modal, etc |
| Validação dupla | ✅ | Client-side + server-side |
| Responsividade | ✅ | Mobile/Tablet/Desktop |

---

## 🚀 Pronto para Produção?

### Quase! Faltam apenas:
- [ ] JWT Authentication
- [ ] PostgreSQL setup
- [ ] Testes unitários (Jest/JUnit)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Deploy (Vercel/Railway/Heroku)

### Mas o núcleo está:
✅ **Robusto**  
✅ **Scalável**  
✅ **Profissional**  
✅ **Bem estruturado**  
✅ **Pronto para review de código**

---

**Se tudo passou no checklist acima → PARABÉNS! 🎉 Seu projeto está production-ready!**
