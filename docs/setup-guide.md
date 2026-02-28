# Setup Guide

보일러플레이트를 clone한 뒤 새 프로젝트로 세팅하는 전체 과정을 안내한다.

<br />

## 목차

1. [프로젝트 초기화](#1-프로젝트-초기화)
2. [환경변수 설정](#2-환경변수-설정)
3. [Sentry 연동](#3-sentry-연동)
4. [Chromatic 연동](#4-chromatic-연동)
5. [GitHub Repository 설정](#5-github-repository-설정)
6. [배포 설정 (Vercel)](#6-배포-설정-vercel)
7. [정리 체크리스트](#7-정리-체크리스트)

<br />

## 1. 프로젝트 초기화

### 레포 clone

```bash
git clone https://github.com/<org>/next-boilerplate.git my-project
cd my-project
git remote set-url origin https://github.com/<org>/my-project.git
```

### Node.js 버전 맞추기

프로젝트 루트의 `.nvmrc`에 Node.js 버전이 지정되어 있다.

```bash
nvm use
```

> nvm이 설치되어 있지 않다면 `.nvmrc` 파일에 명시된 버전을 수동으로 설치한다.

### `package.json` 수정

`name` 필드를 새 프로젝트 이름으로 변경한다.

```jsonc
{
  "name": "my-project", // "next-boilerplate" → 변경
  "version": "0.1.0",
  "private": true,
}
```

### metadata 수정

`src/app/layout.tsx`의 metadata를 프로젝트에 맞게 변경한다.

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'My Project', // 프로젝트 이름
  description: '프로젝트 설명', // 프로젝트 설명
};
```

### 의존성 설치 및 실행 확인

```bash
pnpm install
pnpm dev
```

`http://localhost:3000`에 접속하여 정상 동작을 확인한다.

<br />

## 2. 환경변수 설정

example 파일을 복사하여 실제 환경변수 파일을 생성한다.

```bash
cp .env.example .env
cp .env.sentry-build-plugin.example .env.sentry-build-plugin
```

### `.env`

| 변수                      | 설명                              | 필수 |
| ------------------------- | --------------------------------- | :--: |
| `NEXT_PUBLIC_SENTRY_DSN`  | Sentry DSN (클라이언트/서버 공용) | 선택 |
| `SENTRY_ORG`              | Sentry 조직 slug                  | 선택 |
| `SENTRY_PROJECT`          | Sentry 프로젝트 slug              | 선택 |
| `CHROMATIC_PROJECT_TOKEN` | Chromatic 프로젝트 토큰           | 선택 |

### `.env.sentry-build-plugin`

| 변수                | 설명                                    | 필수 |
| ------------------- | --------------------------------------- | :--: |
| `SENTRY_AUTH_TOKEN` | Sentry Auth Token (source map 업로드용) | 선택 |

> 모든 환경변수는 선택사항이며, 설정하지 않아도 개발 서버는 정상 동작한다.

<br />

## 3. Sentry 연동

### 3-1. Sentry 프로젝트 생성

1. [sentry.io](https://sentry.io/)에 로그인
2. **Projects → Create Project** 클릭
3. Platform으로 **Next.js** 선택
4. 프로젝트 이름 입력 후 생성

### 3-2. DSN 확인 및 `.env`에 입력

1. 생성된 프로젝트의 **Settings → Client Keys (DSN)** 으로 이동
2. DSN 값을 복사하여 `.env`에 입력

```
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

### 3-3. 조직/프로젝트 slug 입력

Sentry 대시보드 URL에서 조직과 프로젝트 slug를 확인할 수 있다.
`https://sentry.io/organizations/{org-slug}/projects/{project-slug}/`

```
SENTRY_ORG=my-org
SENTRY_PROJECT=my-project
```

### 3-4. Auth Token 발급

Source map 업로드를 위해 Auth Token이 필요하다.

1. [sentry.io/settings/auth-tokens](https://sentry.io/settings/auth-tokens/) 으로 이동
2. **Create New Token** 클릭
3. 필요한 scope: `project:releases`, `org:read`
4. 생성된 토큰을 `.env.sentry-build-plugin`에 입력

```
SENTRY_AUTH_TOKEN=sntrys_eyJpYXQ...
```

### 3-5. 동작 확인

```bash
pnpm build
```

빌드 로그에서 Sentry source map 업로드가 정상적으로 수행되는지 확인한다. 빌드 후 Sentry 대시보드의 **Releases** 탭에서 새 릴리스가 생성되었는지 확인한다.

> DSN을 설정하지 않으면 Sentry는 비활성 상태로 동작하며 에러가 발생하지 않는다.

<br />

## 4. Chromatic 연동

### 4-1. Chromatic 프로젝트 연결

1. [chromatic.com](https://www.chromatic.com/)에 로그인
2. **Add Project** 클릭
3. GitHub 레포지토리를 연결

### 4-2. Project Token 확인

1. 프로젝트 연결 후 표시되는 **Project Token**을 복사
2. `.env`에 입력

```
CHROMATIC_PROJECT_TOKEN=chpt_xxxxxxxxxxxx
```

### 4-3. 동작 확인

```bash
pnpm chromatic
```

Chromatic 대시보드에서 Storybook 스냅샷이 업로드되었는지 확인한다.

<br />

## 5. GitHub Repository 설정

### 5-1. Repository Secrets 추가

CI/CD 워크플로우에서 사용하는 토큰을 GitHub Secrets에 등록한다.

1. GitHub 레포지토리의 **Settings → Secrets and variables → Actions** 으로 이동
2. **New repository secret** 클릭 후 아래 값들을 추가

| Secret 이름               | 값                      | 사용처                            |
| ------------------------- | ----------------------- | --------------------------------- |
| `CHROMATIC_PROJECT_TOKEN` | Chromatic 프로젝트 토큰 | `.github/workflows/chromatic.yml` |

> Sentry는 빌드 시 `.env.sentry-build-plugin`에서 토큰을 읽으므로, Vercel 등 배포 플랫폼의 환경변수에서 설정한다. GitHub Actions CI에서는 source map 업로드가 불필요하므로 별도 설정이 필요 없다.

### 5-2. CI/CD 워크플로우 동작 확인

PR을 생성하거나 `main` 브랜치에 push하면 아래 워크플로우가 자동 실행된다.

- **CI Pipeline** (`.github/workflows/ci.yml`): Lint → Type Check → Unit Test → Build → E2E Test
- **Chromatic** (`.github/workflows/chromatic.yml`): Storybook 시각적 회귀 테스트

GitHub **Actions** 탭에서 워크플로우 실행 결과를 확인한다.

<br />

## 6. 배포 설정 (Vercel)

### 6-1. Vercel 프로젝트 연결

```bash
# Vercel CLI 설치 (전역)
pnpm add -g vercel

# 프로젝트 연결
vercel link
```

또는 [vercel.com](https://vercel.com/) 대시보드에서 **Add New Project → Import Git Repository**로 연결한다.

### 6-2. 환경변수 설정

Vercel 대시보드의 **Settings → Environment Variables**에서 아래 변수를 설정한다.

| 변수                     | 환경                | 설명                 |
| ------------------------ | ------------------- | -------------------- |
| `NEXT_PUBLIC_SENTRY_DSN` | Production, Preview | Sentry DSN           |
| `SENTRY_ORG`             | Production, Preview | Sentry 조직 slug     |
| `SENTRY_PROJECT`         | Production, Preview | Sentry 프로젝트 slug |
| `SENTRY_AUTH_TOKEN`      | Production, Preview | Sentry Auth Token    |

> Chromatic은 GitHub Actions에서만 실행되므로 Vercel에 토큰을 설정할 필요 없다.

### 6-3. 배포 확인

```bash
# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```

배포 완료 후 Sentry 에러 전송 및 source map이 정상적으로 동작하는지 확인한다.

<br />

## 7. 정리 체크리스트

모든 단계를 완료했는지 확인한다.

### 프로젝트 초기화

- [ ] 레포 clone 또는 template으로 생성
- [ ] `package.json`의 `name` 변경
- [ ] `src/app/layout.tsx`의 metadata 변경
- [ ] `nvm use`로 Node.js 버전 맞추기
- [ ] `pnpm install` 및 `pnpm dev`로 실행 확인

### 환경변수

- [ ] `.env.example` → `.env` 복사
- [ ] `.env.sentry-build-plugin.example` → `.env.sentry-build-plugin` 복사

### Sentry

- [ ] Sentry 프로젝트 생성
- [ ] `NEXT_PUBLIC_SENTRY_DSN` 설정
- [ ] `SENTRY_ORG`, `SENTRY_PROJECT` 설정
- [ ] `SENTRY_AUTH_TOKEN` 설정
- [ ] `pnpm build`로 source map 업로드 확인

### Chromatic

- [ ] Chromatic 프로젝트 연결
- [ ] `CHROMATIC_PROJECT_TOKEN` 설정
- [ ] `pnpm chromatic`으로 동작 확인

### GitHub

- [ ] Repository Secret에 `CHROMATIC_PROJECT_TOKEN` 추가
- [ ] CI Pipeline 워크플로우 정상 동작 확인
- [ ] Chromatic 워크플로우 정상 동작 확인

### 배포

- [ ] Vercel 프로젝트 연결
- [ ] Vercel 환경변수 설정 (Sentry 관련)
- [ ] 배포 및 동작 확인
