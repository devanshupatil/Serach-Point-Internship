export interface Item {
  id: string;
  name: string;
  deleted: boolean;
  deletedAt?: number;
}

export type View = 'items' | 'trash' | 'settings' | 'help' | 'message';

export interface Feedback {
  type: 'bug' | 'feature';
  text: string;
  email?: string;
}
