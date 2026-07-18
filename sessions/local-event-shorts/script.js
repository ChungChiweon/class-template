const hotelPromoLesson = {
  classMetadata: {
    classId: "hotelPromo",
    classTitle: "AI 호텔 홍보영상 제작 수업",
    subtitle: "고등학생 호텔관광학과를 위한 4교시 실습형 프로그램",
    targetAudience: "고등학생 / 호텔관광학과",
    totalDuration: "4교시",
    finalOutput: "30~40초 호텔 홍보영상",
    recommendedSceneCount: 4,
    heroEyebrow: "고등학생 / 호텔관광학과 4교시 실습",
    heroCopy:
      "AI 캐릭터 생성, 이미지 제작, 영상 생성, 편집 과정을 통해 학생들이 직접 호텔 홍보영상 1편을 완성하는 실습형 수업입니다.",
    brandLabel: "LoreAX Class ERP",
  },
  workflow: [
    { phase: "기획", tool: "Claude", role: "호텔 콘셉트, 장면 구성, 시간별 스크립트 작성" },
    { phase: "캐릭터 생성", tool: "HeyGen", role: "호텔 안내 캐릭터 생성" },
    { phase: "레퍼런스시트", tool: "GPT", role: "캐릭터 기준 이미지 생성" },
    { phase: "장면 이미지", tool: "GPT", role: "장면별 참조 이미지 생성" },
    { phase: "영상 생성", tool: "Google Flow", role: "호텔 배경 영상 생성" },
    { phase: "더빙", tool: "ElevenLabs", role: "호텔 소개 나레이션 더빙" },
    { phase: "편집/제출", tool: "CapCut", role: "영상 합치기 및 최종 편집" },
  ],
  periods: [
    {
      period: "1교시",
      title: "HeyGen 캐릭터 체험 + 합본 프롬프트 생성",
      goal:
        "HeyGen에서 캐릭터를 먼저 확정하고, 그 결과를 Claude에 넣어 GPT/Flow 제작 프롬프트 합본을 생성합니다.",
      activity: "호텔 안내 캐릭터를 생성하고, 나레이션을 입력한 뒤 짧은 영상 생성까지 체험합니다.",
      studentTasks: [
        "Claude 프롬프트 박스에서 HeyGen 캐릭터 생성 프롬프트 요청문 복사",
        "HeyGen에서 캐릭터 생성 체험 진행",
        "HeyGen 결과의 외형, 복장, 말투, 대사를 메모",
        "HeyGen 결과 반영 합본 생성 프롬프트를 Claude에 입력",
        "GPT 레퍼런스샷과 Flow 4장면 프롬프트, 한국어 나레이션 확인",
      ],
      teacherTasks: [
        "학생이 HeyGen 캐릭터 결과를 먼저 확보하게 안내",
        "HeyGen 결과 메모를 합본 생성기에 붙여 넣었는지 확인",
        "4장면 구조와 장면별 한국어 20자 내외 나레이션 조건 확인",
        "Flow 프롬프트는 Claude 합본 결과에서 장면별로 따로 사용한다고 설명",
      ],
      tools: "HeyGen",
      toolKeys: ["heygen"],
      output: "AI 호텔 안내 캐릭터 1명, 나레이션 입력, 체험용 영상 생성",
      outputs: [
        "HeyGen 캐릭터 생성 프롬프트",
        "HeyGen 캐릭터 결과 메모",
        "GPT 4방향 레퍼런스샷 생성 프롬프트",
        "Flow 4장면 영상 프롬프트",
        "장면별 한국어 나레이션",
        "전체 합본 프롬프트",
      ],
      checkpoints: [
        "HeyGen 캐릭터 생성 체험을 먼저 진행했는가",
        "HeyGen 캐릭터 결과 메모를 합본 생성에 반영했는가",
        "GPT 레퍼런스샷 생성 프롬프트가 포함되었는가",
        "4개 영상 프롬프트가 장면별로 분리되었는가",
        "각 장면 나레이션이 한국어 20자 내외인가",
        "합본 프롬프트에 HeyGen 실습용 내용이 포함되었는가",
      ],
      failSafe: ["다운로드가 안 되면 화면 확인으로 대체", "생성이 지연되면 강사 예시 결과물로 설명"],
      note: "헤이젠 무료버전은 다운로드 불가로 1회 체험으로 갈음",
    },
    {
      period: "2교시",
      title: "호텔리어 이미지/레퍼런스 제작",
      goal: "같은 캐릭터를 유지하기 위한 기준 이미지와 4방향 레퍼런스시트를 준비합니다.",
      activity: "호텔리어 이미지를 만들고, 전신 4방향 레퍼런스이미지를 참조하여 구글플로우에서 영상 생성을 준비합니다.",
      studentTasks: ["호텔리어 캐릭터 이미지 생성", "4방향 레퍼런스시트 생성", "필요한 씬 참조 이미지 결정"],
      teacherTasks: ["얼굴/의상/체형 고정 기준 설명", "참조 이미지 업로드 누락 방지", "시간 부족 시 씬 참조 이미지 생략 안내"],
      tools: "GPT, Claude",
      toolKeys: ["gpt", "claude"],
      output: "호텔리어 이미지, 전신 4방향 레퍼런스이미지, 동영상 프롬프트 4~5개, 시간별 스크립트",
      outputs: ["호텔리어 기준 이미지", "전신 4방향 레퍼런스이미지", "영상 프롬프트 초안", "시간별 스크립트"],
      checkpoints: ["같은 인물처럼 보이는가", "전신이 잘 보이는가", "Flow에 넣을 이미지가 준비되었는가"],
      failSafe: ["레퍼런스시트 품질이 낮으면 기준 이미지를 다시 생성", "시간 부족 시 장면 이미지는 생략"],
    },
    {
      period: "3교시",
      title: "영상 생성",
      goal: "참조 이미지를 활용해 장면별 호텔 소개 영상을 생성합니다.",
      activity: "4방향 레퍼런스이미지를 참조하여 구글플로우에서 호텔 장면 영상을 생성합니다.",
      studentTasks: ["모델 선택 확인", "참조 이미지 업로드", "장면별 프롬프트 입력", "생성 결과 저장"],
      teacherTasks: ["Veo 3.1 Lite 기준 크레딧 설명", "Generate 조기 클릭 방지", "정책 차단 가능성 안내"],
      tools: "Google Flow",
      toolKeys: ["flow"],
      output: "구글플로우(혹은 다른 무료툴)를 활용한 4~5장면 영상 클립",
      outputs: ["인트로 영상", "장소 소개 영상", "아웃트로 영상"],
      checkpoints: ["모델을 잘못 선택하지 않았는가", "참조 이미지를 넣었는가", "크레딧이 충분한가"],
      failSafe: ["생성 실패 시 장면 수를 줄임", "정책 차단 시 장소/직업 표현을 중립적으로 수정"],
    },
    {
      period: "4교시",
      title: "더빙/편집/발표",
      goal: "생성 영상과 음성을 편집해 최종 결과물을 완성하고 발표합니다.",
      activity: "ElevenLabs로 더빙을 만들고, 생성한 영상을 합쳐 최종 결과물을 발표합니다.",
      studentTasks: ["나레이션 생성", "영상 클립 가져오기", "자막/BGM/순서 편집", "최종 영상 발표"],
      teacherTasks: ["더빙 길이와 영상 길이 맞추기 안내", "저장 실패 방지", "제출 기준 확인"],
      tools: "ElevenLabs, CapCut",
      toolKeys: ["elevenlabs", "capcut"],
      output: "더빙 음성, 최종 호텔 홍보영상 1편",
      outputs: ["더빙 음성", "최종 호텔 홍보영상 1편"],
      checkpoints: ["영상이 저장되었는가", "나레이션과 장면이 맞는가", "최종 파일명을 확인했는가"],
      failSafe: ["더빙 생성이 어렵다면 텍스트 자막으로 대체", "CapCut 설치가 늦으면 웹/모바일 편집 또는 강사 시연으로 대체"],
    },
  ],
  tools: {
    heygen: {
      name: "HeyGen",
      purpose: "AI 아바타와 짧은 말하기 영상을 체험합니다.",
      url: "https://www.heygen.com",
      affiliateUrl: "",
      required: false,
      useType: "체험용",
      creditNote: "무료버전은 다운로드와 생성 횟수에 제한이 있을 수 있습니다.",
      teacherNote: "무료버전 다운로드 제한이 있어 수업에서는 체험 또는 시연 중심으로 운영합니다.",
    },
    gpt: {
      name: "GPT",
      purpose: "캐릭터 이미지, 레퍼런스시트, 장면 참조 이미지를 생성합니다.",
      url: "https://chatgpt.com",
      affiliateUrl: "",
      required: true,
      useType: "메인 제작용",
      creditNote: "이미지 재생성을 반복하면 시간이 빠르게 소모되므로 기준 이미지를 먼저 확정합니다.",
      teacherNote: "같은 인물 유지가 핵심이므로 기준 이미지와 고정 요소를 반복 확인합니다.",
    },
    claude: {
      name: "Claude",
      purpose: "영상 프롬프트, 스크립트, 장면 구성, 리뷰 문구를 정리합니다.",
      url: "https://claude.ai",
      affiliateUrl: "",
      required: true,
      useType: "메인 제작용",
      creditNote: "복사할 프롬프트 종류를 학생에게 먼저 지정해 혼선을 줄입니다.",
      teacherNote: "학생이 바로 복사해 쓸 수 있는 프롬프트를 미리 준비해 둡니다.",
    },
    flow: {
      name: "Google Flow",
      purpose: "참조 이미지를 기반으로 장면별 영상을 생성합니다.",
      url: "https://labs.google/fx/tools/flow",
      affiliateUrl: "",
      required: true,
      useType: "메인 제작용",
      creditNote: "Veo 3.1 Lite 기준 1장면 10크레딧으로 계산하고 모델 선택을 먼저 확인합니다.",
      teacherNote: "모델 선택과 크레딧 소모량을 생성 전에 반드시 확인시킵니다.",
    },
    elevenlabs: {
      name: "ElevenLabs",
      purpose: "호텔 소개 나레이션 음성을 생성합니다.",
      url: "https://elevenlabs.io",
      affiliateUrl: "",
      required: false,
      useType: "선택 체험용",
      creditNote: "더빙 길이를 영상 길이에 맞추기 어렵다면 자막 대체를 허용합니다.",
      teacherNote: "시간이 부족하면 CapCut 자막 또는 기본 음성으로 대체할 수 있습니다.",
    },
    capcut: {
      name: "CapCut",
      purpose: "영상 클립, 더빙, 자막, BGM을 합쳐 최종 결과물을 편집합니다.",
      url: "https://www.capcut.com",
      affiliateUrl: "",
      required: true,
      useType: "메인 제작용",
      creditNote: "설치형 도구는 수업 전 다운로드 여부를 확인합니다.",
      teacherNote: "설치형 버전은 다운로드 시간이 걸릴 수 있으므로 사전 준비가 필요합니다.",
    },
  },
  promptTabs: [
    {
      tabId: "system",
      tabTitle: "시스템 프롬프트",
      description: "AI의 역할, 답변 규칙, 수업 운영 기준을 먼저 고정합니다.",
      studentSummary:
        "시스템 프롬프트는 AI가 어떤 역할을 맡고, 어떤 규칙을 지키며, 어떤 방식으로 답변해야 하는지를 정해주는 기본 운영 지침입니다.",
      teacherNote: "학생이 장면별 프롬프트를 만들기 전에 이 기준을 먼저 붙여 넣게 하면 결과물 편차를 줄일 수 있습니다.",
      blocks: [
        {
          title: "수업용 시스템 프롬프트",
          description: "AI 호텔 홍보영상 제작 수업에서 모든 프롬프트의 기준이 되는 운영 지침입니다.",
          body: `너는 AI 호텔 홍보영상 제작을 돕는 프롬프트 설계자다.
학생이 만든 캐릭터의 일관성을 유지하고,
4방향 레퍼런스시트와 장면 참조 이미지를 활용하여
Google Flow용 영상 프롬프트를 작성해야 한다.

반드시 지켜야 할 규칙:
- 캐릭터의 얼굴, 헤어스타일, 체형, 유니폼을 유지한다.
- 모든 영상은 16:9 가로형 기준으로 작성한다.
- 장면별 나레이션 언어와 자막 언어를 명확히 구분한다.
- 나레이션은 10초 안에 말할 수 있도록 짧게 작성한다.
- BGM 사용 여부를 명확히 지정한다.
- 무작위 로고, 텍스트, 불필요한 인물 추가를 금지한다.
- 학생이 복사해서 바로 사용할 수 있는 형태로 작성한다.`,
          copyable: true,
          teacherNote: "시스템 프롬프트를 먼저 붙이고, 그 아래에 장면별 조건을 추가하도록 안내하세요.",
        },
      ],
    },
    {
      tabId: "character",
      tabTitle: "캐릭터 프롬프트",
      description: "호텔리어 기준 이미지를 만들기 위한 학생용 프롬프트입니다.",
      studentSummary: "호텔 홍보영상에 계속 등장할 같은 인물의 기준 이미지를 먼저 만듭니다.",
      teacherNote: "최종 영상 품질은 첫 기준 이미지의 선명도와 전신 구도에 크게 좌우됩니다.",
      blocks: [
        {
          title: "호텔리어 캐릭터 생성 프롬프트",
          description: "GPT 이미지 생성 등에 넣어 호텔리어 캐릭터 기준 이미지를 만듭니다.",
          body: `Create a realistic full-body image of a young hotelier character standing in a luxury hotel lobby.

The character has neat, well-groomed hair, a bright and friendly smile, clear expressive eyes, and a refined, polished appearance.

He wears a navy hotel uniform with a crisp white shirt, elegant gold accents, a name tag, matching trousers, and polished black shoes.

The character should look professional, graceful, welcoming, and suitable for a premium hotel introduction video.

Use a luxury hotel lobby background with warm lighting, marble floors, elegant interior details, and a refined hospitality atmosphere.

Full-body composition, realistic style, high detail, clean lighting, premium hotel promotional image.`,
          copyable: true,
          teacherNote: "전신이 잘리지 않았는지, 호텔 직원처럼 보이는지 먼저 확인하게 하세요.",
        },
      ],
    },
    {
      tabId: "reference-sheet",
      tabTitle: "레퍼런스시트 프롬프트",
      description: "같은 캐릭터를 유지하기 위한 4방향 레퍼런스시트를 만듭니다.",
      studentSummary: "정면, 좌측, 우측, 후면이 모두 보이는 4방향 레퍼런스시트를 만들어 Flow 참조 이미지로 사용합니다.",
      teacherNote: "수업용 문구에서는 오해 소지가 있는 mugshot 대신 production character reference sheet 표현을 사용합니다.",
      blocks: [
        {
          title: "4방향 레퍼런스시트 프롬프트",
          description: "업로드한 호텔리어 이미지를 기준으로 같은 인물의 4방향 전신 시트를 만듭니다.",
          body: `Use the uploaded hotelier image as the fixed reference character.

Create a clean full-body turnaround reference sheet of the same person, like a production character reference sheet.

Show 4 views:
front, left side, right side, and back.

Keep the same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.

Use a neutral standing pose, arms relaxed, plain white background, realistic style, clean studio lighting.

No hotel background, no props, no text, no logo, no outfit change.

The character must look identical in all views for Google Flow reference.`,
          copyable: true,
          teacherNote: "4방향 모두 같은 사람처럼 보이지 않으면 이후 영상에서 캐릭터가 흔들릴 가능성이 큽니다.",
        },
      ],
    },
    {
      tabId: "flow-video",
      tabTitle: "Flow 영상 프롬프트",
      description: "장면 5개를 전부 나열하지 않고, 참조 방식에 따라 두 가지 공통 규칙으로 나눕니다.",
      studentSummary: "인트로/기본 장소 소개는 4방향 레퍼런스시트만, 객실/식당/프런트 등은 장면 이미지와 레퍼런스시트를 함께 사용합니다.",
      teacherNote: "학생이 장면별로 새 프롬프트를 길게 만들기보다, 공통 규칙에 장소와 나레이션만 얹게 하면 수업 통제가 쉽습니다.",
      blocks: [
        {
          title: "A. 4방향 레퍼런스시트만 참조하는 경우",
          description: "사용 장면: 인트로, 기본 장소 소개. 공통 규칙에 장면 특징만 덧붙입니다.",
          body: `Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic cinematic 10-second hotel promotional video.

Aspect ratio:
16:9 horizontal widescreen video.

Character consistency:
Use the same hotelier character from the uploaded 4-view reference sheet.
Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.
The character must remain visually identical to the reference sheet.

Narration voice:
Use a calm, professional male voice.
The narration voice must match the male hotelier character.
Do not use a female voice.

Camera:
Use a medium shot or medium full-body shot.
Use slow, smooth cinematic camera movement.
Keep the framing stable and professional.

BGM:
No BGM. Background music will be added later in CapCut.

Important:
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not add extra people in the foreground.
Do not add logos or random text.
Keep the video realistic, clean, and suitable for a hotel introduction video.`,
          copyable: true,
          teacherNote: "이 블록은 레퍼런스시트만 있는 상황에서 빠르게 장면을 생성할 때 사용합니다.",
        },
        {
          title: "B. 장면 이미지 + 4방향 레퍼런스시트를 참조하는 경우",
          description: "사용 장면: 객실, 식당, 프런트, 기타 장소 소개. 위치 이미지를 함께 참조합니다.",
          body: `Use the uploaded scene reference image as the main visual reference.
Use the uploaded 4-view character reference sheet as the fixed character identity reference.

Create a realistic cinematic 10-second hotel promotional video.

Aspect ratio:
16:9 horizontal widescreen video.

Visual reference rules:
Follow the uploaded scene reference image for the location, layout, lighting, atmosphere, composition, and background details.
Follow the uploaded 4-view character reference sheet for the hotelier's face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.

Character consistency:
The hotelier must remain visually identical to the uploaded 4-view character reference sheet.
Do not change the character's identity, outfit, hairstyle, face, or proportions.

Narration voice:
Use a calm, professional male voice.
The narration voice must match the male hotelier character.
Do not use a female voice.

Camera:
Use a medium shot or medium full-body shot.
Use slow, smooth cinematic movement such as a gentle pan, push-in, or dolly movement.
Keep the character and the location clearly visible.

BGM:
No BGM. Background music will be added later in CapCut.

Important:
Do not add extra people in the foreground.
Do not add logos or random text.
Only include subtitles when requested.
Keep the video visually consistent with both uploaded reference images.`,
          copyable: true,
          teacherNote: "장면 참조 이미지를 넣는 경우에도 캐릭터 기준은 반드시 4방향 레퍼런스시트라고 강조하세요.",
        },
      ],
    },
    {
      tabId: "credit-guide",
      tabTitle: "시간/크레딧 운영 가이드",
      description: "영상 길이, 모델 선택, 크레딧 소모량을 수업 전에 통제합니다.",
      studentSummary: "50크레딧 안에서 안정적으로 완성하려면 4장면 구성이 적합합니다.",
      teacherNote: "학생이 모델을 잘못 선택하거나 재생성을 반복하면 4교시 안에 완성하기 어렵습니다.",
      blocks: [
        {
          title: "크레딧 운영 안내",
          description: "Veo 3.1 Lite와 상위 모델 사용 시 크레딧 소모 기준을 안내합니다.",
          body: `Veo 3.1 Lite를 사용하는 경우,
기본 10초 영상 1개 생성 시 10크레딧이 차감됩니다.

다만 프롬프트가 너무 길거나 요구사항이 많을 경우,
출력 영상 길이가 8초 또는 6초로 줄어들 수 있으며,
이 경우에도 기본적으로 10크레딧이 차감될 수 있습니다.

또한 상위 등급 모델 또는 Omni Flash가 적용될 경우,
영상 1개 생성 시 15크레딧이 차감될 수 있습니다.

총 50크레딧 내에서 이론상 5개 장면도 가능해 보일 수 있지만,
실제 수업에서는 학생 실수, 모델 선택 오류, 재생성, 영상 길이 감소 가능성을 고려해야 합니다.

따라서 안정적인 수업 운영을 위해서는 총 4장면 구성이 적합합니다.

권장 구조:
인트로 + 장소소개 2장면 + 아웃트로`,
          copyable: true,
          teacherNote: "수업 시작 전에 4장면 기준을 고정하고, 재생성은 강사 확인 후 진행하게 하세요.",
        },
      ],
    },
    {
      tabId: "review-feedback",
      tabTitle: "리뷰/피드백",
      description: "완성 영상의 품질과 수업 운영 포인트를 리뷰합니다.",
      studentSummary: "캐릭터 일관성, 나레이션, 자막, 편집 흐름을 기준으로 최종 결과물을 점검합니다.",
      teacherNote: "오류가 있는 결과물도 수업 자료로 활용할 수 있습니다. 어떤 오류가 왜 발생했는지 설명하는 데 초점을 둡니다.",
      blocks: [
        {
          title: "씬별 리뷰 포인트",
          description: "학생 결과물을 발표하거나 피드백할 때 확인할 기준입니다.",
          body: `씬별 리뷰 포인트:
- 캐릭터가 동일하게 유지되었는가?
- 나레이션 성별이 캐릭터와 일치하는가?
- 대사가 영상 길이 안에서 끊기지 않았는가?
- 자막과 나레이션 내용이 일치하는가?
- BGM이 장면마다 과하게 달라지지 않았는가?
- 참조 이미지의 분위기가 영상에 반영되었는가?
- 최종 편집에서 흐름이 자연스러운가?`,
          copyable: true,
          teacherNote: "발표 전 학생 스스로 이 목록을 보며 체크하게 하면 피드백 시간이 줄어듭니다.",
        },
        {
          title: "강사용 총평 예시",
          description: "결과물에 오류가 있을 때도 수업적으로 해석할 수 있는 총평 문구입니다.",
          body: `발생 가능한 오류가 골고루 나온 결과물은 오히려 좋은 수업 자료가 될 수 있습니다.
학생들에게 AI 영상 제작은 버튼만 누르는 작업이 아니라,
캐릭터 일관성, 프롬프트 구조, 언어별 대사 길이, 도구별 한계, 크레딧 관리, 편집 전략을 함께 고려해야 하는 과정임을 설명할 수 있습니다.`,
          copyable: true,
          teacherNote: "강사 모드에서 수업 마무리 멘트나 피드백 예시로 활용하세요.",
        },
      ],
    },
  ],
  creditRules: {
    baseModel: "Veo 3.1 Lite",
    baseCreditPerScene: 10,
    premiumModel: "Omni Flash",
    premiumCreditPerScene: 15,
    totalCredits: 50,
    recommendedScenes: 4,
    recommendedStructure: "인트로 + 장소소개 2장면 + 아웃트로",
  },
  riskWarnings: [
    "Generate 버튼 조기 클릭",
    "모델 선택 실수",
    "무료 크레딧 낭비",
    "프롬프트 복사 누락",
    "참조 이미지 업로드 누락",
    "결과물 저장 실패",
    "도구 UI 차이",
    "설치형 도구 다운로드 지연",
    "정책 차단 가능성",
  ],
  instructorNotes: [
    "Generate 버튼은 강사 확인 후 누르게 하세요.",
    "모델 선택을 먼저 확인하세요.",
    "참조 이미지 업로드 여부를 확인하세요.",
    "영상 생성 후 반드시 다운로드하도록 안내하세요.",
    "크레딧 부족 시 장소 소개 장면 수를 줄이세요.",
  ],
};


function applyGenericPromotionProject() {
  Object.assign(hotelPromoLesson.classMetadata, {
    classTitle: "AI 홍보영상 제작 프로젝트",
    subtitle: "중·고등학생을 위한 4교시 실습형 AI 홍보영상 제작 프로젝트",
    targetAudience: "중학생, 고등학생, 진로체험, 자유학기제, 동아리, 특성화고 공통",
    finalOutput: "30~60초 AI 홍보영상",
    heroEyebrow: "중·고등학생 공통 4교시 실습",
    heroCopy: "생성형 AI로 학교, 지역, 행사, 브랜드, 제품, 서비스를 소개하는 30~60초 홍보영상을 기획하고 완성합니다.",
  });
  hotelPromoLesson.workflow = [
    { phase: "기획", tool: "AI", role: "홍보 대상, 타깃 시청자, 핵심 메시지 작성" },
    { phase: "콘셉트", tool: "Claude/GPT", role: "영상 분위기와 스토리보드 구성" },
    { phase: "이미지 생성", tool: "GPT", role: "캐릭터·공간·제품 기준 이미지 생성" },
    { phase: "영상 생성", tool: "Google Flow", role: "장면별 영상 프롬프트 입력 및 생성" },
    { phase: "내레이션", tool: "HeyGen/ElevenLabs", role: "장면별 짧은 내레이션 제작" },
    { phase: "편집/발표", tool: "CapCut", role: "자막, BGM, 장면 순서 편집 및 발표" },
  ];
  Object.assign(hotelPromoLesson.creditRules, {
    recommendedStructure: "인트로 + 핵심 소개 2장면 + 아웃트로",
  });
  hotelPromoLesson.periods = [
    { period: "1교시", title: "홍보 대상과 핵심 메시지 기획", goal: "홍보할 대상을 선택하고 타깃 시청자와 핵심 메시지를 정합니다.", activity: "우리 학교, 동아리, 지역, 행사, 제품, 서비스 등 홍보할 대상을 정하고 주요 특징 3개를 작성합니다.", studentTasks: ["홍보 대상 유형 선택", "홍보 대상명 작성", "핵심 특징 3개 정리", "타깃 시청자 설정", "핵심 메시지 작성", "영상 목적 선택"], teacherTasks: ["호텔을 기본값으로 안내하지 않기", "대상이 너무 넓으면 범위를 좁히게 하기", "허위 혜택·수치·성능을 만들지 않도록 안내"], tools: "Claude, ChatGPT, HeyGen", toolKeys: ["claude", "gpt", "heygen"], output: "홍보 대상, 타깃 시청자, 핵심 메시지, 영상 목적", outputs: ["홍보 대상", "핵심 특징 3개", "타깃 시청자", "핵심 메시지", "영상 목적"], checkpoints: ["홍보 대상이 명확한가", "타깃 시청자가 구체적인가", "핵심 메시지가 한 문장으로 정리되었는가", "허위 정보가 없는가"], failSafe: ["대상이 넓으면 학교 축제나 동아리 모집 예시로 축소", "정보가 부족하면 학생이 아는 사실만 사용"] },
    { period: "2교시", title: "콘셉트와 스토리보드 제작", goal: "영상 분위기와 4~6개 장면의 흐름을 설계합니다.", activity: "도입, 핵심 소개, 마무리 구조로 장면별 화면, 내레이션, 자막, 효과를 정리합니다.", studentTasks: ["영상 분위기 선택", "4~6개 장면 구성", "장면별 화면 설명", "내레이션과 자막 초안 작성"], teacherTasks: ["장면 수를 4장면 중심으로 제한", "장면마다 보여줄 정보가 겹치지 않게 지도", "호텔 예시는 선택 대상 중 하나로만 언급"], tools: "GPT, Claude", toolKeys: ["gpt", "claude"], output: "홍보 콘셉트, 스토리보드, 장면별 스크립트", outputs: ["영상 톤앤매너", "스토리보드", "장면별 내레이션", "자막 초안"], checkpoints: ["도입-핵심-마무리 흐름이 있는가", "장면별 메시지가 분명한가", "30~60초 안에 가능한가"], failSafe: ["시간 부족 시 인트로 + 핵심 소개 2장면 + 아웃트로 4장면으로 축소"] },
    { period: "3교시", title: "이미지·영상 생성", goal: "장면별 이미지와 영상 프롬프트를 만들고 생성 결과를 저장합니다.", activity: "장면별 이미지 생성 프롬프트, 영상 생성 프롬프트, 카메라 움직임, 스타일 일관성을 확인합니다.", studentTasks: ["기준 이미지 또는 장면 이미지 생성", "영상 프롬프트 입력", "모델과 크레딧 확인", "생성 결과 저장"], teacherTasks: ["참조 이미지 업로드 확인", "Generate 조기 클릭 방지", "입력하지 않은 시설·수치·성능 생성 금지 안내"], tools: "Google Flow, GPT", toolKeys: ["flow", "gpt"], output: "장면별 영상 클립 4~6개", outputs: ["인트로 영상", "핵심 소개 영상", "아웃트로 영상"], checkpoints: ["스타일이 일관적인가", "홍보 대상과 목적이 맞는가", "사실과 다른 내용이 없는가"], failSafe: ["정책 차단 시 표현을 중립적으로 수정", "크레딧 부족 시 장면 수 축소"] },
    { period: "4교시", title: "편집과 최종 완성", goal: "영상 클립, 내레이션, 자막, BGM을 편집해 최종 홍보영상을 완성합니다.", activity: "장면 순서, 자막, 배경음악, 로고 또는 마지막 안내 화면을 정리하고 발표합니다.", studentTasks: ["영상 순서 정리", "자막과 BGM 적용", "최종 행동 유도 문구 추가", "30~60초 최종 영상 발표"], teacherTasks: ["저장 실패 방지", "평가 기준 안내", "AI 결과를 학생이 검토·수정했는지 확인"], tools: "CapCut, ElevenLabs", toolKeys: ["capcut", "elevenlabs"], output: "30~60초 AI 홍보영상 1편", outputs: ["최종 AI 홍보영상", "발표용 점검표"], checkpoints: ["30~60초 안에 핵심이 전달되는가", "자막과 내레이션이 간결한가", "최종 행동 유도 문구가 자연스러운가"], failSafe: ["더빙이 어렵다면 자막 중심으로 대체", "CapCut 설치가 늦으면 웹 편집 또는 강사 시연으로 대체"] },
  ];
  hotelPromoLesson.promptTabs = createGenericPromotionPromptTabs();
  hotelPromoLesson.instructorNotes = ["홍보 대상은 호텔이 아니라 학생이 선택한 학교, 동아리, 지역, 행사, 제품, 서비스 등을 기준으로 진행하세요.", "학생이 제공하지 않은 시설, 수치, 혜택, 제품 성능을 AI가 임의로 만들지 않도록 확인하세요.", "Generate 버튼은 프롬프트와 참조 이미지 확인 후 누르게 하세요.", "크레딧 부족 시 핵심 소개 장면 수를 줄이세요."];
}

