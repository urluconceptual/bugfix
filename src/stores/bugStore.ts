import { FieldValue } from "firebase/firestore";
import { makeObservable } from "mobx";

export enum BugStatus {
  Proposed,
  Active,
  Resolved,
  Cancelled
}

export interface BugObj {
  id: string;
  projectId: string;
  proposedBy: string;
  description: string;
  status: BugStatus;
  stepsToReproduce: string;
  timeProposed: FieldValue | any;
  lastUpdated: FieldValue | any;
}

class BugsStore {
  constructor() {
    makeObservable(this);
  }
}

export const bugsStore = new BugsStore();
