1. أول تشخيص معماري

الوضع الحالي تقريبًا:

app/
├── page.js                 ❌ كل الـDashboard تقريبًا هنا
├── layout.js
├── globals.css
└── api/
    └── [[...path]]/
        └── route.js        ❌ كل الـAPI + DB + business logic هنا

components/
└── ui/                     ✅ shadcn primitives

hooks/
├── use-mobile.jsx
└── use-toast.js

lib/
└── utils.js

.env                       ❌ committed
backend_test.py
test_result.md

والـpackage.json نفسه اسمه nextjs-mongo-template، رغم أن المشروع PayTrack؛ وده مؤشر إن فيه template leftovers محتاجة cleanup. كما أن المشروع يستخدم عددًا كبيرًا من Radix packages، بينما الـactual application usage الظاهر في الصفحة الحالية محدود نسبيًا.

أكبر مشكلة

app/page.js حاليًا مسؤول عن:

UI
state
API calls
employee form
payroll actions
filtering
calculations for dashboard display
loading behavior
table rendering
dialogs
domain-specific terminology

يعني عندك فعليًا:

Page
 ├── Presentation
 ├── State Management
 ├── Data Access
 ├── Feature Logic
 └── Domain behavior

وده ضد SRP بشكل واضح.

2. هل نحتاج Clean Architecture هنا؟

أنا لا أنصح بعمل Clean Architecture ضخمة بنفس شكل .NET backend.

المناسب للتطبيق ده:

Next.js App Router + Feature-Based Modular Architecture + clear domain/application/infrastructure boundaries

يعني نستفيد من مبادئ Clean Architecture وSOLID بدون over-engineering.

الشكل المستهدف:

src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── employees/
│   │   │   └── page.jsx
│   │   ├── payroll/
│   │   │   └── page.jsx
│   │   └── analytics/
│   │       └── page.jsx
│   │
│   ├── api/
│   │   ├── employees/
│   │   ├── payroll/
│   │   ├── dashboard/
│   │   └── analytics/
│   │
│   ├── layout.jsx
│   ├── page.jsx
│   ├── loading.jsx
│   ├── error.jsx
│   ├── not-found.jsx
│   └── globals.css
│
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── constants/
│   │
│   ├── employees/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── constants/
│   │
│   ├── payroll/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── domain/
│   │   ├── types/
│   │   └── constants/
│   │
│   └── analytics/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── shared/
│   └── feedback/
│
├── lib/
│   ├── db/
│   │   ├── client.js
│   │   └── collections.js
│   ├── http/
│   ├── validation/
│   ├── errors/
│   ├── formatting/
│   └── utils.js
│
├── config/
│   ├── app.js
│   ├── navigation.js
│   └── environment.js
│
├── providers/
│   └── providers.jsx
│
└── styles/
    ├── tokens.css
    └── components.css
3. الـAPI الحالية محتاجة Refactoring قوي

دلوقتي عندك:

/api/[[...path]]/route.js

وفيه:

MongoClient
UUID
CORS
Payroll calculation
Employee CRUD
Payroll CRUD
Dashboard statistics
Department analytics
Error handling
Routing

كل ده في ملف واحد.

وده أكبر architectural smell في المشروع.

مثلاً:

if (route === '/employees' && method === 'GET') {
   ...
}

if (route === '/employees' && method === 'POST') {
   ...
}

if (route === '/payroll/calculate' && method === 'POST') {
   ...
}

ده manual router داخل Next.js.

الأفضل:

app/api/
├── employees/
│   ├── route.js
│   └── [id]/
│       └── route.js
│
├── payroll/
│   ├── route.js
│   ├── calculate/
│   │   └── route.js
│   └── employee/
│       └── [employeeId]/
│           └── route.js
│
├── dashboard/
│   └── stats/
│       └── route.js
│
└── analytics/
    └── departments/
        └── route.js

ثم:

API Route
   ↓
Application Service
   ↓
Repository / Data Access
   ↓
MongoDB
4. SOLID المطلوب تطبيقه
S — Single Responsibility

بدل:

page.js
  500+ lines

نقسم:

DashboardPage
DashboardStats
PayrollSummary
EmployeeTable
EmployeeDialog
PayrollTable
PeriodSelector
SearchInput

وبالنسبة للـbackend:

