import { observer } from "mobx-react";

import { useParams } from "react-router-dom";
import { projectStore } from "../stores/projectsStore";
import { useEffect, useState } from "react";
import { userStore } from "../stores/userStore";
import ProjectsList from "../components/reusable/ProjectsList";
import { Spin } from "antd";

const Project = observer(() => {
  const params = useParams();
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

  useEffect(() => {
    setProjectsLoading(true);
    Promise.all([
      projectStore.fetchById(params.projectId!),
      userStore.fetchAllUsers(),
    ]);
  }, []);

  useEffect(() => {
    if (userStore.users) {
      setProjectsLoading(false);
    }
  }, [userStore.users]);

  return (
    <>
      <Spin tip="Loading project..." spinning={projectsLoading}>
        <ProjectsList />
      </Spin>
    </>
  );
});

export default Project;
