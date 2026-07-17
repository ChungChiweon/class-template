window.LoreAXPresenterRegistry = {
  hotelPromo: {
    id: "hotelPromo",
    title: "AI 홍보영상 제작 프로젝트",
    periods: [
      {
        title: "홍보 대상과 핵심 메시지 기획",
        objectives:
          "학교, 동아리, 지역, 행사, 제품, 서비스 등 홍보할 대상을 정하고 타깃 시청자와 핵심 메시지를 정리합니다.",
        activities: [
          "홍보 대상 유형 선택",
          "홍보 대상명과 핵심 특징 3개 작성",
          "타깃 시청자 정하기",
          "영상 목적과 원하는 행동 정리",
        ],
        studentGuide:
          "홍보할 대상을 너무 넓게 잡지 말고, 30~60초 영상 안에 보여줄 수 있는 특징을 중심으로 정리하세요.",
        prompt:
          "선택한 홍보 대상, 타깃 시청자, 핵심 특징 3개를 바탕으로 30~60초 AI 홍보영상의 핵심 메시지와 장면 흐름을 제안하세요.",
        example: {
          title: "홍보 대상 기획 예시",
          description: "학교 축제, 동아리 모집, 지역 명소, 제품 소개처럼 다양한 주제로 확장할 수 있습니다.",
          image: "../assets/courses/class3.png",
        },
        warning: "홍보 대상에 없는 장점, 수치, 혜택을 만들어내지 않도록 주의하세요.",
      },
      {
        title: "콘셉트와 스토리보드 제작",
        objectives:
          "영상 분위기, 안내 캐릭터, 장면 흐름, 자막과 내레이션 초안을 정리합니다.",
        activities: [
          "영상 톤과 캐릭터 역할 선택",
          "인트로, 핵심 소개 2장면, 아웃트로 구성",
          "장면별 화면 설명과 내레이션 작성",
          "프롬프트 복사 전 최종 점검",
        ],
        studentGuide:
          "각 장면이 서로 이어지도록 만들고, 같은 캐릭터와 같은 목소리 톤이 유지되게 조건을 적으세요.",
        prompt:
          "홍보 대상과 핵심 메시지를 기준으로 4장면 스토리보드, 장면별 내레이션, 이미지·영상 생성 조건을 정리하세요.",
        example: {
          title: "스토리보드 예시",
          description: "인트로, 핵심 소개 1, 핵심 소개 2, 아웃트로의 흐름을 확인합니다.",
          image: "../assets/courses/class3.png",
        },
        warning: "장면을 너무 많이 만들면 크레딧과 시간이 부족할 수 있습니다.",
      },
      {
        title: "이미지·영상 생성",
        objectives:
          "참조 이미지와 장면별 프롬프트를 사용해 AI 영상 클립을 생성하고 저장합니다.",
        activities: [
          "모델과 크레딧 확인",
          "참조 이미지 또는 장면 설명 준비",
          "장면별 프롬프트 입력",
          "생성 결과 저장",
        ],
        studentGuide:
          "Generate 버튼은 강사 확인 후 누르고, 결과가 마음에 들어도 반드시 파일을 저장하세요.",
        prompt:
          "홍보 대상, 장면 위치, 카메라 움직임, 캐릭터 일관성, 금지 조건을 포함한 장면별 영상 생성 프롬프트를 작성하세요.",
        example: {
          title: "장면별 생성 예시",
          description: "핵심 소개 장면마다 다른 정보가 전달되는지 확인합니다.",
          image: "../assets/courses/class3.png",
        },
        warning: "모델 선택 실수나 조기 생성은 무료 크레딧 낭비로 이어질 수 있습니다.",
      },
      {
        title: "편집과 최종 완성",
        objectives:
          "생성한 영상 클립을 편집하고 자막, BGM, 내레이션, 마지막 안내 문구를 정리합니다.",
        activities: [
          "클립 순서 정리",
          "자막과 BGM 추가",
          "최종 행동 유도 문구 확인",
          "30~60초 홍보영상 내보내기",
        ],
        studentGuide:
          "처음 보는 사람이 홍보 대상의 매력을 이해하고 다음 행동을 떠올릴 수 있는지 확인하세요.",
        prompt:
          "완성 영상의 장면 순서, 자막, 내레이션, 핵심 메시지, 행동 유도 문구를 기준으로 최종 점검표를 작성하세요.",
        example: {
          title: "최종 결과물 예시",
          description: "완성 영상과 제출 전 점검 상태를 확인합니다.",
          image: "../assets/courses/class3.png",
        },
        warning: "최종 영상은 수업 종료 전에 다운로드하고 파일명을 확인하세요.",
      },
    ],
  },
  tourismPromo: {
    id: "tourismPromo",
    title: "AI 관광지 소개영상 제작 수업",
    periods: [
      {
        title: "관광지 선정과 소개 콘셉트 작성",
        objectives: "소개할 관광지를 정하고 방문 매력을 한 문장으로 정리합니다.",
        activities: ["관광지 선정", "방문 포인트 조사", "소개 콘셉트 작성"],
        studentGuide: "실제 정보와 과장 표현을 구분하며 소개할 핵심 매력을 정리하세요.",
        prompt: "선택한 관광지의 매력, 방문 포인트, 영상 분위기를 정리하세요.",
        example: { title: "관광지 소개 콘셉트", description: "관광지의 핵심 매력을 확인합니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "실제 존재하지 않는 정보를 사용하지 않습니다.",
      },
      {
        title: "대표 이미지와 장면 구성",
        objectives: "관광지 대표 이미지와 4장면 영상 흐름을 설계합니다.",
        activities: ["대표 장면 정하기", "이미지 프롬프트 작성", "장면 순서 구성"],
        studentGuide: "관광지 풍경과 방문 경험이 자연스럽게 이어지도록 장면을 구성하세요.",
        prompt: "관광지 대표 이미지와 장면별 영상 조건을 작성하세요.",
        example: { title: "대표 이미지 예시", description: "관광지 분위기를 보여주는 장면입니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "관광지 이름과 풍경이 서로 맞는지 확인하세요.",
      },
      {
        title: "영상 생성과 편집",
        objectives: "장면별 영상을 생성하고 자막과 BGM을 적용합니다.",
        activities: ["영상 프롬프트 입력", "결과 저장", "CapCut 편집"],
        studentGuide: "생성 결과를 저장한 뒤 자막과 음악을 넣어 소개 흐름을 만드세요.",
        prompt: "관광지 장면별 영상 프롬프트와 편집 순서를 정리하세요.",
        example: { title: "영상 편집 예시", description: "소개 흐름을 점검합니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "생성 결과 저장을 잊지 마세요.",
      },
      {
        title: "최종 점검과 제출",
        objectives: "정보 정확성, 관광 매력, 자막 정확성을 점검합니다.",
        activities: ["최종 영상 확인", "리뷰 체크", "제출"],
        studentGuide: "정보가 정확하고 관광 매력이 잘 전달되는지 확인하세요.",
        prompt: "관광지 소개영상의 최종 점검 기준을 작성하세요.",
        example: { title: "최종 영상 예시", description: "제출 전 확인합니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "출처가 불확실한 설명은 빼거나 수정하세요.",
      },
    ],
  },
  productAd: {
    id: "productAd",
    title: "AI 제품 광고영상 제작 수업",
    periods: [
      {
        title: "제품 선정과 광고 메시지 작성",
        objectives: "광고할 제품과 핵심 장점을 정리합니다.",
        activities: ["제품 선정", "타깃 고객 설정", "광고 카피 작성"],
        studentGuide: "제품의 실제 장점과 사용할 사람을 구체적으로 정하세요.",
        prompt: "제품 설명, 타깃 고객, 광고 메시지를 정리하세요.",
        example: { title: "광고 메시지 예시", description: "제품의 핵심 장점을 확인합니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "없는 기능이나 과장된 효과를 만들지 않습니다.",
      },
      {
        title: "제품 이미지와 광고 장면 구성",
        objectives: "제품 대표 이미지와 사용 장면을 설계합니다.",
        activities: ["대표 이미지 생성", "사용 장면 구성", "콜투액션 작성"],
        studentGuide: "제품이 어떻게 쓰이는지 한눈에 보이는 장면을 만드세요.",
        prompt: "제품 이미지와 광고 장면별 프롬프트를 작성하세요.",
        example: { title: "제품 장면 예시", description: "제품 사용 상황을 보여줍니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "브랜드나 로고를 무단으로 사용하지 않습니다.",
      },
      {
        title: "광고 영상 생성과 편집",
        objectives: "광고 장면을 생성하고 자막, BGM, CTA를 편집합니다.",
        activities: ["영상 생성", "자막 추가", "BGM 적용"],
        studentGuide: "제품 장점이 짧고 분명하게 전달되는지 확인하세요.",
        prompt: "광고 영상의 장면별 생성 조건과 편집 흐름을 정리하세요.",
        example: { title: "광고 영상 예시", description: "설득력 있는 흐름을 점검합니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "광고 문구가 너무 길면 전달력이 떨어집니다.",
      },
      {
        title: "최종 광고 점검과 제출",
        objectives: "메시지 명확성, 설득력, 브랜드 느낌을 점검합니다.",
        activities: ["최종 영상 확인", "리뷰 체크", "제출"],
        studentGuide: "처음 보는 사람이 제품 특징과 구매 이유를 이해하는지 확인하세요.",
        prompt: "제품 광고영상의 최종 점검 기준을 작성하세요.",
        example: { title: "최종 광고 예시", description: "제출 전 확인합니다.", image: "../assets/courses/hotel-promotion.webp" },
        warning: "저작권이 있는 이미지와 음악 사용에 주의하세요.",
      },
    ],
  },
  dataAnalysisReport: {
    id: "dataAnalysisReport",
    title: "AI 데이터 분석 기반 주제탐구보고서 작성",
    periods: [
      {
        title: "탐구 주제 설정과 연구 질문 구체화",
        objectives: "관심 분야를 바탕으로 탐구 가능한 주제와 질문을 구체화합니다.",
        activities: ["관심 분야 키워드 도출", "논문 1개 탐색", "탐구 질문 정리"],
        studentGuide: "자신의 관심 분야에서 실제 자료를 찾을 수 있는 주제를 고르세요.",
        prompt: "관심 분야, 키워드, 논문 핵심 문장을 바탕으로 탐구 질문을 정리하세요.",
        example: { title: "탐구 주제 예시", description: "주제와 질문을 점검합니다.", image: "../assets/courses/class1.png" },
        warning: "AI가 만든 출처나 수치를 그대로 믿지 않습니다.",
      },
      {
        title: "자료 수집, 데이터 정제 및 시각화",
        objectives: "자료와 데이터팩을 바탕으로 표와 그래프를 구성합니다.",
        activities: ["분석 방향 선택", "데이터팩 확인", "그래프 해석"],
        studentGuide: "실제 데이터에 있는 값만 사용하고 그래프가 질문과 연결되는지 확인하세요.",
        prompt: "선택한 데이터와 그래프를 바탕으로 분석 결과 초안을 정리하세요.",
        example: { title: "그래프 예시", description: "표와 그래프를 점검합니다.", image: "../assets/courses/class1.png" },
        warning: "상관관계를 인과관계로 단정하지 않습니다.",
      },
      {
        title: "서론 및 연구 방법 초안 작성",
        objectives: "1·2차시 결과를 바탕으로 보고서 본문 초안을 작성합니다.",
        activities: ["학생 생각 입력", "서론 초안 생성", "연구 방법 점검"],
        studentGuide: "AI 문장을 그대로 쓰지 말고 자신의 표현으로 검토하세요.",
        prompt: "승인된 주제, 질문, 데이터 결과를 바탕으로 서론과 연구 방법 초안을 정리하세요.",
        example: { title: "초안 예시", description: "보고서 문단을 점검합니다.", image: "../assets/courses/class1.png" },
        warning: "없는 자료나 논문을 추가하지 않습니다.",
      },
      {
        title: "결과 해석, 결론 및 최종 보고서 완성",
        objectives: "누적된 내용을 직접 검토하고 최종 PDF로 완성합니다.",
        activities: ["최종 점검", "직접 수정", "PDF 생성"],
        studentGuide: "학생이 최종 검토자입니다. 빈칸, 출처, 그래프 설명을 확인하세요.",
        prompt: "최종 보고서의 논리, 출처, 그래프, 결론을 점검하세요.",
        example: { title: "최종 보고서 예시", description: "PDF 생성 상태를 확인합니다.", image: "../assets/courses/class1.png" },
        warning: "PDF 생성 전 최종 승인 상태를 확인하세요.",
      },
    ],
  },
};
