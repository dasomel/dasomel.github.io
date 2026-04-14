export interface CommunityActivity {
  role: string;
  org: string;
  period: string;
  desc: string;
  urls?: string[];
}

export interface Award {
  title: string;
  org: string;
  year: number;
  highlight?: boolean;
  url?: string;
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
  ko: '2013년 eGovFrame 커뮤니티에서 시작해, 클라우드 네이티브 인프라를 만들고 운영해왔습니다. K-PaaS Lite의 파운더로 참여하며, OPA와 OPDC 커뮤니티에 참여하고, 현재는 일과 병행하여 한국공학대학교에서 겸임교수로 수업하고 있습니다.',
  en: 'Starting from the eGovFrame community in 2013, I have been building and operating cloud-native infrastructure. As the founder of K-PaaS Lite, I participate in the OPA and OPDC communities, and currently teach as an adjunct professor at Tech University of Korea alongside my engineering work.',
};

export const communityActivities: CommunityActivity[] = [
  {
    role: 'Bro',
    org: 'CloudBro AI',
    period: '2025 — Present',
    desc: '최신 DevSecOps, FinOps, AI/ML/DataOps, SRE 등 클라우드 기술 현장 경험과 지식을 공유하고 복잡한 기술적 문제를 실시간으로 해결하는 전문가 커뮤니티',
  },
  {
    role: 'Leader',
    org: 'OPA (Open Platform Alliance)',
    period: '2022 — Present',
    desc: '민간 주도 개방형 클라우드 플랫폼 생태계 결집을 위한 개발자 커뮤니티',
    urls: [
      'https://www.etnews.com/20220831000283',
      'https://www.etnews.com/20220831000256',
    ],
  },
  {
    role: 'Committer',
    org: 'OPDC (Open Platform Developer Community)',
    period: '2015 — Present',
    desc: '오픈플랫폼 및 오픈소스 소프트웨어 개발자의 역량 강화와 상호 교류를 위한 법인 커뮤니티',
    urls: ['https://open.egovframe.org'],
  },
];

export interface ProfessionalActivity {
  title: string;
  role: string;
  org: string;
  year: number;
  url?: string;
  note?: string;
}

export const mentoringActivities: ProfessionalActivity[] = [
  { title: '전자정부 표준프레임워크 컨트리뷰션 멘토링', role: '멘토', org: 'NIA / eGovFrame', year: 2025 },
  { title: '제9회 K-PaaS 기반 활용 공모전 멘토링', role: '멘토', org: 'K-PaaS', year: 2025 },
  { title: '전자정부 표준프레임워크 컨트리뷰션 멘토링', role: '멘토', org: 'NIA / eGovFrame', year: 2024 },
  { title: '제8회 K-PaaS 기반 서비스 개발 아이디어 공모전 멘토링', role: '멘토', org: 'K-PaaS', year: 2024 },
  { title: 'K-PaaS 활용 디지털 사회혁신 서비스 개발 공모전 멘토링', role: '멘토', org: 'K-PaaS', year: 2023, note: '멘티 1팀 특별상 수상', url: 'https://k-paas.or.kr/notice/noticeView/1259?query=%EA%B3%B5%EB%AA%A8%EC%A0%84&query_type=all&query_type1=all&start=1' },
  { title: '전자정부 표준프레임워크 컨트리뷰션 멘토링', role: '멘토', org: 'NIA / eGovFrame', year: 2023, url: 'https://open.egovframe.org/oc/support/noticeItem.do?nttId=20350' },
  { title: '제6회 개방형 클라우드 플랫폼 기반 서비스 개발 아이디어 공모전 멘토링', role: '멘토', org: 'K-PaaS', year: 2022, note: '멘티 1팀 은상 수상', url: 'https://k-paas.or.kr/notice/noticeView/1102?query=%EA%B3%B5%EB%AA%A8%EC%A0%84&query_type=all&query_type1=all&start=1' },
  { title: '전자정부 표준프레임워크 컨트리뷰션 멘토링', role: '멘토', org: 'NIA / eGovFrame', year: 2022, url: 'https://open.egovframe.org/oc/support/noticeItem.do?nttId=20070' },
  { title: '전자정부 표준프레임워크 컨트리뷰션 멘토링', role: '멘토', org: 'NIA / eGovFrame', year: 2021, url: 'https://open.egovframe.org/oc/support/noticeItem.do?nttId=19995' },
];

