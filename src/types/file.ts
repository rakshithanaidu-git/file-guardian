export type IntegrityStatus = 'verified' | 'modified' | 'pending' | 'checking';

export interface TrackedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  originalHash: string;
  currentHash: string;
  status: IntegrityStatus;
  addedAt: Date;
  lastChecked: Date | null;
  file: File;
}
