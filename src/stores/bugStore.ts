import {
  FieldValue,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { action, makeObservable, observable, runInAction } from "mobx";
import { db } from "..";
import { message } from "antd";
import { UserObj } from "./userStore";
import { ProjectObj } from "./projectsStore";

export enum BugStatus {
  Proposed = 1,
  Active = 2,
  Resolved = 3,
  Cancelled = 4,
}

export interface BugObj {
  id?: string;
  projectId?: string;
  proposedBy?: string | null;
  description: string;
  status?: BugStatus;
  stepsToReproduce: string[];
  timeProposed: FieldValue;
  lastUpdated?: FieldValue;
}

export interface BugData extends BugObj {
  proposedByEmail?: string;
  projectTitle?: string;
}

class BugsStore {
  currentViewBugs: BugData[] = [];

  constructor() {
    makeObservable(this, {
      addToDb: action,
      currentViewBugs: observable,
      fetchByProject: action,
      fetchByUser: action,
      fetchByProjects: action,
    });
  }

  addToDb = (newBug: BugObj) => {
    addDoc(collection(db, "bugs"), newBug)
      .then(() => {
        this.fetchByProject(newBug.projectId!).then(() => {
          message.success("Bug status successfully addeed!")
        })
      })
      .catch((err) => {
        console.log(err);
        message.error("An error occurred while adding the bug.");
      });
  };

  editInDb = (newBug: BugObj) => {
    const projectRef = doc(db, "bugs", newBug.id!);
    updateDoc(projectRef, { ...newBug })
      .then(() => {
        this.fetchByProject(newBug.projectId!).then(() =>
          message.success("Bug status successfully updated!")
        );
      })
      .catch((err) => {
        console.log(err);
        message.error("An error occurred while updating the bug status.");
      });
  };

  fetchByProject = async (projectId: string) => {
    const projectsRef = collection(db, "bugs");
    const q = query(
      projectsRef,
      where("projectId", "==", projectId ?? ""),
      orderBy("timeProposed", "desc")
    );
    const res = await getDocs(q);

    const bugPromises = res.docs.map(async (docSnap) => {
      const bugData = docSnap.data() as BugObj;
      if (bugData.proposedBy) {
        const userRef = doc(db, "users", bugData.proposedBy!);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data() as UserObj;
        return {
          id: docSnap.id,
          ...bugData,
          proposedByEmail: userData.email!,
        };
      } else {
        return {
          id: docSnap.id,
          ...bugData,
          proposedByEmail: "anonymous",
        };
      }
    });

    const bugs = await Promise.all(bugPromises);

    runInAction(() => {
      this.currentViewBugs = bugs;
    });
  };

  fetchByUser = async (userId: string) => {
    const projectsRef = collection(db, "bugs");
    const q = query(
      projectsRef,
      where("proposedBy", "==", userId ?? ""),
      orderBy("timeProposed", "desc")
    );
    const res = await getDocs(q);
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data() as UserObj;

    const bugPromises = res.docs.map(async (docSnap) => {
      const bugData = docSnap.data() as BugObj;
      const projectRef = doc(db, "projects", bugData.projectId!);
      const projectSnapshot = await getDoc(projectRef);
      const projectData = projectSnapshot.data() as ProjectObj;
      return {
        id: docSnap.id,
        ...bugData,
        proposedByEmail: userData.email!,
        projectTitle: projectData.title,
      };
    });

    const bugs = await Promise.all(bugPromises);

    runInAction(() => {
      this.currentViewBugs = bugs;
    });
  };

  fetchByProjects = async (projectIds: string[]) => {
    const projectsRef = collection(db, "bugs");
    const q = query(
      projectsRef,
      where("projectId", "in", projectIds),
      orderBy("timeProposed", "desc")
    );
    const res = await getDocs(q);

    return res.docs.length;
  };
}

export const bugsStore = new BugsStore();
