import { Avatar, Spin } from "antd";
import { useEffect, useState } from "react";
import { projectStore } from "../stores/projectsStore";
import { UserObj, userStore } from "../stores/userStore";
import { observer } from "mobx-react";
import ProjectsList from "../components/reusable/ProjectsList";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import AddProjectForm from "../components/custom/ProjectComponents/AddProjectForm";
import { bugsStore } from "../stores/bugStore";

const Profile = observer(() => {
  const params = useParams();
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [bugsLoading, setBugsLoading] = useState<boolean>(false);
  const [userInView, setUserInView] = useState<UserObj | null>();
  const [proposedBugs, setProposedBugs] = useState<number>(0);

  useEffect(() => {
    setProjectsLoading(true);
    setBugsLoading(true);

    Promise.all([
      projectStore.fetchByUser(params.userId!),
      bugsStore.fetchByUser(params.userId!),
      userStore.fetchById(params.userId!).then((res) => setUserInView(res)),
    ]);
  }, []);

  useEffect(() => {
    const projectIds = projectStore.currentViewProjects.map((item) => item.id!);
    if (projectIds && projectIds.length > 0) {
      bugsStore.fetchByProjects(projectIds).then((res) => setProposedBugs(res));
    }
    setProjectsLoading(false);
  }, [projectStore.currentViewProjects]);

  useEffect(() => {
    setBugsLoading(false);
  }, [bugsStore.currentViewBugs]);

  return (
    <Spin tip="Loading page..." spinning={projectsLoading && bugsLoading}>
      <div style={{ paddingTop: 20 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: 10,
          }}
        >
          <Avatar size={100} icon={<UserOutlined />} />
          <div>{userInView?.email}</div>
          <div
            style={{ display: "flex", justifyContent: "center", columnGap: 30 }}
          >
            <span>Bugs caught by user: {proposedBugs}</span>
            <span>Projects: {projectStore.currentViewProjects.length}</span>
            <span>Bugs proposed to user: {bugsStore.currentViewBugs.length}</span>
          </div>
        </div>
        <AddProjectForm userId={params.userId} />

        <ProjectsList />
      </div>
    </Spin>
  );
});

export default Profile;