employees route
employee service
employee repository

payroll route
payroll service
payroll calculator
payroll repository
O — Open/Closed

الـpayroll calculation حاليًا:

if (grossSalary > 5000) {
    taxAmount = grossSalary * 0.15
} else {
    taxAmount = grossSalary * 0.10
}

ده hardcoded business rule.

الأفضل:

PayrollCalculator
TaxStrategy
AllowanceCalculator
DeductionCalculator

مثلاً:

Payroll
 ├── PayrollCalculator
 ├── TaxCalculator
 ├── AllowanceCalculator
 └── DeductionCalculator

مش لازم تعمل Strategy Pattern لكل حاجة؛ استخدم abstraction لما يكون فيه real variation.

5. مشكلة الـHardcoded Values

عندك مثلًا:

const [selectedPeriod, setSelectedPeriod] = useState('2024-06')

وعندك:

2024-06
2024-05
2024-04

وده واضح إنه demo data.

كمان:

HR
Engineering
Marketing
Sales
Finance

والـcurrency:

$

والـtax:

15%
10%
5000

كل دي لازم تتراجع.

لكن مهم:

مش معنى إن الرقم موجود في code إنه لازم يتحول إلى environment variable.

الـconfiguration غير الـbusiness rules.

مثلاً:

Environment configuration
→ env

UI constants
→ constants/

Business rules
→ domain/

Static navigation
→ config/

User/data
→ database/API
6. أهم Security Problem

في .env موجود:

MONGO_URL=mongodb://localhost:27017
DB_NAME=your_database_name

حتى لو مفيش secret حقيقي حاليًا، .env نفسه committed.

ده لازم يتشال من repository ويكون:

.env.local
.env.development.local
.env.production.local

مع:

.env*
!.env.example

في .gitignore.

وتعمل:

.env.example

مثلاً:

MONGO_URL=
DB_NAME=
NEXT_PUBLIC_BASE_URL=
7. CORS الحالي خطر وغير منطقي

عندك:

Access-Control-Allow-Origin: *

وفي نفس الوقت:

Access-Control-Allow-Credentials: true

وده configuration لازم يتراجع جذريًا.

كمان next.config.js فيه:

X-Frame-Options: ALLOWALL
Content-Security-Policy: frame-ancestors *
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: *

دي مش production-grade defaults.

خصوصًا:

frame-ancestors *

يعني السماح بتضمين الموقع داخل أي origin تقريبًا.

الـagent لازم يعمل security review بدل مجرد حذف headers عشوائيًا.

8. Error Handling

حاليًا:

catch (error) {
   return NextResponse.json({
      error: "Internal server error",
      details: error.message
   })
}

ده لا يصلح production API.

لازم:

Internal Error
     ↓
Server logs
     ↓
Generic client response

يعني client لا يحصل على:

error.message

لو ممكن يحتوي implementation/database information.

9. Validation ناقصة

عندك:

const body = await request.json()

وبعدين:

body.name
body.email
body.baseSalary

بدون schema validation.

وأنت أصلًا عندك:

zod

موجود في dependencies.

استخدمه فعليًا:

schemas/
├── employee.schema.js
└── payroll.schema.js

مثلاً:

CreateEmployeeSchema
CalculatePayrollSchema
EmployeeQuerySchema
PayrollQuerySchema
10. Data Access

حاليًا الـroute نفسه يعمل:

db.collection('employees').find(...)

وده coupling مباشر:

HTTP → MongoDB

الأفضل:

HTTP
 ↓
Service
 ↓
Repository
 ↓
MongoDB

مثلاً:

EmployeeRepository
 ├── getAll()
 ├── getById()
 └── create()

PayrollRepository
 ├── getByPeriod()
 ├── getByEmployee()
 └── create()

مش لازم تعمل generic repository.

أنا لا أنصح بـ:

GenericRepository<T>
BaseRepository<T>
IRepository<T>

هنا؛ هيضيف abstraction بدون قيمة حقيقية.

11. Database Connection

عندك:

let client
let db

داخل route module.

الأفضل centralize:

lib/db/client.js

ويكون فيه connection reuse مناسب لـNext.js development/server runtime.

وكمان:

lib/db/collections.js

لمنع:

db.collection('employees')

مكرر في كل مكان.

