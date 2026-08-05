# Taskly — Management System

Taskly is a project management system allows teams to organize their work through Epics, Tasks, and Projects, invite and manage team members, and track progress through built-in statistics.

## ✨ Features

- **Authentication**
  - Sign up
  - Login
  - Forgot password
  - Reset password
- **Epics** — group related tasks under larger initiatives
- **Tasks** — create, assign, and track individual work items
- **Projects** — organize epics and tasks under projects
- **Members** — invite and manage team members
- **Statistics** — visualize project and team progress

## 🛠️ Tech Stack

- **Framework:** Angular 17
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Language:** TypeScript
- **Reactive programming:** RxJS
- **Linting/Formatting:** ESLint + Prettier

## 📁 Project Structure

```
app/
├── core/
│   ├── Guards/
│   ├── interceptors/
│   ├── services/
│   └── utils/
├── features/
│   ├── auth/
│   ├── epics/
│   │   ├── components/
│   │   ├── epic.model.ts
│   │   ├── epics.component.ts
│   │   ├── epics.component.html
│   │   ├── epics.component.css
│   │   └── epics.service.ts
│   ├── members/
│   ├── project/
│   ├── statistics/
│   └── tasks/
└── shared/
    ├── classes/
    ├── components/
    ├── directives/
    ├── icons/
    └── pipes/
```

- **core/** — app-wide singletons: guards, interceptors, services, and utility helpers.
- **features/** — one folder for every single page(auth, epics, members, project, statistics, tasks), each following the same internal pattern: `component` + `service` + `model`.
- **shared/** — reusable building blocks (UI components, directives, pipes, icons, base classes) used across components.

## 🚀 Getting Started

### Prerequisites

- Node.js
- pnpm (`npm install -g pnpm`)
- Angular CLI (`pnpm add -g @angular/cli`)

### Installation

```bash
git clone <https://github.com/farahmahfouz/Taskly.git>
cd taskly
pnpm install
```

### Development server

```bash
cd taskly
pnpm dev
```

Navigate to `http://localhost:3000/` 

### Build

```bash
pnpm build
```

### Watch mode (development build)

```bash
pnpm watch
```

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format        # auto-format
pnpm format:check  # check formatting only
```

## 📄 License

All rights reserved to Farah Mahfouz.
