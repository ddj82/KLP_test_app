# TestApp

React Native + Expo 기반의 모바일 애플리케이션입니다.

## 📱 프로젝트 개요

TypeScript와 NativeWind(Tailwind CSS)를 사용하여 개발된 크로스 플랫폼 모바일 앱입니다. Expo Router를 통한 파일 기반 라우팅과 Zustand를 활용한 상태 관리를 제공합니다.

## 🛠 기술 스택

- **Framework**: React Native (0.79.6) + Expo (v53)
- **Language**: TypeScript
- **Navigation**: Expo Router v5
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Storage**: AsyncStorage, Expo SecureStore

## ⚙️ 설치 및 실행

### 필수 요구사항
- Node.js (18 이상)
- npm 또는 yarn
- Expo CLI
- Android Studio (Android 개발 시)
- Xcode (iOS 개발 시)

### 설치
```bash
# 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

### 개발 서버 실행
```bash
# 개발 서버 시작
npm start

# 특정 플랫폼으로 실행
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

### 테스트 실행
```bash
npm test
```

## 📁 프로젝트 구조

```
testApp/
├── app/                    # Expo Router 페이지들
│   ├── (tabs)/            # 탭 네비게이션 페이지들
│   └── _layout.tsx        # 루트 레이아웃
├── assets/                # 이미지, 폰트 등 정적 파일들
├── components/            # 재사용 가능한 컴포넌트들
├── constants/             # 상수 정의
├── lib/                   # 유틸리티 라이브러리
├── stores/                # Zustand 상태 저장소
├── types/                 # TypeScript 타입 정의
├── app.json              # Expo 설정
├── package.json          # 패키지 의존성
├── tailwind.config.js    # Tailwind CSS 설정
└── tsconfig.json         # TypeScript 설정
```

## 🌐 API 설정

프로젝트는 다음과 같은 API 엔드포인트를 지원합니다:

- **iOS 시뮬레이터**: `http://localhost:7979/api`
- **Android 에뮬레이터**: `http://10.0.2.2:7979/api`
- **물리 디바이스**: `http://[YOUR_IP]:7979/api`

## 🚀 주요 기능

- 📱 크로스 플랫폼 지원 (iOS, Android, Web)
- 🎨 NativeWind를 통한 Tailwind CSS 스타일링
- 🧭 Expo Router 기반 네비게이션
- 🗃️ Zustand 상태 관리
- 📁 파일 및 이미지 선택 기능
- 📅 날짜/시간 처리 (dayjs)

## 📝 가이드

### 새로운 페이지 추가
`app/` 디렉토리에 새로운 파일을 생성하면 자동으로 라우트가 생성됩니다.


### 스타일링
NativeWind를 사용하여 Tailwind CSS 클래스로 스타일링이 가능합니다:

```tsx
<View className="flex-1 justify-center items-center bg-white">
  <Text className="text-lg font-bold text-blue-500">Hello World</Text>
</View>
```

### 상태 관리
Zustand를 사용하여 전역 상태를 관리합니다:

```typescript
import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
}

export const useStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## 🔧 설정 파일들

- `app.json`: Expo 앱 설정
- `tailwind.config.js`: Tailwind CSS 설정
- `tsconfig.json`: TypeScript 컴파일러 설정
- `metro.config.js`: Metro 번들러 설정