12. الصفحة الرئيسية

دلوقتي / هي الـdashboard مباشرة.

أنا أفضل:

/
  ↓
Dashboard

لكن dashboard نفسه يبقى composition:

DashboardPage
│
├── DashboardHeader
├── Date/PeriodFilter
├── KPIGrid
│   ├── EmployeesCard
│   ├── PayrollCard
│   ├── AverageSalaryCard
│   └── ProcessedPayrollCard
│
├── PayrollOverview
├── DepartmentOverview
├── RecentPayroll
└── EmployeeOverview

وده يخلي الـHome Page فعلاً dashboard وليس 20 مسؤولية في component واحد.

13. UI / Design System

هنا محتاج cleanup واضح.

components/ui فيه عدد كبير جدًا من components:

accordion
alert-dialog
aspect-ratio
avatar
calendar
carousel
chart
checkbox
...
sidebar
...

وده غالبًا نتيجة scaffold/shadcn generation.

مش مطلوب تحذفهم لمجرد إنهم كتير.

اعمل audit:

Used
Unused
Potentially reusable
Feature-specific

واحذف unused components بعد static usage analysis.

14. Styles

globals.css فيه legacy React styles:

.App
.App-logo
.App-header
.App-link
@keyframes App-logo-spin

ودي واضح إنها leftovers من Create React App/template.

لازم تتحذف.

كمان CSS tokens موجودة، وده جيد، لكن محتاج تتحول إلى Design System منظم:

styles/
├── tokens.css
├── globals.css
└── utilities.css

مع centralized:

colors
spacing
radius
shadows
typography
transitions
layout

والـcomponents تستخدم tokens بدل values عشوائية.

15. Modern Dashboard UI

أنا أقترح visual direction:

PayTrack
│
├── Left Sidebar
│   ├── Overview
│   ├── Employees
│   ├── Payroll
│   ├── Analytics
│   └── Settings
│
├── Topbar
│   ├── Search
│   ├── Notifications
│   ├── Theme
│   └── Profile
│
└── Main
    ├── KPI cards
    ├── Payroll trend
    ├── Department distribution
    ├── Recent payroll
    └── Employee activity

مش مجرد:

Header
4 Cards
Tabs
Tables
16. Images / Logo / Favicon

حاليًا layout.js لا يحتوي على favicon/image configuration.

لازم نعمل:

public/
├── brand/
│   ├── logo.svg
│   ├── logo-mark.svg
│   └── logo-white.svg
│
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.ico
│
└── images/
    └── ...

وفي Next:

app/
├── icon.svg
├── apple-icon.png
└── favicon.ico

حسب asset strategy.

لكن ما نحطش صور decorative عشوائية. كل asset لازم يكون له purpose.

17. Dependencies

عندك packages كتير جدًا.

مثلاً عندك:

@radix-ui/*

عدد كبير، بالإضافة إلى:

embla-carousel
vaul
input-otp
react-day-picker
react-resizable-panels
cmdk
...

مش هقول للـagent:

احذف كل package مش مستخدمة

لأن ده ممكن يكسر components الموجودة.

المطلوب:

1. Detect actual imports
2. Map package → usage
3. Remove truly unused packages
4. Remove corresponding unused UI components
5. Run build
6. Run lint/type/static checks
7. Verify runtime
18. أهم Architecture Rule

خلي الـdependency direction:

app
 ↓
features
 ↓
lib / infrastructure

لكن:

UI component
❌ directly access MongoDB
❌ contain business rules
❌ know database structure

والـAPI:

Route
 ↓
Validation
 ↓
Service
 ↓
Repository
 ↓
Database
19. الـPrompt اللي أنصح إنك تستخدمه

بدل prompt واحد ضخم فقط، اعمل:

.agent/
└── skills/
    ├── 00-master-refactoring.md
    ├── 01-architecture.md
    ├── 02-solid.md
    ├── 03-api-backend.md
    ├── 04-database.md
    ├── 05-security.md
    ├── 06-ui-design-system.md
    ├── 07-assets-branding.md
    ├── 08-cleanup-hardcoded.md
    ├── 09-testing-quality.md
    └── 10-final-verification.md

وده أفضل جدًا من prompt واحد لأن الـagent يقدر ينفذ workflow مرحلي.