function createGenericPromotionPromptTabs() {
  const noFake = "\ud559\uc0dd\uc774 \uc785\ub825\ud558\uc9c0 \uc54a\uc740 \uc2dc\uc124, \uc218\uce58, \ud61c\ud0dd, \uc131\ub2a5\uc744 \ub9cc\ub4e4\uc9c0 \ub9c8.";
  return [
    { tabId: "system", tabTitle: "\uc2dc\uc2a4\ud15c \ud504\ub86c\ud504\ud2b8", description: "AI \ud64d\ubcf4\uc601\uc0c1 \uc81c\uc791 \ud504\ub85c\uc81d\ud2b8\uc758 \uacf5\ud1b5 \uae30\uc900\uc744 \uc815\ud569\ub2c8\ub2e4.", studentSummary: "\ud64d\ubcf4 \ub300\uc0c1, \ud0c0\uae43 \uc2dc\uccad\uc790, \ud575\uc2ec \uba54\uc2dc\uc9c0\ub97c \uae30\uc900\uc73c\ub85c AI\uac00 \uc7a5\uba74\uacfc \ud504\ub86c\ud504\ud2b8\ub97c \ub9cc\ub4e4\uac8c \ud569\ub2c8\ub2e4.", teacherNote: "\ud64d\ubcf4 \ub300\uc0c1\uc740 \ud559\uc0dd\uc774 \uc120\ud0dd\ud55c \uc8fc\uc81c\ub97c \uae30\uc900\uc73c\ub85c \uc9c0\ub3c4\ud569\ub2c8\ub2e4.", blocks: [{ title: "AI \ud64d\ubcf4\uc601\uc0c1 \uc81c\uc791 \uc2dc\uc2a4\ud15c \ud504\ub86c\ud504\ud2b8", description: "\ubaa8\ub4e0 \ud64d\ubcf4\uc601\uc0c1 \uc8fc\uc81c\uc5d0 \uacf5\ud1b5\uc73c\ub85c \uc801\uc6a9\ud558\ub294 \uc6b4\uc601 \uc9c0\uce68\uc785\ub2c8\ub2e4.", body: "\ub108\ub294 \uc911\u00b7\uace0\ub4f1\ud559\uc0dd\uc758 AI \ud64d\ubcf4\uc601\uc0c1 \uc81c\uc791\uc744 \ub3d5\ub294 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4\uc790\ub2e4. \ud559\uc0dd\uc774 \uc120\ud0dd\ud55c \ud64d\ubcf4 \ub300\uc0c1 \uc720\ud615\uacfc \ud64d\ubcf4 \ub300\uc0c1\uba85\uc744 \uae30\uc900\uc73c\ub85c 30~60\ucd08 \ud64d\ubcf4\uc601\uc0c1\uc744 \uc124\uacc4\ud55c\ub2e4. " + noFake + " \ud559\uc0dd\uc774 \uc81c\uacf5\ud55c \uc0ac\uc2e4\uacfc \ud64d\ubcf4 \ub300\uc0c1\uc5d0 \ub9de\ub294 \ud45c\ud604\ub9cc \uc0ac\uc6a9\ud55c\ub2e4.", copyable: true }] },
    { tabId: "planning", tabTitle: "\uae30\ud68d \ud504\ub86c\ud504\ud2b8", description: "\ud64d\ubcf4 \ub300\uc0c1\uacfc \ud575\uc2ec \uba54\uc2dc\uc9c0\ub97c \uc815\ub9ac\ud569\ub2c8\ub2e4.", studentSummary: "\uc6b0\ub9ac \ud559\uad50, \ub3d9\uc544\ub9ac, \uc9c0\uc5ed \uba85\uc18c, \ud589\uc0ac, \uc81c\ud488, \uc11c\ube44\uc2a4 \ub4f1 \uc6d0\ud558\ub294 \ub300\uc0c1\uc744 \ud64d\ubcf4\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", blocks: [{ title: "\ud64d\ubcf4 \ub300\uc0c1 \uae30\ud68d \ud504\ub86c\ud504\ud2b8", description: "\ud64d\ubcf4 \ub300\uc0c1, \ud2b9\uc9d5, \ud0c0\uae43, \ubaa9\uc801\uc744 \uc815\ub9ac\ud569\ub2c8\ub2e4.", body: "\ub0b4 \ud64d\ubcf4 \ub300\uc0c1 \uc720\ud615\uc740 [\uc120\ud0dd\uac12]\uc774\ub2e4. \ud64d\ubcf4 \ub300\uc0c1\uba85\uc740 [\ud64d\ubcf4 \ub300\uc0c1\uba85]\uc774\ub2e4. \ud575\uc2ec \ud2b9\uc9d5\uc740 [\ud2b9\uc9d5 1], [\ud2b9\uc9d5 2], [\ud2b9\uc9d5 3]\uc774\ub2e4. \ud0c0\uae43 \uc2dc\uccad\uc790\ub294 [\ud0c0\uae43]\uc774\uace0, \uc6d0\ud558\ub294 \ud589\ub3d9\uc740 [\ubc29\ubb38/\ucc38\uc5ec/\uad6c\ub9e4/\uad00\uc2ec/\uc774\ubbf8\uc9c0 \uac1c\uc120]\uc774\ub2e4. \ud575\uc2ec \uba54\uc2dc\uc9c0 3\uac1c, \ucd94\ucc9c \ud1a4\uc564\ub9e4\ub108 3\uac1c, \uacfc\uc7a5 \ud45c\ud604 \uc8fc\uc758\uc810\uc744 \ud45c\ub85c \uc815\ub9ac\ud574 \uc918. " + noFake, copyable: true }] },
    { tabId: "storyboard", tabTitle: "\uc2a4\ud1a0\ub9ac\ubcf4\ub4dc \ud504\ub86c\ud504\ud2b8", description: "4~6\uac1c \uc7a5\uba74\uc758 \ud654\uba74, \ub0b4\ub808\uc774\uc158, \uc790\ub9c9\uc744 \uad6c\uc131\ud569\ub2c8\ub2e4.", studentSummary: "\uc778\ud2b8\ub85c, \ud575\uc2ec \uc18c\uac1c, \uc544\uc6c3\ud2b8\ub85c \uc21c\uc11c\ub85c \uc7a5\uba74 \ud750\ub984\uc744 \ub9cc\ub4ed\ub2c8\ub2e4.", blocks: [{ title: "\uc7a5\uba74 \uad6c\uc131 \ud504\ub86c\ud504\ud2b8", description: "\ud64d\ubcf4 \ub300\uc0c1\uc5d0 \ub9de\ub294 \uc7a5\uba74\ubcc4 \uc2a4\ud1a0\ub9ac\ubcf4\ub4dc\ub97c \ub9cc\ub4ed\ub2c8\ub2e4.", body: "\ud64d\ubcf4 \ub300\uc0c1: [\ud64d\ubcf4 \ub300\uc0c1\uba85], \ud575\uc2ec \ud2b9\uc9d5: [3\uac00\uc9c0], \ud0c0\uae43 \uc2dc\uccad\uc790: [\ud0c0\uae43], \ud575\uc2ec \uba54\uc2dc\uc9c0: [\uba54\uc2dc\uc9c0]. 30~60\ucd08 \ud64d\ubcf4\uc601\uc0c1 \uc2a4\ud1a0\ub9ac\ubcf4\ub4dc\ub97c 4\uc7a5\uba74\uc73c\ub85c \uc791\uc131\ud574 \uc918. \uac01 \uc7a5\uba74\ub9c8\ub2e4 \uc7a5\uba74 \ubaa9\uc801, \ud654\uba74\uc5d0 \ubcf4\uc77c \ub0b4\uc6a9, \uce74\uba54\ub77c \uc6c0\uc9c1\uc784, \ud55c\uad6d\uc5b4 \ub0b4\ub808\uc774\uc158 20\uc790 \ub0b4\uc678, \uc790\ub9c9 \ucd08\uc548, \uacfc\uc7a5 \ud45c\ud604 \uc8fc\uc758\uc810\uc744 \uc815\ub9ac\ud574 \uc918.", copyable: true }] },
    { tabId: "video", tabTitle: "\uc601\uc0c1 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8", description: "\uc601\uc0c1 \uc0dd\uc131 \ub3c4\uad6c\uc5d0 \ub123\uc744 \uc7a5\uba74\ubcc4 \uc870\uac74\uc744 \uc815\ub9ac\ud569\ub2c8\ub2e4.", studentSummary: "\uc7a5\uba74\ubcc4\ub85c \ucc38\uc870 \uc774\ubbf8\uc9c0, \uce74\uba54\ub77c \uc6c0\uc9c1\uc784, \uc2a4\ud0c0\uc77c \uc77c\uad00\uc131\uc744 \ud655\uc778\ud569\ub2c8\ub2e4.", blocks: [{ title: "\uc7a5\uba74\ubcc4 \uc601\uc0c1 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8", description: "Flow \ub4f1 \uc601\uc0c1 \uc0dd\uc131 \ub3c4\uad6c\uc5d0 \uc0ac\uc6a9\ud560 \uc870\uac74\uc744 \ub9cc\ub4ed\ub2c8\ub2e4.", body: "\ud64d\ubcf4 \ub300\uc0c1: [\ud64d\ubcf4 \ub300\uc0c1\uba85]. \uc7a5\uba74 \uc81c\ubaa9: [\uc778\ud2b8\ub85c/\ud575\uc2ec \uc18c\uac1c/\uc544\uc6c3\ud2b8\ub85c]. \ubcf4\uc5ec\uc904 \ud575\uc2ec \ub0b4\uc6a9: [\uc7a5\uba74 \ub0b4\uc6a9]. 16:9 \uac00\ub85c\ud615 10\ucd08 \uc601\uc0c1 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8\ub97c \uc601\uc5b4\ub85c \uc791\uc131\ud574 \uc918. \ud654\uba74 \uad6c\uc131, \uce74\uba54\ub77c \uc6c0\uc9c1\uc784, \uc870\uba85, \uc0c9\uac10, \ub4f1\uc7a5 \uc694\uc18c, \uae08\uc9c0 \uc694\uc18c\ub97c \ud3ec\ud568\ud574 \uc918. \uae08\uc9c0: \ub79c\ub364 \ud14d\uc2a4\ud2b8, \uc784\uc758 \ub85c\uace0, \ud655\uc778\ub418\uc9c0 \uc54a\uc740 \uc2dc\uc124\u00b7\uc218\uce58\u00b7\uc131\ub2a5, \ubd88\ud544\uc694\ud55c \uc778\ubb3c \ucd94\uac00.", copyable: true }] },
    { tabId: "review-feedback", tabTitle: "\ub9ac\ubdf0/\ud53c\ub4dc\ubc31", description: "\ucd5c\uc885 \ud64d\ubcf4\uc601\uc0c1 \ud3c9\uac00 \uae30\uc900\uc785\ub2c8\ub2e4.", studentSummary: "\ud64d\ubcf4 \ubaa9\uc801, \ud0c0\uae43 \uba54\uc2dc\uc9c0, \uc7a5\uba74 \ud750\ub984, \uc0ac\uc2e4 \ud655\uc778, \ud3b8\uc9d1 \uc644\uc131\ub3c4\ub97c \uc810\uac80\ud569\ub2c8\ub2e4.", blocks: [{ title: "\ucd5c\uc885 \uc810\uac80 \uccb4\ud06c\ub9ac\uc2a4\ud2b8", description: "\ubc1c\ud45c \uc804 \ud559\uc0dd \uac80\ud1a0\uc6a9 \uae30\uc900\uc785\ub2c8\ub2e4.", body: "- \ud64d\ubcf4 \ub300\uc0c1\uacfc \ubaa9\uc801\uc774 \uba85\ud655\ud55c\uac00?\n- \ud0c0\uae43 \uc2dc\uccad\uc790\uc5d0 \ub9de\ub294 \uba54\uc2dc\uc9c0\uc778\uac00?\n- \uc7a5\uba74 \ud750\ub984\uc774 \uc790\uc5f0\uc2a4\ub7ec\uc6b4\uac00?\n- \uc0ac\uc2e4\uacfc \ub2e4\ub978 \ub0b4\uc6a9\uc744 \ub9cc\ub4e4\uc9c0 \uc54a\uc558\ub294\uac00?\n- 30~60\ucd08 \uc548\uc5d0 \ud575\uc2ec \ub0b4\uc6a9\uc774 \uc804\ub2ec\ub418\ub294\uac00?\n- AI \uacb0\uacfc\ub97c \ud559\uc0dd\uc774 \uac80\ud1a0\ud558\uace0 \uc218\uc815\ud588\ub294\uac00?", copyable: true }] },
  ];
}

applyGenericPromotionProject();


function createSamplePromptTabs(topic) {
  return [
    {
      tabId: "system",
      tabTitle: "시스템 프롬프트",
      description: `${topic.title} 수업에서 AI의 역할과 답변 기준을 정합니다.`,
      studentSummary: `${topic.outputName} 제작을 돕는 AI에게 역할, 형식, 주의사항을 먼저 알려줍니다.`,
      teacherNote: "이 수업 데이터는 샘플입니다. 실제 수업에서는 주제에 맞는 프롬프트와 예시 결과물을 추가하세요.",
      blocks: [
        {
          title: `${topic.shortName} 시스템 프롬프트`,
          description: `${topic.outputName} 제작 보조자 역할을 지정합니다.`,
          body: `너는 ${topic.title}을 돕는 프롬프트 설계자다.
학생이 정한 주제와 대상에 맞게 이미지 프롬프트, 영상 프롬프트, 나레이션 초안을 작성해야 한다.

반드시 지켜야 할 규칙:
- 영상은 16:9 가로형 기준으로 작성한다.
- 핵심 메시지가 10초 안에 전달되도록 문장을 짧게 만든다.
- 장면마다 무엇을 보여줄지 명확히 쓴다.
- 자막과 나레이션 언어를 구분한다.
- 무작위 로고, 부정확한 정보, 불필요한 인물 추가를 피한다.
- 학생이 복사해서 바로 사용할 수 있는 형태로 작성한다.`,
          copyable: true,
          teacherNote: "샘플 프롬프트이므로 실제 장소/제품 정보에 맞게 사실 확인 문구를 추가하세요.",
        },
      ],
    },
    {
      tabId: "image",
      tabTitle: "이미지 프롬프트",
      description: `${topic.imageTarget}을 만들기 위한 기본 프롬프트입니다.`,
      studentSummary: `영상 생성 전에 ${topic.imageTarget}을 먼저 준비합니다.`,
      teacherNote: "참조 이미지가 명확할수록 영상 결과가 안정됩니다.",
      blocks: [
        {
          title: `${topic.imageTarget} 생성 프롬프트`,
          description: "수업용 샘플 이미지 프롬프트입니다.",
          body: topic.imagePrompt,
          copyable: true,
          teacherNote: "이 수업 데이터는 샘플입니다. 실제 수업에서는 주제에 맞는 프롬프트와 예시 결과물을 추가하세요.",
        },
      ],
    },
    {
      tabId: "reference-sheet",
      tabTitle: "자료/구성 프롬프트",
      description: `${topic.outputName} 제작에 필요한 장면 구성과 참고 자료를 정리합니다.`,
      studentSummary: "영상 생성 전에 장면 순서, 핵심 메시지, 참고 자료를 간단히 정리합니다.",
      teacherNote: "호텔 수업의 레퍼런스시트 탭에 해당하는 샘플 자리입니다. 실제 수업에서는 주제별 자료 구조로 바꾸세요.",
      blocks: [
        {
          title: `${topic.shortName} 장면 구성 프롬프트`,
          description: "장면 수와 메시지를 먼저 정리하는 수업용 샘플입니다.",
          body: `${topic.outputName}을 만들기 위한 장면 구성을 작성해 주세요.

조건:
- 권장 장면 수는 ${topic.recommendedScenes}개입니다.
- 각 장면은 10초 안에 이해할 수 있어야 합니다.
- 장면마다 보여줄 대상, 핵심 메시지, 필요한 자막을 구분해 주세요.
- 실제 수업에서는 주제에 맞는 프롬프트와 예시 결과물을 추가하세요.`,
          copyable: true,
          teacherNote: "학생이 생성 버튼을 누르기 전에 이 구성표를 먼저 확인하게 하세요.",
        },
      ],
    },
    {
      tabId: "flow-video",
      tabTitle: "Flow 영상 프롬프트",
      description: `${topic.outputName} 장면 영상을 생성하기 위한 기본 규칙입니다.`,
      studentSummary: `${topic.videoFocus}가 잘 드러나도록 장면 특징과 카메라 움직임을 구체화합니다.`,
      teacherNote: "장면 수를 먼저 확정한 뒤 Generate 버튼을 누르게 하세요.",
      blocks: [
        {
          title: `${topic.shortName} 영상 공통 프롬프트`,
          description: "Google Flow에 넣을 수 있는 수업용 샘플입니다.",
          body: topic.videoPrompt,
          copyable: true,
          teacherNote: "학생이 장면별 장소/제품명만 바꿔 쓰도록 안내하면 수업 통제가 쉽습니다.",
        },
      ],
    },
    {
      tabId: "credit-guide",
      tabTitle: "시간/크레딧 운영 가이드",
      description: "장면 수와 모델 선택에 따른 크레딧 사용을 안내합니다.",
      studentSummary: `${topic.recommendedScenes}장면 구성을 기준으로 먼저 완성하고, 시간이 남으면 보완합니다.`,
      teacherNote: "샘플 수업도 4교시 기준에서는 재생성 여유를 남기는 편이 안전합니다.",
      blocks: [
        {
          title: "수업 운영 가이드",
          description: "크레딧 과소비를 막기 위한 공통 안내입니다.",
          body: `Veo 3.1 Lite 기준으로 10초 영상 1개 생성 시 10크레딧이 차감됩니다.
상위 모델 또는 Omni Flash를 선택하면 장면 1개에 15크레딧이 차감될 수 있습니다.

이 수업에서는 ${topic.recommendedStructure} 구성을 권장합니다.
이 수업 데이터는 샘플입니다. 실제 수업에서는 주제에 맞는 프롬프트와 예시 결과물을 추가하세요.`,
          copyable: true,
          teacherNote: "모델 선택 화면을 학생과 함께 확인한 뒤 생성하게 하세요.",
        },
      ],
    },
    {
      tabId: "review-feedback",
      tabTitle: "리뷰/피드백",
      description: `${topic.outputName} 결과물을 평가하기 위한 기준입니다.`,
      studentSummary: topic.reviewSummary,
      teacherNote: "결과물 오류를 도구의 한계와 프롬프트 개선 포인트로 연결해 설명하세요.",
      blocks: [
        {
          title: "리뷰 포인트",
          description: "발표와 피드백에 사용할 수 있는 기본 체크리스트입니다.",
          body: topic.reviewPrompt,
          copyable: true,
          teacherNote: "이 수업 데이터는 샘플입니다. 실제 수업에서는 주제에 맞는 프롬프트와 예시 결과물을 추가하세요.",
        },
      ],
    },
  ];
}

function createSampleLesson(config) {
  return {
    classMetadata: {
      classId: config.id,
      classTitle: config.classTitle,
      subtitle: config.subtitle,
      targetAudience: config.targetAudience,
      totalDuration: config.totalDuration,
      finalOutput: config.finalOutput,
      recommendedSceneCount: config.recommendedScenes,
      heroEyebrow: `${config.targetAudience} ${config.totalDuration} 실습`,
      heroCopy: config.heroCopy,
      brandLabel: config.brandLabel,
    },
    workflow: config.workflow.map((role, index) => ({ tool: String(index + 1).padStart(2, "0"), role })),
    periods: [
      {
        period: "1교시",
        title: `${config.shortName} 기획`,
        goal: "주제, 대상, 핵심 메시지를 정합니다.",
        studentTasks: [config.selectionTask, "핵심 메시지 1문장 작성", "장면 후보 정리"],
        teacherTasks: ["샘플 데이터임을 안내", "정보 정확성 확인", "장면 수 제한 안내"],
        tools: "ChatGPT",
        outputs: ["기획 메모", "나레이션 초안"],
        checkpoints: ["주제가 명확한가", "10초 안에 말할 수 있는가", "장면 수가 과하지 않은가"],
        failSafe: ["예시 주제를 제공", "장면 수를 줄임"],
      },
      {
        period: "2교시",
        title: "이미지/프롬프트 제작",
        goal: "대표 이미지와 영상 프롬프트를 준비합니다.",
        studentTasks: [config.imageTask, "영상 프롬프트 작성", "참조 이미지 확인"],
        teacherTasks: ["프롬프트 복사 누락 확인", "참조 이미지 품질 확인"],
        tools: "ChatGPT, Google Flow",
        outputs: ["대표 이미지", "영상 프롬프트"],
        checkpoints: ["이미지가 주제와 맞는가", "프롬프트가 구체적인가"],
        failSafe: ["이미지 없이 텍스트 프롬프트 중심으로 진행"],
      },
      {
        period: "3교시",
        title: "장면 영상 생성",
        goal: "정해진 장면 수 안에서 영상을 생성합니다.",
        studentTasks: ["모델 선택 확인", "장면별 영상 생성", "결과 저장"],
        teacherTasks: ["크레딧 계산기 확인", "Generate 버튼 확인 후 클릭 안내"],
        tools: "Google Flow",
        outputs: ["장면별 영상 클립"],
        checkpoints: ["크레딧이 남는가", "장면이 메시지와 맞는가"],
        failSafe: ["장면 수 축소", "샘플 결과물로 대체 설명"],
      },
      {
        period: "4교시",
        title: "편집/제출",
        goal: "영상 클립을 합쳐 최종 결과물을 완성합니다.",
        studentTasks: ["영상 순서 정리", "자막/BGM 추가", "최종 파일 제출"],
        teacherTasks: ["제출 기준 안내", "저장 실패 방지"],
        tools: config.editTools,
        outputs: [config.finalOutput],
        checkpoints: ["흐름이 자연스러운가", "핵심 메시지가 보이는가", "파일 저장이 되었는가"],
        failSafe: ["최소 완성 구조로 제출", "자막 중심 결과물로 대체"],
      },
    ],
    tools: config.tools,
    promptTabs: createSamplePromptTabs(config.promptTopic),
    creditRules: {
      ...hotelPromoLesson.creditRules,
      recommendedScenes: config.recommendedScenes,
      recommendedStructure: config.promptTopic.recommendedStructure,
    },
    riskWarnings: hotelPromoLesson.riskWarnings,
    instructorNotes: [
      "이 수업 데이터는 샘플입니다. 실제 수업에서는 주제에 맞는 프롬프트와 예시 결과물을 추가하세요.",
      "Generate 버튼은 강사 확인 후 누르게 하세요.",
      "크레딧 부족 시 장면 수를 줄이세요.",
    ],
  };
}

