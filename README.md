# 🗺️ TripPlanner - Full Stack Travel Planning App

Bem-vindo ao **TripPlanner**! Esta é uma aplicação full-stack de agendamento de viagens "production-ready" desenvolvida para demonstrar padrões arquiteturais robustos e as melhores práticas em desenvolvimento de software usando **React** e **Java Spring Boot**.

## 🚀 Sobre o Projeto

O TripPlanner permite que os usuários busquem destinos, adicionem favoritos e façam reservas de viagens. O sistema apresenta uma **busca inteligente** que não apenas pesquisa destinos cadastrados, mas também *gera destinos dinamicamente* caso a cidade não exista no banco de dados.

## 📚 Documentação Completa

O projeto conta com documentação aprofundada! Recomendamos ler os seguintes arquivos para entender o escopo completo:

* 👉 [**QUICKSTART.md**](./QUICKSTART.md) - Setup em 3 minutos para rodar o app localmente.
* 👉 [**DOCUMENTATION_INDEX.md**](./DOCUMENTATION_INDEX.md) - Guia mestre para a documentação e estrutura de pastas do projeto.
* 👉 [**PROFESSIONAL.md**](./PROFESSIONAL.md) - Arquitetura detalhada, diagrama de componentes e documentação da API.
* 👉 [**IMPLEMENTATION_SUMMARY.md**](./IMPLEMENTATION_SUMMARY.md) - Resumo de decisões arquiteturais, padrões implementados (DTOs, Context API) e melhorias.
* 👉 [**VALIDATION_CHECKLIST.md**](./VALIDATION_CHECKLIST.md) - Checklist completo para validar endpoints, UI e integrações.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React 18
* Vite
* Tailwind CSS
* Lucide Icons
* Context API para Estado Global
* Custom Hooks

**Backend:**
* Java 17+
* Spring Boot 3.2
* Spring Data JPA
* H2 Database (In-Memory)
* Jakarta Validation (@Valid)

## ✨ Principais Funcionalidades

* 🔍 **Busca Dinâmica Avançada**: Fallback para geração dinâmica caso a cidade não seja encontrada no banco.
* 🛡️ **Validação Dupla**: Validações robustas no Frontend e no Backend (`@Valid` em DTOs).
* ⚙️ **Arquitetura em Camadas (Backend)**: Controller → Service → Repository e Global Exception Handler.
* ⚛️ **Estado Global Eficiente (Frontend)**: Uso de Context API e Componentes Reutilizáveis.
* ❤️ **Persistência Local (Frontend)**: Favoritos e Mock Auth salvos via `localStorage`.

## ⚙️ Como Executar Rapidamente

Consulte o [QUICKSTART.md](./QUICKSTART.md) para detalhes, mas em resumo:

```bash
# Terminal 1 - Backend (Roda na porta 8080)
cd backend
mvn spring-boot:run &

# Terminal 2 - Frontend (Roda na porta 3000)
cd frontend
npm install
npm run dev &
```

---

