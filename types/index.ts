export interface Supervisor {
  id: string;
  name: string;
  specialization: string;
  created_at: string;
}

export interface Assistant {
  id: string;
  name: string;
  supervisor_id: string;
  created_at: string;
  supervisor?: {
    name: string;
  };
}

export interface Submission {
  id: string;
  student_name: string;
  matric_number: string;
  supervisor_id: string;
  assistant_id: string;
  created_at: string;
  supervisor?: {
    name: string;
  };
  assistant?: {
    name: string;
  };
}

export interface SystemSettings {
  id: string;
  portal_open: boolean;
}
