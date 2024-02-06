import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { projectStore } from "../stores/projectsStore";
import { useEffect, useState } from "react";
import ProjectsList from "../components/reusable/ProjectsList";
import { Spin } from "antd";
import { bugsStore } from "../stores/bugStore";
import BugsTable from "../components/reusable/BugsTable";

const Project = observer(() => {
  const params = useParams();
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [bugsLoading, setBugsLoading] = useState<boolean>(false);

  useEffect(() => {
    setProjectsLoading(true);
    Promise.all([
      projectStore.fetchById(params.projectId!),
      bugsStore.fetchByProject(params.projectId!),
    ]);
  }, []);

  useEffect(() => {
    setProjectsLoading(false);
  }, [projectStore.currentViewProjects]);

  useEffect(() => {
    setBugsLoading(false);
  }, [bugsStore.currentViewBugs]);

  return (
    <Spin tip="Loading page..." spinning={projectsLoading && bugsLoading}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 10,
        }}
      >
        <ProjectsList />
        <BugsTable />
      </div>
    </Spin>
  );
});

export default Project;
