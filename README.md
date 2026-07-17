# LoreAX Class ERP

정적 HTML/CSS/JS 기반 수업 실행형 PWA입니다. React, Vite, Next.js, 빌드 시스템 없이 Vercel 정적 배포로 동작합니다.

## Supabase 실제 연결 순서

1. Supabase 프로젝트를 생성합니다.
2. Supabase SQL editor에서 `supabase/schema.sql`을 실행합니다.
3. Storage에서 `student-reports` 버킷을 생성합니다.
4. Realtime 대상 테이블에서 `student_sessions` 변경 이벤트가 활성화되어 있는지 확인합니다.
5. `lib/supabase-config.js`에 URL과 anonKey를 입력합니다.
6. `enabled: true`로 설정합니다.
7. Vercel에 재배포합니다.
8. `/diagnostics/`에서 연결 점검 버튼을 순서대로 실행합니다.
9. 태블릿은 `/sessions/ai-practice/`, 강사 PC는 `/present/`에 접속해 실기기 상태 표시를 확인합니다.

## Supabase 설정 파일

`lib/supabase-config.js`

```js
window.LOREAX_SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_PUBLIC_ANON_KEY",
  enabled: true
};
```

설정값이 비어 있거나 `enabled: false`이면 서버 호출을 하지 않고 기존 localStorage/mock 모드로 동작합니다.

## Supabase 데이터 구조

- `class_sessions`: lesson_id + session_date 기준 수업 회차
- `student_sessions`: 기기별 학생 접속 상태, 진행률, PDF 상태
- `student_reports`: 학생 보고서 JSON 백업
- Storage bucket `student-reports`: 생성된 PDF 파일

## 진단 화면

`/diagnostics/`

진단 화면은 학생 메뉴에 노출하지 않는 운영 점검용 화면입니다. 다음 테스트를 수동으로 실행할 수 있습니다.

- 연결 다시 확인
- 테스트 수업 세션 생성
- 테스트 presence 전송
- 테스트 보고서 저장
- 테스트 PDF Blob 업로드
- Realtime 구독 테스트
- 테스트 데이터 정리

진단 데이터는 다음 값으로만 생성됩니다.

- `lesson_id`: `__diagnostic_lesson__`
- `device_id`: `__diagnostic_device__`
- `student_name`: `__LOREAX_TEST__`

테스트 데이터 정리 버튼은 위 진단 데이터만 삭제하도록 구성되어 있습니다.

## PDF URL 방식

현재 앱은 `student-reports` 버킷 업로드 후 `getPublicUrl()` 결과를 `student_sessions.pdf_url`에 저장합니다. 강사 화면에서 PDF를 바로 열려면 버킷을 public으로 설정하세요.

비공개 버킷을 사용할 경우 `/diagnostics/`에서 signed URL 생성 가능 여부는 확인할 수 있지만, 현재 강사 화면의 PDF 보기 링크는 public URL 기준입니다.

## 보안 주의

- 현재 RLS는 수업용 MVP 정책입니다.
- 실제 외부 공개 서비스 전에는 인증, 수업별 접근 제어, RLS 정책을 강화해야 합니다.
- `service_role` 키는 절대 프론트엔드 파일에 넣지 마세요.
- 학생 연락처, 전화번호, 카카오톡 ID는 수집하지 않습니다.
- anonKey 전체 값은 화면이나 콘솔에 출력하지 않습니다.
