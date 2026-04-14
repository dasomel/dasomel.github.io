export interface ExpertActivity {
  category: 'advisory' | 'review' | 'mentoring';
  title: string;
  org: string;
  year: number;
}

export interface Award {
  title: string;
  org: string;
  year: number;
  highlight?: boolean;
}

export interface ResearchReport {
  title: string;
  client: string;
  year: number;
  url?: string;
}

export interface NarrativeIntro {
  ko: string;
  en: string;
}

export const narrativeIntro: NarrativeIntro = {
  ko: '2013년 eGovFrame 커뮤니티에서 시작해, 클라우드 네이티브 인프라를 만들고 운영해왔습니다. K-PaaS의 핵심 컨트리뷰터로 참여하며, OPA와 OPDC 커뮤니티를 이끌고, 현재는 한국공학대학교에서 후배 엔지니어를 가르치고 있습니다.',
  en: 'Starting from the eGovFrame community in 2013, I have been building and operating cloud-native infrastructure. As a core contributor to K-PaaS, I lead the OPA and OPDC communities, and currently teach the next generation of engineers at Tech University of Korea.',
};

// TODO: 사용자가 실제 데이터로 교체해야 함
export const expertActivities: ExpertActivity[] = [
  { category: 'advisory', title: '클라우드 기술 자문위원', org: 'NIPA', year: 2023 },
];

export const awards: Award[] = [
  { title: '장관상', org: '과학기술정보통신부', year: 2024, highlight: true },
];

export const researchReports: ResearchReport[] = [
  { title: 'K-PaaS 기술 동향 보고서', client: 'NIA', year: 2024 },
];
