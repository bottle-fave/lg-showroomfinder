# LG Living Showroom

Vite 기반의 LG Living Showroom 프로젝트입니다. OMS 환경에서 사용할 수 있도록 HTML, CSS, JavaScript가 분리되어 있습니다.

## 사용 기술

- **Vite** - 빌드 도구
- **Swiper** - 슬라이더 라이브러리
- **GSAP** - 애니메이션 라이브러리

## 프로젝트 구조

```
lg_living_showroom/
├── index.html          # 메인 HTML 파일
├── src/
│   ├── css/
│   │   └── style.css   # 스타일시트
│   └── js/
│       └── main.js     # JavaScript 로직
├── package.json        # 프로젝트 설정
├── vite.config.js      # Vite 설정
└── README.md          # 프로젝트 설명
```

## 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **빌드 결과 미리보기**
   ```bash
   npm run preview
   ```

## OMS 환경에서 사용하기

빌드 후 `dist` 폴더의 파일들을 OMS 환경에 업로드하여 사용할 수 있습니다:

- `index.html` - HTML 소스
- `assets/style.css` - CSS 소스
- `assets/main-[hash].js` - JavaScript 소스

## 주요 기능

### Swiper 슬라이더
- 자동 재생 (5초 간격)
- 페이드 효과
- 페이지네이션
- 네비게이션 버튼
- 키보드/터치 네비게이션

### GSAP 애니메이션
- 슬라이드 전환 시 텍스트 애니메이션
- 페이지 로드 애니메이션
- 부드러운 이징 효과

## 커스터마이징

### 슬라이드 추가/수정
`index.html`의 `.swiper-wrapper` 내부에 새로운 `.swiper-slide` 요소를 추가하세요.

### 스타일 수정
`src/css/style.css`에서 색상, 크기, 애니메이션 등을 수정할 수 있습니다.

### JavaScript 기능 확장
`src/js/main.js`에서 Swiper 설정이나 GSAP 애니메이션을 추가/수정할 수 있습니다.

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

이 프로젝트는 LG Living Showroom 전용으로 제작되었습니다. 