const dataAnalysisLesson = {
  classMetadata: {
    classId: "dataAnalysisReport",
    classTitle: "AI 데이터 분석 기반 주제탐구보고서 작성 수업",
    subtitle: "고등학생을 위한 4교시 AI 데이터 분석 주제탐구보고서 실습형 프로그램",
    targetAudience: "고등학생",
    totalDuration: "4교시",
    finalOutput: "AI 데이터 분석 기반 주제탐구보고서 1부 (PDF)",
    recommendedSceneCount: 0,
    heroEyebrow: "고등학생 4교시 실습",
    heroCopy:
      "AI 도구를 활용해 탐구 질문을 세우고, 공공 데이터를 수집·정제·시각화한 뒤 객관적 근거로 주제탐구보고서를 완성하는 실습형 수업입니다.",
    brandLabel: "LoreAX Class ERP",
  },
  workflow: [
    { tool: "주제 탐색", role: "AI로 관심 주제를 탐색하고 탐구 질문을 설정합니다." },
    { tool: "데이터 수집·정제", role: "공공데이터포털 등에서 데이터를 수집하고 정제합니다." },
    { tool: "데이터 시각화", role: "스프레드시트로 그래프를 만들고 패턴을 파악합니다." },
    { tool: "서론·연구 방법", role: "연구 배경, 목적, 필요성과 연구 방법을 작성합니다." },
    { tool: "결론·PDF 제출", role: "결론·한계·향후 탐구를 정리하고 PDF로 제출합니다." },
  ],
  periods: [
    {
      period: "1차시",
      title: "주제 설정과 탐구 질문",
      goal: "AI를 활용해 관심 주제를 탐색하고 탐구 질문과 변수를 설정합니다.",
      activity: "AI 프롬프트로 주제 후보를 탐색하고, 탐구 질문·독립변수·종속변수·연구 범위를 정리합니다.",
      studentTasks: [
        "AI 주제 탐색 프롬프트 실행",
        "탐구 질문 1문장 작성",
        "독립변수·종속변수 설정",
        "연구 범위(기간/대상) 명확화",
        "데이터 출처 후보 1곳 이상 확인",
      ],
      teacherTasks: [
        "주제가 데이터로 검증 가능한지 확인",
        "탐구 질문이 측정 가능한 변수를 포함했는지 점검",
        "데이터 출처 접근성 안내",
      ],
      tools: "ChatGPT, Claude",
      outputs: ["탐구 질문", "독립변수·종속변수", "연구 범위", "데이터 출처 후보"],
      checkpoints: [
        "탐구 질문이 1문장으로 명확한가?",
        "독립변수와 종속변수가 구분되었는가?",
        "데이터 출처가 확보되었는가?",
      ],
      failSafe: ["주제 범위 축소 안내", "공공데이터포털 추천 예시 제공"],
      requiredReportFields: [
        "report.title",
        "report.researchQuestion",
        "report.independentVariable",
        "report.dependentVariable",
        "report.researchScope",
        "report.methodology.dataSource",
      ],
    },
    {
      period: "2차시",
      title: "데이터 정제·시각화",
      goal: "수집한 데이터를 정제하고 그래프로 시각화하여 패턴을 파악합니다.",
      activity: "데이터를 정제(결측치·이상치 처리)하고, 스프레드시트로 그래프를 생성한 뒤 축과 제목을 설정합니다.",
      studentTasks: [
        "데이터 정제(결측치·이상치 확인)",
        "스프레드시트에 데이터 입력",
        "그래프 종류 선택 및 생성",
        "X축·Y축 설명과 그래프 제목 작성",
        "그래프 이미지 캡처·업로드",
      ],
      teacherTasks: [
        "그래프 종류가 변수 관계에 적합한지 확인",
        "축 단위와 라벨이 명확한지 점검",
        "데이터 정제 기준 안내",
      ],
      tools: "Google Sheets, 공공데이터포털",
      outputs: ["정제된 데이터", "그래프 이미지", "X축·Y축 설명", "그래프 제목"],
      checkpoints: [
        "데이터 정제가 완료되었는가?",
        "그래프가 변수 관계를 잘 보여주는가?",
        "축 설명과 제목이 명확한가?",
      ],
      failSafe: ["예시 데이터셋 제공", "스프레드시트 기본 차트 템플릿 안내"],
      requiredReportFields: [
        "report.methodology.collectionMethod",
        "report.methodology.analysisMethod",
        "report.results.chartTitle",
        "report.results.xAxisDescription",
        "report.results.yAxisDescription",
        "report.results.interpretation",
        "chartImage",
      ],
    },
    {
      period: "3차시",
      title: "서론·연구 방법 작성",
      goal: "연구 배경·목적·필요성과 연구 방법을 객관적으로 작성합니다.",
      activity: "AI 프롬프트로 서론 초안을 생성하고, 연구 방법(데이터 출처·수집·분석)을 정리합니다.",
      studentTasks: [
        "연구 배경 작성",
        "연구 목적·필요성 작성",
        "연구 방법(출처·수집·분석) 정리",
        "분석 결과 요약 작성",
        "참고문헌·AI 활용 기록 정리",
      ],
      teacherTasks: [
        "서론이 주장이 아닌 사실 기반인지 확인",
        "연구 방법의 재현성 점검",
        "AI 활용 기록 누락 여부 확인",
      ],
      tools: "ChatGPT, Claude",
      outputs: ["연구 배경·목적·필요성", "연구 방법", "분석 결과 요약", "참고문헌", "AI 활용 기록"],
      checkpoints: [
        "서론이 객관적 사실로 작성되었는가?",
        "연구 방법이 재현 가능한가?",
        "AI 활용 기록이 빠짐없이 작성되었는가?",
      ],
      failSafe: ["서론 작성 프롬프트 예시 제공", "참고문헌 양식 안내"],
      requiredReportFields: [
        "report.introduction.background",
        "report.introduction.purpose",
        "report.introduction.necessity",
        "report.methodology.collectionMethod",
        "report.methodology.analysisMethod",
        "report.results.summary",
        "report.references",
        "report.aiUsageLogs",
      ],
    },
    {
      period: "4차시",
      title: "결론·PDF 제출",
      goal: "결론·한계·향후 탐구를 정리하고 동료 피드백을 반영해 PDF로 제출합니다.",
      activity: "그래프 해석과 결론을 작성하고, 한계·향후 탐구를 정리한 뒤 동료 피드백을 반영해 PDF를 생성합니다.",
      studentTasks: [
        "그래프 해석 작성",
        "결론(탐구 질문에 대한 답) 작성",
        "연구의 한계·향후 탐구 작성",
        "동료 피드백 반영 내용 정리",
        "PDF 생성 및 제출",
      ],
      teacherTasks: [
        "결론이 데이터 근거를 포함하는지 확인",
        "한계가 구체적인지 점검",
        "PDF 생성 완료 여부 확인",
      ],
      tools: "ChatGPT, Claude",
      outputs: ["그래프 해석", "결론", "한계·향후 탐구", "동료 피드백 반영", "최종 PDF"],
      checkpoints: [
        "결론이 탐구 질문에 대한 답인가?",
        "한계와 향후 탐구가 구체적인가?",
        "동료 피드백 반영 내용이 작성되었는가?",
        "PDF가 생성되었는가?",
      ],
      failSafe: ["결론 작성 프롬프트 예시 제공", "PDF 생성 단계 재안내"],
      requiredReportFields: [
        "report.results.interpretation",
        "report.conclusion.answer",
        "report.conclusion.limitations",
        "report.conclusion.futureResearch",
        "report.peerFeedback",
        "report.feedbackReflection",
        "report.aiUsageLogs",
      ],
    },
  ],
  tools: {
    gpt: {
      name: "ChatGPT",
      purpose: "주제 탐색, 탐구 질문 생성, 서론·결론 초안 작성에 활용합니다.",
      required: true,
      useType: "필수 · 학생 실습용",
      creditNote: "무료 버전으로 충분하며, 과도한 반복 생성은 피합니다.",
      teacherNote: "AI가 사실을 날조하지 않도록 출처 교차 검증을 안내하세요.",
    },
    claude: {
      name: "Claude",
      purpose: "연구 방법 정리, 논리 구조 점검, 문장 다듬기에 활용합니다.",
      required: true,
      useType: "필수 · 학생 실습용",
      creditNote: "무료 버전으로 충분하며, 긴 문장 요약에 적합합니다.",
      teacherNote: "Claude는 긴 맥락 처리에 강하므로 서론·결론 구조 점검에 활용하세요.",
    },
    sheets: {
      name: "Google Sheets",
      purpose: "데이터 정제, 그래프 생성, X축·Y축 설정에 활용합니다.",
      required: true,
      useType: "필수 · 학생 실습용",
      creditNote: "무료이며, 구글 계정만 있으면 됩니다.",
      teacherNote: "차트 종류(막대·꺾은선·산점도)가 변수 관계에 맞는지 확인하세요.",
    },
    dataPortal: {
      name: "공공데이터포털",
      purpose: "신뢰할 수 있는 공공 데이터를 수집하는 1차 출처로 활용합니다.",
      required: true,
      useType: "필수 · 데이터 수집용",
      creditNote: "무료이며, 다운로드 가능한 데이터셋을 우선 사용합니다.",
      teacherNote: "데이터의 최종 수정일과 단위를 반드시 확인하게 하세요.",
    },
  },
  promptTabs: [
    {
      tabId: "ai-principles",
      tabTitle: "AI 활용 원칙",
      description: "데이터 분석 수업에서 AI를 윤리적으로 활용하는 기준을 안내합니다.",
      studentSummary: "AI는 보조 도구로만 사용하고, 모든 데이터와 결론은 직접 검증합니다.",
      teacherNote: "AI가 생성한 수치나 출처를 맹신하지 않도록 반복 안내하세요.",
      blocks: [
        {
          title: "AI 활용 원칙",
          description: "데이터 분석 수업의 AI 활용 기준",
          copyable: false,
          body: `1. AI는 아이디어 탐색과 문장 다듬기에만 활용한다.
2. AI가 제시한 수치·통계·출처는 반드시 원문에서 교차 검증한다.
3. AI 활용 내용은 보고서 'AI 활용 기록'에 빠짐없이 작성한다.
4. AI가 생성한 결론을 그대로 복사하지 않는다.`,
        },
      ],
    },
    {
      tabId: "topic-explore",
      tabTitle: "주제 탐색",
      description: "AI로 관심 주제를 탐색하고 데이터 검증 가능성을 확인합니다.",
      studentSummary: "관심 분야에서 데이터로 검증할 수 있는 주제 후보를 3개 이상 탐색합니다.",
      teacherNote: "주제가 너무 광범위하면 범위를 좁히도록 안내하세요.",
      blocks: [
        {
          title: "주제 탐색 프롬프트",
          description: "데이터 분석 가능한 주제 후보 생성",
          copyable: true,
          body: `나는 고등학생으로, AI를 활용해 데이터 기반 주제탐구보고서를 작성하려고 해.
관심 분야: [관심 분야 입력]
이 분야에서 공공데이터포털 등에서 데이터를 구할 수 있고, 변수를 설정해 분석할 수 있는 주제 후보 3개를 제안해 줘.
각 주제마다 (1) 탐구 질문, (2) 가능한 독립변수·종속변수, (3) 예상 데이터 출처를 함께 적어 줘.`,
        },
      ],
    },
    {
      tabId: "research-question",
      tabTitle: "탐구 질문",
      description: "측정 가능한 변수를 포함한 탐구 질문을 설정합니다.",
      studentSummary: "주제를 1문장 탐구 질문으로 정리하고, 독립변수·종속변수를 명확히 합니다.",
      teacherNote: "탐구 질문이 'A가 B에 미치는 영향' 형태인지 확인하세요.",
      blocks: [
        {
          title: "탐구 질문 작성 프롬프트",
          description: "변수가 명확한 탐구 질문 생성",
          copyable: true,
          body: `주제: [주제 입력]
이 주제를 데이터로 검증할 수 있는 탐구 질문 1문장으로 작성해 줘.
조건:
- 독립변수와 종속변수가 각각 무엇인지 명시할 것
- 측정 가능한 변수일 것
- 연구 범위(기간·대상)를 포함할 것`,
        },
      ],
    },
    {
      tabId: "search-terms",
      tabTitle: "검색어",
      description: "공공데이터포털에서 데이터를 찾기 위한 검색어를 설계합니다.",
      studentSummary: "탐구 질문에 맞는 데이터 검색어를 3개 이상 작성합니다.",
      teacherNote: "검색어가 너무 좁으면 데이터가 부족할 수 있음을 안내하세요.",
      blocks: [
        {
          title: "검색어 설계 프롬프트",
          description: "데이터 수집용 검색어 생성",
          copyable: true,
          body: `탐구 질문: [탐구 질문 입력]
공공데이터포털에서 관련 데이터를 찾기 위한 검색어 3개 이상을 제안해 줘.
각 검색어마다 예상 데이터 형식(엑셀·CSV·API)과 활용 가능성을 함께 적어 줘.`,
        },
      ],
    },
    {
      tabId: "source-summary",
      tabTitle: "출처 요약",
      description: "수집한 데이터 출처의 신뢰성과 활용 가능성을 정리합니다.",
      studentSummary: "데이터 출처의 제공 기관·수정일·데이터 단위를 요약합니다.",
      teacherNote: "출처의 최종 수정일이 오래되었으면 최신 데이터를 찾도록 안내하세요.",
      blocks: [
        {
          title: "출처 요약 프롬프트",
          description: "데이터 출처 신뢰성 정리",
          copyable: true,
          body: `데이터 출처: [출처명·URL 입력]
이 출처의 (1) 제공 기관, (2) 최종 수정일, (3) 데이터 단위, (4) 활용 가능한 변수를 표로 정리해 줘.
신뢰성을 판단할 수 있는 근거도 한 줄 추가해 줘.`,
        },
      ],
    },
    {
      tabId: "data-cleaning",
      tabTitle: "데이터 정제",
      description: "결측치·이상치를 처리하고 분석 가능한 형태로 정제합니다.",
      studentSummary: "결측치와 이상치를 확인하고 처리 기준을 정해 데이터를 정제합니다.",
      teacherNote: "이상치를 임의로 삭제하지 않도록 처리 기준을 명시하게 하세요.",
      blocks: [
        {
          title: "데이터 정제 프롬프트",
          description: "결측치·이상치 처리 기준 정리",
          copyable: true,
          body: `데이터 샘플: [데이터 일부 입력]
이 데이터에서 (1) 결측치 처리 기준, (2) 이상치 판단 기준, (3) 단위 통일 방법을 정리해 줘.
단, 실제 삭제·수정은 내가 직접 스프레드시트에서 수행할 테니 기준만 제시해 줘.`,
        },
      ],
    },
    {
      tabId: "analysis-method",
      tabTitle: "분석 방법",
      description: "변수 관계에 맞는 분석 방법을 선택합니다.",
      studentSummary: "독립변수·종속변수 관계에 맞는 분석 방법(비교·추이·상관 등)을 선택합니다.",
      teacherNote: "고등학생 수준에서는 기술 통계와 시각화 중심으로 안내하세요.",
      blocks: [
        {
          title: "분석 방법 선택 프롬프트",
          description: "변수 관계에 맞는 분석 방법 안내",
          copyable: true,
          body: `독립변수: [독립변수 입력]
종속변수: [종속변수 입력]
고등학생 수준에서 이 변수 관계를 분석할 수 있는 방법을 2~3개 제안해 줘.
각 방법마다 (1) 적합한 그래프 종류, (2) 필요한 계산, (3) 주의점을 적어 줘.`,
        },
      ],
    },
    {
      tabId: "chart-making",
      tabTitle: "그래프 생성",
      description: "스프레드시트로 변수 관계를 잘 보여주는 그래프를 만듭니다.",
      studentSummary: "변수 관계에 맞는 그래프를 생성하고 제목·축 설명을 설정합니다.",
      teacherNote: "축 단위가 적절한지, 범례가 필요한지 확인하세요.",
      blocks: [
        {
          title: "그래프 생성 가이드",
          description: "스프레드시트 차트 생성 단계",
          copyable: false,
          body: `1. 데이터 범위를 선택한다.
2. [삽입] → [차트]에서 그래프 종류를 선택한다.
   - 비교: 막대 그래프
   - 추이: 꺾은선 그래프
   - 상관: 산점도
3. 차트 제목, X축 제목, Y축 제목을 입력한다.
4. 축 단위와 눈금 간격을 조정한다.
5. 그래프를 이미지로 캡처해 보고서에 첨부한다.`,
        },
      ],
    },
    {
      tabId: "chart-interpret",
      tabTitle: "그래프 해석",
      description: "그래프에서 읽을 수 있는 패턴과 의미를 객관적으로 해석합니다.",
      studentSummary: "그래프에서 관찰되는 패턴을 사실로 해석하고, 주장과 추측을 구분합니다.",
      teacherNote: "해석이 데이터에 근거하는지, 과잉 해석은 아닌지 점검하세요.",
      blocks: [
        {
          title: "그래프 해석 프롬프트",
          description: "객관적 패턴 해석",
          copyable: true,
          body: `그래프 설명: [그래프 종류·축·데이터 범위 입력]
이 그래프에서 관찰되는 객관적 패턴 3가지를 작성해 줘.
조건:
- 데이터 수치에 근거할 것
- 주장이 아닌 관찰 사실로 작성할 것
- 추측은 '추측'이라고 명시할 것`,
        },
      ],
    },
    {
      tabId: "intro-edit",
      tabTitle: "서론 작성",
      description: "연구 배경·목적·필요성을 객관적 사실로 작성합니다.",
      studentSummary: "AI 초안을 바탕으로 서론을 작성하고, 사실과 주장을 구분합니다.",
      teacherNote: "서론에 주관적 의견이 들어가지 않았는지 확인하세요.",
      blocks: [
        {
          title: "서론 작성 프롬프트",
          description: "연구 배경·목적·필요성 초안 생성",
          copyable: true,
          body: `탐구 질문: [탐구 질문 입력]
연구 배경·연구 목적·연구 필요성 각각 3~4문장으로 초안을 작성해 줘.
조건:
- 객관적 사실과 출처에 근거할 것
- 주관적 의견·과장 표현은 빼고, 사실 위주로 작성할 것
- 각 문단은 배경→목적→필요성 순서로 구성할 것`,
        },
      ],
    },
    {
      tabId: "method-check",
      tabTitle: "연구 방법",
      description: "데이터 출처·수집 방법·분석 방법을 재현 가능하게 정리합니다.",
      studentSummary: "연구 방법을 누구나 따라 할 수 있도록 구체적으로 작성합니다.",
      teacherNote: "연구 방법의 재현성을 점검하세요.",
      blocks: [
        {
          title: "연구 방법 정리 프롬프트",
          description: "재현 가능한 연구 방법 작성",
          copyable: true,
          body: `데이터 출처: [출처 입력]
수집 방법: [수집 방법 입력]
분석 방법: [분석 방법 입력]
이 연구 방법을 다른 사람도 동일하게 따라 할 수 있도록, 누락된 단계나 도구·기준을 보완해 줘.`,
        },
      ],
    },
    {
      tabId: "conclusion-logic",
      tabTitle: "결론 작성",
      description: "탐구 질문에 대한 답을 데이터 근거로 작성합니다.",
      studentSummary: "결론은 탐구 질문에 대한 답이며, 그래프 해석과 데이터에 근거합니다.",
      teacherNote: "결론이 데이터를 인용하는지, 과잉 일반화는 아닌지 점검하세요.",
      blocks: [
        {
          title: "결론 작성 프롬프트",
          description: "데이터 근거 결론 생성",
          copyable: true,
          body: `탐구 질문: [탐구 질문 입력]
그래프 해석: [해석 입력]
이 탐구 질문에 대한 결론을 4~5문장으로 작성해 줘.
조건:
- 그래프 해석과 데이터 수치를 근거로 인용할 것
- 탐구 질문에 대한 직접적 답을 첫 문장에 제시할 것
- 과잉 일반화·추측은 빼고, 데이터 범위 안에서 결론지을 것`,
        },
      ],
    },
    {
      tabId: "ethics-source",
      tabTitle: "참고문헌·AI 기록",
      description: "참고문헌과 AI 활용 기록을 빠짐없이 정리합니다.",
      studentSummary: "모든 출처와 AI 활용 내용을 양식에 맞춰 정리합니다.",
      teacherNote: "AI 활용 기록이 누락되지 않았는지 반드시 확인하세요.",
      blocks: [
        {
          title: "참고문헌·AI 기록 정리 프롬프트",
          description: "출처와 AI 활용 내역 정리",
          copyable: true,
          body: `사용한 출처 목록: [출처 입력]
사용한 AI 도구와 활용 내용: [AI 활용 내용 입력]
참고문헌 양식과 AI 활용 기록 양식을 각각 정리해 줘.
조건:
- 참고문헌: 작성자, 제목, 출처명, URL, 접속일 순서
- AI 활용 기록: 도구명, 사용 단계, 입력 내용 요약, 출력 활용 방법`,
        },
      ],
    },
    {
      tabId: "final-check",
      tabTitle: "최종 점검",
      description: "제출 전 보고서 필수 항목을 점검합니다.",
      studentSummary: "필수 항목 체크리스트로 보고서 완성도를 점검한 뒤 PDF를 생성합니다.",
      teacherNote: "PDF 생성 전 필수 항목 누락이 없는지 최종 확인하세요.",
      blocks: [
        {
          title: "최종 점검 체크리스트",
          description: "제출 전 필수 항목",
          copyable: false,
          body: `1. 탐구 질문·독립변수·종속변수·연구 범위가 작성되었는가?
2. 서론(배경·목적·필요성)이 객관적 사실로 작성되었는가?
3. 연구 방법(출처·수집·분석)이 재현 가능한가?
4. 그래프 이미지와 축 설명이 포함되었는가?
5. 그래프 해석이 데이터에 근거하는가?
6. 결론이 탐구 질문에 대한 답인가?
7. 한계·향후 탐구가 구체적인가?
8. 참고문헌과 AI 활용 기록이 작성되었는가?
9. 동료 피드백 반영 내용이 있는가?
10. PDF가 생성되었는가?`,
        },
      ],
    },
  ],
  creditRules: {
    totalCredits: 0,
    recommendedScenes: 0,
    baseCreditPerScene: 0,
    premiumCreditPerScene: 0,
    baseModel: "데이터 분석 수업(크레딧 사용 없음)",
    premiumModel: "데이터 분석 수업(크레딧 사용 없음)",
  },
  riskWarnings: [
    "AI가 생성한 수치·출처를 맹신하지 마세요.",
    "데이터 정제 기준 없이 이상치를 삭제하지 마세요.",
    "결론을 데이터 범위 밖까지 확장하지 마세요.",
    "AI 활용 기록을 빠짐없이 작성하세요.",
  ],
  instructorNotes: [
    "데이터 분석 수업은 크레딧 소비가 없는 무료 도구 위주로 진행됩니다.",
    "AI는 보조 도구로만 사용하고, 모든 데이터와 결론은 학생이 직접 검증하게 하세요.",
    "그래프 종류가 변수 관계에 적합한지 반드시 확인하세요.",
    "서론·결론이 주장이 아닌 객관적 사실·데이터 근거인지 점검하세요.",
    "PDF 생성 전 필수 항목 체크리스트를 완료했는지 확인하세요.",
  ],
  practiceSteps: [
    {
      title: "주제 탐색과 탐구 질문 설정",
      toolKey: "gpt",
      role: "AI로 관심 주제를 탐색하고 탐구 질문·변수를 설정합니다.",
      activity: "AI 주제 탐색 프롬프트로 주제 후보를 확인하고, 탐구 질문·독립변수·종속변수·연구 범위를 정리합니다.",
      output: "탐구 질문 1문장, 독립변수·종속변수, 연구 범위, 데이터 출처 후보",
      infoLabels: ["AI 주제 탐색", "탐구 질문 작성", "변수·범위 설정"],
      checklist: [
        "주제 탐색 프롬프트 실행",
        "탐구 질문 1문장 작성",
        "독립변수·종속변수 설정",
        "연구 범위 명확화",
        "데이터 출처 후보 확인",
      ],
    },
    {
      title: "데이터 수집·정제·시각화",
      toolKey: "sheets",
      role: "공공 데이터를 수집·정제하고 스프레드시트로 그래프를 생성합니다.",
      activity: "데이터를 정제(결측치·이상치 처리)하고, 그래프를 생성한 뒤 축과 제목을 설정합니다.",
      output: "정제된 데이터, 그래프 이미지, X축·Y축 설명, 그래프 제목",
      infoLabels: ["데이터 정제", "그래프 생성", "축·제목 설정"],
      checklist: [
        "데이터 수집",
        "결측치·이상치 처리",
        "그래프 종류 선택",
        "X축·Y축 설명 작성",
        "그래프 이미지 캡처·업로드",
      ],
    },
    {
      title: "서론·연구 방법 작성",
      toolKey: "claude",
      role: "연구 배경·목적·필요성과 연구 방법을 객관적으로 작성합니다.",
      activity: "AI 프롬프트로 서론 초안을 생성하고, 연구 방법을 재현 가능하게 정리합니다.",
      output: "연구 배경·목적·필요성, 연구 방법, 분석 결과 요약, 참고문헌, AI 활용 기록",
      infoLabels: ["서론 작성", "연구 방법 정리", "출처·AI 기록"],
      checklist: [
        "연구 배경 작성",
        "연구 목적·필요성 작성",
        "연구 방법 정리",
        "분석 결과 요약 작성",
        "참고문헌·AI 활용 기록 정리",
      ],
    },
    {
      title: "결론·PDF 제출",
      toolKey: "gpt",
      role: "결론·한계·향후 탐구를 정리하고 동료 피드백을 반영해 PDF를 제출합니다.",
      activity: "그래프 해석과 결론을 작성하고, 한계·향후 탐구를 정리한 뒤 PDF를 생성합니다.",
      output: "그래프 해석, 결론, 한계·향후 탐구, 동료 피드백 반영, 최종 PDF",
      infoLabels: ["결론 작성", "한계·향후 탐구", "PDF 생성"],
      checklist: [
        "그래프 해석 작성",
        "결론 작성",
        "한계·향후 탐구 작성",
        "동료 피드백 반영",
        "PDF 생성 및 제출",
      ],
    },
  ],
  finalDeliverables: [
    "AI 데이터 분석 기반 주제탐구보고서 1부 (PDF)",
    "그래프 이미지 1개 이상",
    "참고문헌 및 AI 활용 기록",
  ],
  warnings: [
    "AI가 생성한 수치·출처는 반드시 원문에서 교차 검증하세요.",
    "데이터 정제 기준 없이 이상치를 삭제하지 마세요.",
    "결론을 데이터 범위 밖까지 확장하지 마세요.",
  ],
  examples: [
    "탐구 질문 예시: '대중교통 이용량이 증가할 때 대기오염도는 어떻게 변화하는가?'",
    "그래프 예시: 월별 대중교통 이용량과 대기오염도를 비교한 이중 축 꺾은선 그래프",
    "결론 예시: '대중교통 이용량이 증가한 달에 대기오염도가 소폭 감소하는 경향이 관찰되었다.'",
  ],
};

function buildResearchPromptTab(tabId, tabTitle, description, studentSummary, title, body, teacherNote = "") {
  return {
    tabId,
    tabTitle,
    description,
    studentSummary,
    teacherNote,
    blocks: [
      {
        title,
        description,
        body,
        copyable: true,
        teacherNote,
      },
    ],
  };
}

