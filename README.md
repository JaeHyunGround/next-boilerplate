# next-boilerplate

사내 프로젝트를 위한 Next.js 보일러플레이트. 테스트, 모니터링, CI/CD까지 포함된 프로덕션 레디 스타터.

<br />

## 목차

1. [기술 스택](#기술-스택)
2. [시작하기](#시작하기)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처 결정](#아키텍처-결정)
5. [스크립트](#스크립트)
6. [테스트](#테스트)
7. [Storybook & 시각적 테스트](#storybook--시각적-테스트)
8. [코드 품질](#코드-품질)
9. [CI/CD](#cicd)
10. [에러 모니터링 (Sentry)](#에러-모니터링-sentry)
11. [환경변수](#환경변수)

<br />

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | [Next.js](https://nextjs.org/) (App Router) | 16 |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) | 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | 4 |
| Server State | [TanStack Query](https://tanstack.com/query) | 5 |
| Client State | [Zustand](https://zustand.docs.pmnd.rs/) | 5 |
| Schema Validation | [Zod](https://zod.dev/) | 4 |
| Unit Test | [Vitest](https://vitest.dev/) | 4 |
| E2E Test | [Playwright](https://playwright.dev/) | 1.58 |
| API Mocking | [MSW](https://mswjs.io/) | 2 |
| Component Dev | [Storybook](https://storybook.js.org/) | 10 |
| Visual Regression | [Chromatic](https://www.chromatic.com/) | - |
| Monitoring | [Sentry](https://sentry.io/) | 10 |
| Linter | [ESLint](https://eslint.org/) | 9 |
| Formatter | [Prettier](https://prettier.io/) | 3 |
| Git Hooks | [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | - |

<br />

## 시작하기

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+

### 설치 & 실행

```bash
# 1. 레포 clone
git clone <your-repo-url>
cd <project-name>

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env
cp .env.sentry-build-plugin.example .env.sentry-build-plugin

# 4. 개발 서버 실행
pnpm dev
```

> Sentry DSN 없이도 개발 서버는 정상 실행됩니다.

<br />

## 프로젝트 구조

```
src/
├── app/                     # App Router 페이지
│   ├── layout.tsx           # 루트 레이아웃 (QueryProvider 포함)
│   ├── page.tsx             # 홈 페이지
│   ├── globals.css          # 전역 스타일 (Tailwind)
│   └── global-error.tsx     # 전역 에러 UI (Sentry 연동)
├── components/              # 공통 컴포넌트
│   └── [Feature]/
│       ├── Feature.tsx
│       └── Feature.stories.tsx
├── providers/               # React Context Providers
│   └── query-provider.tsx   # TanStack Query 설정
├── mocks/                   # MSW 핸들러
│   ├── handlers.ts          # API 모킹 핸들러 정의
│   └── node.ts              # Node.js 환경용 서버
├── instrumentation.ts       # Sentry 서버 초기화
└── instrumentation-client.ts # Sentry 클라이언트 초기화

e2e/                         # Playwright E2E 테스트
.storybook/                  # Storybook 설정
.github/workflows/           # GitHub Actions CI/CD
```

<br />

## 아키텍처 결정

### 왜 TanStack Query + Zustand인가?

서버 상태와 클라이언트 상태를 명확히 분리한다.

- **TanStack Query**: API 응답 캐싱, 자동 refetch, 무한 스크롤 등 서버 상태 관리
- **Zustand**: UI 상태, 폼 상태 등 클라이언트 전용 상태 관리

두 도구를 조합하면 Redux 같은 단일 스토어 대비 보일러플레이트 코드가 적고, 각 도구가 가장 잘하는 영역에 집중할 수 있다.

### 왜 Vitest인가?

- Vite 기반으로 빠른 실행 속도
- Storybook의 Vitest addon과 네이티브 통합 (스토리를 테스트로 재사용)
- ESM 지원이 Jest보다 안정적

### 왜 MSW인가?

- 네트워크 레벨에서 API를 가로채므로 fetch/axios 등 구현에 비의존적
- 동일한 핸들러를 Vitest 단위 테스트와 Storybook 스토리에서 공유 가능
- Service Worker 기반이므로 브라우저 DevTools Network 탭에서 모킹된 요청 확인 가능

### 왜 Storybook + Chromatic인가?

- 컴포넌트를 독립 환경에서 개발하고 시각적으로 문서화
- Chromatic이 PR마다 시각적 변경을 자동 감지하여 의도하지 않은 UI 변경 방지
- Storybook Vitest addon으로 스토리가 곧 테스트가 됨 (별도 테스트 작성 불필요)

<br />

## 스크립트

| 커맨드 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
| `pnpm type-check` | TypeScript 타입 검사 |
| `pnpm test` | 단위 테스트 (Vitest, watch 모드) |
| `pnpm test:run` | 단위 테스트 (1회 실행) |
| `pnpm test:e2e` | E2E 테스트 (Playwright) |
| `pnpm test:e2e:ui` | E2E 테스트 UI 모드 |
| `pnpm storybook` | Storybook 개발 서버 (포트 6006) |
| `pnpm build-storybook` | Storybook 정적 빌드 |
| `pnpm chromatic` | Chromatic에 스토리 게시 |

<br />

## 테스트

### 단위 테스트 (Vitest)

```bash
pnpm test         # watch 모드
pnpm test:run     # 1회 실행 + 커버리지
```

- 테스트 파일: `src/**/*.test.{ts,tsx}`
- 설정: `vitest.config.mts`
- 환경: jsdom
- Storybook 스토리도 Vitest 프로젝트로 자동 실행 (`storybook` 프로젝트)

### E2E 테스트 (Playwright)

```bash
pnpm test:e2e      # headless 실행
pnpm test:e2e:ui   # UI 모드 (디버깅용)
```

- 테스트 파일: `e2e/**/*.spec.ts`
- 설정: `playwright.config.ts`
- 브라우저: Chromium, Firefox, WebKit
- 로컬에서는 `pnpm dev`, CI에서는 `pnpm start`로 서버 실행

### API 모킹 (MSW)

`src/mocks/handlers.ts`에 API 핸들러를 정의하면 Vitest와 Storybook에서 공유된다.

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/example', () => {
    return HttpResponse.json({ message: 'mocked response' });
  }),
];
```

<br />

## Storybook & 시각적 테스트

### 로컬 실행

```bash
pnpm storybook
```

`http://localhost:6006`에서 컴포넌트를 브라우저에서 독립적으로 확인할 수 있다.

### 스토리 작성

스토리 파일은 컴포넌트와 같은 디렉토리에 위치시킨다.

```
src/components/Button/
├── Button.tsx
└── Button.stories.tsx
```

### Chromatic (시각적 회귀 테스트)

- `main` push 및 모든 PR에서 자동 실행 (`.github/workflows/chromatic.yml`)
- `main` 브랜치의 변경은 자동 승인 (`autoAcceptChanges`)
- PR에서 시각적 변경이 감지되면 Chromatic UI에서 리뷰 후 승인/거부

<br />

## 코드 품질

### ESLint & Prettier

- ESLint: `next/core-web-vitals` + `next/typescript` + `storybook` + `prettier` 규칙
- Prettier: 설정은 `.prettierrc.json`

```bash
pnpm lint         # ESLint 검사
```

### Husky & lint-staged

`git commit` 시 자동 실행:

| 대상 파일 | 실행 커맨드 |
|-----------|------------|
| `*.{js,jsx,ts,tsx}` | `eslint --fix` → `prettier --write` |
| `*.{json,css,md}` | `prettier --write` |

### 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 규칙을 따른다.

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 리팩토링
chore: 빌드, 패키지 등 기타 변경
docs: 문서 변경
test: 테스트 추가/수정
```

<br />

## CI/CD

### CI Pipeline (`.github/workflows/ci.yml`)

`main`/`prod` 브랜치의 push 및 PR에서 실행:

```
Lint (ESLint) → Type Check (tsc) → Unit Test (Vitest) → Build → E2E Test (Playwright)
```

### Chromatic (`.github/workflows/chromatic.yml`)

`main` push 및 모든 PR에서 실행. Storybook 스토리의 시각적 변경을 감지한다.

> 두 워크플로우 모두 pnpm store 캐시를 사용하여 반복 실행 시 설치 시간을 단축한다.

<br />

## 에러 모니터링 (Sentry)

프로젝트에 Sentry가 사전 설정되어 있다.

### 설정 파일

| 파일 | 역할 |
|------|------|
| `sentry.server.config.ts` | 서버 사이드 Sentry 초기화 |
| `sentry.edge.config.ts` | Edge Runtime Sentry 초기화 |
| `src/instrumentation.ts` | Next.js instrumentation hook (서버/에지 분기) |
| `src/instrumentation-client.ts` | 클라이언트 사이드 Sentry 초기화 |
| `src/app/global-error.tsx` | 전역 에러 UI + Sentry 에러 전송 |
| `next.config.ts` | Sentry webpack plugin (source map 업로드) |

### 활성화 방법

1. [Sentry](https://sentry.io/)에서 프로젝트 생성
2. `.env`에 `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` 설정
3. `.env.sentry-build-plugin`에 `SENTRY_AUTH_TOKEN` 설정

> DSN을 설정하지 않으면 Sentry는 비활성 상태로 동작하며 에러가 발생하지 않는다.

<br />

## 환경변수

| 변수 | 설명 | 필수 |
|------|------|:----:|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (클라이언트/서버 공용) | 선택 |
| `SENTRY_ORG` | Sentry 조직 slug | 선택 |
| `SENTRY_PROJECT` | Sentry 프로젝트 slug | 선택 |
| `SENTRY_AUTH_TOKEN` | Sentry Auth Token (source map 업로드용) | 선택 |
| `CHROMATIC_PROJECT_TOKEN` | Chromatic 프로젝트 토큰 | 선택 |

- `.env.example`과 `.env.sentry-build-plugin.example`을 복사하여 실제 값을 채운다.
- 모든 환경변수는 선택사항이며, 설정하지 않아도 개발 서버는 정상 동작한다.
