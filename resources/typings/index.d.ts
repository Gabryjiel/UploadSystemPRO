export type TSubject = {
  id: number;
  name: string;
  group: string;
  subgroup: number;
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