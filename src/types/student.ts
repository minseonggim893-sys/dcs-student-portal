export interface Evaluation {
  theory: number | null;
  practice: number | null;
  totalScore: number | null;
  achievement: string;
  achieveLevel: string;
  certStatus: string;
  dept: string;
  feedback: string;
  createdTime: string;
}

export interface GrowthRecord {
  date: string;
  content: string;
  observeArea: string;
  dept: string;
}

export interface Project {
  group: string;
  role: string;
  task: string;
  status: string;
  dept: string;
}

export interface Counsel {
  title: string;
  type: string;
  content: string;
  followUp: string;
  date: string;
}

export interface StudentData {
  nickname: string;
  dept: string;
  grade: number | null;
  classNo: number | null;
  number: number | null;
  careerType: string;
  careerHope: string;
  achievement: string;
  achieveLevel: string;
  totalScore: number | null;
  certStatus: string;
  certName: string;
  needCounsel: boolean;
  observeAreas: string[];
  evaluations: Evaluation[];
  records: GrowthRecord[];
  projects: Project[];
  counsels: Counsel[];
}
