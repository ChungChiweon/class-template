# LoreAX Class 신규 수업 등록 가이드

이 문서는 루트 랜딩의 수업 카탈로그에 새 수업을 추가할 때 사용하는 기준입니다. 학생 수업 페이지, 보고서, AI API, Supabase, `/present/` 화면과는 별개로 메타데이터만 다룹니다.

## 1. 새 수업 추가 순서

1. `docs/course-registration-template.js`를 복사합니다.
2. `data-courses.js`의 `erpData.courses` 배열에 새 객체를 추가합니다.
3. `id`, `title`, `shortTitle`, `description`, `category`, `thumbnail`, `resultType`을 먼저 채웁니다.
4. 학생용 페이지가 아직 없으면 `studentUrl: ""`과 `status: "active"`를 사용해 준비 중 카드로 표시하거나, 공개하지 않을 경우 `status: "draft"`를 사용합니다.
5. 루트 페이지에서 검색, 카테고리, 정렬, 링크를 확인합니다.
6. 수업 내부 URL을 만든 뒤에는 기존 `id`, `studentUrl`, `reportUrl`을 함부로 바꾸지 않습니다.

## 2. 필수 필드와 선택 필드

모든 수업은 아래 필드를 갖습니다.

- `id`
- `title`
- `shortTitle`
- `description`
- `category`
- `tags`
- `tools`
- `lessons`
- `duration`
- `type`
- `resultType`
- `thumbnail`
- `studentUrl`
- `reportUrl`
- `featured`
- `isToday`
- `createdAt`
- `sortOrder`
- `target`
- `status`

`studentUrl`과 `reportUrl`은 페이지가 없으면 빈 문자열을 사용합니다.

## 3. id 작성 규칙

- 영문 소문자 기반으로 작성합니다.
- 새 수업은 `kebab-case`를 권장합니다.
- 이미 배포된 수업의 `id`는 localStorage 키와 연결될 수 있으므로 바꾸지 않습니다.
- 중복 `id`는 금지합니다.

## 4. category 허용값

아래 값 중 하나만 사용합니다.

- `AI 기초`
- `보고서·탐구`
- `이미지`
- `영상`
- `데이터`
- `진로`
- `홍보·마케팅`
- `기타`

알 수 없으면 `기타`를 사용합니다.

## 5. thumbnail 이미지 규격

- 권장 크기: `1200 x 750px`
- 비율: `16:10`
- 권장 포맷: `WebP`
- 경로 예: `assets/courses/sample-course.webp`
- 이미지 내부 텍스트는 넣지 않는 것을 권장합니다. 수업명과 설명은 HTML 텍스트로 표시합니다.
- 이미지가 없으면 `assets/empty/no-report.webp`로 fallback됩니다.

## 6. studentUrl 작성 규칙

- 학생이 직접 들어가는 수업 경로입니다.
- 예: `sessions/topic-research-report/`
- 아직 페이지가 없으면 빈 문자열 `""`로 둡니다.
- 기존 수업의 URL은 저장 데이터와 연결될 수 있으므로 바꾸지 않습니다.

## 7. reportUrl 처리

- 보고서 또는 결과물 화면이 있으면 경로를 입력합니다.
- 없으면 빈 문자열 `""`로 둡니다.
- 빈 문자열은 오류가 아니며, 루트 화면에서 안전하게 처리됩니다.

## 8. featured 사용 기준

`featured: true`인 수업은 Hero 슬라이더와 추천 영역에 우선 표시됩니다.

권장 기준:

- 실제 수업에 바로 사용할 수 있는 수업
- 대표 이미지가 준비된 수업
- 학생 진입 URL이 준비된 수업

## 9. isToday 사용 기준

`isToday: true`는 오늘의 수업으로 표시됩니다.

- 일반적으로 하나의 active 수업에만 사용합니다.
- 여러 개가 true이면 `sortOrder`가 가장 낮은 수업을 우선 표시합니다.

## 10. status 의미

- `active`: 공개 카탈로그에 표시
- `draft`: 공개 카탈로그에서 숨김
- `hidden`: 공개 카탈로그에서 숨김

초안 수업은 `draft`로 등록한 뒤, 이미지와 링크 확인 후 `active`로 바꿉니다.

## 11. 수업 추가 후 검증 방법

루트 페이지에서 확인합니다.

- Hero 슬라이더 표시
- 검색 결과 표시
- 카테고리 필터
- 정렬
- 오늘의 수업
- 이어서 하기
- 수업 링크
- 보고서 링크
- 모바일 390px 가로 넘침
- 한글 깨짐 없음
- 콘솔 오류 없음

정적 검사:

```bash
node --check data-courses.js
node --check script.js
node --check sw.js
```

## 12. 기존 학생 저장 데이터 주의

다음 값은 기존 학생 저장 데이터와 연결될 수 있으므로 변경에 주의합니다.

- `id`
- `studentUrl`
- `reportUrl`
- localStorage 키와 연결되는 lesson id

이미 수업에 사용한 뒤에는 가능한 한 유지합니다.

## 13. 샘플 수업

```js
{
  id: "ai-news-card",
  title: "AI 뉴스카드 제작 수업",
  shortTitle: "뉴스카드 제작",
  description: "사회 이슈를 조사하고 AI를 활용해 홍보용 뉴스카드 세트를 제작합니다.",
  category: "이미지",
  tags: ["뉴스카드", "사회", "홍보", "이미지"],
  tools: ["ChatGPT", "Canva"],
  lessons: 4,
  duration: "4차시",
  type: "실습형",
  resultType: "홍보용 뉴스카드 세트",
  thumbnail: "assets/courses/ai-news-card.webp",
  studentUrl: "",
  reportUrl: "",
  featured: false,
  isToday: false,
  createdAt: "2026-07-17",
  sortOrder: 999,
  target: ["중학생", "고등학생"],
  status: "draft"
}
```
