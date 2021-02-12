export type TRole = 'admin' | 'teacher' | 'student'

export type TGroup = {
  id: number;
  name: string;
}

export type TSubgroup = {
  id: number;
  name: string;
}

export type TSemester = {
  id: number;
  name: string;
}

export type TSubject = {
  id: number;
  name: string;
  group: TGroup;
  students: number;
  subgroup: TSubgroup;
  semester: TSemester;
  description: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export type TAssignment = {
  id: number;
  name: string;
  description: string;
  deadline: string;
}

export type TSubjectRequest = TSubject & {
  assignments: TAssignment[];
}

export type TUniClassProps = {
  semesters: TSemester[];
  groups: TGroup[];
  subgroups: TSubgroup[];
}

export type TUser = {
  id: number;
  name: string;
  role: number;
}

export type TFile = {
  id: number;
  name: string;
  size: number;
  user: TUser;
}

export type TAnswer = {
  id: number;
  description: string;
  user: TUser;
  files: TFile;
}

export type TResponse = {
  message: string;
}
