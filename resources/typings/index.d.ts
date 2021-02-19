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
  group: string;
  students: TUser[];
  subgroup: string;
  semester: string;
  description: string;
  code: string;
  teachers: TUser[];
  assignments: TAssignmentProps[];
}

export type TSubjectProps = {
  id: number;
  name: string;
  group: string;
  students: number;
  subgroup: string;
  semester: string;
  description: string;
  teachers: TUser[];
  feedbacks: number;
  answers?: number;
  assignments: number;
}

export type TAssignment = {
  id: number;
  name: string;
  description: string;
  deadline: string;
  files: TFile[];
  answers: TAnswer[];
  subject_id: number;
}

export type TAssignmentProps = {
  id: number;
  name: string;
  description: string;
  deadline: string;
  files: number;
  answers: number;
  subject_id: number;
  students: number;
  ends_in: string;
  not_graded: number;
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
  files: TFile[];
  timestamp: string;
  feedback: number | null;
}

export type TResponse = {
  message: string;
}

export type TFeedback = {
  answer_id: number;
  description: string;
  id: number;
  user_id: number;
}

export type TDetailedUser = {
  id: number;
  name: string;
  role: number;
  email: string;
  upgrade_requested: boolean;
}

export type TUserStats = {
  name: string;
  answers: number;
  assignments: number;
  feedback: number;
  files: number;
  subjects: number;
}

export type TAdminStats = {
  name: string;
  admins: number;
  answers: number;
  assignments: number;
  feedback: number;
  files: number;
  groups: number;
  semesters: number;
  students: number;
  subgroups: number;
  subjects: number;
  teachers: number;
  upgrade_requests: number;
}