function applyResearchReportCurriculum() {
  dataAnalysisLesson.classMetadata = {
    ...dataAnalysisLesson.classMetadata,
    classTitle: "주제탐구보고서 커리큘럼",
    subtitle: "AI를 활용해 탐구 주제 설정, 자료 수집·분석·시각화, 보고서 작성과 PDF 제출까지 진행하는 4차시 수업",
    finalOutput: "주제탐구보고서 PDF",
    heroCopy:
      "AI를 활용해 탐구 주제를 설정하고, 자료를 수집·분석·시각화한 뒤 서론·방법·분석·결과·결론을 포함한 주제탐구보고서를 완성합니다.",
  };

  dataAnalysisLesson.workflow = [
    { tool: "1차시-1", role: "탐구보고서 구조를 이해하고 관심 분야 키워드로 주제 후보를 만듭니다." },
    { tool: "1차시-2", role: "탐구 질문을 정교화하고 학술 자료·통계 자료 수집 전략을 세웁니다." },
    { tool: "2차시", role: "수집한 자료를 정리하고 표·그래프로 시각화하며 데이터 패턴을 해석합니다." },
    { tool: "3차시", role: "서론과 연구 방법 초안을 작성하고 AI 문장과 자기 문장을 비교·수정합니다." },
    { tool: "4차시", role: "분석 결과와 결론을 작성하고 동료 피드백을 반영해 PDF를 생성합니다." },
  ];

  dataAnalysisLesson.periods = [
    {
      period: "1차시-1",
      title: "탐구 주제 설정과 AI 활용 기초",
      goal: "탐구보고서의 구조를 이해하고 AI로 관심 분야 키워드와 주제 후보를 도출합니다.",
      activity: "관심 분야 키워드를 정리하고 ChatGPT·AI 검색툴로 주제 후보를 만든 뒤 최종 주제와 선택 이유를 작성합니다.",
      studentTasks: [
        "탐구보고서 구조 이해",
        "관심 분야 키워드 도출",
        "핵심 키워드 3~5개 작성",
        "AI로 주제 후보 만들기",
        "최종 주제와 선택 이유 작성",
      ],
      teacherTasks: [
        "서론·본론·결론 구조 설명",
        "너무 넓은 주제는 좁히도록 안내",
        "AI 제안 주제를 그대로 쓰지 않게 지도",
      ],
      tools: "ChatGPT, AI 검색툴",
      outputs: ["관심 분야", "핵심 키워드", "주제 후보 3개", "최종 선택 주제", "주제 선택 이유"],
      checkpoints: [
        "주제가 너무 넓지 않은가",
        "실제 자료를 찾을 수 있는가",
        "학생이 직접 수정한 주제인가",
      ],
      failSafe: ["교사가 예시 관심 분야를 제공", "주제 후보를 3개에서 2개로 줄임"],
      requiredReportFields: ["report.title", "report.topicReason"],
    },
    {
      period: "1차시-2",
      title: "탐구 질문 정교화 및 자료 수집 전략",
      goal: "좋은 연구 질문의 조건을 이해하고, 신뢰할 수 있는 자료 출처와 검색 전략을 세웁니다.",
      activity: "AI로 탐구 질문을 재구성하고 온라인 학술 DB와 통계 자료를 탐색해 자료 요약과 선택 이유를 작성합니다.",
      studentTasks: [
        "초안 탐구 질문 작성",
        "AI로 탐구 질문 재구성",
        "질문의 구체성·탐구 가능성 점검",
        "학술 DB·통계 자료 검색",
        "자료 요약과 선택 이유 작성",
      ],
      teacherTasks: [
        "좋은 연구 질문의 조건 설명",
        "신뢰 가능한 자료 출처 구분 안내",
        "AI 요약과 원문 내용 일치 여부 확인",
      ],
      tools: "인터넷, 구글스칼라, 학술 DB, 통계 자료",
      outputs: ["초안 연구 질문", "최종 연구 질문", "연구 대상", "연구 범위", "연구 기간", "자료 출처", "자료 요약"],
      checkpoints: [
        "질문이 구체적인가",
        "실제 자료로 탐구할 수 있는가",
        "검색 가능한 핵심어가 포함되었는가",
        "신뢰할 수 있는 자료 출처가 있는가",
        "AI 요약과 원문 내용이 일치하는가",
      ],
      failSafe: ["자료가 없는 주제는 범위를 좁히거나 유사 주제로 전환", "통계 자료 대신 학술 자료 요약 중심으로 운영"],
      requiredReportFields: [
        "report.researchQuestion",
        "report.researchScope",
        "report.methodology.dataSource",
        "report.dataSummary",
      ],
    },
    {
      period: "2차시",
      title: "자료 분석과 시각화",
      goal: "수집한 자료를 정리하고 표·그래프를 작성해 데이터의 경향과 특징을 해석합니다.",
      activity: "자료를 표로 정리하고 Excel·AI 시각화 도구로 그래프를 만든 뒤 데이터 패턴과 그래프 해석을 작성합니다.",
      studentTasks: [
        "수집한 자료 표로 정리",
        "필요 없는 자료와 중복 자료 정리",
        "주요 수치와 변수 확인",
        "AI로 자료 분석·요약",
        "Excel 또는 AI 시각화 도구로 그래프 제작",
        "데이터에서 발견한 패턴 작성",
      ],
      teacherTasks: [
        "그래프 종류가 자료에 적절한지 확인",
        "축 제목과 단위가 분명한지 점검",
        "상관관계를 원인으로 단정하지 않게 안내",
      ],
      tools: "노트북, 데이터 파일, Excel, 스프레드시트, AI 시각화 도구",
      outputs: ["자료 제목", "자료 출처", "주요 데이터", "표 또는 데이터 정리 내용", "그래프 제목", "그래프 종류", "X축·Y축 설명", "그래프 해석"],
      checkpoints: [
        "자료 출처가 기록되어 있는가",
        "표의 항목과 단위가 정확한가",
        "그래프 종류가 자료에 적절한가",
        "X축과 Y축 설명이 분명한가",
        "AI 분석 결과를 원본 자료와 비교했는가",
        "단순 상관관계를 원인으로 단정하지 않았는가",
      ],
      failSafe: ["파일 업로드는 필수가 아니라 보조 기능으로 운영", "그래프 제작이 어려우면 표 정리와 해석 중심으로 진행"],
      requiredReportFields: [
        "report.methodology.analysisMethod",
        "report.results.chartTitle",
        "report.results.xAxisDescription",
        "report.results.yAxisDescription",
        "report.results.summary",
        "report.results.interpretation",
        "chartImage",
      ],
    },
    {
      period: "3차시",
      title: "보고서 초안 작성(서론·방법)",
      goal: "AI 도움을 받아 서론과 연구 방법 초안을 작성하되 자기 문장으로 다시 수정합니다.",
      activity: "연구 배경, 목적, 필요성, 자료 수집 방법, 분석 방법을 작성하고 자기 문장과 AI 문장을 비교합니다.",
      studentTasks: [
        "연구 배경 작성",
        "탐구 목적 작성",
        "연구 필요성 작성",
        "자료 수집 방법 작성",
        "자료 분석 방법 작성",
        "자기 문장과 AI 수정 문장 비교",
        "최종 문장을 자기 문장으로 다시 작성",
      ],
      teacherTasks: [
        "AI는 대필 도구가 아니라 구조 점검 도구임을 안내",
        "표절·윤리 이슈와 AI 활용 기록 설명",
        "자기 초안을 먼저 쓴 뒤 AI 피드백을 받게 지도",
      ],
      tools: "워드, 한글, 문서 작성 프로그램, ChatGPT, Claude",
      outputs: ["연구 배경", "탐구 목적", "연구 필요성", "자료 수집 방법", "자료 분석 방법", "자기 초안", "AI 수정 문장", "최종 수정 문장", "AI 활용 기록"],
      checkpoints: [
        "서론에 배경·목적·필요성이 포함되었는가",
        "연구 방법이 실제 수행 과정과 일치하는가",
        "AI 문장을 그대로 복사하지 않았는가",
        "자기 문장과 AI 문장을 비교했는가",
        "최종 문장을 학생이 직접 수정했는가",
        "AI 활용 이력이 기록되었는가",
      ],
      failSafe: ["문장 작성이 어려운 학생에게 문단 틀 제공", "AI 수정 전 자기 초안 3문장 이상을 먼저 작성하게 함"],
      requiredReportFields: [
        "report.introduction.background",
        "report.introduction.purpose",
        "report.introduction.necessity",
        "report.methodology.collectionMethod",
        "report.methodology.analysisMethod",
        "report.selfDraft",
        "report.aiRevisedSentence",
        "report.finalRevisedSentence",
        "report.aiUsageLogs",
      ],
    },
    {
      period: "4차시",
      title: "보고서 완성(분석·결과·결론)",
      goal: "분석 결과와 결론을 작성하고 AI 교정과 동료 피드백을 반영해 최종 PDF를 완성합니다.",
      activity: "분석 결과, 그래프 해석, 연구 질문에 대한 답, 결론, 학문적 의미, 연구 한계, 향후 탐구와 피드백 반영 내용을 작성합니다.",
      studentTasks: [
        "분석 결과 작성",
        "그래프 해석을 보고서 문장으로 정리",
        "탐구 질문에 대한 답 작성",
        "최종 결론 작성",
        "학문적 의미 작성",
        "연구 한계와 향후 탐구 작성",
        "동료 피드백 반영",
        "AI 최종 교정 기록 작성",
        "최종 PDF 생성",
      ],
      teacherTasks: [
        "결과와 결론을 구분하게 지도",
        "연구 질문과 결론이 연결되는지 확인",
        "동료 피드백 반영 여부와 PDF 생성 여부 확인",
      ],
      tools: "보고서 초안, 교정 체크리스트, ChatGPT, Claude",
      outputs: ["분석 결과", "그래프 해석", "연구 질문에 대한 답", "최종 결론", "학문적 의미", "연구 한계", "향후 탐구", "동료 피드백", "피드백 반영 내용", "AI 최종 교정 기록", "최종 PDF"],
      checkpoints: [
        "연구 질문과 결론이 연결되는가",
        "결과와 결론이 구분되는가",
        "그래프 해석이 보고서에 반영되었는가",
        "학문적 의미가 포함되었는가",
        "연구 한계가 포함되었는가",
        "동료 피드백을 반영했는가",
        "AI 교정 내용을 학생이 다시 검토했는가",
        "참고문헌과 AI 활용 기록이 포함되었는가",
        "PDF 내용이 정상적으로 표시되는가",
      ],
      failSafe: ["필수 항목이 비어도 PDF 생성은 가능하되 제출 전 누락 항목을 다시 확인", "결론 작성이 어려우면 연구 질문에 대한 답 1문장부터 작성"],
      requiredReportFields: [
        "report.results.summary",
        "report.results.interpretation",
        "report.conclusion.answer",
        "report.conclusion.significance",
        "report.conclusion.limitations",
        "report.conclusion.futureResearch",
        "report.peerFeedback",
        "report.feedbackReflection",
        "report.aiFinalRevisionLog",
      ],
    },
  ];

  dataAnalysisLesson.tools = {
    gpt: {
      name: "ChatGPT",
      purpose: "관심 분야 키워드 브레인스토밍, 주제 후보 생성, 탐구 질문 재구성, 초안 교정에 활용합니다.",
      url: "https://chatgpt.com",
      required: true,
      useType: "필수 · 학생 실습용",
      creditNote: "무료 버전으로 충분하며, 전체 보고서 대필이 아니라 질문·검토·수정 보조로 사용합니다.",
      teacherNote: "AI 답변을 그대로 제출하지 않고 학생이 자기 문장으로 다시 쓰게 하세요.",
    },
    claude: {
      name: "Claude",
      purpose: "자료 요약, 문단 구조 점검, 서론·방법·결론의 논리 검토에 활용합니다.",
      url: "https://claude.ai",
      required: false,
      useType: "선택 · 긴 글 검토용",
      creditNote: "긴 자료 요약과 문장 피드백에 적합합니다.",
      teacherNote: "긴 원문을 넣을 때 개인정보나 민감 자료가 포함되지 않도록 안내하세요.",
    },
    googleScholar: {
      name: "Google Scholar",
      purpose: "학술 자료와 선행 연구를 검색합니다.",
      url: "https://scholar.google.com",
      required: false,
      useType: "자료 수집용",
      creditNote: "무료 검색이 가능하지만 원문 접근은 제한될 수 있습니다.",
      teacherNote: "학술 자료는 제목·저자·연도·출처를 반드시 기록하게 하세요.",
    },
    sheets: {
      name: "Google Sheets",
      purpose: "자료 정리, 표 작성, 그래프 제작에 활용합니다.",
      url: "https://docs.google.com/spreadsheets",
      required: true,
      useType: "자료 분석·시각화용",
      creditNote: "무료이며 그래프 제작에 충분합니다.",
      teacherNote: "그래프 종류와 축 단위가 자료에 적절한지 확인하세요.",
    },
    dataPortal: {
      name: "공공데이터포털",
      purpose: "신뢰할 수 있는 통계·공공 데이터를 찾습니다.",
      url: "https://www.data.go.kr",
      required: false,
      useType: "자료 수집용",
      creditNote: "무료이며 다운로드 가능한 자료를 우선 사용합니다.",
      teacherNote: "자료의 제공 기관, 수정일, 단위를 확인하게 하세요.",
    },
  };

  dataAnalysisLesson.practiceSteps = dataAnalysisLesson.periods.map((period) => ({
    title: `${period.period} · ${period.title}`,
    toolKey: period.period === "2차시" ? "sheets" : "gpt",
    role: period.goal,
    activity: period.activity,
    output: period.outputs.join(", "),
    infoLabels: ["학습 목표", "학생 활동", "결과물"],
    checklist: period.checkpoints,
  }));

  dataAnalysisLesson.promptTabs = [
    buildResearchPromptTab(
      "ai-principles",
      "AI 활용 기본 원칙",
      "AI를 대필 도구가 아니라 탐구 보조 도구로 사용하는 기준입니다.",
      "AI가 만든 문장을 그대로 제출하지 않고, 자료와 문장을 직접 검토합니다.",
      "AI 활용 원칙 안내",
      `다음 원칙을 지키며 주제탐구보고서를 작성한다.
1. AI는 아이디어 탐색, 질문 정교화, 자료 요약, 문장 교정 보조로만 사용한다.
2. AI가 만든 문장을 그대로 제출하지 않는다.
3. AI가 제시한 자료와 수치는 원문에서 다시 확인한다.
4. AI를 사용한 단계와 활용 내용을 보고서에 기록한다.`,
      "수업 시작 전에 반드시 읽게 하세요."
    ),
    buildResearchPromptTab(
      "keyword-brainstorm",
      "관심 분야 키워드 브레인스토밍",
      "관심 분야에서 탐구 가능한 키워드를 넓게 도출합니다.",
      "내 관심 분야를 AI에게 설명하고 탐구 가능 키워드를 받습니다.",
      "관심 분야 키워드 브레인스토밍",
      `나는 고등학생이고 주제탐구보고서를 작성하려고 한다.
관심 분야: [관심 분야 입력]
이 분야에서 탐구할 만한 핵심 키워드 10개를 제안해 줘.
각 키워드마다 왜 탐구할 가치가 있는지 한 줄로 설명해 줘.
너무 넓은 키워드는 고등학생이 조사 가능한 범위로 좁혀 줘.`,
      "학생의 실제 관심 분야를 먼저 쓰게 한 뒤 사용하게 하세요."
    ),
    buildResearchPromptTab(
      "topic-candidates",
      "탐구 주제 후보 만들기",
      "키워드를 바탕으로 주제 후보 3개를 만듭니다.",
      "AI가 제안한 주제를 그대로 쓰지 않고 내가 수정할 후보로 사용합니다.",
      "탐구 주제 후보 생성",
      `관심 분야: [관심 분야]
핵심 키워드: [키워드 3~5개]
위 내용을 바탕으로 주제탐구보고서 주제 후보 3개를 만들어 줘.
각 후보마다 다음을 표로 정리해 줘.
- 주제명
- 탐구 가능성
- 찾을 수 있는 자료 유형
- 장점
- 주의할 점
마지막에는 고등학생에게 가장 적합한 주제 1개를 추천해 줘.`,
      "AI 추천 주제를 학생이 다시 수정했는지 확인하세요."
    ),
    buildResearchPromptTab(
      "question-refine",
      "탐구 질문 재구성",
      "초안 질문을 구체적이고 탐구 가능한 질문으로 바꿉니다.",
      "좋은 탐구 질문은 구체적이고 자료로 확인 가능해야 합니다.",
      "탐구 질문 재구성",
      `초안 탐구 질문: [초안 질문]
이 질문을 더 좋은 연구 질문으로 재구성해 줘.
조건:
- 너무 넓지 않게 만들 것
- 실제 자료로 탐구 가능할 것
- 연구 대상과 범위가 드러날 것
- 질문형 문장으로 쓸 것
수정 전 질문, 수정 후 질문, 수정 이유를 표로 정리해 줘.`,
      "구체성, 탐구 가능성, 자료 접근성을 함께 확인하세요."
    ),
    buildResearchPromptTab(
      "academic-search",
      "학술 DB 검색어 만들기",
      "학술 DB와 통계 자료 검색어를 만듭니다.",
      "검색어를 잘 만들어야 자료를 빠르게 찾을 수 있습니다.",
      "학술·통계 자료 검색어 만들기",
      `탐구 질문: [탐구 질문]
이 질문과 관련된 자료를 찾기 위한 검색어를 만들어 줘.
다음 형식으로 정리해 줘.
- 학술 DB 검색어 5개
- 통계 자료 검색어 5개
- 공공데이터 검색어 5개
- 검색할 때 함께 넣으면 좋은 보조 키워드
각 검색어가 어떤 자료를 찾는 데 유용한지도 설명해 줘.`,
      "검색어가 너무 좁거나 너무 넓지 않은지 확인하세요."
    ),
    buildResearchPromptTab(
      "source-summary",
      "학술자료·통계자료 요약",
      "학술 자료·통계 자료를 AI로 요약하되 원문과 비교합니다.",
      "AI 요약은 반드시 원문과 비교해야 합니다.",
      "자료 요약 및 신뢰도 점검",
      `자료 제목: [자료 제목]
자료 출처/URL: [출처]
자료의 주요 내용: [자료 일부 또는 요약]
이 자료를 주제탐구보고서에 활용할 수 있도록 요약해 줘.
다음 항목을 포함해 줘.
- 핵심 내용 3줄 요약
- 내 탐구 질문과의 관련성
- 활용 가능한 통계·사례
- 주의해야 할 한계
- 원문에서 다시 확인해야 할 부분`,
      "AI 요약과 원문 내용이 일치하는지 반드시 확인하게 하세요."
    ),
    buildResearchPromptTab(
      "data-cleaning",
      "자료 정리 및 핵심 수치 찾기",
      "수집한 자료를 표로 정리하고 주요 수치를 찾습니다.",
      "자료를 그래프로 만들기 전에 제목, 단위, 주요 수치를 정리합니다.",
      "자료 정리 및 핵심 수치 찾기",
      `수집한 자료 내용: [자료 내용 또는 표]
이 자료를 보고서에 쓰기 좋게 정리해 줘.
다음 항목을 표로 작성해 줘.
- 자료 제목
- 자료 출처
- 주요 항목
- 단위
- 핵심 수치
- 분석에 사용할 수 있는 부분
불필요하거나 중복되는 자료가 있으면 따로 표시해 줘.`,
      "파일 업로드가 필수 목표가 아님을 안내하세요."
    ),
    buildResearchPromptTab(
      "pattern-interpret",
      "데이터 패턴 해석",
      "자료에서 보이는 경향과 특징을 해석합니다.",
      "수치에서 보이는 패턴을 쓰되, 원인으로 단정하지 않습니다.",
      "데이터 패턴 해석",
      `자료 또는 그래프 설명: [자료/그래프 설명]
이 자료에서 발견할 수 있는 경향과 특징을 정리해 줘.
조건:
- 객관적으로 보이는 사실과 해석을 구분할 것
- 단순 상관관계를 원인으로 단정하지 말 것
- 보고서에 쓸 수 있는 문장으로 제안할 것
- 추가로 확인하면 좋은 자료를 제안할 것`,
      "상관과 인과를 구분하도록 강조하세요."
    ),
    buildResearchPromptTab(
      "chart-recommend",
      "그래프 종류 추천",
      "자료에 맞는 표·그래프 유형을 고릅니다.",
      "자료의 성격에 맞는 그래프를 선택합니다.",
      "그래프 종류 추천",
      `자료의 형태: [예: 연도별 수치, 항목별 비교, 두 변수 관계]
분석 목적: [비교/변화/관계/비율 등]
이 자료를 표현하기에 적절한 그래프 종류를 추천해 줘.
각 그래프마다 장점, 단점, X축, Y축에 넣을 항목을 설명해 줘.
고등학생 보고서에 가장 적합한 그래프 1개를 추천해 줘.`,
      "막대, 꺾은선, 산점도 등 기본 그래프 중심으로 안내하세요."
    ),
    buildResearchPromptTab(
      "chart-interpret-check",
      "그래프 해석 점검",
      "그래프 해석이 자료 범위 안에서 작성되었는지 확인합니다.",
      "그래프에서 보이는 사실과 해석을 구분합니다.",
      "그래프 해석 점검",
      `그래프 제목: [그래프 제목]
X축 의미: [X축]
Y축 의미: [Y축]
그래프에서 보이는 변화: [변화]
이 그래프 해석에서 사실, 해석, 과장된 표현을 구분해 줘.
탐구 질문과 연결되는 문장으로 다듬을 점도 알려 줘.`,
      "원인 단정, 과장 표현, 단위 누락을 확인하게 하세요."
    ),
    buildResearchPromptTab(
      "intro-method",
      "서론 작성 도움",
      "서론과 연구 방법 초안을 작성합니다.",
      "배경, 목적, 필요성, 자료 수집과 분석 방법을 구분합니다.",
      "서론 및 연구 방법 초안",
      `탐구 주제: [주제]
탐구 질문: [질문]
자료 출처: [자료 출처]
분석 방법: [분석 방법]
위 내용을 바탕으로 주제탐구보고서의 서론과 연구 방법 초안을 작성해 줘.
서론은 연구 배경, 연구 목적, 연구 필요성으로 나누고,
연구 방법은 자료 수집 방법과 분석 방법으로 나누어 작성해 줘.
단, 학생이 자기 문장으로 다시 고칠 수 있도록 너무 완성된 문장보다 수정 가능한 초안 형태로 작성해 줘.`,
      "학생 자기 초안 작성 후 AI 피드백을 받게 하세요."
    ),
    buildResearchPromptTab(
      "method-help",
      "연구 방법 작성 도움",
      "실제로 수행한 자료 수집과 분석 과정을 연구 방법으로 정리합니다.",
      "자료 수집 방법과 분석 방법을 구분해 작성합니다.",
      "연구 방법 작성 도움",
      `탐구 질문: [탐구 질문]
자료 출처: [자료 출처]
자료 수집 방법: [내가 자료를 찾은 방법]
자료 분석 방법: [표, 그래프, 비교, 변화 분석 등]
위 내용을 바탕으로 연구 방법 단락을 점검해 줘.
내가 실제로 하지 않은 과정은 추가하지 말고, 빠진 설명과 더 명확히 쓸 부분만 알려 줘.`,
      "학생이 실제 수행하지 않은 분석 방법을 AI가 꾸며 넣지 않게 확인하세요."
    ),
    buildResearchPromptTab(
      "self-vs-ai",
      "자기 문장과 AI 문장 비교",
      "자기 초안과 AI 수정 문장을 비교합니다.",
      "AI가 고친 문장을 그대로 쓰지 않고 차이를 비교합니다.",
      "자기 문장과 AI 문장 비교",
      `내가 쓴 문장: [자기 초안]
AI가 수정한 문장: [AI 수정 문장]
두 문장을 비교해 줘.
다음 항목으로 정리해 줘.
- 의미가 더 명확해진 부분
- 표현이 과장되거나 학생답지 않은 부분
- 다시 고쳐야 할 부분
- 내가 최종 문장으로 다시 쓸 때 주의할 점`,
      "최종 문장은 학생이 다시 직접 쓰게 하세요."
    ),
    buildResearchPromptTab(
      "ethics-check",
      "표절·윤리 점검",
      "AI 활용과 출처 기록을 점검합니다.",
      "출처와 AI 활용 기록을 빠뜨리지 않습니다.",
      "표절·윤리·출처 점검",
      `보고서 초안: [초안 일부]
사용한 자료 출처: [출처 목록]
AI 활용 내용: [사용한 AI와 활용 단계]
표절·윤리·출처 측면에서 점검해 줘.
다음 항목을 확인해 줘.
- 출처가 필요한 문장
- AI 활용 기록에 포함해야 할 내용
- 그대로 베낀 것처럼 보일 수 있는 표현
- 학생 문장으로 바꾸면 좋은 부분`,
      "출처 누락과 AI 대필처럼 보이는 문장을 점검하세요."
    ),
    buildResearchPromptTab(
      "result-conclusion",
      "결과·결론 논리 점검",
      "분석 결과와 결론의 논리를 점검합니다.",
      "결과와 결론을 구분하고 탐구 질문에 답합니다.",
      "결과·결론 논리 점검",
      `탐구 질문: [탐구 질문]
분석 결과: [분석 결과]
그래프 해석: [그래프 해석]
결론 초안: [결론 초안]
결과와 결론이 논리적으로 연결되는지 점검해 줘.
다음 항목을 알려 줘.
- 탐구 질문에 대한 답이 분명한가
- 결과와 결론이 구분되는가
- 데이터 범위를 넘어선 주장이 있는가
- 결론을 더 정확하게 고친 문장`,
      "결론이 데이터 범위를 넘지 않게 지도하세요."
    ),
    buildResearchPromptTab(
      "significance",
      "학문적 의미 정리",
      "탐구 결과가 갖는 의미와 한계를 함께 정리합니다.",
      "결과를 과장하지 않고 의미, 한계, 향후 탐구로 나눕니다.",
      "학문적 의미 정리",
      `탐구 주제: [탐구 주제]
탐구 질문: [탐구 질문]
분석 결과: [분석 결과]
결론: [결론]
이 탐구가 갖는 학문적 의미, 연구의 한계, 향후 탐구 방향을 구분해서 정리할 수 있도록 질문과 피드백을 줘.
새로운 사실을 꾸며 쓰지 말고 내가 쓴 내용 안에서만 제안해 줘.`,
      "자료 범위를 넘어 일반화하지 않도록 안내하세요."
    ),
    buildResearchPromptTab(
      "peer-feedback",
      "동료 피드백 반영",
      "동료 피드백을 보고서 수정에 반영합니다.",
      "받은 피드백을 그대로 적는 것이 아니라 어떻게 반영했는지 씁니다.",
      "동료 피드백 반영 정리",
      `동료 피드백: [받은 피드백]
내가 수정한 내용: [수정 내용]
이 내용을 보고서의 '피드백 반영 내용'에 넣을 수 있게 정리해 줘.
다음 형식으로 작성해 줘.
- 받은 피드백
- 반영한 부분
- 반영하지 않은 부분과 이유
- 수정 후 더 좋아진 점`,
      "피드백을 실제 수정으로 연결했는지 확인하세요."
    ),
    buildResearchPromptTab(
      "final-check",
      "최종 보고서 점검",
      "PDF 생성 전 보고서 필수 항목을 확인합니다.",
      "누락 항목을 확인하고 PDF를 생성합니다.",
      "최종 보고서 체크리스트",
      `내 보고서 초안: [초안 또는 목차]
아래 기준으로 최종 점검해 줘.
1. 탐구 주제와 선택 이유가 있는가
2. 탐구 질문이 구체적인가
3. 자료 출처와 자료 요약이 있는가
4. 서론과 연구 방법이 구분되는가
5. 표 또는 그래프와 해석이 있는가
6. 분석 결과와 결론이 구분되는가
7. 학문적 의미, 한계, 향후 탐구가 있는가
8. 참고문헌과 AI 활용 기록이 있는가
9. 동료 피드백 반영 내용이 있는가
10. PDF로 제출해도 되는 상태인가`,
      "PDF 생성 전 마지막으로 사용하게 하세요."
    ),
  ];

  dataAnalysisLesson.riskWarnings = [
    "AI가 만든 주제를 그대로 사용하지 마세요.",
    "자료 출처 없이 주장만 쓰지 마세요.",
    "AI 요약은 원문과 반드시 비교하세요.",
    "상관관계를 원인으로 단정하지 마세요.",
    "AI 문장을 그대로 제출하지 마세요.",
    "참고문헌과 AI 활용 기록을 빠뜨리지 마세요.",
  ];

  dataAnalysisLesson.instructorNotes = [
    "1차시는 두 단계로 운영합니다. 1차시-1은 주제 후보, 1차시-2는 탐구 질문과 자료 수집 전략입니다.",
    "자료 분석 수업으로 축소하지 말고, 서론·방법·분석·결과·결론을 포함한 주제탐구보고서 완성을 목표로 안내하세요.",
    "AI는 대필 도구가 아니라 질문 정교화, 자료 요약, 문장 교정 보조 도구로 사용하게 하세요.",
    "파일 업로드는 필수 목표가 아니라 보조 기능입니다. 핵심은 수집 자료를 이해하고 표·그래프로 표현하는 것입니다.",
    "PDF 생성 전 참고문헌, AI 활용 기록, 동료 피드백 반영 여부를 확인하세요.",
  ];
}

applyResearchReportCurriculum();

const lessonRegistry = {
  hotelPromo: hotelPromoLesson,
  dataAnalysisReport: dataAnalysisLesson,
  localEventShorts: createSampleLesson({
    id: "localEventShorts",
    classTitle: "AI 지역행사 홍보 숏츠 제작",
    subtitle: "지역 전시·공연·축제·체험 정보를 바탕으로 15초 세로형 AI 홍보영상을 제작하는 90분 실습",
    targetAudience: "중·고등학생 / 지역 홍보·영상 제작 수업",
    totalDuration: "90분",
    finalOutput: "15초 세로형 지역행사 홍보영상",
    recommendedScenes: 4,
    shortName: "지역행사 홍보 숏츠",
    brandLabel: "LoreAX Class ERP",
    heroCopy: "김포시 문화행사, 공연, 전시, 교육·체험 프로그램 정보를 공식 페이지에서 확인한 뒤 15초 세로형 홍보 숏츠를 완성합니다.",
    workflow: ["행사정보 확인·기획", "15초 스토리보드", "장면별 문구·프롬프트", "AI 이미지·영상 생성", "자막·오디오·편집", "미리보기·완성"],
    selectionTask: "김포시 지역행사 또는 직접 입력 주제 선택",
    imageTask: "지역행사 분위기를 보여주는 9:16 장면 이미지 생성",
    editTools: "CapCut, Canva",
    tools: {
      gpt: {
        name: "ChatGPT",
        purpose: "공식 정보 요약, Hook 문구, 장면별 자막·프롬프트 작성",
        url: "https://chatgpt.com",
        required: true,
        useType: "메인 제작용",
        creditNote: "확인하지 않은 날짜·장소·비용·신청정보는 생성하지 않습니다.",
        teacherNote: "학생이 공식 페이지에서 최신 정보를 확인한 뒤 입력했는지 먼저 확인하세요.",
      },
      flow: {
        name: "Google Flow",
        purpose: "지역행사 장면별 세로형 영상 생성",
        url: "https://labs.google/fx/tools/flow",
        required: true,
        useType: "메인 제작용",
        creditNote: "15초 완성을 위해 3~4초 장면 4개로 제한합니다.",
        teacherNote: "과도한 카메라 움직임과 확인되지 않은 행사 정보를 프롬프트에 넣지 않게 하세요.",
      },
      capcut: {
        name: "CapCut",
        purpose: "자막, BGM, 화면 전환, 최종 세로형 영상 편집",
        url: "https://www.capcut.com",
        required: true,
        useType: "메인 제작용",
        creditNote: "모바일에서 읽히도록 자막 길이를 짧게 유지합니다.",
        teacherNote: "BGM은 공공 홍보에 어울리는 밝고 친근한 분위기로 제한하세요.",
      },
      canva: {
        name: "Canva",
        purpose: "선택 체험용 썸네일 또는 행사 정보 카드 제작",
        url: "https://www.canva.com",
        required: false,
        useType: "선택 체험용",
        creditNote: "시간이 부족하면 영상 편집에 집중합니다.",
        teacherNote: "썸네일은 확장 활동으로만 운영하세요.",
      },
    },
    promptTopic: {
      title: "AI 지역행사 홍보 숏츠 제작",
      shortName: "지역행사",
      outputName: "15초 지역행사 홍보 숏츠",
      imageTarget: "지역행사 대표 장면",
      imagePrompt: "Create a high-quality 9:16 vertical image for a local cultural event promotion. Show families or students participating in an exhibition, performance, festival, or hands-on workshop. Include a clear public cultural venue or event atmosphere, bright friendly lighting, community-centered mood, no random text, no logo, no fake dates, no prices.",
      videoFocus: "첫 3초 Hook, 행사 분위기, 확인 정보, CTA",
      videoPrompt: "Create a realistic cinematic 3-4 second vertical 9:16 video scene for a local event promotional short. Show a clear subject, real action, event venue or cultural activity, stable camera movement, bright friendly public-promotion mood, and safe space for Korean captions. Do not invent dates, places, prices, application details, logos, or random text.",
      recommendedScenes: 4,
      recommendedStructure: "Hook 0~3초 + Main Visual 3~7초 + Information 7~12초 + CTA 12~15초",
      reviewSummary: "정보 정확성, 3초 Hook, 모바일 가독성, 장면별 메시지, CTA 명확성을 기준으로 점검합니다.",
      reviewPrompt: "리뷰 포인트:\n- 첫 3초 안에 관심을 끄는가?\n- 공식 페이지에서 확인한 정보만 사용했는가?\n- 행사명·날짜·시간·장소·참여 방법이 정확한가?\n- 9:16 세로형 화면에서 자막이 읽히는가?\n- 장면 흐름이 Hook → 분위기 → 정보 → CTA로 이어지는가?\n- 확인되지 않은 정보나 과장 표현은 없는가?",
    },
  }),
  tourismPromo: createSampleLesson({
    id: "tourismPromo",
    classTitle: "AI 관광지 소개영상 제작 수업",
    subtitle: "관광지의 매력과 방문 포인트를 30~40초 영상으로 소개하는 실습형 프로그램",
    targetAudience: "고등학생 / 관광·홍보 수업",
    totalDuration: "4교시",
    finalOutput: "30~40초 관광지 소개영상",
    recommendedScenes: 4,
    shortName: "관광지 소개영상",
    brandLabel: "LoreAX Class ERP",
    heroCopy: "관광지 선정, 소개 콘셉트 작성, 대표 이미지 생성, 장면 영상 생성, 편집 과정을 통해 관광지 소개영상을 완성합니다.",
    workflow: ["관광지 선정", "소개 콘셉트 작성", "대표 이미지 생성", "장면 영상 생성", "편집", "제출"],
    selectionTask: "관광지 선정",
    imageTask: "관광지 대표 장면 이미지 생성",
    editTools: "CapCut, ElevenLabs",
    tools: {
      gpt: {
        name: "ChatGPT",
        purpose: "관광지 소개문, 나레이션, 프롬프트 작성",
        url: "https://chatgpt.com",
        required: true,
        useType: "메인 제작용",
        creditNote: "정보 정확성을 확인한 뒤 소개문을 사용합니다.",
        teacherNote: "실제 관광지 정보와 과장 표현을 확인하세요.",
      },
      flow: {
        name: "Google Flow",
        purpose: "관광지 장면 영상 생성",
        url: "https://labs.google/fx/tools/flow",
        required: true,
        useType: "메인 제작용",
        creditNote: "장면 수를 4개 안팎으로 제한합니다.",
        teacherNote: "모델 선택과 크레딧 소모량을 먼저 확인하세요.",
      },
      capcut: {
        name: "CapCut",
        purpose: "편집, 자막, BGM",
        url: "https://www.capcut.com",
        required: true,
        useType: "메인 제작용",
        creditNote: "편집 도구 설치 여부를 미리 확인합니다.",
        teacherNote: "BGM이 관광지 분위기와 맞는지 확인하게 하세요.",
      },
      elevenlabs: {
        name: "ElevenLabs",
        purpose: "선택 체험용 나레이션 생성",
        url: "https://elevenlabs.io",
        required: false,
        useType: "선택 체험용",
        creditNote: "시간이 부족하면 자막으로 대체합니다.",
        teacherNote: "나레이션 길이를 짧게 제한하세요.",
      },
    },
    promptTopic: {
      title: "AI 관광지 소개영상 제작 수업",
      shortName: "관광지",
      outputName: "관광지 소개영상",
      imageTarget: "관광지 대표 장면",
      imagePrompt: "Create a realistic cinematic 16:9 image of a famous travel destination with attractive scenery, clear weather, natural visitors in the background, and a welcoming tourism promotion mood. High detail, clean lighting, no random text, no logo.",
      videoFocus: "관광지 풍경, 방문 포인트, 현장감",
      videoPrompt: "Create a realistic cinematic 10-second tourism promotional video. Show the destination scenery, visitor experience, and one clear travel highlight. Use stable camera movement, natural lighting, no random text, no logo, and subtitles only when requested.",
      recommendedScenes: 4,
      recommendedStructure: "인트로 + 방문 포인트 2장면 + 아웃트로",
      reviewSummary: "정보 정확성, 관광 매력, 자막 정확성을 기준으로 결과물을 점검합니다.",
      reviewPrompt: "리뷰 포인트:\n- 관광지 정보가 정확한가?\n- 방문하고 싶은 매력이 드러나는가?\n- 자막과 나레이션이 일치하는가?\n- 장면 흐름이 자연스러운가?\n- 과장되거나 부정확한 표현은 없는가?",
    },
  }),
  productAd: createSampleLesson({
    id: "productAd",
    classTitle: "AI 제품 광고영상 제작 수업",
    subtitle: "제품의 장점과 광고 메시지를 20~30초 영상으로 표현하는 실습형 프로그램",
    targetAudience: "고등학생 / 마케팅·창업 수업",
    totalDuration: "4교시",
    finalOutput: "20~30초 제품 광고영상",
    recommendedScenes: 3,
    shortName: "제품 광고영상",
    brandLabel: "LoreAX Class ERP",
    heroCopy: "제품 선정, 광고 메시지 작성, 제품 이미지 생성, 광고 장면 영상 생성, 편집 과정을 통해 제품 광고영상을 완성합니다.",
    workflow: ["제품 선정", "광고 메시지 작성", "제품 이미지 생성", "광고 장면 영상 생성", "편집", "제출"],
    selectionTask: "제품 선정",
    imageTask: "제품 대표 이미지 생성",
    editTools: "CapCut, Canva",
    tools: {
      gpt: {
        name: "ChatGPT",
        purpose: "제품 설명, 광고 카피, 프롬프트 작성",
        url: "https://chatgpt.com",
        required: true,
        useType: "메인 제작용",
        creditNote: "제품 장점을 1~2개로 좁히면 결과가 안정됩니다.",
        teacherNote: "과장 광고 표현을 점검하세요.",
      },
      flow: {
        name: "Google Flow",
        purpose: "제품 광고 장면 영상 생성",
        url: "https://labs.google/fx/tools/flow",
        required: true,
        useType: "메인 제작용",
        creditNote: "제품 컷, 사용 장면, 콜투액션 정도로 장면을 제한합니다.",
        teacherNote: "제품 로고나 브랜드 표현은 수업 상황에 맞게 조정하세요.",
      },
      capcut: {
        name: "CapCut",
        purpose: "편집, 자막, BGM",
        url: "https://www.capcut.com",
        required: true,
        useType: "메인 제작용",
        creditNote: "짧은 광고 리듬에 맞게 컷을 줄입니다.",
        teacherNote: "광고 카피가 화면을 가리지 않게 지도하세요.",
      },
      canva: {
        name: "Canva",
        purpose: "선택 체험용 썸네일/광고 이미지 제작",
        url: "https://www.canva.com",
        required: false,
        useType: "선택 체험용",
        creditNote: "시간이 부족하면 생략합니다.",
        teacherNote: "썸네일 제작은 확장 활동으로만 운영하세요.",
      },
    },
    promptTopic: {
      title: "AI 제품 광고영상 제작 수업",
      shortName: "제품 광고",
      outputName: "제품 광고영상",
      imageTarget: "제품 대표 이미지",
      imagePrompt: "Create a realistic 16:9 product advertising image. Show the product clearly in a clean studio or lifestyle setting, with attractive lighting, strong composition, premium commercial mood, no random text, and no logo unless provided.",
      videoFocus: "제품 사용 장면, 장점 강조, 콜투액션",
      videoPrompt: "Create a realistic cinematic 10-second product advertisement video. Show the product clearly, demonstrate one key benefit, include a simple call-to-action mood, use smooth camera movement, clean lighting, no random text, and no extra distracting objects.",
      recommendedScenes: 3,
      recommendedStructure: "제품 소개 + 사용 장면 + 콜투액션",
      reviewSummary: "메시지 명확성, 설득력, 브랜드 느낌, 제품 특징 표현을 기준으로 점검합니다.",
      reviewPrompt: "리뷰 포인트:\n- 광고 메시지가 명확한가?\n- 제품 특징이 잘 보이는가?\n- 설득력 있는 장면 흐름인가?\n- 브랜드 느낌이 일관적인가?\n- 콜투액션이 자연스러운가?",
    },
  }),
};

