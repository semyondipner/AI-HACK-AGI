export interface ReportSource {
  id: number;
  title: string;
  url: string;
  description: string;
  available: boolean;
  authRequred: boolean;
  createdAt: Date;
}

export interface ReportTopic {
  id: number;
  title: string;
  code: string;
  createdAt: Date;
}

export interface ReportTemplate {
  id: number;
  title: string;
  topicId: number;
  createdAt: Date;
  parameters: any;
}

export interface Report {
  id: number;
  title: string;
  templateId: number;
  createdAt: Date;
  parameters: any;
  documents?: ReportDocument[];
}

export interface Email {
  id: number;
  full_name: string;
  email: string;
  job: string;
  topics: string;
  activity: boolean;
  updatedAt: Date;
}

export interface ReportDocument {
  id: number;
  reportId: number;
  name: string;
  content: string;
  createdAt: Date;
}
