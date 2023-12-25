import { makeObservable, observable } from "mobx";

export enum BugStatus {
  Proposed,
  Active,
  Resolved
}

export interface ProjectObj {
  id: string;
  title: string;
  author: string;
  githubLink: string;
  description: string;
  bugs: BugObj[];
}

export interface BugObj {
  id: string;
  proposedBy: string;
  description: string;
  stepsToReproduce: Step[];
  status: BugStatus;
}

export interface Step {
  id: string;
  index: number;
  action: string;
}

class ProjectsStore {
  projects: ProjectObj[] = [];

  constructor() {
    makeObservable(this, {
      projects: observable,
    });
  }
}

export const projectStore = new ProjectsStore();