Object.assign(lessonRegistry.localEventShorts, {
  workflow: [
    { tool: "01", role: "행사정보 확인·기획" },
    { tool: "02", role: "15초 스토리보드" },
    { tool: "03", role: "장면별 문구·프롬프트" },
    { tool: "04", role: "AI 이미지·영상 생성" },
    { tool: "05", role: "자막·오디오·편집" },
    { tool: "06", role: "미리보기·완성" },
  ],
  periods: [
    {
      period: "1단계",
      title: "행사정보 확인·기획",
      goal: "공식 페이지에서 지역행사 정보를 확인하고 홍보 대상과 핵심 메시지를 정합니다.",
      activity: "김포시 문화행사·공연·전시·교육·체험 중 하나를 선택하거나 직접 주제를 입력하고, 행사명·대상·목적·공식 출처를 정리합니다.",
      studentTasks: ["추천 주제 선택 또는 직접 입력", "공식 페이지에서 최신 정보 확인", "홍보 대상과 목적 작성", "핵심 메시지 1문장 작성"],
      teacherTasks: ["학생이 공식 링크를 열어 확인했는지 점검", "확인되지 않은 날짜·장소·비용·신청정보를 쓰지 않게 안내"],
      tools: "ChatGPT",
      toolKeys: ["gpt"],
      outputs: ["행사 정보 기획서", "공식 출처", "핵심 메시지"],
      checkpoints: ["공식 출처가 있는가", "홍보 대상이 명확한가", "확인되지 않은 정보가 없는가"],
      failSafe: ["공식 정보가 부족하면 날짜·비용 등 세부정보를 비워 둠", "직접 입력 주제로 대체"],
    },
    {
      period: "2단계",
      title: "15초 스토리보드",
      goal: "Hook, Main Visual, Information, CTA의 4장면 흐름을 만듭니다.",
      activity: "0~3초 Hook, 3~7초 행사 분위기, 7~12초 핵심 정보, 12~15초 행동 유도 구조로 장면을 설계합니다.",
      studentTasks: ["Hook 문구 작성", "행사 분위기 장면 정하기", "확인 정보 장면 정하기", "CTA 문구 작성"],
      teacherTasks: ["첫 3초 Hook이 짧고 명확한지 확인", "모바일에서 읽을 수 있는 길이로 줄이게 안내"],
      tools: "ChatGPT",
      toolKeys: ["gpt"],
      outputs: ["15초 4장면 스토리보드", "장면별 자막 초안"],
      checkpoints: ["4장면 구조가 있는가", "각 장면이 3~4초 안에 이해되는가", "CTA가 명확한가"],
      failSafe: ["장면 수를 3개로 줄임", "정보 장면을 자막 중심으로 대체"],
    },
    {
      period: "3단계",
      title: "장면별 문구·프롬프트",
      goal: "장면별 자막, 나레이션, 이미지·영상 생성 프롬프트를 준비합니다.",
      activity: "학생이 입력한 사실을 바탕으로 장면별 짧은 자막과 9:16 세로형 생성 프롬프트를 만듭니다.",
      studentTasks: ["장면별 자막 1줄 작성", "영상 프롬프트 복사", "확인되지 않은 정보 삭제", "생성 전 최종 점검"],
      teacherTasks: ["AI가 임의 사실을 추가하지 않았는지 확인", "장면 프롬프트에 9:16과 안정적 카메라 조건이 들어갔는지 확인"],
      tools: "ChatGPT, Google Flow",
      toolKeys: ["gpt", "flow"],
      outputs: ["Hook 문구", "장면별 자막", "영상 생성 프롬프트"],
      checkpoints: ["문구가 짧은가", "프롬프트에 행사 분위기가 보이는가", "가짜 정보가 없는가"],
      failSafe: ["문구를 자막 중심으로 축소", "영상 생성 대신 이미지 장면으로 대체"],
    },
    {
      period: "4단계",
      title: "AI 이미지·영상 생성",
      goal: "장면별 3~4초 세로형 영상 또는 이미지 클립을 생성합니다.",
      activity: "Hook, Main Visual, Information, CTA 장면을 생성하고 결과를 저장합니다.",
      studentTasks: ["9:16 비율 확인", "장면별 생성", "결과 저장", "문제 장면 재생성 여부 판단"],
      teacherTasks: ["Generate 버튼 조기 클릭 방지", "과도한 카메라 움직임과 랜덤 텍스트 결과 점검"],
      tools: "Google Flow",
      toolKeys: ["flow"],
      outputs: ["세로형 장면 클립 4개 또는 이미지 4장"],
      checkpoints: ["9:16인가", "장면에 주제가 보이는가", "랜덤 텍스트·로고가 없는가"],
      failSafe: ["장면 수를 3개로 축소", "영상 대신 이미지와 자막으로 편집"],
    },
    {
      period: "5단계",
      title: "자막·오디오·편집",
      goal: "생성 결과를 15초 안에 이어 붙이고 자막, BGM, 효과음을 넣습니다.",
      activity: "CapCut에서 장면 순서를 맞추고 모바일 가독성 중심으로 자막과 BGM을 정리합니다.",
      studentTasks: ["영상 순서 정리", "자막 추가", "BGM 또는 효과음 적용", "15초 길이 확인"],
      teacherTasks: ["자막이 화면 밖으로 나가지 않는지 확인", "BGM이 공공 홍보 분위기와 맞는지 점검"],
      tools: "CapCut",
      toolKeys: ["capcut"],
      outputs: ["편집본 초안", "자막·BGM 적용 영상"],
      checkpoints: ["15초 안에 끝나는가", "자막이 읽히는가", "BGM이 과하지 않은가"],
      failSafe: ["BGM 생략", "자막만으로 최종 제출"],
    },
    {
      period: "6단계",
      title: "미리보기·완성",
      goal: "최종 15초 홍보 숏츠를 점검하고 제출합니다.",
      activity: "정보 정확성, Hook, 장면 흐름, CTA를 확인한 뒤 최종 파일을 저장합니다.",
      studentTasks: ["최종 미리보기", "공식 정보 재확인", "파일명 확인", "최종 제출"],
      teacherTasks: ["확인되지 않은 정보가 남아 있는지 최종 점검", "제출 파일 저장 여부 확인"],
      tools: "CapCut",
      toolKeys: ["capcut"],
      outputs: ["15초 세로형 지역행사 홍보영상"],
      checkpoints: ["공식 정보와 일치하는가", "CTA가 보이는가", "최종 파일이 저장되었는가"],
      failSafe: ["미완성 시 3장면 최소 구조로 제출", "이미지 슬라이드형 결과물로 대체"],
    },
  ],
});

const lessons = lessonRegistry;
window.LoreAXLessonRegistry = lessonRegistry;

function createFullPromptGenerationTab(lesson) {
  const metadata = lesson.classMetadata || {};
  const title = metadata.classTitle || "AI 실습형 영상 제작 수업";
  const output = metadata.finalOutput || "AI 영상 결과물";
  const sceneCount = metadata.recommendedSceneCount || lesson.creditRules?.recommendedScenes || 4;

  return {
    tabId: "full-prompt-set",
    tabTitle: "HeyGen 이후 합본 생성",
    description: "HeyGen 캐릭터를 먼저 만든 뒤, 그 결과를 Claude에 넣어 제작 프롬프트 합본을 생성합니다.",
    studentSummary:
      "HeyGen 캐릭터 결과를 기준으로 GPT 레퍼런스샷 프롬프트, Flow 4장면 영상 프롬프트, 한국어 나레이션, 합본 프롬프트를 요청합니다.",
    teacherNote:
      "학생이 HeyGen 캐릭터 결과를 먼저 확보한 뒤 이 프롬프트를 Claude에 넣게 하세요. 그래야 캐릭터 기준이 중복 생성되지 않습니다.",
    blocks: [
      {
        title: "HeyGen 결과 반영 합본 생성 요청",
        description:
          "HeyGen 캐릭터 생성 후 Claude에 붙여 넣어 GPT/Flow 제작 프롬프트 합본을 생성하게 하는 요청문입니다.",
        body: `너는 AI 실습형 영상 제작 수업의 프롬프트 설계자다.

이미 HeyGen 캐릭터 생성/체험을 먼저 진행했다.
아래 HeyGen 캐릭터 결과를 기준으로 다음 수업을 위한 제작 프롬프트 합본을 생성해라.

수업명: ${title}
최종 결과물: ${output}
권장 장면 수: ${sceneCount}장면
필수 장면 구조: 인트로 1장면 + 핵심 소개 2장면 + 아웃트로 1장면

학생이 입력할 정보:
- 홍보 대상 유형:
- 홍보 대상명:
- 캐릭터 역할:
- 핵심 소개 1:
- 핵심 소개 2:
- 원하는 영상 분위기:
- HeyGen 캐릭터 결과:

반드시 생성할 항목:

1. HeyGen 캐릭터 설정 요약
- 학생이 입력한 HeyGen 캐릭터 결과를 기준으로 외형, 복장, 말투, 목소리 톤, 대사를 요약한다.
- 이후 GPT와 Flow에서 이 캐릭터를 고정 기준으로 사용한다고 안내한다.
- 이후 HeyGen, ElevenLabs, CapCut 더빙에서 같은 목소리 프로필을 유지한다고 안내한다.

2. GPT 레퍼런스샷 생성 프롬프트
- HeyGen에서 확정한 캐릭터 결과를 기준으로 사용할 프롬프트를 작성한다.
- 같은 인물의 전신 4방향 레퍼런스샷을 만들도록 작성한다.
- 정면, 왼쪽, 오른쪽, 뒷모습이 모두 보이게 한다.
- 얼굴, 헤어스타일, 체형, 복장, 신발이 네 방향에서 동일해야 한다.

3. Google Flow 장면별 영상 프롬프트 4개
- 장면 1: 인트로
- 장면 2: 핵심 소개 1
- 장면 3: 핵심 소개 2
- 장면 4: 아웃트로
- 각 장면은 Flow에 따로 입력할 수 있게 분리해서 작성한다.
- 각 장면은 4방향 레퍼런스샷을 참조한다는 조건을 포함한다.

4. 각 장면별 한국어 나레이션
- 장면마다 한국어 나레이션을 20자 내외로 작성한다.
- 영상 길이에 맞게 짧고 명확한 한 문장으로 작성한다.
- 모든 장면의 나레이션은 같은 화자가 말하는 것처럼 성별 느낌, 연령대, 속도, 억양, 감정 톤을 일관되게 유지한다.
- ElevenLabs 또는 HeyGen 음성을 사용할 경우 같은 voice preset/voice ID/화자 설정을 계속 사용하라고 안내한다.

5. 전체 합본 프롬프트
- HeyGen 캐릭터 요약과 짧은 대사까지 포함한다.
- GPT 레퍼런스샷 프롬프트와 Flow 4장면 프롬프트를 모두 합쳐 정리한다.
- 목소리 일관성 유지 규칙과 장면별 나레이션 배분표를 포함한다.
- 학생이 복사해 바로 사용할 수 있도록 제목과 구분선을 명확히 넣는다.

주의:
- 이 요청문은 HeyGen 캐릭터 생성 이후에 사용합니다.
- Flow에는 4개 장면 프롬프트를 한 번에 넣지 않습니다. 장면별로 각각 입력합니다.
- 50크레딧 수업 운영을 고려해 기본 4장면 구성으로 제한합니다.
- 나레이션은 반드시 한국어로 작성합니다.
- 목소리는 장면마다 바뀌면 안 된다. 같은 화자의 톤, 속도, 억양, 감정선을 유지합니다.`,
        copyable: true,
        teacherNote:
          "HeyGen 캐릭터 결과가 없는 상태에서 합본을 만들면 캐릭터 기준이 흔들립니다. 먼저 HeyGen 체험 결과를 메모하게 하세요.",
      },
    ],
  };
}

function applyHotelPromptWorkflow() {
  const hasFullPromptTab = hotelPromoLesson.promptTabs?.some((tab) => tab.tabId === "full-prompt-set");
  if (!hasFullPromptTab) {
    hotelPromoLesson.promptTabs.unshift(createFullPromptGenerationTab(hotelPromoLesson));
  }
}

applyHotelPromptWorkflow();

(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("lesson") === "dataAnalysisReport") {
    window.location.replace("../topic-research-report/");
  }
})();

const LESSON_STORAGE_KEY = "selectedLessonId";
let currentLessonId = getStoredLessonId();
currentLessonId = "localEventShorts";
saveLessonId(currentLessonId);
let lessonData = lessons[currentLessonId];

