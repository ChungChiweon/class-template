# 업체 온보딩 체크리스트

## 1. 업체 생성

- [ ] tenant id 결정
- [ ] slug 결정
- [ ] 업체명 입력
- [ ] 표시명 입력
- [ ] 상태 `active / draft / hidden` 결정

## 2. 요금제 선택

- [ ] starter
- [ ] business
- [ ] institution
- [ ] 별도 계약 조건 여부 확인

## 3. 로고·색상

- [ ] 로고 파일 준비
- [ ] primary color 지정
- [ ] 랜딩/학생 화면에서 가독성 확인

## 4. 수업 선택

- [ ] 제공할 수업 ID 목록 확정
- [ ] `enabledCourseIds` 설정
- [ ] 기본 tenant는 빈 배열이면 모든 active 수업 표시
- [ ] 특정 tenant는 명시된 수업만 표시

## 5. 포함 인원 및 초과 안내

- [ ] 포함 활성 학습자 수 확인
- [ ] 초과 단가 확인
- [ ] 월간 활성 학습자 정의 안내
- [ ] 단순 방문은 과금 대상이 아님을 안내

## 6. 강사 계정

- [ ] 강사 수 확인
- [ ] 강사용 `/present/` 링크 전달 방식 확인
- [ ] 실제 판매 전 관리자 로그인 필요 안내

## 7. 사용량 확인

- [ ] `usage_events` insert 정상
- [ ] `course_open` 기록
- [ ] `activity_save` 기록
- [ ] `ai_generate` 기록
- [ ] `pdf_generate` 기록
- [ ] `report_submit` 기록
- [ ] `/tenant-admin/usage.html?tenant=default&month=YYYY-MM` 확인

## 8. 다음 달 정산 확인

- [ ] 월별 활성 학습자 수
- [ ] 초과 인원
- [ ] 예상 기본료
- [ ] 예상 초과료
- [ ] 예상 총액
- [ ] 실제 계약 조건과 차이 여부

## 9. 계약 종료 시 데이터 처리

- [ ] tenant status 변경
- [ ] 수업 접근 제한
- [ ] 학생 보고서 보존 기간 확인
- [ ] PDF 저장소 보존/삭제 정책 확인
- [ ] 개인정보 처리 요청 대응

## 10. 운영 전 보안 TODO

- [ ] `/tenant-admin/usage.html` 로그인 보호
- [ ] tenant 관리자 권한 테이블
- [ ] 서버리스 API 권한 검증
- [ ] service role key 서버 환경변수 등록
- [ ] RLS 정책 최종 점검
