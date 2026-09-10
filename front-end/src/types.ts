export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId?: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id?: number | string;
  username: string;
  role: 'professor' | 'aluno';
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author?: Pick<User, 'id' | 'username' | 'role'>;
  createdAt: string;
  updatedAt: string;
}
