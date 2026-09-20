# PayTrack

<p align="center">
  <strong>Payroll operations, made clear.</strong><br />
  A focused dashboard for managing employees, payroll periods, and operational insights.
</p>

<p align="center">
  <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions">CI</a>
  ·
  <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/issues">Issues</a>
  ·
  <a href="CHANGELOG.md">Changelog</a>
</p>

## What PayTrack focuses on

- **One operational view** for payroll health, employee totals, and current-period activity.
- **Reliable calculations** with shared validation schemas and a centralized payroll domain calculator.
- **Responsive workflows** that remain usable across desktop, tablet, and mobile layouts.
- **Accessible interface primitives** powered by shadcn/ui, Radix UI, semantic HTML, and keyboard-friendly controls.
- **Maintainable foundations** with TypeScript, feature-oriented modules, centralized configuration, and API boundaries.

## Product areas

| Area | Purpose |
| --- | --- |
| Overview | Review payroll totals, active employees, and recent activity. |
| Employees | Add, search, and manage employee records. |
| Payroll | Inspect payroll periods and calculate compensation details. |
| Analytics | Review department-level operational data. |
| Settings | Access application preferences and theme controls. |

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- shadcn/ui with Radix UI
- Zod validation
- MongoDB
- Recharts and Lucide icons

## Quick start

### Requirements

- Node.js 18 or newer
- Yarn 1.22
- MongoDB, local or hosted

### Install and configure

```bash
git clone https://github.com/Mostafa-SAID7/Dashboard-paytrack-F.git
cd Dashboard-paytrack-F
yarn install
cp .env.example .env.development.local
```

Update `.env.development.local` with the MongoDB connection used by your environment:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=paytrack
```

### Run locally

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Description |
| --- | --- |
| `yarn dev` | Start the development server on port 3000. |
| `yarn dev:no-reload` | Start development without the custom memory option. |
| `yarn dev:webpack` | Start the development server with the webpack command. |
| `yarn typecheck` | Run TypeScript without emitting files. |
| `yarn build` | Create a production build. |
| `yarn start` | Serve the production build. |

## Project structure

```text
app/                 App Router pages and API route handlers
components/ui/       Shared accessible UI primitives
config/              Application metadata, defaults, and validation rules
features/             Domain schemas and payroll calculation logic
hooks/                Reusable client hooks
lib/                  Database, HTTP, error, and utility modules
public/                Static brand assets
.github/              CI, release, contribution, and issue workflows
```

## API surface

- `GET /api/employees` — list employees
- `POST /api/employees` — create an employee
- `GET /api/payroll?period=YYYY-MM` — retrieve payroll for a period
- `POST /api/payroll` — create or update payroll data
- `POST /api/payroll/calculate` — validate and calculate payroll values
- `GET /api/dashboard/stats` — retrieve dashboard summary metrics
- `GET /api/analytics/departments` — retrieve department analytics

All request validation belongs in the shared schemas under `config/` and `features/`. Keep route handlers thin and keep business rules in domain modules.

## Quality and delivery

Pull requests are checked through the workflows in `.github/workflows/`:

- CI installs locked dependencies and verifies the application build.
- Release automation builds tagged versions and publishes GitHub releases.
- Dependabot keeps dependency updates visible for review.

Before opening a pull request, run:

```bash
yarn typecheck
yarn build
```

For UI changes, verify both a wide viewport and a mobile viewport, including keyboard navigation, readable contrast, and the open/closed mobile sidebar states.

## Configuration principles

- Keep application metadata and UI defaults in `config/app.ts`.
- Keep environment parsing in `config/environment.ts`.
- Keep shared validation in `config/schemas.ts` and feature schemas.
- Keep database access behind `lib/db/client.ts`.
- Avoid adding duplicate constants, route logic, or styling systems when an existing shared module already provides the behavior.

## Contributing

Read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) before contributing. Use the pull request template, describe user-visible changes clearly, and update [`CHANGELOG.md`](CHANGELOG.md) when behavior or release notes change.

## License

This project is maintained by Mostafa-SAID7. Licensing terms should be added before distributing the application outside the repository.

---

Built for clear, dependable payroll operations.

