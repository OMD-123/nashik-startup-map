export interface Company {
  id: string;
  name: string;
  type: "startup" | "company";
  sector: string;
  stage: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  website: string;
  hiring: boolean;
  size: string;
  roles: string[];
  founded: number;
}

export interface Meta {
  sectors: string[];
  stages: string[];
  types: string[];
  areas: string[];
}

export interface Stats {
  total: number;
  hiring: number;
  sectors: number;
  areas: number;
  jobs?: number;
  bySector: Record<string, number>;
  byArea: Record<string, number>;
}

export interface FilterState {
  type: string;
  sector: string;
  stage: string;
  area: string;
  hiring: boolean;
  q: string;
  view: "map" | "list" | "grid";
}

export const DEFAULT_FILTERS: FilterState = {
  type: "",
  sector: "",
  stage: "",
  area: "",
  hiring: false,
  q: "",
  view: "map",
};

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyWebsite: string;
  companyType: "startup" | "company";
  sector: string;
  stage: string;
  area: string;
  isIntern: boolean;
  isFresher: boolean;
  remote: boolean;
  postedDaysAgo: number;
  salaryLpa: { min: number; max: number; period: string };
}

export interface JobFilters {
  q: string;
  sector: string;
  area: string;
  type: string;
  fresher: boolean;
  intern: boolean;
  remote: boolean;
}