export interface User {
  id: number;
  email: string;
  roles?: string[];
  username?: string;
  fullName?: string;
  imageUrl?: string;
}
