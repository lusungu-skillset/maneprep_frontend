export type ManebFormValue = 1 | 2 | 3 | 4;

export type QuestionDifficultyValue = 'easy' | 'medium' | 'hard';


export interface CreateSubjectInput {
  name: string;
  form: ManebFormValue;
}

export interface UpdateSubjectInput {
  name?: string;
  form?: ManebFormValue;
}

export interface CreateTopicInput {
  name: string;
  subjectId: number;
}

export interface UpdateTopicInput {
  name?: string;
  subjectId?: number;
}

export interface CreateQuestionInput {
  topicId: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty?: QuestionDifficultyValue;
  year?: number | null;
}

export interface UpdateQuestionInput {
  topicId?: number;
  question?: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: QuestionDifficultyValue;
  year?: number | null;
}
