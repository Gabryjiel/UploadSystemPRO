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

export type TAnswer = {

}
