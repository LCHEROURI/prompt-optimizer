
export interface OptimizedOutput {
  prompt: string;
  notes: string;
}

export type FileType = 'image' | 'document' | 'audio';

export type FilesState = {
  image: File | null;
  document: File | null;
  audio: File | null;
};
