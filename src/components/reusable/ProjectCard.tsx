import { Card } from "antd";
import { observer } from "mobx-react";
import {
  CodeOutlined,
  EyeOutlined,
  BugOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  EXPLORE_LINK,
  NEON_GREEN_COLOUR,
  PROFILE_LINK,
} from "../../models/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { ProjectData } from "../../stores/projectsStore";
import { userStore } from "../../stores/userStore";

const enum Action {
  seeCode,
  seeProject,
  reportBug,
  editProject,
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
      case Action.reportBug:
        break;
    }
  };

  const getAvailableActions = () => {
    let actions = [
      <CodeOutlined
        onClick={() => handleAction(Action.seeCode, project)}
        style={{ color: NEON_GREEN_COLOUR }}
        key="seeCode"
      />,
      <BugOutlined
        onClick={() => handleAction(Action.seeCode, project)}
        style={{ color: NEON_GREEN_COLOUR }}
        key="reportBug"
      />,
    ];

    if (location.pathname !== `${EXPLORE_LINK}/${project.id}`)
      actions = actions.concat([
        <EyeOutlined
          onClick={() => handleAction(Action.seeProject, project)}
          style={{ color: NEON_GREEN_COLOUR }}
          key="seeProject"
        />,
      ]);

    if (
      project.authorId ===
        (userStore.currentUser ? userStore.currentUser!.uid : "") &&
      location.pathname === `${PROFILE_LINK}/${project.authorId}`
    )
      actions = actions.concat([
        <EditOutlined
          onClick={() => handleAction(Action.editProject, project)}
          style={{ color: NEON_GREEN_COLOUR }}
          key="reportBug"
        />,
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
