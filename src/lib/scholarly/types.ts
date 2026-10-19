export interface Author {
  id?: string;
  name: string;
  institution?: string;
  orcid?: string;
}

export interface Topic {
  id?: string;
  name: string;
  field?: string;
  domain?: string;
  score?: number;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  publicationYear: number;
  publicationDate?: string;
  authors: Author[];
  doi?: string;
  landingPageUrl?: string;
  isOpenAccess: boolean;
  openAccessUrl?: string;
  primaryTopic?: Topic;
  topics?: Topic[];
  concepts: string[];
  citationCount: number;
  venue?: string;
  source: "openalex" | "arxiv" | "crossref";
  bibtex?: string;
}

export interface SearchFilters {
  yearMin?: number;
  yearMax?: number;
  openAccessOnly?: boolean;
  topic?: string;
  sortBy?: "relevance" | "cited" | "year_desc" | "year_asc";
  page?: number;
  perPage?: number;
}

export interface SearchResult {
  papers: Paper[];
  totalCount: number;
  page: number;
  perPage: number;
  query: string;
  provider: string;
}

export interface AuthorProfile {
  id: string;
  name: string;
  affiliation?: string;
  worksCount: number;
  citationCount: number;
  hIndex?: number;
  orcid?: string;
  topWorks: Paper[];
}

export interface TopicSummary {
  id: string;
  name: string;
  field: string;
  domain: string;
  worksCount: number;
  description: string;
}
