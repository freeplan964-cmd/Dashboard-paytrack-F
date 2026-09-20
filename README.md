<div align="center">
  <img src="https://img.icons8.com/color/96/000000/receive-cash.png" alt="PayTrack Logo" width="80" height="80">
  <h1 align="center">PayTrack Dashboard</h1>
  <p align="center">
    <strong>Modern, clear, and secure payroll management.</strong>
  </p>
  <p align="center">
    <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/actions">CI Status</a>
    ·
    <a href="https://github.com/Mostafa-SAID7/Dashboard-paytrack-F/issues">Report Bug</a>
    ·
    <a href="CHANGELOG.md">Changelog</a>
  </p>
</div>

<hr />

## ✨ Key Focus Points

PayTrack is engineered for stability, clarity, and security without enterprise over-engineering.

* 🔒 **Secure by Default:** Zero-dependency JWT stateless authentication using strict `HttpOnly` cookies and `scrypt` password hashing.
* 🧮 **Bulletproof Calculations:** Strict separation between manual deductions and statutory tax prevents any double-counting errors. Fully tested with Jest.
* 🛡️ **End-to-End Type Safety:** Fully typed domain models ensure that the API contracts precisely match the UI requirements.
* ⚡ **Next.js App Router:** Built on modern Next.js boundaries, organized elegantly into feature modules (`/features/payroll`, `/features/employees`).
* 🎨 **Clean & Responsive UI:** Powered by Tailwind CSS, Shadcn/UI, and Radix primitives to provide an accessible, beautiful experience across all devices.

## 🚀 Quick Start

### Prerequisites
* **Node.js** 24 or newer
* **pnpm** (recommended for dependency management)
* **MongoDB** (local or hosted URI)

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   Copy the example config and adjust your MongoDB URI and Auth secrets.
   ```bash
   cp .env.example .env
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```
   *Visit [http://localhost:3000](http://localhost:3000) to view the application.*

## 🧪 Testing & Validation

PayTrack ensures correctness through continuous typechecking and mathematical unit testing.

```bash
# Run unit tests (Jest)
pnpm test

# Run TypeScript typechecker
pnpm typecheck
```

## 🏗️ Architecture Overview

The repository enforces clean architectural boundaries:
- **`app/`**: Next.js App Router endpoints and pages.
- **`features/`**: Domain logic (Payroll calculation, Employee models).
- **`lib/`**: Infrastructure utilities (Database, Auth tokens, API error handling).
- **`components/`**: Reusable React UI primitives (Shadcn/UI).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