if (window.LoreAXTenant?.guardCourseAccess?.(currentLessonId, { homeUrl: "../../index.html" })?.blocked) {
  window.LoreAXPractice = { blocked: true };
} else {

const practiceSteps = [
  {
    title: "HeyGen 체험 + 합본 프롬프트 생성",
    toolKey: "heygen",
    role:
      "HeyGen에서 캐릭터를 먼저 확정하고, 그 결과를 Claude 합본 프롬프트에 반영합니다.",
    activity:
      "HeyGen 캐릭터 생성 프롬프트로 체험을 진행한 뒤, 캐릭터 결과 메모를 넣어 GPT 레퍼런스샷, Flow 4장면 프롬프트, 장면별 한국어 나레이션을 합본으로 준비합니다.",
    output:
      "HeyGen 캐릭터 결과 메모, GPT 레퍼런스샷 프롬프트, Flow 4장면 프롬프트, 한국어 나레이션, 전체 합본 프롬프트",
    checklist: [
      "HeyGen 캐릭터 생성 프롬프트 복사",
      "HeyGen 캐릭터 생성 체험",
      "HeyGen 결과 메모 입력",
      "HeyGen 결과 반영 합본 생성 프롬프트를 Claude에 입력",
      "GPT 레퍼런스샷 생성 프롬프트 확인",
      "Flow 4장면 프롬프트와 20자 내외 나레이션 확인",
      "합본 프롬프트에 HeyGen 캐릭터 기준 포함 여부 확인",
    ],
    guides: ["screen", "style", "appearance"],
    detailTitle: "1교시 시작 순서",
    details: [
      {
        title: "HeyGen 캐릭터 먼저 생성",
        text: "Claude 프롬프트 박스에서 HeyGen 캐릭터 생성 프롬프트 요청문을 복사한 뒤, HeyGen에서 캐릭터 생성 체험을 먼저 진행합니다.",
      },
      {
        title: "HeyGen 결과 메모",
        text: "생성된 캐릭터의 외형, 복장, 말투, 짧은 대사를 프롬프트 생성기의 HeyGen 캐릭터 결과 메모 칸에 정리합니다.",
      },
      {
        title: "Claude에서 합본 생성",
        text: "HeyGen 결과 반영 합본 생성 프롬프트를 Claude에 넣어 GPT 레퍼런스샷 프롬프트와 Flow 4장면 프롬프트를 생성합니다.",
      },
      {
        title: "Flow 4장면 준비",
        text: "인트로 1, 장소소개 2, 아웃트로 1의 네 장면 프롬프트와 각 장면의 한국어 20자 내외 나레이션을 확인합니다.",
      },
    ],
  },
  {
    title: "GPT 이미지 생성",
    toolKey: "gpt",
    role: "호텔을 소개할 호텔리어 캐릭터 이미지를 생성합니다.",
    activity: "생성된 호텔리어 이미지를 GPT에 다시 입력하고, 같은 인물의 전신 4방향 레퍼런스샷을 생성합니다.",
    output: "4방향 레퍼런스샷을 기준으로 영상 흐름에 필요한 장면 이미지를 만들 수 있습니다. 이 단계는 생략 가능합니다.",
    infoLabels: ["캐릭터 생성", "레퍼런스샷 생성", "씬 참조장면 생성"],
    checklist: ["캐릭터 이미지 확인", "4방향 레퍼런스샷 생성", "씬 참조장면 생성 여부 결정"],
    guides: ["gptCharacter", "gptReference", "gptSceneReference"],
    detailTitle: "GPT 이미지 실습 진행 순서",
    details: [
      {
        title: "캐릭터 생성",
        text: "호텔을 소개할 호텔리어 캐릭터 이미지를 먼저 만듭니다. 이 이미지는 이후 레퍼런스샷과 Google Flow 영상에서 같은 인물로 유지하기 위한 기준 이미지가 됩니다.",
      },
      {
        title: "레퍼런스샷 생성",
        text: "생성된 호텔리어 이미지를 GPT에 다시 입력하고, 정면·좌측·우측·후면 4방향 전신 레퍼런스샷을 만듭니다. 얼굴, 헤어스타일, 유니폼, 체형, 신발이 모두 동일해야 합니다.",
      },
      {
        title: "씬 참조장면 생성",
        text: "필요하면 4방향 레퍼런스샷을 기준으로 호텔 외관, 로비, 객실, 레스토랑 등 영상 흐름에 맞는 씬 참조장면을 추가로 만듭니다. 시간이 부족하면 이 단계는 생략할 수 있습니다.",
      },
    ],
  },
  {
    title: "Claude 프롬프트 작성",
    toolKey: "claude",
    role: "레퍼런스샷을 기준으로 장면 생성에 사용할 공통프롬프트를 정리합니다.",
    activity: "전신 4방향 레퍼런스샷을 Flow에 넣는 기준 이미지로 삼고 장면별 프롬프트를 만듭니다.",
    output: "Flow 동영상 프롬프트 4~5개, 배분 시간별 스크립트(6초/8초/10초)",
    infoLabels: ["영상 프롬프트 설계", "시간 배분 스크립트", "생성 준비물"],
    checklist: ["레퍼런스샷 기준 문장 작성", "Flow 장면 4~5개 구성", "6초/8초/10초 스크립트 작성"],
  },
  {
    title: "Google Flow 배경영상 생성",
    toolKey: "flow",
    role: "전신 4방향 레퍼런스샷을 기준으로 호텔 장면 영상을 생성합니다.",
    activity: "참조용 이미지를 기준으로 호텔 장면 영상을 생성합니다.",
    output: "3단계에서 결정한 영상 갯수만큼 구글플로우에서 영상을 생성합니다.",
    infoLabels: ["전신 레퍼런스 적용(2-3의 먼저 만든 이미지가 없는 경우)", "참조용 이미지 적용", "영상 생성"],
    checklist: ["전신 4방향 레퍼런스샷 적용", "참조용 이미지 적용", "결정한 영상 갯수만큼 생성"],
    guides: ["flowFullBodyReference", "flowSceneReference"],
  },
  {
    title: "ElevenLabs 더빙 생성",
    toolKey: "elevenlabs",
    role: "호텔 소개 스크립트를 자연스러운 더빙 음성으로 만듭니다.",
    activity: "목소리의 일관성 유지가 좋고, 원하는 톤을 선택하는 것이 가능합니다.",
    output: "목소리 일관성, 나레이션 편집도 가능하지만, 동영상과 싱크 맞추기가 힘들다.",
    infoLabels: ["툴(일레븐랩스)의 역할", "장점", "단점"],
    checklist: ["스크립트 입력", "목소리 톤 확인", "더빙 음성 저장"],
  },
  {
    title: "CapCut 영상 편집",
    toolKey: "capcut",
    role: "클립을 합치고 자막, 배경음악, 엔딩을 정리합니다.",
    activity: "캐릭터 영상과 배경 영상을 연결해 최종 결과물을 만듭니다.",
    output: "호텔 홍보영상 1편",
    checklist: ["클립 가져오기", "자막 추가", "최종 영상 내보내기"],
  },
];


hotelPromoLesson.practiceSteps = [
  { title: "홍보 대상 기획", toolKey: "claude", role: "홍보 대상, 타깃 시청자, 핵심 메시지를 정리합니다.", activity: "우리 학교, 동아리, 지역, 행사, 제품, 서비스 등 홍보할 대상을 선택하고 주요 특징 3개를 작성합니다.", output: "홍보 대상 유형, 홍보 대상명, 핵심 특징, 타깃 시청자, 원하는 행동", infoLabels: ["홍보 대상", "핵심 메시지", "결과물"], checklist: ["홍보 대상 유형 선택", "홍보 대상명 작성", "핵심 특징 3개 작성", "타깃 시청자 작성", "원하는 행동 선택"] },
  { title: "콘셉트와 스토리보드", toolKey: "gpt", role: "4~6개 장면의 화면, 내레이션, 자막, 효과를 구성합니다.", activity: "도입, 핵심 소개, 마무리 흐름으로 장면별 스토리보드를 만듭니다.", output: "장면별 화면 설명, 내레이션, 자막 초안, 영상 분위기", infoLabels: ["콘셉트", "스토리보드", "장면 구성"], checklist: ["영상 분위기 선택", "장면 4개 이상 구성", "장면별 내레이션 작성", "자막 초안 작성"] },
  { title: "이미지·영상 생성 준비", toolKey: "flow", role: "장면별 이미지와 영상 생성 프롬프트를 준비합니다.", activity: "참조 이미지, 카메라 움직임, 스타일 일관성을 확인한 뒤 영상 생성 도구에 입력합니다.", output: "장면별 영상 프롬프트와 생성 영상 클립", infoLabels: ["참조 이미지", "영상 생성", "결과 저장"], checklist: ["참조 이미지 또는 장면 설명 준비", "영상 프롬프트 확인", "모델과 크레딧 확인", "생성 결과 저장"] },
  { title: "편집과 최종 완성", toolKey: "capcut", role: "영상 클립을 합치고 자막, BGM, 마지막 안내 화면을 정리합니다.", activity: "30~60초 안에 핵심 메시지가 전달되도록 최종 홍보영상을 편집하고 발표합니다.", output: "30~60초 AI 홍보영상 1편", checklist: ["클립 순서 정리", "자막과 BGM 추가", "최종 행동 유도 문구 확인", "최종 영상 내보내기"] },
];

const scenePromptSlots = [
  {
    label: "Scene 01",
    title: "씬 1",
    subtitle: "메인 호텔 소개 장면",
    referenceNote: "4방향 레퍼런스샷을 고정 캐릭터 기준으로 참조",
    video: "../../assets/scene-01-hotel-intro.mp4",
    prompt: `Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic cinematic 10-second hotel promotional video.

Character consistency:
Use the same hotelier character from the uploaded reference sheet. Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes. The character must remain visually identical to the reference sheet.

Scene 1: Main hotel introduction scene
The same hotelier character stands inside a luxurious hotel lobby and introduces the hotel with a warm, professional smile. The lobby should feel elegant, premium, clean, and welcoming, with marble floors, warm lighting, refined interior design, floral arrangements, and a calm luxury atmosphere.

Character action:
The hotelier faces the camera directly and speaks naturally. He gently gestures with one hand while introducing the hotel. His posture should be confident, polite, calm, and professional.

Camera:
Start with a medium full-body shot and slowly push in toward a medium shot. Smooth cinematic camera movement, stable framing, premium hotel commercial style.

Mood:
Elegant, welcoming, trustworthy, warm, professional, refined.

Korean narration to include:
"안녕하세요. 저희 호텔에 오신 것을 환영합니다. 품격 있는 공간, 편안한 객실, 세심한 서비스로 고객님의 하루가 더욱 특별해지도록 정성을 다하겠습니다."

Important:
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not add extra people in the foreground.
Do not add text, logos, or subtitles unless requested.
Do not make the scene comedic or exaggerated.
Keep the video realistic, clean, elegant, and suitable for a hotel introduction video.`,
  },
  {
    label: "Scene 02",
    title: "씬 2",
    subtitle: "호텔 로비 소개 장면",
    referenceNote: "4방향 레퍼런스샷을 고정 캐릭터 기준으로 참조",
    video: "../../assets/scene-02-lobby-intro-v2.mp4",
    prompt: `Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic cinematic 10-second video introducing the inside of a luxury hotel lobby.

Character consistency:
Use the same hotelier character from the uploaded reference sheet. Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes. The character must remain visually identical to the reference sheet.

Scene:
The same hotelier character stands inside a spacious luxury hotel lobby. Show marble floors, warm lighting, a reception desk, elegant lounge seating, refined decorations, and a calm premium atmosphere.

Character action:
The hotelier smiles warmly at the camera and gently gestures toward the lobby and reception area.

Camera:
Medium shot, slow smooth pan or dolly movement, stable framing, premium hotel promotional style.

Mood:
Elegant, calm, welcoming, refined, professional.

Japanese narration to include:
「こちらが、上質なくつろぎのロビーです。」

Important:
Do not show the hotel exterior or entrance as the main background.
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not add extra people in the foreground.
Do not add logos or random text.
Keep the scene realistic, clean, elegant, and suitable for a hotel introduction video.`,
  },
  {
    label: "Scene 03",
    title: "씬 3",
    subtitle: "객실 참조 장면",
    referenceNote: "참조용으로 생성된 객실 이미지를 기준으로 참조",
    referenceImage: "../../assets/scene-03-room-reference-v2.png",
    referenceImageNote: "3번 씬 참조용 객실 이미지 기반",
    imagePrompt: `Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic high-quality reference image of the same hotelier character inside a luxury hotel guest room.

Aspect ratio and composition:
Create the image in a 16:9 horizontal widescreen composition, suitable for video production. Make sure the scene is framed like a cinematic hotel promotional shot, with enough space to clearly show both the character and the guest room interior.

Character consistency:
Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes. The character must remain visually identical to the uploaded reference sheet.

Scene:
Show the hotelier standing inside a premium hotel guest room. The room should look clean, elegant, spacious, and comfortable, with a neatly made bed, soft warm lighting, tasteful furniture, curtains, a side table, and a calm luxury atmosphere.

Character action:
The hotelier stands near the bed or beside the room entrance, facing the camera with a warm professional smile, gently gesturing toward the guest room as if introducing it.

Framing:
Use a full-body or medium full-body shot. Keep the character clearly visible while also showing the room interior in a balanced 16:9 layout. The image should feel like a reference frame for a hotel introduction video.

Mood:
Comfortable, welcoming, elegant, calm, professional.

Style:
Realistic, high detail, clean lighting, premium hotel promotional image.

Important:
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not add extra people.
Do not add text, logos, or distracting objects.
Keep the image clean and suitable as a reference image for generating a hotel room introduction video.`,
    video: "../../assets/scene-03-room-intro.mp4",
    prompt: `Use the uploaded hotel guest room reference image as the main scene reference.

Create a realistic cinematic 10-second video introducing the inside of a luxury hotel guest room.

Aspect ratio:
16:9 horizontal widescreen video, suitable for a hotel promotional video.

Visual reference rules:
Follow the uploaded guest room reference image for the room layout, interior style, lighting, composition, and character placement.
Keep the same hotelier character shown in the reference image, including the same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.

Scene:
The same hotelier character stands inside a premium hotel guest room. Show a neatly made bed, warm lighting, tasteful furniture, curtains, side table, and a calm luxury atmosphere. The scene must clearly show the guest room interior.

Character action:
The hotelier smiles warmly at the camera and gently gestures toward the guest room as if introducing the room to guests.

Camera:
Medium shot or medium full-body shot, slow smooth pan or dolly movement, stable framing, premium hotel promotional style.

Mood:
Comfortable, welcoming, elegant, calm, professional, luxurious.

Spoken narration language:
Japanese only. The narrator must speak natural Japanese. Do not mix Korean, English, or any other language in the spoken narration.

Japanese narration to include:
「こちらは、ゆったりとお過ごしいただける上質なロビーです。落ち着いた空間で、皆さまを心を込めてお迎えいたします。」

Korean subtitles:
Add Korean subtitles that match the Japanese narration.

Korean subtitle text:
“이곳은 편안하게 머무실 수 있는 품격 있는 로비입니다. 차분한 공간에서 정성을 다해 여러분을 맞이합니다.”

Important:
Do not show the hotel exterior or entrance as the main background.
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not add extra people in the foreground.
Do not add logos or random text.
Only include Korean subtitles for the Japanese narration.
Keep the video realistic, clean, elegant, and suitable for a hotel introduction video.`,
  },
  {
    label: "Scene 04",
    title: "씬 4",
    subtitle: "레스토랑/조식 소개 장면",
    referenceNote: "참조용으로 생성된 레스토랑 이미지를 기준으로 참조",
    referenceImage: "../../assets/scene-04-restaurant-reference.png",
    referenceImageNote: "4번 씬 참조용 레스토랑 이미지 기반",
    imagePrompt: `Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic high-quality reference image of the same hotelier character inside a luxury hotel restaurant or breakfast dining area.

Aspect ratio:
16:9 horizontal widescreen composition, suitable as a reference image for video generation.

Character consistency:
Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes. The character must remain visually identical to the uploaded reference sheet.

Scene:
Show the hotelier standing inside a refined luxury hotel restaurant or breakfast dining area. The space should include elegant dining tables, soft warm lighting, fresh breakfast dishes, a clean buffet area, premium table settings, large windows or warm morning light, and a calm upscale atmosphere.

Character action:
The hotelier stands near the dining area or buffet section, facing the camera with a warm professional smile, gently gesturing toward the restaurant as if introducing the hotel’s dining service.

Composition:
Medium full-body or full-body shot. Clearly show both the hotelier and the restaurant interior in a balanced 16:9 frame. The image should look like a polished reference frame for a hotel promotional video.

Mood:
Fresh, elegant, welcoming, comfortable, refined, professional, premium hotel dining atmosphere.

Style:
Realistic, high detail, clean lighting, premium hotel promotional image.

Important:
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not show a guest room, hotel lobby, or hotel exterior.
Do not add extra people.
Do not add text, logos, random signs, or distracting objects.
Keep the image clean and suitable as a reference image for generating a hotel restaurant introduction video.`,
    video: "../../assets/scene-04-restaurant-intro.mp4",
    prompt: `Use the uploaded hotel restaurant reference image as the main scene reference.
Use the uploaded 4-view character reference sheet as the fixed character identity reference.

Create a realistic cinematic 10-second video introducing a luxury hotel restaurant or breakfast dining area.

Aspect ratio:
16:9 horizontal widescreen video, suitable for a hotel promotional video.

Visual reference rules:
Follow the uploaded restaurant reference image for the interior style, layout, atmosphere, composition, and dining scene.
Follow the hotelier character shown in the restaurant reference image for the face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.

Scene:
Show the same hotelier character standing inside a refined luxury hotel restaurant or breakfast dining area.
The restaurant should match the uploaded reference image, including elegant dining tables, a clean buffet area, warm lighting, premium table settings, fresh food, and a calm upscale hotel atmosphere.

Character action:
The hotelier faces the camera with a warm professional smile and gently gestures toward the restaurant and buffet area, as if introducing the hotel’s dining service.

Camera:
Use a medium shot or medium full-body shot in a 16:9 frame.
Use slow smooth cinematic camera movement, such as a gentle pan or dolly, while keeping the character and restaurant clearly visible.

Mood:
Fresh, elegant, welcoming, comfortable, refined, professional, premium hotel dining atmosphere.

Spoken narration language:
Korean only. Do not use Japanese, English, or any other language in the spoken narration.

Korean narration to include:
“저희 호텔 레스토랑에서는 신선한 재료와 정성스러운 서비스로 하루의 시작을 더욱 특별하게 만들어드립니다.”

Korean subtitles:
Add Korean subtitles that exactly match the Korean narration.

Important:
Keep the character visually identical to the uploaded restaurant reference image.
Keep the restaurant interior visually consistent with the uploaded restaurant reference image.
Do not change the character identity, outfit, hairstyle, face, or proportions.
Do not add extra people in the foreground.
Do not add logos, random text, or subtitles unless requested.
Keep the video realistic, clean, elegant, and suitable for a hotel introduction video.`,
  },
  {
    label: "Scene 05",
    title: "씬 5",
    subtitle: "프런트데스크 마무리 장면",
    referenceNote: "참조용으로 생성된 프런트데스크 이미지를 기준으로 참조",
    referenceImage: "../../assets/scene-05-frontdesk-reference.png",
    referenceImageNote: "5번 씬 참조용 프런트데스크 이미지 기반",
    imagePrompt: `Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic high-quality reference image of the same hotelier character standing at the front desk of a luxury hotel.

Aspect ratio:
16:9 horizontal widescreen composition, suitable as a reference image for video generation.

Character consistency:
Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes. The character must remain visually identical to the uploaded reference sheet.

Scene:
Show the hotelier standing at or near the front desk inside a luxury hotel reception area. The space should include an elegant front desk counter, warm lighting, refined interior design, polished surfaces, tasteful décor, and a calm premium atmosphere. The background should clearly feel like a hotel front desk or reception area.

Character action:
The hotelier faces the camera with a warm professional smile, giving a polite farewell or greeting gesture, as if thanking guests and saying goodbye at the end of the hotel introduction.

Composition:
Use a medium full-body or full-body shot. Clearly show both the hotelier and the front desk area in a balanced 16:9 frame. The image should feel like the final scene of a hotel promotional video.

Mood:
Warm, elegant, welcoming, refined, professional, calm, premium hospitality atmosphere.

Style:
Realistic, high detail, clean lighting, premium hotel promotional image.

Important:
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not show a guest room, restaurant, or hotel exterior.
Do not add extra people.
Do not add text, logos, random signs, or distracting objects.
Keep the image clean and suitable as a reference image for generating a hotel front desk outro video.`,
    video: "../../assets/scene-05-frontdesk-outro-v2.mp4",
    prompt: `Use the uploaded front desk reference image as the main scene reference.
Use the uploaded 4-view character reference sheet as the fixed character identity reference.

Create a realistic cinematic 10-second outro video set at the front desk of a luxury hotel.

Aspect ratio:
16:9 horizontal widescreen video, suitable for a hotel promotional video.

Visual reference rules:
Follow the uploaded front desk reference image for the reception area, front desk layout, lighting, atmosphere, composition, and overall hotel mood.
Follow the uploaded 4-view character reference sheet for the hotelier’s face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.

Scene:
Show the same hotelier character standing in front of the luxury hotel front desk. The reception area should match the uploaded reference image, with an elegant front desk counter, warm lighting, polished surfaces, tasteful décor, and a calm premium atmosphere.

Character action:
The hotelier faces the camera with a warm professional smile and gives a polite farewell gesture, as if thanking guests and closing the hotel introduction. His movement should be gentle, refined, and natural.

Camera:
Use a medium full-body shot in a 16:9 frame.
Use slow smooth cinematic camera movement, such as a gentle push-in or soft dolly movement, while keeping the character and front desk clearly visible.

Mood:
Warm, elegant, welcoming, refined, professional, calm, premium hospitality atmosphere.

Spoken narration language:
Japanese only. Do not mix Korean, English, or any other language in the spoken narration.

Japanese narration to include:
「ご覧いただき、ありがとうございました。皆さまのお越しを、心よりお待ちしております。」

Important:
Keep the character visually identical to the uploaded 4-view reference sheet.
Keep the front desk area visually consistent with the uploaded front desk reference image.
Do not change the character identity, outfit, hairstyle, face, or proportions.
Do not add extra people in the foreground.
Do not add logos, random text, or subtitles unless requested.
Keep the video realistic, clean, elegant, and suitable as the final outro of a hotel introduction video.`,
  },
];

const promptData = [
  {
    id: "consistency",
    label: "일관성 시스템",
    text: `1. 일관성 시스템

목적
생성형 AI 도구를 이동해도 같은 호텔리어 캐릭터가 유지되도록 하는 기준 규칙입니다.

이 수업의 핵심은 하나의 호텔리어 캐릭터를 끝까지 유지하는 것입니다.

ChatGPT 이미지 생성 → 4방향 레퍼런스샷 → Google Flow 영상 생성 → CapCut 편집까지 이어지는 과정에서 캐릭터의 얼굴, 헤어스타일, 체형, 유니폼, 분위기가 바뀌지 않도록 관리해야 합니다.

반드시 유지할 요소:
- 얼굴형
- 눈매
- 피부톤
- 헤어스타일
- 체형과 신장 비율
- 네이비 호텔 유니폼
- 흰 셔츠
- 골드 포인트
- 이름표
- 바지와 구두
- 친절하고 전문적인 호텔리어 분위기

변경 가능 요소:
- 장소
- 카메라 움직임
- 손동작
- 배경
- 조명 분위기
- 나레이션 언어
- 자막 언어

주의:
캐릭터가 다른 사람처럼 보이면 실패입니다.
장면이 바뀌어도 같은 호텔리어가 계속 등장해야 합니다.

핵심 안내 문구
캐릭터 일관성은 창의성보다 우선합니다.
새로운 장면을 만들 때마다 반드시 4방향 레퍼런스샷을 기준으로 사용하세요.`,
  },
  {
    id: "character",
    label: "캐릭터 프롬프트",
    text: `2. 캐릭터 프롬프트

목적
호텔 소개영상에 등장할 호텔리어 캐릭터 이미지를 생성하는 프롬프트입니다.

호텔리어 생성 프롬프트
Create a realistic full-body image of a young hotelier character standing in a luxury hotel lobby.

The character has neat, well-groomed hair, a bright and friendly smile, clear expressive eyes, and a refined, polished appearance.

He wears a navy hotel uniform with a crisp white shirt, elegant gold accents, a name tag, matching trousers, and polished black shoes.

The character should look professional, graceful, welcoming, and suitable for a premium hotel introduction video.

Use a luxury hotel lobby background with warm lighting, marble floors, elegant interior details, and a refined hospitality atmosphere.

Full-body composition, realistic style, high detail, clean lighting, premium hotel promotional image.

사용 후 안내
생성된 호텔리어 이미지는 이후 4방향 레퍼런스샷 제작의 기준 이미지로 사용합니다.
마음에 드는 캐릭터가 나오면 반드시 저장하세요.`,
  },
  {
    id: "image",
    label: "호텔리어/레퍼런스샷",
    text: `3. 호텔리어 / 레퍼런스샷

목적
생성된 호텔리어 이미지를 기준으로 전신 4방향 레퍼런스샷을 만드는 프롬프트입니다.

Use the uploaded hotelier image as the fixed reference character.

Create a clean full-body turnaround reference sheet of the same person, like a mugshot-style character sheet.

Show 4 views:
front, left side, right side, and back.

Keep the same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.

Use a neutral standing pose, arms relaxed, plain white background, realistic style, clean studio lighting.

No hotel background, no props, no text, no logo, no outfit change.

The character must look identical in all views for Google Flow reference.

사용 안내
이 이미지는 Google Flow에서 캐릭터를 고정하기 위한 기준 자료입니다.
영상 프롬프트를 작성할 때마다 이 4방향 레퍼런스샷을 함께 업로드하세요.

체크리스트
□ 정면 전신이 보이는가?
□ 좌측면이 보이는가?
□ 우측면이 보이는가?
□ 후면이 보이는가?
□ 유니폼이 동일한가?
□ 얼굴과 헤어스타일이 같은 인물처럼 보이는가?
□ 배경이 단순한가?`,
  },
  {
    id: "video",
    label: "Flow 영상 프롬프트",
    text: `4. Flow 영상 프롬프트

목적
Google Flow에서 호텔 소개 영상을 만들 때 사용하는 프롬프트 구조입니다.
장면에 따라 4방향 레퍼런스샷만 참조하는 경우와 사전 제작된 장면 이미지를 함께 참조하는 경우로 나누어 사용합니다.

A. 4방향 레퍼런스샷만 참조하는 경우

사용 장면
1. 호텔 인트로 장면
2. 로비 소개 장면

사용 목적
별도의 장면 이미지를 만들지 않고, 4방향 캐릭터 레퍼런스샷만 기준으로 Google Flow에서 영상을 생성하는 방식입니다.

공통 규칙
Use the uploaded 4-view character reference sheet as the fixed character identity.

Create a realistic cinematic 10-second hotel promotional video.

Aspect ratio:
16:9 horizontal widescreen video.

Character consistency:
Use the same hotelier character from the uploaded 4-view reference sheet.
Keep the exact same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.
The character must remain visually identical to the reference sheet.

Camera:
Use a medium shot or medium full-body shot.
Use slow, smooth cinematic camera movement.
Keep the framing stable and professional.

Mood:
Elegant, calm, welcoming, refined, professional, premium hotel atmosphere.

Important:
Do not change the character identity, face, hairstyle, uniform, body shape, or proportions.
Do not add extra people in the foreground.
Do not add logos or random text.
Keep the video realistic, clean, and suitable for a hotel introduction video.

B. 사전 제작된 장면 이미지를 참조하는 경우

사용 장면
3. 객실 소개 장면
4. 식당 소개 장면
5. 프런트 아웃트로 장면

사용 목적
먼저 ChatGPT 이미지로 장면 이미지를 만든 뒤, 그 이미지를 Google Flow에 넣어 영상화하는 방식입니다.
이 방식은 장소 분위기와 구도를 더 안정적으로 유지할 수 있습니다.

공통 규칙
Use the uploaded scene reference image as the main visual reference.

Create a realistic cinematic 10-second hotel promotional video.

Aspect ratio:
16:9 horizontal widescreen video.

Visual reference rules:
Follow the uploaded scene reference image for the location, layout, lighting, atmosphere, composition, and background details.
Follow the hotelier character already included in the uploaded scene reference image.

Character consistency:
The hotelier must remain visually identical to the uploaded scene reference image.
Do not change the character’s identity, outfit, hairstyle, face, or proportions.

Camera:
Use a medium shot or medium full-body shot.
Use slow, smooth cinematic movement such as a gentle pan, push-in, or dolly movement.
Keep the character and the location clearly visible.

Mood:
Clean, elegant, welcoming, refined, professional, premium hotel promotional style.

Important:
Do not add extra people in the foreground.
Do not add logos or random text.
Only include subtitles when requested.
Keep the video visually consistent with the uploaded scene reference image.

탭 안 최종 표시 구조

Flow 영상 프롬프트

1. 사용 방식 선택
   - A. 4방향 레퍼런스샷만 참조
   - B. 사전 제작된 장면 이미지 참조

2. 공통 규칙
   - 캐릭터 고정
   - 16:9 영상
   - 카메라 움직임
   - 언어/자막 규칙

3. 장면 특징
   - 호텔 인트로
   - 로비 소개
   - 객실 소개
   - 식당 소개
   - 프런트 아웃트로

1~2번 장면:
4방향 캐릭터 레퍼런스샷만 사용

3~5번 장면:
사전 제작된 장면 이미지만 사용`,
  },
  {
    id: "script",
    label: "시간별 스크립트 프롬프트",
    text: `5. 시간별 스크립트 프롬프트

목적
Google Flow 영상 생성 시 장면 수, 시간, 크레딧 소모량을 고려하여
수업 시간 안에 안정적으로 결과물을 만들 수 있도록 안내하는 영역입니다.

기본 크레딧 기준
Veo 3.1 Lite를 사용하는 경우,
기본 10초 영상 1개 생성 시 10크레딧이 차감됩니다.

다만 프롬프트가 너무 길거나 요구사항이 많을 경우,
출력 영상 길이가 8초 또는 6초로 줄어들 수 있으며,
이 경우에도 기본적으로 10크레딧이 차감될 수 있습니다.

또한 상위 등급 모델(예: Omni Flash)이 적용될 경우,
영상 1개 생성 시 15크레딧이 차감될 수 있습니다.

수업 운영 판단 기준
총 50크레딧 내에서 영상을 제작하려면
이론상 최대 5개 장면도 가능해 보일 수 있습니다.

하지만 실제 수업에서는
- 학생 프롬프트 실수
- 재생성 필요
- 장면 길이 감소
- 모델 변경 가능성
- 예비 크레딧 확보 필요

등의 변수가 발생할 수 있으므로,
안정적인 수업 운영을 위해서는 4개 장면 구성이 가장 적합합니다.

권장 장면 수
권장 구성: 총 4장면

1. 인트로
2. 장소 소개 장면 1
3. 장소 소개 장면 2
4. 아웃트로

권장 이유
4장면 구성이 적합한 이유는 다음과 같습니다.

- 10초 기준으로 장면 4개를 생성하면 기본적으로 40크레딧이 소모됩니다.
- 남은 10크레딧은 학생 실수나 재생성 상황에 대비한 예비 크레딧으로 활용할 수 있습니다.
- 장소 소개 장면을 2개로 제한하면 영상 흐름이 단순하고 편집도 쉬워집니다.
- 수업 시간 안에 완성하기에 부담이 적습니다.
- 결과적으로 “완성 가능성”이 높아집니다.

추천 영상 구성안
총 4장면 구성 예시

1. 인트로
- 호텔 전체 소개
- 환영 인사
- 브랜드 분위기 전달

2. 장소 소개 장면 1
- 로비 또는 객실 소개
- 공간의 장점 설명

3. 장소 소개 장면 2
- 식당 또는 프런트 소개
- 서비스 특징 설명

4. 아웃트로
- 감사 인사
- 방문 유도
- 마무리 멘트

장면별 스크립트 작성 원칙
각 장면은 기본 10초를 기준으로 작성합니다.

스크립트 작성 시 주의사항:
- 한 장면당 핵심 메시지는 1개만 전달
- 문장은 짧고 분명하게 작성
- 과도하게 긴 프롬프트는 피하기
- 요구사항이 너무 많으면 영상 길이가 줄 수 있음
- 언어와 자막 조건은 장면별로 명확히 작성
- 학생이 바로 복사해 사용할 수 있도록 단순하게 작성

수업용 안내 문구
총 50크레딧 안에서 안정적으로 영상을 완성하려면
4장면 구성이 가장 현실적입니다.

특히 학생 실수나 재생성 상황을 고려하면,
“인트로 + 장소소개 2장면 + 아웃트로” 구조가
가장 적합한 수업용 구성으로 판단됩니다.

Claude / GPT용 정리 프롬프트
총 50크레딧 내에서 완성 가능한 호텔 소개영상 구성을 제안해줘.

조건:
- Veo 3.1 Lite 기준
- 기본 10초 영상 1개당 10크레딧 차감
- 프롬프트가 길면 8초 또는 6초로 줄어들 수 있음
- 상위 모델(Omni Flash) 적용 시 15크레딧 차감 가능
- 학생 실수나 재생성을 고려해야 함
- 수업 시간 안에 완성 가능한 구성이어야 함

요청:
- 가장 적합한 장면 수를 제안
- 각 장면의 역할을 정리
- 인트로 + 장소소개 2장면 + 아웃트로 구조를 기준으로
  장면별 스크립트 초안을 작성
- 각 장면은 약 10초 기준으로 작성
- 편집이 쉬운 순서로 정리`,
  },
];

const heygenGuideData = {
  screen: {
    badge: "01",
    title: "생성화면 해설 가이드",
    visualTitle: "Create Avatar",
    visualText: "HeyGen 캐릭터 생성 화면 캡쳐 자리",
    image: "../../assets/heygen-avatar-create-guide.png",
    summary: "학생이 처음 들어가서 캐릭터를 만들고, 나레이션 입력 후 영상 생성까지 체험하는 화면 안내입니다.",
    points: [
      "캐릭터 생성 메뉴에서 새 아바타 또는 캐릭터 만들기를 선택합니다.",
      "호텔 안내 역할에 맞는 기본 템플릿을 고릅니다.",
      "캐릭터 이름과 역할을 먼저 정한 뒤 외형을 조정합니다.",
      "캐릭터 완성 후 짧은 나레이션을 입력하고 영상 생성까지 체험합니다.",
    ],
  },
  style: {
    badge: "02",
    title: "스타일 해설",
    visualTitle: "Character Style",
    visualText: "실사형/반실사/스타일화 선택 예시 이미지 자리",
    image: "../../assets/heygen-style-guide.png",
    summary: "캐릭터가 어떤 시각 스타일로 보일지 정하는 기준입니다.",
    points: [
      "실사형은 호텔 홍보영상에 가장 자연스럽지만 얼굴 일관성 확인이 중요합니다.",
      "반실사형은 학생 실습에서 부담이 적고 친근한 느낌을 만들기 좋습니다.",
      "동물 또는 의인화 캐릭터는 종, 털색, 귀, 코, 의상을 반드시 고정합니다.",
      "수업 중에는 한 번 정한 스타일을 GPT와 Google Flow에서도 계속 유지합니다.",
    ],
  },
  appearance: {
    badge: "03",
    title: "외형 해설",
    visualTitle: "Fixed Appearance",
    visualText: "얼굴/의상/액세서리 고정 요소 캡쳐 자리",
    image: "../../assets/heygen-appearance-guide.png",
    summary: "도구를 이동해도 같은 캐릭터로 보이게 만드는 외형 고정 기준입니다.",
    points: [
      "얼굴형, 눈매, 머리색 또는 털색, 코와 입의 특징을 기록합니다.",
      "호텔 프런트 직원 느낌의 의상 색상과 형태를 고정합니다.",
      "명찰, 스카프, 재킷 같은 핵심 액세서리는 바꾸지 않습니다.",
      "기준 이미지와 다른 헤어스타일, 의상색, 얼굴 인상으로 바뀌면 다시 생성합니다.",
    ],
  },
};

const gptGuideData = {
  gptCharacter: {
    badge: "01",
    title: "캐릭터 생성 해설",
    visualTitle: "Character Image",
    visualText: "캐릭터 생성 해설 이미지 자리",
    image: "../../assets/gpt-character-hotelier-guide.png",
    summary: "호텔을 소개할 호텔리어 캐릭터 이미지를 만들고, 이후 모든 단계의 기준 이미지로 사용하는 방법입니다.",
    prompt: "A young hotelier character standing in a luxury hotel lobby. He has neat, well-groomed hair, a bright and friendly smile, clear expressive eyes, and a refined, attractive appearance. He is wearing a navy hotel uniform with a crisp white shirt, elegant gold accents, and a name tag. He looks like a professional hotel staff member with a graceful, polished, and welcoming presence. Full-body composition, realistic style, high detail, elegant atmosphere, luxury hospitality setting.",
    points: [
      "호텔을 대표할 호텔리어 캐릭터의 역할과 분위기를 먼저 정합니다.",
      "얼굴, 헤어스타일, 피부톤, 유니폼 색, 금색 장식, 명찰, 신발을 유지 요소로 기록합니다.",
      "호텔 직원처럼 단정하고 신뢰감 있는 인상이 나오는지 확인합니다.",
      "생성된 이미지는 GPT에 다시 입력해 4방향 레퍼런스샷을 만들 기준 이미지로 사용합니다.",
    ],
  },
  gptReference: {
    badge: "02",
    title: "레퍼런스샷 생성 해설",
    visualTitle: "4-Way Reference",
    visualText: "4방향 레퍼런스샷 해설 이미지 자리",
    image: "../../assets/gpt-reference-turnaround-guide.png",
    summary: "생성된 호텔리어 이미지를 GPT에 다시 입력해 같은 인물의 4방향 전신 레퍼런스샷을 만드는 단계입니다.",
    prompt: "Use the uploaded hotelier image as the fixed reference character.\n\nCreate a clean full-body turnaround reference sheet of the same person, like a mugshot-style character sheet.\n\nShow 4 views:\nfront, left side, right side, and back.\n\nKeep the same face, hairstyle, skin tone, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes.\n\nUse a neutral standing pose, arms relaxed, plain white background, realistic style, clean studio lighting.\n\nNo hotel background, no props, no text, no logo, no outfit change.\n\nThe character must look identical in all views for Google Flow reference.",
    points: [
      "정면, 좌측, 우측, 후면 전신 이미지를 한 장의 레퍼런스 시트처럼 준비합니다.",
      "네 방향 모두 같은 인물처럼 보이도록 얼굴, 헤어스타일, 피부톤, 유니폼, 체형, 신발을 고정합니다.",
      "배경은 흰색 또는 밝은 회색처럼 단순하게 두어 캐릭터 식별 요소가 잘 보이게 합니다.",
      "Google Flow에서 기준 이미지로 사용할 수 있도록 과한 포즈, 소품, 배경을 피합니다.",
    ],
  },
  gptSceneReference: {
    badge: "03",
    title: "씬 참조장면 해설",
    visualTitle: "Scene Reference",
    visualText: "씬 참조장면 해설 이미지 자리",
    summary: "4방향 레퍼런스샷을 기준으로 영상 흐름에 필요한 씬 참조장면을 준비하는 선택 단계입니다.",
    points: [
      "호텔 외관, 로비, 객실, 레스토랑 등 최종 영상의 흐름을 먼저 정합니다.",
      "각 씬 참조장면에서도 캐릭터가 같은 얼굴, 같은 유니폼, 같은 체형으로 보이는지 확인합니다.",
      "씬 참조장면은 선택 사항이며, 시간이 부족하면 생략할 수 있습니다.",
      "생략하더라도 4방향 레퍼런스샷은 Google Flow에서 캐릭터 일관성 기준으로 사용합니다.",
    ],
  },
};

const flowGuideData = {
  flowFullBodyReference: {
    badge: "01",
    title: "전신 레퍼런스 적용 해설",
    visualTitle: "Full-body Reference",
    visualText: "전신 4방향 레퍼런스 적용 예시",
    image: "../../assets/flow-fullbody-reference-guide.png",
    summary: "전신 4방향 레퍼런스샷을 참조 이미지로 넣고, 같은 호텔리어 캐릭터가 호텔 입구 장면에 등장하도록 영상을 생성하는 방법입니다.",
    prompt: "Use the uploaded character reference sheet as the fixed character identity.\n\nCreate a realistic cinematic video of the same hotelier character standing in front of a luxury hotel entrance.\n\nKeep the same face, hairstyle, body proportions, navy hotel uniform, white shirt, gold accents, name tag, trousers, and shoes from the reference sheet.\n\nThe character stands near the main entrance of an elegant premium hotel, smiling warmly and welcoming guests.",
    points: [
      "Flow에 전신 4방향 레퍼런스샷을 먼저 업로드합니다.",
      "첫 문장에서 업로드한 레퍼런스 시트를 고정 캐릭터 정체성으로 사용한다고 명시합니다.",
      "얼굴, 헤어스타일, 체형, 네이비 호텔 유니폼, 금색 장식, 명찰, 바지, 구두를 그대로 유지합니다.",
      "2-3에서 먼저 만든 장면 이미지가 없을 때 이 방식으로 호텔 장면 영상을 생성합니다.",
    ],
  },
  flowSceneReference: {
    badge: "02",
    title: "참조용 이미지 적용 해설",
    visualTitle: "Scene Reference",
    visualText: "참조용 이미지 적용 이미지 자리",
    summary: "참조용 이미지를 기준으로 호텔 장면 영상을 생성하는 방법입니다.",
    points: [
      "2단계에서 만든 참조용 이미지를 Flow에 입력합니다.",
      "프롬프트에는 참조 이미지의 인물, 의상, 분위기를 유지한다고 명확히 적습니다.",
      "장면 설명은 짧게 쓰고, 캐릭터 동일성 유지 문장을 먼저 배치합니다.",
      "3단계에서 정한 영상 갯수와 시간 배분에 맞춰 장면별로 생성합니다.",
    ],
  },
};

const guideData = {
  ...heygenGuideData,
  ...gptGuideData,
  ...flowGuideData,
};

const flowTimeline = document.querySelector("#flowTimeline");
const classCards = document.querySelector("#classCards");
const practiceAccordion = document.querySelector("#practiceAccordion");
const progressText = document.querySelector("#progressText");
const progressTeacherNote = document.querySelector("#progressTeacherNote");
const resetProgressButton = document.querySelector("#resetProgressButton");
const lessonSelect = document.querySelector("#lessonSelect");
const brandLabel = document.querySelector("#brandLabel");
const heroImage = document.querySelector(".hero-image");
const heroEyebrow = document.querySelector("#heroEyebrow");
const heroTitle = document.querySelector("#heroTitle");
const heroSubtitle = document.querySelector("#heroSubtitle");
const heroCopy = document.querySelector("#heroCopy");
const heroModuleTitle = document.querySelector("#heroModuleTitle");
const heroRecommendedScenes = document.querySelector("#heroRecommendedScenes");
const heroDuration = document.querySelector("#heroDuration");
const heroFinalOutput = document.querySelector("#heroFinalOutput");
const moduleLessonTitle = document.querySelector("#moduleLessonTitle");
const moduleDuration = document.querySelector("#moduleDuration");
const moduleFinalOutput = document.querySelector("#moduleFinalOutput");
const overviewAudience = document.querySelector("#overviewAudience");
const overviewDuration = document.querySelector("#overviewDuration");
const overviewOutput = document.querySelector("#overviewOutput");
const quickStartDescription = document.querySelector("#quickStartDescription");
const quickActionGrid = document.querySelector("#quickActionGrid");
const hardRefreshButton = document.querySelector("#hardRefreshButton");
const preflightPanel = document.querySelector("#preflightPanel");
const preflightGrid = document.querySelector("#preflightGrid");
const modeToggle = document.querySelector(".mode-toggle");
const modeButtons = document.querySelectorAll("[data-mode]");
const toolCards = document.querySelector("#toolCards");
const instructorPanel = document.querySelector("#instructorPanel");
const instructorNotes = document.querySelector("#instructorNotes");
const riskWarnings = document.querySelector("#riskWarnings");
const promptSectionHeading = document.querySelector("#prompts .section-heading");
const promptTabs = document.querySelector("#promptTabs");
const promptPanels = document.querySelector("#promptPanels");
const promptGenerator = document.querySelector("#promptGenerator");
const samplesSection = document.querySelector("#samples");
const promptProjectTitle = document.querySelector("#promptProjectTitle");
const promptPlaceName = document.querySelector("#promptPlaceName");
const promptTargetType = document.querySelector("#promptTargetType");
const promptPlaceOne = document.querySelector("#promptPlaceOne");
const promptPlaceTwo = document.querySelector("#promptPlaceTwo");
const promptCharacterRole = document.querySelector("#promptCharacterRole");
const promptTone = document.querySelector("#promptTone");
const promptHeygenResult = document.querySelector("#promptHeygenResult");
const regeneratePromptsButton = document.querySelector("#regeneratePromptsButton");
const generatedHeygenPrompt = document.querySelector("#generatedHeygenPrompt");
const generatedReferencePrompt = document.querySelector("#generatedReferencePrompt");
const generatedVideoPrompts = document.querySelector("#generatedVideoPrompts");
const generatedScenePrompt1 = document.querySelector("#generatedScenePrompt1");
const generatedScenePrompt2 = document.querySelector("#generatedScenePrompt2");
const generatedScenePrompt3 = document.querySelector("#generatedScenePrompt3");
const generatedScenePrompt4 = document.querySelector("#generatedScenePrompt4");
const generatedCombinedPrompt = document.querySelector("#generatedCombinedPrompt");
const creditCalculatorSection = document.querySelector("#creditCalculator");
const creditCalculatorNavLink = document.querySelector('a[href="#creditCalculator"]');
const totalCreditsInput = document.querySelector("#totalCreditsInput");
const sceneCountInput = document.querySelector("#sceneCountInput");
const creditPerSceneSelect = document.querySelector("#creditPerSceneSelect");
const expectedCredits = document.querySelector("#expectedCredits");
const remainingCredits = document.querySelector("#remainingCredits");
const creditStatusCard = document.querySelector("#creditStatusCard");
const creditStatusLabel = document.querySelector("#creditStatusLabel");
const creditStatusMessage = document.querySelector("#creditStatusMessage");
const creditTeacherNotes = document.querySelector("#creditTeacherNotes");
const toast = document.querySelector("#toast");
const guideModal = document.querySelector("#guideModal");
const guideModalClose = document.querySelector("#guideModalClose");
const guideModalBadge = document.querySelector("#guideModalBadge");
const guideModalVisualTitle = document.querySelector("#guideModalVisualTitle");
const guideModalVisualText = document.querySelector("#guideModalVisualText");
const guideModalVisual = document.querySelector(".guide-modal-visual");
const guideModalEyebrow = document.querySelector("#guideModalEyebrow");
const guideModalTitle = document.querySelector("#guideModalTitle");
const guideModalSummary = document.querySelector("#guideModalSummary");
const guideModalList = document.querySelector("#guideModalList");
const guideModalPrompt = document.querySelector("#guideModalPrompt");
const guideModalPromptText = document.querySelector("#guideModalPromptText");
const sceneModal = document.querySelector("#sceneModal");
const sceneModalClose = document.querySelector("#sceneModalClose");
const sceneModalVideo = document.querySelector("#sceneModalVideo");
const sceneModalLabel = document.querySelector("#sceneModalLabel");
const sceneModalTitle = document.querySelector("#sceneModalTitle");
const sceneModalReference = document.querySelector("#sceneModalReference");
const sceneModalReferenceImage = document.querySelector("#sceneModalReferenceImage");
const sceneModalReferenceImageSrc = document.querySelector("#sceneModalReferenceImageSrc");
const sceneModalReferenceImageCaption = document.querySelector("#sceneModalReferenceImageCaption");
const sceneModalImagePromptBox = document.querySelector("#sceneModalImagePromptBox");
const sceneModalImagePrompt = document.querySelector("#sceneModalImagePrompt");
const sceneModalPrompt = document.querySelector("#sceneModalPrompt");
const MODE_STORAGE_KEY = "aiClassTemplateMode";
let currentMode = getStoredMode();
let resetProgressConfirmTimer;

function isHotelLesson() {
  return currentLessonId === "hotelPromo";
}

function isVideoLesson() {
  return currentLessonId !== "dataAnalysisReport";
}

function getToolUrl(toolKey) {
  const tool = lessonData.tools[toolKey] || (isHotelLesson() ? hotelPromoLesson.tools[toolKey] : null);
  return tool?.affiliateUrl || tool?.url || "#";
}

function getStoredMode() {
  try {
    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    return storedMode === "teacher" ? "teacher" : "student";
  } catch {
    return "student";
  }
}

function getStoredLessonId() {
  try {
    const queryLessonId = new URLSearchParams(window.location.search).get("lesson");
    if (lessons[queryLessonId]) {
      window.localStorage.setItem(LESSON_STORAGE_KEY, queryLessonId);
      return queryLessonId;
    }
    const storedLessonId = window.localStorage.getItem(LESSON_STORAGE_KEY);
    return lessons[storedLessonId] ? storedLessonId : "hotelPromo";
  } catch {
    return "hotelPromo";
  }
}

function saveLessonId(lessonId) {
  try {
    window.localStorage.setItem(LESSON_STORAGE_KEY, lessonId);
  } catch {
    // localStorage can be unavailable in some restricted browser contexts.
  }
}

function saveMode(mode) {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // localStorage can be unavailable in some restricted browser contexts.
  }
}

