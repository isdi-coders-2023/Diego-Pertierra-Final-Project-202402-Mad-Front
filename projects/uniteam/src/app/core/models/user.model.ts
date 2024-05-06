export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'guest';
  avatar: string;
  location: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'unspecified';
  bio: string;
  events?: Event[];
  friends?: User[];
  comments?: Comment[];
};

export type UserLoginDto = {
  username?: string;
  email?: string;
  password: string;
};

export type UserRegisterDto = {
  username: string;
  email: string;
  password: string;
  avatar: File;
  birthDateString: string;
};
