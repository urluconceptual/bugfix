import {
  FieldValue,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
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
  id: string;
  projectId: string;
  proposedBy: string;
  description: string;
  status: BugStatus;
}

export interface Step {
  id: string;
  bugId: string;
  index: number;
  action: string;
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

  fetchAll = async () => {
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
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
}

export const projectStore = new ProjectsStore();
