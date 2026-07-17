// LoreAX Class course registration template
// Copy this object into data-courses.js and replace each placeholder.
// Keep existing studentUrl, reportUrl, and localStorage keys stable after a course is published.

export const COURSE_TEMPLATE = {
  // Unique lowercase English id. Prefer kebab-case or a stable camelCase already used by a route.
  id: "sample-course",

  // Official course title shown on catalog cards and search results.
  title: "정식 수업명",

  // Short mobile/card title.
  shortTitle: "짧은 수업명",

  // One or two sentence summary for students.
  description: "수업 소개를 1~2문장으로 작성합니다.",

  // One of: AI 기초, 보고서·탐구, 이미지, 영상, 데이터, 진로, 홍보·마케팅, 기타
  category: "기타",

  // Search keywords. Include topic, tool, output, and audience words.
  tags: ["키워드", "키워드"],

  // Tools used in class.
  tools: ["ChatGPT"],

  // Numeric lesson count.
  lessons: 4,

  // Display duration. Keep existing value if the course is already published.
  duration: "4차시",

  // Suggested values: 실습형, 프로젝트형, 이론·실습
  type: "실습형",

  // Official final output name.
  resultType: "최종 결과물",

  // Thumbnail path. Recommended: 1200 x 750px, 16:10, WebP, no text inside image.
  thumbnail: "assets/courses/sample-course.webp",

  // Student-facing course path. Use empty string while the page is not ready.
  studentUrl: "/sessions/sample-course/",

  // Report/result path. Use empty string when there is no report page.
  reportUrl: "",

  // Whether this course appears in the Hero slider and featured area.
  featured: false,

  // Only one active course should normally have isToday: true.
  isToday: false,

  // YYYY-MM-DD
  createdAt: "YYYY-MM-DD",

  // Numeric catalog order. Lower number appears earlier.
  sortOrder: 999,

  // Audience labels.
  target: ["중학생", "고등학생"],

  // active: public catalog, draft: hidden from public, hidden: hidden from public
  status: "draft",
};