function isTeacherMode() {
  return currentMode === "teacher";
}

function getProgressStorageKey() {
  return `lessonProgress:${currentLessonId}`;
}

function loadLessonProgress() {
  try {
    const storedProgress = window.localStorage.getItem(getProgressStorageKey());
    return storedProgress ? JSON.parse(storedProgress) : {};
  } catch {
    return {};
  }
}

function saveLessonProgress(progress) {
  try {
    window.localStorage.setItem(getProgressStorageKey(), JSON.stringify(progress));
  } catch {
    // localStorage can be unavailable in some restricted browser contexts.
  }
}

function clearLessonProgress() {
  try {
    window.localStorage.removeItem(getProgressStorageKey());
  } catch {
    // localStorage can be unavailable in some restricted browser contexts.
  }
}

function getChecklistItemId(stepIndex, checkIndex) {
  return `practice-${stepIndex + 1}-${checkIndex + 1}`;
}

function updateProgressDisplay() {
  const checkboxes = [...practiceAccordion.querySelectorAll("[data-progress-id]")];
  const total = checkboxes.length;
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;

  if (total === 0) {
    progressText.textContent = "진행 체크리스트가 아직 없습니다.";
    resetProgressButton.disabled = true;
  } else {
    const percent = Math.round((completed / total) * 100);
    progressText.textContent = `진행률: ${completed} / ${total} 완료 (${percent}%)`;
    resetProgressButton.disabled = false;
  }

  progressTeacherNote.hidden = !isTeacherMode();
}

function getProgressSummary() {
  const checkboxes = [...practiceAccordion.querySelectorAll("[data-progress-id]")];
  const total = checkboxes.length;
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}

