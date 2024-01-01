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
import { UserObj } from "./userStore";

export interface ProjectObj {
  id?: string;
  title: string | any;
  authorId: string | any;
  githubLink: string | any;
  description: string | any;
  timestamp: FieldValue | any;
}

export interface ProjectData extends ProjectObj {
  authorEmail: string;
}

class ProjectsStore {
  currentViewProjects: ProjectData[] = [];

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
    const projectRef = doc(db, "users", authorId);
    const userSnap = await getDoc(projectRef);
    const userData = userSnap.data() as UserObj;
    runInAction(
      () =>
        (this.currentViewProjects = res.docs.map((doc) => {
          const projectData = doc.data() as ProjectObj;
          return {
            id: doc.id,
            ...projectData,
            authorEmail: userData.email!
          };
        }))
    );
  };

  fetchById = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      const projectData = docSnap.data() as ProjectObj;
      const userRef = doc(db, "users", projectData.authorId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserObj;
      runInAction(() => {
        
        this.currentViewProjects = [
          {
            id: docSnap.id,
            ...projectData,
            authorEmail: userData.email!,
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
    const projectPromises = res.docs.map(async (docSnap) => {
      const projectData = docSnap.data() as ProjectObj;
      const userRef = doc(db, "users", projectData.authorId);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data() as UserObj;
      return {
        id: docSnap.id,
        ...projectData,
        authorEmail: userData.email!
      };
    });
  
    const projects = await Promise.all(projectPromises);
  
    runInAction(() => {
      this.currentViewProjects = projects;
    });
  };
}

export const projectStore = new ProjectsStore();