export const expertActivities: ProfessionalActivity[] = [
  { title: '차세대 표준프레임워크 발전방안 수립을 위한 전문가 자문회의', role: '전문가 자문', org: 'NIA', year: 2026 },
  { title: '국산 SW 컨테이너 이미지 제작·유통 지원 프로젝트 자문', role: '자문위원', org: 'OPA', year: 2025 },
  { title: '클라우드 네이티브 특화 결과물 전문가 검토', role: '전문가 검토', org: '(주)브이티더블류', year: 2025 },
  { title: '공공부문 이용 SaaS 개발·검증(교육SaaS트랙) 과제조정위원회', role: '과제조정위원 (클라우드 전문가)', org: 'NIA', year: 2024 },
  { title: '전자정부 표준프레임워크 컨트리뷰션 평가', role: '평가위원', org: 'NIA / eGovFrame', year: 2023 },
  { title: '공공부문 이용 SaaS 개발·검증(교육SaaS트랙) 과제조정위원회', role: '평가위원 (클라우드 전문가)', org: 'NIA', year: 2023 },
  { title: '공공부문 이용 SaaS 개발·검증 과제 평가위원회', role: '평가위원', org: 'NIA', year: 2022 },
];

export const awards: Award[] = [
  { title: 'OPA Awards — 커뮤니티 히어로 부문', org: 'OPA', year: 2025, highlight: true, url: 'https://www.koit.co.kr/news/articleView.html?idxno=202085' },
  { title: 'OPA Awards — 우수기여자 부문', org: 'OPA', year: 2024, highlight: true, url: 'https://opakorea.org/bbs/board.php?bo_table=notice&wr_id=59' },
  { title: '전자정부 표준프레임워크 컨트리뷰션 감사장', org: 'NIA', year: 2023 },
  { title: '전자정부 표준프레임워크 컨트리뷰션 감사장', org: 'NIA', year: 2022 },
  { title: '행정안전부장관 표창장', org: '행정안전부', year: 2021, highlight: true, url: 'https://www.egovframe.go.kr/home/ntt/nttRead.do?menuNo=74&bbsId=6&nttId=1836' },
  { title: '학습조직 우수상 (Cloud Native DevOps)', org: '한화시스템', year: 2021 },
  { title: '전자정부 표준프레임워크 컨트리뷰션 감사장', org: 'NIA', year: 2021, url: 'https://www.egovframe.go.kr/home/ntt/nttRead.do?pagerOffset=10&searchKey=&searchValue=&menuNo=74&bbsId=6&nttId=1820' },
  { title: '표준프레임워크 오픈커뮤니티 공로상', org: 'OPDC', year: 2021 },
  { title: 'Open Tech Lounge Recognition (3위)', org: 'SK holdings C&C', year: 2018 },
  { title: '부문 Idea Festival (3등) — NateOn 챗봇', org: 'SK holdings C&C', year: 2018 },
  { title: '하반기 부문장 Recognition', org: 'SK holdings C&C', year: 2018 },
  { title: '슈퍼개발자K 시즌3 동상 — eGov OAuth', org: '표준프레임워크 오픈커뮤니티', year: 2014 },
];

export const researchReports: ResearchReport[] = [
  { title: '표준프레임워크에서의 AI 활용방안 보고서', client: 'NIA', year: 2024 },
  { title: '표준프레임워크 발전방향 보고서', client: 'NIA', year: 2021 },
  { title: 'Cloud를 위한 표준프레임워크 발전방향 연구보고서', client: 'NIA', year: 2021 },
  { title: '글로벌 개발환경 최신동향 연구보고서', client: 'NIA', year: 2018 },
  { title: '전자정부 표준프레임워크 발전방향 연구보고서', client: 'NIA', year: 2018 },
];
