# LoreAX 업체별 수업 패키지 및 사용량 집계 구조

## 1. tenant 개념

`tenant`는 LoreAX Class를 사용하는 교육업체 또는 기관 단위다. 기존 단일 환경은 `default` tenant로 자동 해석한다.

tenant 결정 우선순위:

1. URL query의 `tenant`
2. localStorage의 `loreax:tenantId`
3. 배포 환경의 기본 tenant
4. `default`

기존 공개 수업 URL과 학생 저장 키는 유지한다. 업체별 보조 식별자로 `tenant_id`를 추가해 사용량과 수업 노출 범위를 분리한다.

## 2. plan 개념

`plan`은 업체가 구매한 수업 패키지와 월간 포함 인원을 정의한다.

초기 패키지:

| plan | 설치비 | 월 기본료 | 포함 활성 학습자 | 초과 단가 | 포함 수업 |
| --- | ---: | ---: | ---: | ---: | ---: |
| starter | 990,000원 | 150,000원 | 50명 | 3,000원 | 5개 |
| business | 1,990,000원 | 290,000원 | 150명 | 2,500원 | 전체 |
| institution | 3,000,000원 | 600,000원 | 300명 | 2,000원 | 전체 |

## 3. 월간 활성 학습자 정의

월간 활성 학습자(MAL)는 같은 `tenantId + billingMonth` 안에서 다음 중 하나 이상을 수행한 고유 학생이다.

- `activity_save`
- `ai_generate`
- `pdf_generate`
- `report_submit`

단순 랜딩 방문이나 `course_open`만으로는 활성 학습자로 계산하지 않는다.

고유 학생 기준:

- 로그인 전: `anonymousStudentId`
- 로그인 후: `userId` 우선, `anonymousStudentId` 보조

## 4. 사용량 이벤트 종류

| 이벤트 | 의미 |
| --- | --- |
| `course_open` | 수업 진입 |
| `activity_save` | 의미 있는 저장 완료 |
| `ai_generate` | AI 생성 요청 |
| `ai_generate_success` | AI 생성 성공 |
| `ai_generate_failed` | AI 생성 실패 |
| `pdf_generate` | PDF 생성 |
| `pdf_download` | PDF 다운로드 |
| `report_submit` | 최종 보고서 제출 또는 최종 승인 |
| `student_active` | 별도 활성 이벤트 |

입력 자동저장마다 이벤트를 찍지 않는다. `activity_save`는 debounce를 적용하고, AI/PDF는 요청 단위로 기록한다.

## 5. 예상 이용료 공식

```text
baseFee = plan.monthlyBaseFee
overageLearners = max(0, activeLearners - includedLearners)
overageFee = overageLearners × overagePrice
estimatedTotal = baseFee + overageFee
```

초기 구축비는 월간 예상 이용료에 포함하지 않는다. 이미지·영상 AI 크레딧은 이번 계산에서 제외하고, 추후 별도 usage credit 필드로 확장한다.

## 6. 무료 방문과 과금 대상 행동 구분

무료 또는 비과금성 행동:

- 랜딩 방문
- 수업 목록 검색
- 수업 카드 클릭 전 탐색
- 단순 `course_open`

과금 산정에 영향을 주는 행동:

- 실습 저장
- AI 생성
- PDF 생성
- 최종 제출

## 7. AI 사용량과 활성 인원 과금 관계

AI 생성 횟수는 별도 운영 지표로 집계한다. 다만 같은 학생이 AI를 여러 번 호출해도 활성 학습자는 1명으로 계산한다.

예:

- 같은 학생이 AI를 5회 호출
- 활성 학습자: 1명
- AI 생성 횟수: 5회

## 8. 이미지·영상 AI 분리 이유

이미지·영상 생성은 텍스트 AI보다 비용 변동이 크다. 따라서 이번 tenant usage 기반에서는 텍스트 AI/PDF/활성 학습자 중심으로 기록하고, 이미지·영상 AI는 추후 별도 크레딧 정책으로 분리한다.

## 9. 개인정보 최소 수집 원칙

사용량 집계는 브라우저별 `anonymousStudentId`를 사용한다.

금지:

- 학생 이름을 사용량 ID로 사용
- 이메일을 사용량 ID로 사용
- IP만으로 모든 사용자를 식별
- 브라우저에 service role key 노출

학생 이름과 학번은 기존 보고서/진행 현황 기능에만 사용한다.

## 10. RLS 및 서버리스 API 구조

권장 API:

- `POST /api/usage-event`
- `GET /api/tenant-usage?tenant=&month=`

브라우저는 `usage_events`를 직접 조회하지 않는다. 삽입은 anon 정책 또는 서버리스 API를 통해 수행한다. 조회와 집계는 서버리스 API에서 처리하며, 실제 판매 전에는 관리자 인증을 추가해야 한다.

RLS 원칙:

- 학생은 usage event insert만 가능
- 학생은 전체 usage event 조회 불가
- 업체 관리자는 자기 tenant summary만 조회
- LoreAX 최고관리자는 전체 조회
- service role은 서버 환경변수에서만 사용

## 11. 향후 로그인·권한 연동 순서

1. 업체 관리자 로그인
2. tenant 관리자 권한 테이블 추가
3. `/tenant-admin/usage.html` 보호
4. `GET /api/tenant-usage`에 관리자 권한 검증
5. 월별 summary materialized view 또는 RPC 추가
6. 결제/정산 시스템과 연결

현재 단계는 결제 확정이 아니라 예상 이용료 산정을 위한 기반이다.
