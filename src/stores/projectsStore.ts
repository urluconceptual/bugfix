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
import { makeObservable, observable, action } from "mobx";
import { db } from "..";
import { message } from "antd";
import { runInAction } from "mobx";

export enum BugStatus {
  Proposed,
  Active,
  Resolved,
}

export interface ProjectObj {
  id?: string;
  title: string | any;
  authorId: string | any;
  githubLink: string | any;
  description: string | any;
  timestamp: FieldValue | any;
}

export interface ProjectData {
  id?: string;
  title: string | any;
  authorId: string | any;
  githubLink: string | any;
  description: string | any;
  timestamp: FieldValue | any;
  authorEmail: string;
}

export interface BugObj {
  id?: string;
  projectId?: string;
  proposedBy?: string;
  description: string;
  status?: BugStatus;
  stepsToReproduce: string,
  timeProposed: FieldValue | any;
  timeResolved: FieldValue | any;
}

class ProjectsStore {
  currentViewProjects: ProjectObj[] = [];

  constructor() {
    makeObservable(this, {
      currentViewProjects: observable,
      addToDb: action,
      fetchByUser: action,
    });
  }

  addToDb = (newProject: ProjectObj) => {
    addDoc(collection(db, "projects"), newProject)
      .then(() => {
        this.fetchByUser(newProject.authorId).then(() =>
          message.success("Project successfully added!")
        );
      })
      .catch((err) => {
        console.log(err);
        message.error("An error occurred while adding the project.");
      });
  };

  editInDb = (newProject: ProjectObj) => {
    const projectRef = doc(db, "projects", newProject.id!);
    updateDoc(projectRef, { ...newProject })
      .then(() => {
        this.fetchByUser(newProject.authorId).then(() =>
          message.success("Project successfully updated!")
        );
      })
      .catch((err) => {
        console.log(err);
        message.error("An error occurred while updating the project.");
      });
  };

  fetchByUser = async (authorId: string) => {
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
      where("authorId", "==", authorId ?? ""),
      orderBy("timestamp", "desc")
    );
    const res = await getDocs(q);
    runInAction(
      () =>
        (this.currentViewProjects = res.docs.map((doc) => {
          const projectData = doc.data();
          return {
            id: doc.id,
            title: projectData.title,
            authorId: projectData.authorId,
            githubLink: projectData.githubLink,
            description: projectData.description,
            timestamp: projectData.timestamp,
          };
        }))
    );
  };

  fetchById = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      runInAction(() => {
        const projectData = docSnap.data();
        this.currentViewProjects = [
          {
            id: docSnap.id,
            title: projectData.title,
            authorId: projectData.authorId,
            githubLink: projectData.githubLink,
            description: projectData.description,
            timestamp: projectData.timestamp,
          },
        ];
      });
    } else {
      console.log("Project does not exist");
    }
  };

  fetchAll = async () => {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, orderBy("timestamp", "desc"));
    const res = await getDocs(q);
    runInAction(
      () =>
        (this.currentViewProjects = res.docs.map((doc) => {
          const projectData = doc.data();
          return {
            id: doc.id,
            title: projectData.title,
            authorId: projectData.authorId,
            githubLink: projectData.githubLink,
            description: projectData.description,
            timestamp: projectData.timestamp,
          };
        }))
    );
  };
}

export const projectStore = new ProjectsStore();
