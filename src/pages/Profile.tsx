import { Avatar, Spin } from "antd";
import { useEffect, useState } from "react";
import { projectStore } from "../stores/projectsStore";
import { userStore } from "../stores/userStore";
import { observer } from "mobx-react";
import ProjectsList from "../components/reusable/ProjectsList";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { User } from "firebase/auth";
import AddProjectForm from "../components/AddProjectForm";

const Profile = observer(() => {
  const params = useParams();
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [userInView, setUserInView] = useState<User>();

  useEffect(() => {
    setProjectsLoading(true);
    Promise.all([
      projectStore.fetchByUser(params.userId!),
      userStore.fetchAllUsers(),
    ]);
  }, []);

  useEffect(() => {
    if (userStore.users) {
      setUserInView(userStore.users[params.userId!]);
      setProjectsLoading(false);
    }
  }, [userStore.users]);


  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: 10 }}>
        <Avatar size={100} icon={<UserOutlined />} />
        <div>{userInView?.email}</div>
        <div style={{ display: "flex", justifyContent: "center", columnGap: 10 }}>
          <span>Projects: {projectStore.currentViewProjects.length}</span>
          <span>Bugs: 0</span>
        </div>
      </div>
      <AddProjectForm userId={params.userId}/>
      <Spin tip="Loading projects..." spinning={projectsLoading}>
        <ProjectsList />
      </Spin>
    </div>
  );
});

export default Profile;
