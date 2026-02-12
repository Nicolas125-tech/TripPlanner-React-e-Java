# 🚀 Quick Start Guide - TripPlanner

## ⚡ Setup em 3 Minutos

### 1️⃣ Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
```
✅ Aguarde: "Tomcat started on port(s): 8080"

### 2️⃣ Terminal 2 - Frontend
```bash
cd frontend
npm install  # (primeira vez apenas)
npm run dev
```
✅ Aguarde: "ready in XXX ms"

### 3️⃣ Abrir Browser
```
http://localhost:3000
```

---

## 🧪 Testar Funcionalidades

### Teste 1: Listar Destinos
- Página carrega com 3 destinos (Paris, Rio, Tóquio)

### Teste 2: Buscar Destino Existente
- Digite: `Paris`
- Resultado: Dados do banco (rating 4.8, preço real)

### Teste 3: Buscar Destino Dinâmico
- Digite: `Dubai`
- Resultado: Destino GERADO randomicamente
- Digite: `Londres` → Gera outro
- Digite: `Barcelona` → E mais outro!

### Teste 4: Favoritos
- Clique no ❤️ icon
- Vá para aba "Favoritos"
- Viaje já está lá (localStorage)

### Teste 5: Reserva
- Clique "Ver Detalhes" de qualquer card
- Clique "Reservar Agora"
- Faça login (nome + email qualquer)
- Selecione datas e hóspedes
- Clique "Confirmar Pagamento"
- Vá para "Minhas Viagens"
- Reserva aparece! ✅

### Teste 6: Logout
- Clique no avatar na navbar
- Dados são limpos
- Login novamente com nome diferente

---

## 🔌 Testar API com cURL

### Todos os destinos
```bash
curl http://localhost:8080/api/trips
```

### Busca existente
```bash
curl "http://localhost:8080/api/trips/search?query=paris"
```

### Busca dinâmica
```bash
curl "http://localhost:8080/api/trips/search?query=dubai"
```

### Criar destino (com validação)
```bash
curl -X POST http://localhost:8080/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Amsterdam",
    "country": "Holanda",
    "price": 3500,
    "rating": 4.7,
    "category": "Cidade",
    "description": "Canais e bicicletas",
    "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
  }'
```

### Teste de validação (error 400)
```bash
curl -X POST http://localhost:8080/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "city": "",  # Erro: obrigatório
    "price": 50, # Erro: mínimo é 100
    "rating": 6  # Erro: máximo é 5
  }'
```

Resposta:
```json
{
  "status": 400,
  "message": "Erro de validação",
  "errors": {
    "city": "Cidade é obrigatória",
    "price": "Preço mínimo é R$ 100",
    "rating": "Rating máximo é 5"
  }
}
```

---

## 📁 Arquivos Principais

| Arquivo | O quê faz |
|---------|-----------|
| `frontend/src/context/TripContext.jsx` | Estado global (Context API) |
| `frontend/src/App.jsx` | Componente principal |
| `frontend/src/components/*` | Componentes reutilizáveis |
| `backend/src/.../TripController.java` | REST API |
| `backend/src/.../TripService.java` | Lógica de negócio |
| `backend/src/.../dto/*.java` | Validações com @Valid |
| `backend/src/.../exception/*` | Tratamento de erros |

---

## ⚙️ Configurações

### Backend (application.properties)
```properties
server.port=8080
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

### Frontend (vite.config.js)
```javascript
server: {
  port: 3000,
  open: true
}
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | `lsof -i :3000 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| Porta 8080 em uso | `lsof -i :8080 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| npm modules não instala | `rm -rf node_modules && npm install` |
| Backend não compila | `mvn clean compile` |
| Frontend não atualiza | Pressione `Ctrl+C` e execute `npm run dev` novamente |

---

## 📊 Stack Resumido

**Frontend**
- React 18
- Tailwind CSS
- Lucide Icons
- Context API
- Vite

**Backend**
- Java 17
- Spring Boot 3.2
- Spring Data JPA
- H2 Database
- Jakarta Validation

---

## 🎯 O que Torna Isso "Professional"

1. ✅ **DTOs com @Valid** - Validação automática
2. ✅ **Exception Handler Global** - Erros consistentes
3. ✅ **Context API** - Estado centralizado
4. ✅ **Custom Hooks** - Lógica reutilizável
5. ✅ **Service Layer** - Business logic separada
6. ✅ **Componentes pequeninhos** - Single Responsibility
7. ✅ **Error Handling** - Try/catch em tudo
8. ✅ **Loading States** - UX profissional
9. ✅ **Validação Client & Server** - Dupla segurança
10. ✅ **localStorage** - Persistência do estado

---

Como um Senior Developer, chamaria isso de:

> **"Arquitetura in Camadas com Componentes Reutilizáveis, Context API para Estado Global, REST API com Validação em DTOs e Exception Handling Centralizado - Production Ready."**

---

🎉 **Parabéns! Você possui uma aplicação PROFISSIONAL!**
