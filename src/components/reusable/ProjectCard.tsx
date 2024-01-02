import { Card } from "antd";
import { observer } from "mobx-react";
import {
  CodeOutlined,
  EyeOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  EXPLORE_LINK,
  NEON_GREEN_COLOUR,
  PROFILE_LINK,
} from "../../models/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { ProjectData, projectStore } from "../../stores/projectsStore";
import { userStore } from "../../stores/userStore";
import EditProjectForm from "../custom/ProjectComponents/EditProjectForm";
import AddBugForm from "../custom/BugComponents/AddBugForm";

const enum Action {
  seeCode,
  seeProject,
  seeAuthor,
  deleteProject
}

const ProjectCard = observer(({ project }: { project: ProjectData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = (action: Action, project: ProjectData) => {
    switch (action) {
      case Action.seeCode:
        window.open(project.githubLink);
        break;
      case Action.seeProject:
        navigate(`${EXPLORE_LINK}/${project.id}`);
        break;
      case Action.seeAuthor:
        navigate(`${PROFILE_LINK}/${project.authorId}`);
        break;
      case Action.deleteProject:
        projectStore.deleteFromDb(project);
        break;
    }
  };

  const getAvailableActions = () => {
    let actions = [
      <span onClick={() => handleAction(Action.seeCode, project)}>
        <CodeOutlined style={{ color: NEON_GREEN_COLOUR }} key="seeCode" /> See
        repository
      </span>,
      <AddBugForm project={project} />,
    ];

    if (location.pathname === `${EXPLORE_LINK}`)
      actions = actions.concat([
        <span onClick={() => handleAction(Action.seeAuthor, project)}>
          <UserOutlined style={{ color: NEON_GREEN_COLOUR }} key="seeAuthor" />{" "}
          Author profile
        </span>,
      ]);

    if (location.pathname !== `${EXPLORE_LINK}/${project.id}`)
      actions = actions.concat([
        <span onClick={() => handleAction(Action.seeProject, project)}>
          <EyeOutlined style={{ color: NEON_GREEN_COLOUR }} key="seeProject" />{" "}
          See project
        </span>,
      ]);

    if (
      project.authorId ===
        (userStore.currentUser ? userStore.currentUser!.uid : "") &&
      location.pathname === `${PROFILE_LINK}/${project.authorId}`
    )
      actions = actions.concat([
        <EditProjectForm project={project} />,
        <span onClick={() => handleAction(Action.deleteProject, project)}>
          <DeleteOutlined
            style={{ color: NEON_GREEN_COLOUR }}
            key="deleteProject"
          />{" "}
          Delete project
        </span>,
      ]);
    return actions;
  };

  return (
    <Card
      style={{ padding: 0 }}
      title={
        <>
          <span style={{ fontSize: 20 }}>{project.title}</span>{" "}
          <span style={{ fontSize: 14 }}>by {project.authorEmail}</span>
        </>
      }
      actions={getAvailableActions()}
    >
      {project.description}
    </Card>
  );
});

export default ProjectCard;
