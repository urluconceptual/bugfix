import { observer } from "mobx-react";
import ProjectsList from "../components/reusable/ProjectsList";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { projectStore } from "../stores/projectsStore";
import { userStore } from "../stores/userStore";

const Explore = observer(() => {
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

  useEffect(() => {
    setProjectsLoading(true);
    Promise.all([projectStore.fetchAll(), userStore.fetchAllUsers()]);
  }, []);

  useEffect(() => {
    if (userStore.users) {
      setProjectsLoading(false);
    }
  }, [userStore.users]);

  return (
    <Spin tip="Loading projects..." spinning={projectsLoading}>
      <ProjectsList />
    </Spin>
  );
});

export default Explore;
