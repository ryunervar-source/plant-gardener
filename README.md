# 🌿 plant-gardener

집에서 키우는 화분 식물의 물 주기·비료·점검 일정을 한눈에 보고 기록하는 개인용 웹앱.
아이폰 사파리와 맥 브라우저에서 모두 잘 보이도록 **모바일 우선 반응형**으로 만들었습니다.

## 주요 기능

- **홈**: 식물 카드 목록 + "오늘 할 일" 요약(오늘 물 줄 식물, 점검 밀린 식물), 급수 급한 순 정렬
- **상세**: 계절 자동 전환 물주기, "물 줬어요 / 비료 줬어요" 기록, 관리 이력 타임라인(최근 20건)
- **주간 점검 체크리스트**: 공통 항목 + 식물별 특이 항목, 완료 시 7일 후 자동 예약, 점검 이력 저장
- **추가/편집/삭제**: 사진(자동 800px 압축), 계절별 물주기 등 전체 정보 편집
- **백업**: JSON 내보내기 / 가져오기
- 데이터는 브라우저 **localStorage**에만 저장 (서버 없음). 스키마 버전 필드로 마이그레이션 대비

초기 실행 시 식물 5종(치자나무·오렌지 자스민·무화과나무·로즈마리·몬스테라)이 기본 등록됩니다.

## 개발

```bash
npm install
npm run dev        # 개발 서버 (base '/' 로 로컬 실행하려면: VITE_BASE=/ npm run dev)
npm run build      # 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```

## 기술 스택

React 18 · Vite · React Router (HashRouter) · Tailwind CSS · localStorage

## GitHub Pages 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드·배포합니다.
저장소 **Settings → Pages → Source**를 **GitHub Actions**로 설정하세요.

`vite.config.js`의 `base`는 기본값이 `/plant-gardener/`(리포지토리 이름)입니다.
리포지토리 이름이 다르면 `VITE_BASE` 환경변수로 덮어쓸 수 있습니다.
