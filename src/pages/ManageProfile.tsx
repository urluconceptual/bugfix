import { Spin, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { projectStore } from "../stores/projectsStore";
import { UserObj, userStore } from "../stores/userStore";
import { observer } from "mobx-react";
import ProjectsList from "../components/reusable/ProjectsList";
import { useParams } from "react-router-dom";
import AddProjectForm from "../components/custom/ProjectComponents/AddProjectForm";
import { bugsStore } from "../stores/bugStore";
import ProfileCard from "../components/reusable/ProfileCard";
import BugsTable from "../components/reusable/BugsTable";

const ManageProfile = observer(() => {
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

  const handlePrivacyChange = () => {
    userStore
      .changePrivacySettings(params.userId!, !userInView?.accountIsPrivate)
      .then(() =>
        setUserInView((prev) => ({
          ...prev,
          accountIsPrivate: !prev?.accountIsPrivate,
        }))
      );
  };

  const items: TabsProps["items"] = [
    {
      key: "projects",
      label: "Projects",
      children: (
        <>
          <AddProjectForm userId={params.userId} />
          <ProjectsList />
        </>
      ),
    },
    {
      key: "bugs",
      label: "Bugs caught",
      children: <BugsTable />,
    },
  ];

  return (
    <Spin tip="Loading page..." spinning={projectsLoading && bugsLoading}>
      <ProfileCard
        user={userInView}
        proposedBugs={proposedBugs}
        handlePrivacyChange={
          userStore.currentUser?.uid === userInView?.id
            ? handlePrivacyChange
            : undefined
        }
      />
      <Tabs defaultActiveKey="projects" items={items} />
    </Spin>
  );
});

export default ManageProfile;
