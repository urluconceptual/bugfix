import { Card, List } from "antd";
import { observer } from "mobx-react";
import { CodeOutlined, EyeOutlined, BugOutlined } from "@ant-design/icons";
import { projectStore } from "../../stores/projectsStore";
import { EXPLORE_LINK, NEON_GREEN_COLOUR } from "../../models/constants";
import { userStore } from "../../stores/userStore";
import { useEffect, useState } from "react";
import { FieldValue } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const enum Action {
  seeCode,
  seeProject,
  reportBug,
}

interface ProjectData {
  id: string;
  title: string;
  authorEmail: string;
  githubLink: string;
  description: string;
  timestamp: FieldValue;
}

const ProjectsList = observer(() => {
  const navigate = useNavigate();

  const handleAction = (action: Action, project: ProjectData) => {
    switch (action) {
      case Action.seeCode:
        window.open(project.githubLink);
        break;
      case Action.seeProject:
        navigate(`${EXPLORE_LINK}/${project.id}`)
        break;
      case Action.reportBug:
        break;
    }
  };
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (userStore.users)
      setDataSource(
        projectStore.currentViewProjects.map((item) => {
          return {
            id: item.id!,
            title: item.title,
            authorEmail: userStore.users[item.authorId]["email"],
            githubLink: item.githubLink,
            description: item.description,
            timestamp: item.timestamp,
          };
        })
      );
  }, [userStore.users, projectStore.currentViewProjects]);

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={dataSource}
      pagination={{
        pageSize: 3,
      }}
      renderItem={(item: ProjectData) => (
        <List.Item key={item.id} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Card
            style={{ padding: 0 }}
            title={
              <>
                <span style={{ fontSize: 20 }}>{item.title}</span>{" "}
                <span style={{ fontSize: 14 }}>by {item.authorEmail}</span>
              </>
            }
            actions={[
              <CodeOutlined
                onClick={() => handleAction(Action.seeCode, item)}
                style={{ color: NEON_GREEN_COLOUR }}
                key="seeCode"
              />,
              <EyeOutlined
                onClick={() => handleAction(Action.seeProject, item)}
                style={{ color: NEON_GREEN_COLOUR }}
                key="seeProject"
              />,
              <BugOutlined
                onClick={() => handleAction(Action.seeCode, item)}
                style={{ color: NEON_GREEN_COLOUR }}
                key="reportBug"
              />,
            ]}
          >
            {item.description}
          </Card>
        </List.Item>
      )}
      style={{ width: 1200 }}
    />
  );
});

export default ProjectsList;
