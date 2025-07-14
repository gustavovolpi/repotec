export interface MailError {
  code?: string;
  message: string;
  response?: string;
  responseCode?: number;
  command?: string;
} 