export interface User {
  name: string;
  dob: string;
  currentlyPursuing: string;
  interests: string[];
  email: string;
  phone: string;
  userId: string;
}

export interface AdvancedSearchParams {
  paperId: string;
  paperName: string;
  paperAuthor: string;
  paperTopic: string;
  paperYear: string;
  publicationType: 'journal' | 'conference';
  field: string;
  keywords: string[];
}

export interface TaggedFolder {
  id: string;
  name: string;
  searches: string[];
}