function renderList(items, className = "") {
  if (!items?.length) return "";
  return `<ul${className ? ` class="${className}"` : ""}>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderLessonSelector() {
  const labels = {
    hotelPromo: "AI 홍보영상 제작 프로젝트",
    localEventShorts: "AI 지역행사 홍보 숏츠 제작",
    dataAnalysisReport: "AI 데이터 분석 기반 주제탐구보고서 작성",
    tourismPromo: "AI 관광지 소개영상 제작",
    productAd: "AI 제품 광고영상 제작",
  };
  lessonSelect.innerHTML = ["localEventShorts"]
    .map((lessonId) => `<option value="${lessonId}">${labels[lessonId] || lessons[lessonId].classMetadata.classTitle}</option>`)
    .join("");
  lessonSelect.value = currentLessonId;
}

function renderLessonMetadata() {
  const metadata = lessonData.classMetadata;
  document.title = metadata.classTitle;
  brandLabel.textContent = "LoreAX Class ERP";
  heroEyebrow.textContent = "강의관리 ERP";
  heroTitle.textContent = "LoreAX Class ERP";
  heroSubtitle.textContent = "강의 준비, 수업 진행, 실습 자료, 결과물 관리를 한 곳에서 운영하는 강사용 수업 관리 시스템";
  heroCopy.textContent = "현재 실행 모듈: AI 실습형 수업 운영 모듈";
  heroModuleTitle.textContent = metadata.classTitle;
  heroRecommendedScenes.textContent = isVideoLesson()
    ? `${metadata.recommendedSceneCount ?? lessonData.creditRules?.recommendedScenes ?? 4}장면`
    : metadata.totalDuration || "4차시";
  heroDuration.textContent = metadata.totalDuration;
  heroFinalOutput.textContent = metadata.finalOutput;
  if (heroImage) heroImage.hidden = !isVideoLesson();
  moduleLessonTitle.textContent = metadata.classTitle;
  moduleDuration.textContent = metadata.totalDuration;
  moduleFinalOutput.textContent = metadata.finalOutput;
  overviewAudience.textContent = metadata.targetAudience;
  overviewDuration.textContent = metadata.totalDuration;
  overviewOutput.textContent = metadata.finalOutput;
}

function getReportUrl() {
  return `./report/?lesson=${encodeURIComponent(currentLessonId)}`;
}

function getPresentUrl() {
  return `../../present/?lesson=${encodeURIComponent(currentLessonId)}`;
}

function getLessonQuickActions() {
  if (currentLessonId === "dataAnalysisReport") {
    return [
      {
        label: "1",
        title: "입력 시작",
        description: "탐구 주제, 연구 질문, 변수, 데이터 출처를 먼저 작성합니다.",
        href: "#reportBuilder",
        primary: true,
      },
      {
        label: "2",
        title: "프롬프트 복사",
        description: "필요한 시점에 AI 활용 프롬프트를 복사해 초안을 다듬습니다.",
        href: "#prompts",
      },
      {
        label: "3",
        title: "보고서 PDF",
        description: "누락 항목을 확인하고 최종 탐구보고서 PDF를 생성합니다.",
        href: getReportUrl(),
      },
    ];
  }

  return [
    {
      label: "1",
      title: "실습 단계 열기",
      description: "현재 차시의 실습 카드를 열고 체크리스트를 따라 진행합니다.",
      href: "#practice",
      primary: true,
    },
    {
      label: "2",
      title: "프롬프트 복사",
      description: "수업 주제에 맞는 프롬프트를 복사해 AI 도구에 입력합니다.",
      href: "#prompts",
    },
    {
      label: "3",
      title: isHotelLesson() ? "크레딧 확인" : "도구 바로가기",
      description: isHotelLesson()
        ? "Flow 생성 전에 장면 수와 모델별 예상 크레딧을 확인합니다."
        : "수업에 필요한 AI 도구로 이동해 결과물을 제작합니다.",
      href: isVideoLesson() ? "#creditCalculator" : "#tools",
    },
  ];
}

function renderQuickStart() {
  if (!quickActionGrid) return;
  const metadata = lessonData.classMetadata || {};
  const progress = getProgressSummary();
  if (quickStartDescription) {
    quickStartDescription.textContent =
      currentLessonId === "dataAnalysisReport"
        ? "탐구보고서 수업은 입력 작성 → 프롬프트 보조 → PDF 확인 순서로 진행합니다."
        : "영상 제작 수업은 실습 카드 → 프롬프트 복사 → 도구 실행 순서로 진행합니다.";
  }

  const actionCards = getLessonQuickActions()
    .map(
      (action) => `
        <a class="quick-action-card ${action.primary ? "is-primary" : ""}" href="${action.href}">
          <span>${action.label}</span>
          <strong>${action.title}</strong>
          <p>${action.description}</p>
        </a>
      `,
    )
    .join("");

  quickActionGrid.innerHTML = `
    ${actionCards}
    <article class="quick-action-card quick-status-card">
      <span>상태</span>
      <strong>${metadata.classTitle || "현재 수업"}</strong>
      <p>체크리스트 ${progress.completed} / ${progress.total || 0} 완료${progress.total ? ` (${progress.percent}%)` : ""}</p>
    </article>
  `;
}

function renderPreflightPanel() {
  if (!preflightPanel || !preflightGrid) return;
  preflightPanel.hidden = !isTeacherMode();
  if (!isTeacherMode()) return;

  const progress = getProgressSummary();
  const reportData = loadReportData();
  const reportGenerated = Boolean(reportData.metadata?.pdfGenerated);
  const checks = [
    {
      label: "선택 수업",
      value: lessonData.classMetadata?.classTitle || currentLessonId,
      state: "ready",
    },
    {
      label: "학생 화면",
      value: `?lesson=${currentLessonId}`,
      state: "ready",
    },
    {
      label: "진행률",
      value: progress.total ? `${progress.completed}/${progress.total} (${progress.percent}%)` : "체크리스트 없음",
      state: progress.total ? "ready" : "warn",
    },
    {
      label: "보고서 PDF",
      value: reportGenerated ? "생성됨" : "미생성",
      state: reportGenerated ? "ready" : "warn",
    },
    {
      label: "저장 상태",
      value: serverSyncStatus?.textContent?.trim() || "로컬 저장",
      state: "ready",
    },
    {
      label: "강사용 현황",
      value: "새 탭에서 확인",
      state: "ready",
      href: getPresentUrl(),
    },
  ];

  preflightGrid.innerHTML = checks
    .map(
      (item) => `
        <article class="preflight-card is-${item.state}">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          ${item.href ? `<a href="${item.href}" target="_blank" rel="noreferrer">열기</a>` : ""}
        </article>
      `,
    )
    .join("");
}

function renderLesson() {
  renderLessonMetadata();
  renderFlow();
  renderClasses();
  renderPractice();
  renderTools();
  renderInstructorPanel();
  const promptEyebrow = promptSectionHeading?.querySelector(".eyebrow");
  const promptTitle = promptSectionHeading?.querySelector("h2");
  const promptHeadingCopy = promptSectionHeading?.querySelector("p:last-child");
  const promptFoldSummary = document.querySelector("#prompts .prompt-fold-panel summary");
  const promptFoldEyebrow = promptFoldSummary?.querySelector(".eyebrow");
  const promptFoldTitle = promptFoldSummary?.querySelector("h3");
  const promptFoldCopy = promptFoldSummary?.querySelector("p:last-child");
  if (promptEyebrow) promptEyebrow.textContent = isHotelLesson() ? "AI Promotion Prompt Box" : "AI Prompt Box";
  if (promptTitle) promptTitle.textContent = isHotelLesson() ? "Claude 프롬프트 박스" : "AI 프롬프트 박스";
  if (promptHeadingCopy) {
    promptHeadingCopy.textContent = isHotelLesson()
      ? "HeyGen 캐릭터를 먼저 확정한 뒤 Claude에서 GPT/Flow 제작 프롬프트 합본을 생성합니다."
      : "수업 단계에 맞는 AI 활용 프롬프트를 복사해 탐구보고서 작성을 보조합니다.";
  }
  if (promptFoldEyebrow) promptFoldEyebrow.textContent = isHotelLesson() ? "Prompt Tabs" : "Report Prompt Tabs";
  if (promptFoldTitle) promptFoldTitle.textContent = isHotelLesson() ? "Claude 프롬프트 박스" : "주제탐구 프롬프트";
  if (promptFoldCopy) {
    promptFoldCopy.textContent = isHotelLesson()
      ? "수업용 Claude 프롬프트 탭을 펼쳐 확인합니다."
      : "차시별 AI 활용 프롬프트를 펼쳐 확인합니다.";
  }
  renderPrompts();
  const promptGeneratorPanel = promptGenerator?.closest("details");
  if (promptGeneratorPanel) {
    promptGeneratorPanel.hidden = !isHotelLesson();
  }
  if (isHotelLesson()) {
    fillPromptGeneratorDefaults();
  }
  if (creditCalculatorSection) {
    creditCalculatorSection.hidden = !isVideoLesson();
  }
  if (creditCalculatorNavLink) {
    creditCalculatorNavLink.hidden = !isVideoLesson();
  }
  if (isVideoLesson()) {
    initCreditCalculator();
  }
  if (samplesSection) {
    samplesSection.hidden = !isVideoLesson();
  }
  updateProgressDisplay();
  renderQuickStart();
  creditTeacherNotes.hidden = !isTeacherMode() || !isVideoLesson();
}

function switchLesson(lessonId) {
  currentLessonId = lessons[lessonId] ? lessonId : "hotelPromo";
  lessonData = lessons[currentLessonId];
  saveLessonId(currentLessonId);
  renderLessonSelector();
  renderLesson();
  hydrateReportForm();
  sendPresenceHeartbeat?.();
}

function handleLessonSelectChange() {
  switchLesson(lessonSelect.value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function renderFlow() {
  flowTimeline.innerHTML = lessonData.workflow
    .map(
      (item, index) => `
        <li>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${item.tool}</strong>
          <p>${item.role}</p>
        </li>
      `,
    )
    .join("");
}
function renderClasses() {
  classCards.innerHTML = lessonData.periods
    .map(
      (item) => `
        <details class="class-card class-period-panel ${isTeacherMode() ? "has-teacher-info" : ""}">
          <summary class="class-card-summary">
            <span class="period">${item.period}</span>
            <div>
              <h3>${item.title}</h3>
              <p>${item.goal || item.activity}</p>
            </div>
          </summary>
          <div class="class-card-body">
            <dl>
              <div><dt>교시 목표</dt><dd>${item.goal || item.activity}</dd></div>
              <div><dt>학생 할 일</dt><dd>${renderList(item.studentTasks) || item.activity}</dd></div>
              <div><dt>사용 도구</dt><dd>${item.tools}</dd></div>
              <div><dt>결과물</dt><dd>${renderList(item.outputs) || item.output}${item.note ? `<small>${item.note}</small>` : ""}</dd></div>
              <div><dt>체크포인트</dt><dd>${renderList(item.checkpoints) || "진행 상태를 확인합니다."}</dd></div>
              ${
                isTeacherMode()
                  ? `
                    <div class="teacher-note"><dt>강사용 설명</dt><dd>${renderList(item.teacherTasks) || "수업 진행 상황에 맞게 통제 절차를 안내합니다."}</dd></div>
                    <div class="teacher-note is-warning"><dt>실패 시 대체 방법</dt><dd>${renderList(item.failSafe) || "강사 예시 자료 또는 장면 수 축소로 대체합니다."}</dd></div>
                    ${
                      item.teacherNote
                        ? `<div class="teacher-note"><dt>Teacher Note</dt><dd>${item.teacherNote}</dd></div>`
                        : ""
                    }
                  `
                  : ""
              }
            </dl>
          </div>
        </details>
      `,
    )
    .join("");
}

function renderTools() {
  toolCards.innerHTML = Object.entries(lessonData.tools)
    .map(
      ([toolKey, tool]) => `
        <article class="tool-card">
          <div>
            <span class="tool-required ${tool.required ? "is-required" : ""}">${tool.required ? "필수" : "선택"}</span>
            <h3>${tool.name}</h3>
            <p>${tool.purpose}</p>
          </div>
          <a class="tool-button" href="${getToolUrl(toolKey)}" target="_blank" rel="noreferrer">
            ${tool.name} 바로가기
          </a>
          ${
            isTeacherMode()
              ? `
                <div class="teacher-tool-note">
                  <span>강사용</span>
                  <p><strong>운영 구분</strong>${tool.useType || "수업 운영용"}</p>
                  <p><strong>크레딧 주의</strong>${tool.creditNote || "무료 사용량과 생성 제한을 확인하세요."}</p>
                  <p><strong>Teacher Note</strong>${tool.teacherNote || "수업 상황에 맞게 사용 여부를 조정하세요."}</p>
                </div>
              `
              : ""
          }
        </article>
      `,
    )
    .join("");
}

function renderInstructorPanel() {
  const notes = lessonData.instructorNotes?.length
    ? lessonData.instructorNotes
    : [
        "Generate 버튼은 강사 확인 후 누르게 하세요.",
        "모델 선택을 먼저 확인하세요.",
        "참조 이미지 업로드 여부를 확인하세요.",
        "영상 생성 후 반드시 다운로드하도록 안내하세요.",
        "크레딧 부족 시 장소 소개 장면 수를 줄이세요.",
      ];

  instructorNotes.innerHTML = notes
    .map(
      (note) => `
        <article class="teacher-memo-card">
          <span>강사용</span>
          <p>${note}</p>
        </article>
      `,
    )
    .join("");

  riskWarnings.innerHTML = (lessonData.riskWarnings || [])
    .map(
      (risk) => `
        <article class="risk-card">
          <span>주의</span>
          <strong>${risk}</strong>
          <p>수업 진행 전 확인하고, 학생에게 생성 버튼을 누르기 전에 한 번 멈추도록 안내합니다.</p>
        </article>
      `,
    )
    .join("");
}

function initCreditCalculator() {
  const rules = lessonData.creditRules || {};
  totalCreditsInput.value = rules.totalCredits ?? 50;
  sceneCountInput.value = rules.recommendedScenes ?? 4;
  creditPerSceneSelect.innerHTML = `
    <option value="${rules.baseCreditPerScene ?? 10}">${rules.baseCreditPerScene ?? 10}크레딧: ${rules.baseModel || "Veo 3.1 Lite"}</option>
    <option value="${rules.premiumCreditPerScene ?? 15}">${rules.premiumCreditPerScene ?? 15}크레딧: ${rules.premiumModel || "Omni Flash 또는 상위 모델"}</option>
  `;
  updateCreditCalculator();
}

function updateCreditCalculator() {
  const totalCredits = Math.max(0, Number(totalCreditsInput.value) || 0);
  const sceneCount = Math.min(8, Math.max(1, Number(sceneCountInput.value) || 1));
  const creditPerScene = Number(creditPerSceneSelect.value) || lessonData.creditRules?.baseCreditPerScene || 10;
  const usedCredits = sceneCount * creditPerScene;
  const remaining = totalCredits - usedCredits;

  if (String(sceneCount) !== sceneCountInput.value) sceneCountInput.value = sceneCount;
  expectedCredits.textContent = usedCredits;
  remainingCredits.textContent = remaining;

  let status = "safe";
  let label = "안전";
  let message = "예비 크레딧이 남아 있습니다. 실수나 재생성에 대비할 수 있습니다.";

  if (remaining < 0) {
    status = "danger";
    label = "위험";
    message = "예상 크레딧을 초과합니다. 장면 수를 줄이거나 모델을 변경해야 합니다.";
  } else if (remaining < 10) {
    status = "warning";
    label = "주의";
    message = "재생성 여유가 거의 없습니다. 프롬프트와 모델 선택을 반드시 확인하세요.";
  }

  creditStatusCard.classList.remove("is-safe", "is-warning", "is-danger");
  creditStatusCard.classList.add(`is-${status}`);
  creditStatusLabel.textContent = label;
  creditStatusMessage.textContent = message;
}

function applyMode(mode) {
  currentMode = mode === "teacher" ? "teacher" : "student";
  saveMode(currentMode);
  document.body.dataset.mode = currentMode;
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === currentMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  instructorPanel.hidden = !isTeacherMode();
  renderClasses();
  renderTools();
  renderInstructorPanel();
  renderPrompts();
  updateProgressDisplay();
  renderQuickStart();
  creditTeacherNotes.hidden = !isTeacherMode() || !isVideoLesson();
}

function renderPractice() {
  const progress = loadLessonProgress();
  const activePracticeSteps = Array.isArray(lessonData.practiceSteps)
    ? lessonData.practiceSteps
    : isHotelLesson()
      ? practiceSteps
      : [];
  practiceAccordion.innerHTML = activePracticeSteps
    .map((step, index) => {
      const tool = lessonData.tools[step.toolKey] || (isHotelLesson() ? hotelPromoLesson.tools[step.toolKey] : null) || { name: step.toolKey || "도구" };
      return `
        <details class="practice-panel">
          <summary>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${step.title}</strong>
          </summary>
          <div class="practice-body">
            <div class="practice-info">
              <p><strong>${step.infoLabels?.[0] || "도구 역할"}</strong>${step.role}</p>
              <p><strong>${step.infoLabels?.[1] || "학생 활동"}</strong>${step.activity}</p>
              <p><strong>${step.infoLabels?.[2] || "결과물"}</strong>${step.output}</p>
              ${
                step.details
                  ? `<div class="practice-detail-block">
                      <h4>${step.detailTitle}</h4>
                      <ol>
                        ${step.details
                          .map(
                            (detail) => `
                              <li>
                                <strong>${detail.title}</strong>
                                <p>${detail.text}</p>
                              </li>
                            `,
                          )
                          .join("")}
                      </ol>
                    </div>`
                  : ""
              }
            </div>
            <div class="practice-actions">
              ${
                step.guides
                  ? `<div class="guide-launchers" aria-label="HeyGen 캐릭터 생성 해설 팝업">
                      <span>해설 팝업</span>
                      ${step.guides
                        .map(
                          (guideKey) => `
                            <button class="guide-button" type="button" data-guide="${guideKey}">
                              <strong>${guideData[guideKey].title}</strong>
                              <small>팝업 보기</small>
                            </button>
                          `,
                        )
                        .join("")}
                    </div>`
                  : ""
              }
              <a class="tool-button" href="${getToolUrl(step.toolKey)}" target="_blank" rel="noreferrer">
                ${tool.name} 바로가기
              </a>
              <ul class="check-list">
                ${step.checklist
                  .map((item, checkIndex) => {
                    const progressId = getChecklistItemId(index, checkIndex);
                    const isChecked = Boolean(progress[progressId]);
                    return `
                      <li class="${isChecked ? "is-complete" : ""}">
                        <label>
                          <input type="checkbox" data-progress-id="${progressId}" ${isChecked ? "checked" : ""} />
                          ${item}
                        </label>
                      </li>
                    `;
                  })
                  .join("")}
              </ul>
            </div>
          </div>
        </details>
        ${false ? renderScenePromptBoard() : ""}
      `;
    })
    .join("");
}

function renderScenePromptBoard() {
  return `
    <details class="scene-prompt-board" aria-label="자세한 영상 프롬프트 및 결과보기">
      <summary class="scene-prompt-head">
        <div>
          <span>Flow Detail</span>
          <h3>자세한 영상 및 프롬프트 결과보기</h3>
        </div>
        <p>클릭하면 5개 씬의 참조 이미지, 영상, 프롬프트를 확인할 수 있습니다.</p>
      </summary>
      <div class="scene-slot-grid">
        ${scenePromptSlots
          .map(
            (scene, sceneIndex) => `
              <article class="scene-slot">
                <div class="scene-slot-title">
                  <span>${scene.label}</span>
                  <strong>${scene.title}</strong>
                  ${scene.subtitle ? `<small>${scene.subtitle}</small>` : ""}
                </div>
                <div class="scene-prompt-empty ${scene.prompt ? "is-filled" : ""}">
                  <span>${scene.referenceNote || "상세 영상 프롬프트"}</span>
                </div>
                ${
                  scene.referenceImage
                    ? `<div class="scene-reference-thumb">
                        <img src="${scene.referenceImage}" alt="${scene.title} 참조 이미지" />
                        <span>${scene.referenceImageNote || "참조용 이미지"}</span>
                      </div>`
                    : ""
                }
                <div class="scene-result-empty ${scene.video ? "has-video" : ""}">
                  ${
                    scene.video
                      ? `<video src="${scene.video}" muted playsinline preload="metadata"></video>`
                      : `<span>결과 영상 자리</span>`
                  }
                </div>
                ${
                  scene.prompt || scene.video
                    ? `<button class="scene-open-button" type="button" data-scene-index="${sceneIndex}">확대해서 보기</button>`
                    : ""
                }
              </article>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function openGuideModal(key) {
  const guide = guideData[key];
  if (!guide) return;
  guideModalBadge.textContent = guide.badge;
  guideModalVisualTitle.textContent = guide.visualTitle;
  guideModalVisualText.textContent = guide.visualText;
  guideModalVisual.style.backgroundImage = guide.image ? `url("${guide.image}")` : "";
  guideModalVisual.classList.toggle("has-image", Boolean(guide.image));
  guideModal.classList.toggle("image-only", Boolean(guide.image));
  guideModal.classList.toggle("has-prompt", Boolean(guide.prompt));
  guideModalEyebrow.textContent = "HeyGen Character Guide";
  guideModalTitle.textContent = guide.title;
  guideModalSummary.textContent = guide.summary;
  guideModalList.innerHTML = guide.points.map((point) => `<li>${point}</li>`).join("");
  guideModalPrompt.hidden = !guide.prompt;
  guideModalPromptText.textContent = guide.prompt || "";
  if (!guideModal.open) guideModal.showModal();
}

function openSceneModal(index) {
  const scene = scenePromptSlots[index];
  if (!scene) return;
  sceneModalLabel.textContent = scene.label;
  sceneModalTitle.textContent = `${scene.title}${scene.subtitle ? ` · ${scene.subtitle}` : ""}`;
  sceneModalReference.textContent = scene.referenceNote || "";
  sceneModalReferenceImage.hidden = !scene.referenceImage;
  sceneModalReferenceImageSrc.src = scene.referenceImage || "";
  sceneModalReferenceImageCaption.textContent = scene.referenceImageNote || "";
  sceneModalImagePromptBox.hidden = !scene.imagePrompt;
  sceneModalImagePrompt.textContent = scene.imagePrompt || "";
  sceneModalPrompt.textContent = scene.prompt || "상세 영상 프롬프트를 나중에 입력합니다.";
  sceneModalVideo.src = scene.video || "";
  sceneModalVideo.hidden = !scene.video;
  if (!sceneModal.open) sceneModal.showModal();
}

function closeSceneModal() {
  sceneModalVideo.pause();
  sceneModalVideo.removeAttribute("src");
  sceneModalVideo.load();
  sceneModalReferenceImageSrc.removeAttribute("src");
  sceneModalImagePrompt.textContent = "";
  sceneModal.close();
}

function renderPrompts() {
  promptTabs.innerHTML = lessonData.promptTabs
    .map(
      (prompt, index) => `
        <button class="prompt-tab ${index === 0 ? "is-active" : ""}" type="button" data-prompt="${prompt.tabId}">
          ${prompt.tabTitle}
        </button>
      `,
    )
    .join("");

  promptPanels.innerHTML = lessonData.promptTabs
    .map(
      (prompt, index) => `
        <article class="prompt-panel ${index === 0 ? "is-active" : ""}" data-prompt-panel="${prompt.tabId}">
          <div class="prompt-panel-head">
            <div>
              <h3>${prompt.tabTitle}</h3>
              <p>${prompt.description}</p>
            </div>
          </div>
          <div class="prompt-summary">
            <strong>학생 안내</strong>
            <p>${prompt.studentSummary}</p>
          </div>
          ${
            isTeacherMode() && prompt.teacherNote
              ? `<div class="prompt-teacher-note">
                  <strong>Teacher Note</strong>
                  <p>${prompt.teacherNote}</p>
                </div>`
              : ""
          }
          <div class="prompt-block-list">
            ${prompt.blocks
              .map(
                (block, blockIndex) => `
                  <section class="prompt-block">
                    <div class="prompt-block-head">
                      <div>
                        <h4>${block.title}</h4>
                        <p>${block.description}</p>
                      </div>
                      ${
                        block.copyable
                          ? `<button class="copy-button" type="button" data-copy="${prompt.tabId}:${blockIndex}">복사하기</button>`
                          : ""
                      }
                    </div>
                    ${
                      isTeacherMode() && block.teacherNote
                        ? `<div class="prompt-teacher-note is-compact">
                            <strong>Teacher Note</strong>
                            <p>${block.teacherNote}</p>
                          </div>`
                        : ""
                    }
                    <pre>${block.body}</pre>
                  </section>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function getPromptGeneratorDefaults() {
  const metadata = lessonData.classMetadata || {};
  const defaultMap = {
    hotelPromo: {
      projectTitle: "AI 홍보영상 제작 프로젝트",
      targetType: "우리 학교",
      placeName: "우리 학교 축제",
      placeOne: "체험 부스와 참여 활동",
      placeTwo: "무대 공연과 학생 인터뷰",
      characterRole: "밝고 신뢰감 있는 홍보 안내자",
      tone: "활기차고 명확한 AI 홍보영상",
    },
    dataAnalysisReport: {
      projectTitle: "AI 데이터 분석 기반 주제탐구보고서 작성",
      placeName: "서울시 월별 대기오염도",
      placeOne: "대중교통 이용량",
      placeTwo: "대기오염도",
      characterRole: "데이터를 객관적으로 분석하는 탐구자",
      tone: "데이터에 근거한 객관적이고 명확한 주제탐구보고서",
    },
    tourismPromo: {
      projectTitle: "AI 관광지 소개영상 제작",
      placeName: "해변 관광지",
      placeOne: "대표 풍경",
      placeTwo: "방문 포인트",
      characterRole: "밝고 신뢰감 있는 관광 안내자",
      tone: "생동감 있고 정보가 분명한 관광 홍보영상",
    },
    productAd: {
      projectTitle: "AI 제품 광고영상 제작",
      placeName: "스마트 텀블러",
      placeOne: "제품 첫인상",
      placeTwo: "사용 장면",
      characterRole: "제품 장점을 자연스럽게 소개하는 모델",
      tone: "깔끔하고 설득력 있는 제품 광고영상",
    },
  };

  return {
    ...(defaultMap[currentLessonId] || defaultMap.hotelPromo),
    projectTitle: defaultMap[currentLessonId]?.projectTitle || metadata.classTitle || defaultMap.hotelPromo.projectTitle,
  };
}

function fillPromptGeneratorDefaults() {
  const defaults = getPromptGeneratorDefaults();
  promptProjectTitle.value = defaults.projectTitle;
  if (promptTargetType) promptTargetType.value = defaults.targetType || "우리 학교";
  promptPlaceName.value = defaults.placeName;
  promptPlaceOne.value = defaults.placeOne;
  promptPlaceTwo.value = defaults.placeTwo;
  promptCharacterRole.value = defaults.characterRole;
  promptTone.value = defaults.tone;
  promptHeygenResult.value = "";
  updateGeneratedPrompts();
}

function getPromptGeneratorValues() {
  const defaults = getPromptGeneratorDefaults();
  return {
    projectTitle: promptProjectTitle.value.trim() || defaults.projectTitle,
    targetType: promptTargetType?.value || defaults.targetType || "우리 학교",
    placeName: promptPlaceName.value.trim() || defaults.placeName,
    placeOne: promptPlaceOne.value.trim() || defaults.placeOne,
    placeTwo: promptPlaceTwo.value.trim() || defaults.placeTwo,
    characterRole: promptCharacterRole.value.trim() || defaults.characterRole,
    tone: promptTone.value.trim() || defaults.tone,
    heygenResult: promptHeygenResult.value.trim(),
  };
}

function buildGeneratedPromptSet() {
  const values = getPromptGeneratorValues();
  const narrations = [
    "어서 오세요, 특별한 하루입니다",
    `${values.placeOne}의 매력을 만나보세요`,
    `${values.placeTwo}에서 깊은 여유를 느껴보세요`,
    "다시 찾고 싶은 순간입니다",
  ];
  const scenePlan = [
    {
      label: "장면 1 · 인트로",
      type: "인트로",
      location: `${values.placeName} 입구 또는 대표 전경`,
      action: "캐릭터가 화면을 향해 환영 인사를 하며 주제의 첫인상을 보여준다.",
      narration: narrations[0],
      reference: "4방향 캐릭터 레퍼런스샷",
    },
    {
      label: "장면 2 · 핵심 소개 1",
      type: "핵심 소개 1",
      location: values.placeOne,
      action: "캐릭터가 첫 번째 핵심 공간을 안내하고 카메라는 공간의 분위기를 부드럽게 보여준다.",
      narration: narrations[1],
      reference: "4방향 캐릭터 레퍼런스샷 + 필요 시 장소 참조 이미지",
    },
    {
      label: "장면 3 · 핵심 소개 2",
      type: "핵심 소개 2",
      location: values.placeTwo,
      action: "캐릭터가 두 번째 핵심 공간을 소개하고 이용 장면이 자연스럽게 이어진다.",
      narration: narrations[2],
      reference: "4방향 캐릭터 레퍼런스샷 + 필요 시 장소 참조 이미지",
    },
    {
      label: "장면 4 · 아웃트로",
      type: "아웃트로",
      location: `${values.placeName}의 마무리 공간`,
      action: "캐릭터가 다시 화면을 향해 짧게 인사하고 영상이 안정적으로 마무리된다.",
      narration: narrations[3],
      reference: "4방향 캐릭터 레퍼런스샷",
    },
  ];

  const heygen = `[Claude에 넣을 HeyGen 캐릭터 생성 프롬프트 요청]
다음 조건으로 HeyGen 캐릭터 생성/체험에 바로 사용할 프롬프트를 작성해라.

수업/프로젝트: ${values.projectTitle}
홍보 대상 유형: ${values.targetType}
홍보 대상명: ${values.placeName}
캐릭터 역할: ${values.characterRole}
영상 분위기: ${values.tone}

반드시 포함할 것:
- 캐릭터 외형: 단정한 헤어스타일, 밝고 신뢰감 있는 표정, 전문적인 복장
- 말투: 친절하고 또렷한 한국어 안내 톤
- 목소리 프로필: 같은 화자로 유지할 성별 느낌, 연령대, 속도, 억양, 감정 톤
- HeyGen에 넣을 짧은 한국어 대사
- 이후 모든 장면의 나레이션에서 같은 voice preset/voice ID/화자 설정을 유지하라는 안내
- 무료 체험에서는 다운로드 제한이 있을 수 있으므로 결과 화면 확인 중심이라는 안내
- 이후 합본 프롬프트에 붙여 넣을 수 있도록 캐릭터 결과 요약란

HeyGen 체험용 대사 초안:
"안녕하세요. ${values.placeName}을 소개합니다. 오늘은 ${values.placeOne}와 ${values.placeTwo}를 짧게 보여드리겠습니다."`;

  const heygenResultForPrompt =
    values.heygenResult ||
    "아직 HeyGen 결과를 붙여 넣지 않았다면, 위 캐릭터 역할과 영상 분위기로 기준을 잡고 임시 캐릭터 설정을 만들고 학생에게 HeyGen 결과로 교체하라고 안내합니다.";

  const reference = `[합본에 포함할 GPT 레퍼런스샷 생성 조건]
다음 조건으로 GPT 이미지 생성에 사용할 4방향 레퍼런스샷 프롬프트를 작성해라.

기준 이미지:
- HeyGen에서 확정한 캐릭터 결과를 기준으로 사용합니다.

HeyGen 캐릭터 결과:
${heygenResultForPrompt}

생성해야 할 결과:
- 같은 인물의 전신 4방향 레퍼런스샷
- 정면, 왼쪽, 오른쪽, 뒷모습이 한 장에 모두 보이게 한다.

캐릭터 역할:
${values.characterRole}

반드시 유지할 것:
- 같은 얼굴
- 같은 헤어스타일
- 같은 체형
- 같은 복장
- 같은 신발
- 같은 전체 분위기

금지:
- 배경 장면 추가 금지
- 소품 추가 금지
- 로고/텍스트 금지
- 네 방향에서 옷이나 얼굴이 바뀌는 것 금지

출력은 학생이 GPT에 바로 복사해 넣을 수 있는 영어 이미지 생성 프롬프트로 작성해라.`;

  const scenePrompts = scenePlan.map(
    (scene) => `[${scene.label}]
이 내용은 Google Flow에 바로 넣는 최종 프롬프트가 아니다.
HeyGen 결과 반영 합본에서 Claude가 이 장면의 실제 Flow 입력 프롬프트를 만들 때 사용할 조건이다.

Claude에게 요청할 일:
아래 조건을 바탕으로 Google Flow에 실제로 입력할 영어 영상 생성 프롬프트를 작성해라.

장면 유형: ${scene.type}
수업/프로젝트: ${values.projectTitle}
홍보 대상 유형: ${values.targetType}
홍보 대상명: ${values.placeName}
HeyGen 캐릭터 결과: ${heygenResultForPrompt}
장면 위치: ${scene.location}
장면 행동: ${scene.action}
참조 이미지 조건: ${scene.reference}
영상 분위기: ${values.tone}
한국어 나레이션(20자 내외): "${scene.narration}"
목소리 일관성 조건: HeyGen 캐릭터 결과의 목소리 톤, 말투, 속도, 억양, 감정선을 모든 장면에서 같은 화자처럼 유지

나레이션 배분 규칙:
- 이 장면의 나레이션은 반드시 이 장면의 Flow 프롬프트와 한 묶음으로 출력한다.
- 나레이션을 다른 장면으로 섞거나 합치지 않는다.
- Flow에 입력할 영상 프롬프트와 편집용 한국어 나레이션을 분리해서 보여준다.
- 같은 voice preset/voice ID/화자 설정을 계속 사용하도록 편집 메모를 포함한다.

Flow 프롬프트에 반드시 포함할 조건:
- 10초 영상
- 16:9 가로형 영상
- 자연스러운 카메라 움직임
- 현실적인 조명과 깨끗한 구도
- 업로드한 4방향 캐릭터 레퍼런스샷을 고정 캐릭터 기준으로 사용
- 얼굴, 헤어스타일, 체형, 복장, 신발이 레퍼런스와 동일하게 유지
- 랜덤 텍스트, 로고, 손 왜곡, 불필요한 인물 추가 금지

Claude 출력 형식:
1. Google Flow에 붙여넣을 최종 영어 프롬프트
2. 이 장면에 배정된 편집용 한국어 나레이션 1줄
3. 목소리 일관성 편집 메모 1줄`,
  );

  const videos = scenePrompts.join("\n\n---\n\n");

  const combined = `[HeyGen 결과 반영 합본 생성 요청문]
너는 AI 실습형 영상 제작 수업의 프롬프트 설계자다.
이미 HeyGen 캐릭터 생성/체험을 먼저 진행했다.
아래 HeyGen 캐릭터 결과를 반영해서 실제 수업에서 사용할 프롬프트 합본을 생성하라.

수업/프로젝트: ${values.projectTitle}
홍보 대상 유형: ${values.targetType}
홍보 대상명: ${values.placeName}
캐릭터 역할: ${values.characterRole}
핵심 장면 1: ${values.placeOne}
핵심 장면 2: ${values.placeTwo}
영상 분위기: ${values.tone}
권장 구성: 인트로 1 + 핵심 소개 2 + 아웃트로 1, 총 4장면

[HeyGen 캐릭터 결과]
${heygenResultForPrompt}

반드시 출력할 것:
1. HeyGen 캐릭터 설정 요약
   - 외형, 복장, 말투, 목소리 톤, 수업용 짧은 대사
   - HeyGen 체험 결과를 이후 제작의 고정 캐릭터 기준으로 쓰라는 안내
   - 이후 모든 나레이션에서 같은 화자/목소리 프로필을 유지하라는 안내
2. GPT 레퍼런스샷 생성 프롬프트
   - 같은 인물의 전신 4방향 레퍼런스샷
   - 정면, 왼쪽, 오른쪽, 뒷모습
   - 얼굴, 헤어스타일, 체형, 복장, 신발이 유지되도록 작성
3. Google Flow 장면별 최종 영어 프롬프트 4개
   - 장면 1: 인트로 + 장면 1 나레이션
   - 장면 2: ${values.placeOne} + 장면 2 나레이션
   - 장면 3: ${values.placeTwo} + 장면 3 나레이션
   - 장면 4: 아웃트로 + 장면 4 나레이션
4. 각 장면에 맞는 한국어 20자 내외 나레이션 4개
   - 4개 나레이션은 같은 사람이 이어서 말하는 것처럼 말투, 속도, 억양, 감정 톤을 통일
5. 학생이 복사해 사용할 수 있는 최종 합본
   - HeyGen 캐릭터 요약
   - GPT 레퍼런스샷 프롬프트
   - Flow 장면 1~4 프롬프트와 각 장면에 배정된 한국어 나레이션
   - 목소리 일관성 유지 규칙

중요:
- 이 요청문은 HeyGen 캐릭터 생성 이후에만 사용합니다.
- Flow 프롬프트는 반드시 장면 1, 장면 2, 장면 3, 장면 4로 분리해서 출력합니다.
- Flow에는 4개 장면 프롬프트를 한 번에 넣지 않고 각각 따로 입력합니다.
- 장면마다 한국어 나레이션은 20자 내외로 짧게 쓴다.
- HeyGen 합본에서 나온 나레이션은 인트로, 핵심 소개 1, 핵심 소개 2, 아웃트로 순서로 각각 하나씩 배분합니다.
- 각 Flow 장면 출력은 "최종 영어 영상 프롬프트"와 "해당 장면 한국어 나레이션"을 한 세트로 묶는다.
- 나레이션 4개를 한곳에 몰아서 쓰지 말고, 장면 1~4 아래에 각각 붙여서 출력합니다.
- 모든 나레이션은 같은 목소리 프로필을 따른다. 성별 느낌, 연령대, 발화 속도, 억양, 감정 톤이 장면마다 바뀌면 안 된다.
- HeyGen이나 ElevenLabs를 사용할 경우 같은 voice preset/voice ID/화자 설정을 계속 사용하라고 명시합니다.
- CapCut 편집 단계에서는 장면별 음성 볼륨, 속도, 톤이 튀지 않도록 맞추라는 편집 메모를 포함합니다.
- 50크레딧 수업 운영을 고려하여 기본 4장면 구성으로 제한합니다.
- 프롬프트가 너무 길어 영상 길이가 줄어들 수 있으므로 핵심 동작과 구도 중심으로 작성합니다.

Flow 장면 출력 형식은 반드시 아래 구조를 따른다:

[장면 1 · 인트로]
- Flow 최종 영어 프롬프트:
- 한국어 나레이션:
- 목소리 일관성 메모:

[장면 2 · ${values.placeOne}]
- Flow 최종 영어 프롬프트:
- 한국어 나레이션:
- 목소리 일관성 메모:

[장면 3 · ${values.placeTwo}]
- Flow 최종 영어 프롬프트:
- 한국어 나레이션:
- 목소리 일관성 메모:

[장면 4 · 아웃트로]
- Flow 최종 영어 프롬프트:
- 한국어 나레이션:
- 목소리 일관성 메모:

[GPT 레퍼런스샷 생성 조건]
${reference}

[장면별 Flow 생성 조건]
${videos}`;

  return { heygen, reference, videos, scenePrompts, combined };
}

function updateGeneratedPrompts() {
  const prompts = buildGeneratedPromptSet();
  generatedHeygenPrompt.textContent = prompts.heygen;
  generatedReferencePrompt.textContent = prompts.reference;
  generatedVideoPrompts.textContent = prompts.videos;
  generatedVideoPrompts.hidden = true;
  generatedScenePrompt1.textContent = prompts.scenePrompts[0] || "";
  generatedScenePrompt2.textContent = prompts.scenePrompts[1] || "";
  generatedScenePrompt3.textContent = prompts.scenePrompts[2] || "";
  generatedScenePrompt4.textContent = prompts.scenePrompts[3] || "";
  generatedCombinedPrompt.textContent = prompts.combined;
}

function copyGeneratedPrompt(type) {
  const promptMap = {
    heygen: generatedHeygenPrompt,
    reference: generatedReferencePrompt,
    videos: generatedVideoPrompts,
    scene1: generatedScenePrompt1,
    scene2: generatedScenePrompt2,
    scene3: generatedScenePrompt3,
    scene4: generatedScenePrompt4,
    combined: generatedCombinedPrompt,
  };
  const target = promptMap[type];
  if (!target) return;
  copyText(target.textContent, "프롬프트가 복사되었습니다.");
}

function switchPrompt(id) {
  document.querySelectorAll(".prompt-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.prompt === id);
  });
  document.querySelectorAll(".prompt-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.promptPanel === id);
  });
}

function copyText(text, successMessage = "프롬프트가 복사되었습니다.") {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast(successMessage);
  } catch {
    showToast("복사할 수 없습니다. 프롬프트를 직접 선택해 주세요.");
  }
}

function copyPrompt(id) {
  const [tabId, blockIndexValue] = id.split(":");
  const prompt = lessonData.promptTabs.find((item) => item.tabId === tabId);
  const block = prompt?.blocks?.[Number(blockIndexValue)];
  if (!block) return;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = block.body;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("프롬프트가 복사되었습니다");
  } catch {
    showToast("복사할 수 없습니다. 프롬프트를 직접 선택해 주세요");
  }
}

function initVideoSlots() {
  document.querySelectorAll("[data-video-input]").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      const slot = input.closest(".video-slot");
      const video = slot.querySelector("video");
      const placeholder = slot.querySelector(".video-placeholder");
      const title = slot.querySelector(".video-slot-footer h3");

      video.src = URL.createObjectURL(file);
      video.hidden = false;
      placeholder.hidden = true;
      if (title) title.textContent = file.name;
      video.load();
      showToast("영상이 탑재되었습니다");
    });
  });
}

renderLessonSelector();
initVideoSlots();
renderLesson();
applyMode(currentMode);
window.LoreAXTenant?.applyTenantLinks?.();

lessonSelect.addEventListener("change", () => {
  handleLessonSelectChange();
});

lessonSelect.addEventListener("input", () => {
  handleLessonSelectChange();
});

window.setTimeout(() => {
  if (lessonSelect.value !== currentLessonId && lessons[lessonSelect.value]) {
    switchLesson(lessonSelect.value);
  }
}, 0);

modeToggle.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  applyMode(button.dataset.mode);
  renderPreflightPanel();
});

hardRefreshButton?.addEventListener("click", () => {
  window.location.reload();
});

[totalCreditsInput, sceneCountInput, creditPerSceneSelect].forEach((control) => {
  control.addEventListener("input", updateCreditCalculator);
  control.addEventListener("change", updateCreditCalculator);
});

promptTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-prompt]");
  if (button) switchPrompt(button.dataset.prompt);
});

promptPanels.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy]");
  if (button) copyPrompt(button.dataset.copy);
});

[promptProjectTitle, promptTargetType, promptPlaceName, promptPlaceOne, promptPlaceTwo, promptCharacterRole, promptTone, promptHeygenResult].filter(Boolean).forEach((control) => {
  control.addEventListener("input", updateGeneratedPrompts);
});

regeneratePromptsButton.addEventListener("click", fillPromptGeneratorDefaults);

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-generated]");
  if (button) copyGeneratedPrompt(button.dataset.copyGenerated);
});

practiceAccordion.addEventListener("click", (event) => {
  const sceneButton = event.target.closest("[data-scene-index]");
  if (sceneButton) {
    openSceneModal(Number(sceneButton.dataset.sceneIndex));
    return;
  }

  const button = event.target.closest("[data-guide]");
  if (button) openGuideModal(button.dataset.guide);
});

practiceAccordion.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-progress-id]");
  if (!checkbox) return;

  const progress = loadLessonProgress();
  if (checkbox.checked) {
    progress[checkbox.dataset.progressId] = true;
  } else {
    delete progress[checkbox.dataset.progressId];
  }

  saveLessonProgress(progress);
  checkbox.closest("li")?.classList.toggle("is-complete", checkbox.checked);
  updateProgressDisplay();
  renderQuickStart();
  renderPreflightPanel();
});

resetProgressButton.addEventListener("click", () => {
  if (resetProgressButton.dataset.confirming !== "true") {
    resetProgressButton.dataset.confirming = "true";
    resetProgressButton.textContent = "한 번 더 누르면 초기화됩니다";
    window.clearTimeout(resetProgressConfirmTimer);
    resetProgressConfirmTimer = window.setTimeout(() => {
      resetProgressButton.dataset.confirming = "false";
      resetProgressButton.textContent = "현재 수업 진행상태 초기화";
    }, 3500);
    return;
  }

  window.clearTimeout(resetProgressConfirmTimer);
  resetProgressButton.dataset.confirming = "false";
  resetProgressButton.textContent = "현재 수업 진행상태 초기화";
  clearLessonProgress();
  renderPractice();
  updateProgressDisplay();
  renderQuickStart();
  renderPreflightPanel();
});

sceneModalClose.addEventListener("click", closeSceneModal);
sceneModal.addEventListener("click", (event) => {
  if (event.target === sceneModal) closeSceneModal();
});

guideModalClose.addEventListener("click", () => guideModal.close());
guideModal.addEventListener("click", (event) => {
  if (event.target === guideModal) guideModal.close();
});

const REPORT_STORAGE_PREFIX = "loreaxReport:";
const REPORT_AUTOSAVE_DELAY_MS = 1200;
const reportFields = [...document.querySelectorAll("[data-report-path]")];
const reportSaveStatus = document.querySelector("#reportSaveStatus");
const serverSyncStatus = document.querySelector("#serverSyncStatus");
const reportChartInput = document.querySelector("#reportChartInput");
const reportChartPreview = document.querySelector("#reportChartPreview");
const reportChartPreviewImage = document.querySelector("#reportChartPreview img");
const removeReportChartButton = document.querySelector("#removeReportChartButton");
let reportSaveTimer;
let reportServerSaveTimer;

function updateServerSyncStatus(statusText, state = "local") {
  if (!serverSyncStatus) return;
  serverSyncStatus.textContent = statusText;
  serverSyncStatus.dataset.state = state;
}

window.addEventListener("loreax:supabase-status", (event) => {
  const state = event.detail?.state || "local";
  const labelMap = {
    synced: "서버 저장 완료",
    syncing: "서버 동기화 중",
    local: "로컬에 안전 저장됨",
    mock: "로컬에 안전 저장됨",
    offline: "오프라인",
  };
  updateServerSyncStatus(labelMap[state] || event.detail?.detail || "로컬에 안전 저장됨", state);
});

function createDefaultReportData() {
  const now = new Date().toISOString();
  return {
    student: {
      name: "",
      studentNumber: "",
      className: "",
    },
    report: {
      title: "",
      topicReason: "",
      researchQuestion: "",
      independentVariable: "",
      dependentVariable: "",
      researchScope: "",
      dataSummary: "",
      cleanedDataNotes: "",
      introduction: {
        background: "",
        purpose: "",
        necessity: "",
      },
      methodology: {
        dataSource: "",
        collectionMethod: "",
        analysisMethod: "",
      },
      results: {
        summary: "",
        chartTitle: "",
        xAxisDescription: "",
        yAxisDescription: "",
        interpretation: "",
      },
      conclusion: {
        answer: "",
        limitations: "",
        futureResearch: "",
        significance: "",
      },
      references: [],
      aiUsageLogs: [],
      selfDraft: "",
      aiRevisedSentence: "",
      finalRevisedSentence: "",
      peerFeedback: "",
      feedbackReflection: "",
      aiFinalRevisionLog: "",
    },
    chartImage: null,
    metadata: {
      createdAt: now,
      updatedAt: now,
      pdfGenerated: false,
      pdfGeneratedAt: "",
    },
  };
}

function getReportStorageKey() {
  return `${REPORT_STORAGE_PREFIX}${currentLessonId}`;
}

function getByPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function setByPath(source, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== "object") current[key] = {};
    return current[key];
  }, source);
  target[lastKey] = value;
}

function normalizeReportData(data) {
  const base = createDefaultReportData();
  return {
    ...base,
    ...data,
    student: { ...base.student, ...(data?.student || {}) },
    report: {
      ...base.report,
      ...(data?.report || {}),
      introduction: { ...base.report.introduction, ...(data?.report?.introduction || {}) },
      methodology: { ...base.report.methodology, ...(data?.report?.methodology || {}) },
      results: { ...base.report.results, ...(data?.report?.results || {}) },
      conclusion: { ...base.report.conclusion, ...(data?.report?.conclusion || {}) },
      references: Array.isArray(data?.report?.references) ? data.report.references : [],
      aiUsageLogs: Array.isArray(data?.report?.aiUsageLogs) ? data.report.aiUsageLogs : [],
    },
    metadata: { ...base.metadata, ...(data?.metadata || {}) },
    chartImage: data?.chartImage || null,
  };
}

function loadReportData() {
  try {
    const storedReport = window.localStorage.getItem(getReportStorageKey());
    return storedReport ? normalizeReportData(JSON.parse(storedReport)) : createDefaultReportData();
  } catch {
    return createDefaultReportData();
  }
}

function getStudentIdentityFromReport(reportData = loadReportData()) {
  return {
    studentName: String(reportData.student?.name || "").trim(),
    studentNumber: String(reportData.student?.studentNumber || "").trim(),
    className: String(reportData.student?.className || "").trim(),
  };
}

function scheduleReportServerSave(reportData) {
  if (!window.LoreAXSupabase?.isEnabled?.()) {
    updateServerSyncStatus("로컬에 안전 저장됨", "mock");
    return;
  }
  updateServerSyncStatus("서버 동기화 중", "syncing");
  window.clearTimeout(reportServerSaveTimer);
  reportServerSaveTimer = window.setTimeout(() => {
    const presence = buildPresencePayload();
    window.LoreAXSupabase.saveReport({
      lessonId: currentLessonId,
      reportData,
      presence,
    }).then((result) => {
      if (result.mode === "supabase") updateServerSyncStatus("서버 저장 완료", "synced");
      if (result.mode !== "supabase") updateServerSyncStatus("로컬에 안전 저장됨", "local");
    });
  }, 2500);
}

function saveReportData(data, statusText = "저장 완료") {
  const reportData = normalizeReportData(data);
  reportData.metadata.updatedAt = new Date().toISOString();
  try {
    window.localStorage.setItem(getReportStorageKey(), JSON.stringify(reportData));
    if (reportSaveStatus) reportSaveStatus.textContent = `${statusText} · ${new Date(reportData.metadata.updatedAt).toLocaleTimeString("ko-KR")}`;
    window.LoreAXUsage?.trackActivitySave?.(currentLessonId, { source: "ai_practice_report_save" });
    scheduleReportServerSave(reportData);
  } catch {
    if (reportSaveStatus) reportSaveStatus.textContent = "로컬 저장 실패";
    updateServerSyncStatus("오프라인", "offline");
  }
  renderPreflightPanel();
  sendPresenceHeartbeat?.();
}

function getReportFieldValue(field) {
  const value = field.value || "";
  if (field.dataset.reportPath === "report.references" || field.dataset.reportPath === "report.aiUsageLogs") {
    return value
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}

function setReportFieldValue(field, data) {
  const value = getByPath(data, field.dataset.reportPath);
  field.value = Array.isArray(value) ? value.join("\n") : value || "";
}

function collectReportDataFromForm() {
  const reportData = loadReportData();
  reportFields.forEach((field) => {
    setByPath(reportData, field.dataset.reportPath, getReportFieldValue(field));
  });
  return reportData;
}

function scheduleReportSave() {
  if (!reportFields.length) return;
  if (reportSaveStatus) reportSaveStatus.textContent = "저장 중...";
  window.clearTimeout(reportSaveTimer);
  reportSaveTimer = window.setTimeout(() => {
    saveReportData(collectReportDataFromForm(), "로컬 저장됨");
  }, REPORT_AUTOSAVE_DELAY_MS);
}

function renderReportChartPreview(reportData) {
  if (!reportChartPreview || !reportChartPreviewImage) return;
  const hasImage = Boolean(reportData.chartImage);
  reportChartPreview.hidden = !hasImage;
  reportChartPreviewImage.src = hasImage ? reportData.chartImage : "";
}

function hydrateReportForm() {
  if (!reportFields.length) return;
  const reportData = loadReportData();
  reportFields.forEach((field) => setReportFieldValue(field, reportData));
  renderReportChartPreview(reportData);
  if (reportSaveStatus) reportSaveStatus.textContent = reportData.metadata.updatedAt ? `로컬 저장됨 · ${new Date(reportData.metadata.updatedAt).toLocaleTimeString("ko-KR")}` : "로컬 저장 대기 중";
  renderPreflightPanel();
}

reportFields.forEach((field) => field.addEventListener("input", scheduleReportSave));

reportChartInput?.addEventListener("change", () => {
  const file = reportChartInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const reportData = collectReportDataFromForm();
    reportData.chartImage = reader.result;
    saveReportData(reportData, "그래프 이미지 저장됨");
    renderReportChartPreview(reportData);
  });
  reader.readAsDataURL(file);
});

removeReportChartButton?.addEventListener("click", () => {
  const reportData = collectReportDataFromForm();
  reportData.chartImage = null;
  saveReportData(reportData, "그래프 이미지 삭제됨");
  renderReportChartPreview(reportData);
  if (reportChartInput) reportChartInput.value = "";
});

hydrateReportForm();
renderPreflightPanel();

const PRESENCE_HEARTBEAT_INTERVAL_MS = 180000;
const PRESENCE_STORAGE_PREFIX = "loreaxPresence:";

function getPresenceDeviceId() {
  try {
    const existingId = window.localStorage.getItem("loreaxPresenceDeviceId");
    if (existingId) return existingId;
    const newId = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem("loreaxPresenceDeviceId", newId);
    return newId;
  } catch {
    return `device-${Date.now()}`;
  }
}

function getRequiredInputProgress() {
  const fields = [
    promptProjectTitle,
    promptPlaceName,
    promptPlaceOne,
    promptPlaceTwo,
    promptCharacterRole,
    promptTone,
    promptHeygenResult,
  ].filter(Boolean);
  const completed = fields.filter((field) => String(field.value || "").trim()).length;
  return { completed, total: fields.length };
}

function getChecklistProgress() {
  const checkboxes = [...practiceAccordion.querySelectorAll("[data-progress-id]")];
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  return { completed, total: checkboxes.length };
}

function calculateStudentProgressPercent() {
  const input = getRequiredInputProgress();
  const checklist = getChecklistProgress();
  const inputRatio = input.total ? input.completed / input.total : 0;
  const checklistRatio = checklist.total ? checklist.completed / checklist.total : 0;
  return Math.round(((inputRatio + checklistRatio) / 2) * 100);
}

function getCurrentStudentStepLabel() {
  const openPanel = practiceAccordion.querySelector("details[open] summary strong");
  return openPanel?.textContent?.trim() || lessonData.classMetadata?.classTitle || "AI 실습 진행 중";
}

function buildPresencePayload() {
  const deviceId = getPresenceDeviceId();
  const checklist = getChecklistProgress();
  const input = getRequiredInputProgress();
  const reportData = loadReportData();
  const identity = getStudentIdentityFromReport(reportData);
  return {
    studentId: deviceId,
    studentName: identity.studentName || "학생 기기",
    studentNumber: identity.studentNumber,
    className: identity.className,
    lessonId: currentLessonId,
    lessonTitle: lessonData.classMetadata?.classTitle || currentLessonId,
    currentStep: getCurrentStudentStepLabel(),
    progress: calculateStudentProgressPercent(),
    checklistDone: checklist.completed,
    checklistTotal: checklist.total,
    requiredInputsDone: input.completed,
    requiredInputsTotal: input.total,
    pdfGenerated: Boolean(reportData.metadata.pdfGenerated),
    reportUpdatedAt: reportData.metadata.updatedAt || "",
    lastSeenAt: Date.now(),
  };
}

function sendPresenceHeartbeat() {
  const payload = buildPresencePayload();
  const endpoint = window.LOREAX_PRESENCE_ENDPOINT;

  try {
    window.localStorage.setItem(`${PRESENCE_STORAGE_PREFIX}${payload.studentId}`, JSON.stringify(payload));
  } catch {
    // Local mock presence can be unavailable in restricted browser contexts.
  }

  window.LoreAXSupabase?.syncPresence?.(payload);

  if (!endpoint) return;

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Presence is non-critical and must never interrupt the lesson page.
  }
}

window.LoreAXPresence = {
  heartbeat: sendPresenceHeartbeat,
  buildPayload: buildPresencePayload,
  intervalMs: PRESENCE_HEARTBEAT_INTERVAL_MS,
  onlineWindowMs: 360000,
};

sendPresenceHeartbeat();
window.setInterval(sendPresenceHeartbeat, PRESENCE_HEARTBEAT_INTERVAL_MS);
["click", "change", "input", "visibilitychange"].forEach((eventName) => {
  document.addEventListener(eventName, sendPresenceHeartbeat, { passive: true });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    window.LoreAXUsage?.trackCourseOpen?.(currentLessonId, { source: "ai_practice_page" });
    navigator.serviceWorker
      .register("../../sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((error) => console.warn("Service Worker registration failed:", error));
  });
}
}
