# 💰 FinTrack — Gerenciador Financeiro Pessoal

<p align="center">
  <strong>Controle suas finanças de forma simples, visual e elegante.</strong><br>
  Projeto Final da disciplina de Desenvolvimento Web.
</p>

---

## 📋 Sobre o Projeto

O **FinTrack** é uma aplicação web para gerenciamento de finanças pessoais, permitindo que o usuário registre, organize e acompanhe suas receitas e despesas de forma intuitiva. Todo o sistema roda diretamente no navegador, sem necessidade de servidor ou banco de dados externo.

### Principais funcionalidades

- **Dashboard interativo** com resumo financeiro (saldo, receitas, despesas) e gráfico de barras mensal
- **Gerenciamento de Transações** — Cadastro, edição, exclusão e filtros avançados (por tipo, categoria e período)
- **Gerenciamento de Categorias** — Criação de categorias personalizadas com seletor de cores
- **Persistência de dados** via `localStorage` (os dados permanecem mesmo após fechar o navegador)
- **Design responsivo** que se adapta a desktop, tablet e celular

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica das páginas (`header`, `nav`, `main`, `section`, `aside`) |
| **CSS3** | Estilização completa com CSS Variables, Flexbox, Grid e Media Queries |
| **JavaScript (ES6+)** | Lógica da aplicação, manipulação do DOM e persistência com `localStorage` |
| **Google Fonts** | Tipografia moderna (fonte Inter) |

> ⚠️ Nenhum framework ou biblioteca externa foi utilizado. Todo o código é **Vanilla** (puro).

---

## 📁 Estrutura de Arquivos

```
Projeto/
├── index.html              # Dashboard (página principal)
├── transacoes.html          # Página de gerenciamento de transações
├── categorias.html          # Página de gerenciamento de categorias
├── css/
│   └── style.css            # Estilos globais, design system e responsividade
└── js/
    ├── storage.js           # Módulo de persistência (localStorage)
    ├── ui.js                # Utilitários de interface (Modal, Toast, Sidebar)
    ├── dashboard.js         # Lógica do Dashboard
    ├── transacoes.js        # Lógica do CRUD de Transações
    └── categorias.js        # Lógica do CRUD de Categorias
```

---

## 🚀 Como Executar

1. Faça o download ou clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, etc.)
3. Pronto! Não é necessário instalar nada

```
Basta abrir o index.html → O sistema já funciona.
```

---

## 🧩 Entidades de Dados

### 1. Categorias
| Campo  | Tipo     | Descrição                          |
|--------|----------|------------------------------------|
| `id`   | `string` | Identificador único (gerado auto.) |
| `name` | `string` | Nome da categoria                  |
| `type` | `string` | `"receita"` ou `"despesa"`         |
| `color`| `string` | Código hexadecimal da cor          |

### 2. Transações
| Campo        | Tipo     | Descrição                          |
|--------------|----------|------------------------------------|
| `id`         | `string` | Identificador único (gerado auto.) |
| `description`| `string` | Descrição da transação             |
| `value`      | `number` | Valor em reais (R$)               |
| `date`       | `string` | Data no formato `YYYY-MM-DD`       |
| `type`       | `string` | `"receita"` ou `"despesa"`         |
| `categoryId` | `string` | ID da categoria vinculada          |

---

## 📱 Responsividade

A aplicação foi projetada com abordagem **mobile-friendly**, utilizando:

- **CSS Media Queries** para adaptar o layout em diferentes resoluções
- **Sidebar colapsável** com menu hamburger em telas menores (≤ 768px)
- **Grids adaptáveis** que reorganizam os cards automaticamente

---

## ✅ Requisitos Atendidos

- [x] Mínimo de 2 entidades de dados (Categorias e Transações)
- [x] Mínimo de 2 páginas com navegação (3 páginas com sidebar)
- [x] CRUD completo (Create, Read, Update, Delete)
- [x] Persistência de dados com `localStorage`
- [x] HTML semântico
- [x] CSS com Flexbox, Grid e Media Queries
- [x] Formulários com validação
- [x] JavaScript puro (sem frameworks)

---

## 👤 Autor

Desenvolvido como Projeto Final da disciplina de **Desenvolvimento Web**.

---
