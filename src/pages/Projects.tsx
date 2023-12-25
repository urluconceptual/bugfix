import { Card, List } from "antd";
import { observer } from "mobx-react";
import { ProjectObj } from "../stores/projectsStore";
import { CodeOutlined, EyeOutlined, BugOutlined } from "@ant-design/icons";
import { NEON_GREEN_COLOUR } from "../models/constants";

const data: ProjectObj[] = [
  {
    id: "1",
    title: "My Project",
    author: "John Doe",
    githubLink: "https://github.com/johndoe/myproject",
    description: "This is a sample project.",
    bugs: [],
  },
  {
    id: "2",
    title: "Another Project",
    author: "Jane Doe",
    githubLink: "https://github.com/janedoe/anotherproject",
    description: "This is another sample project.",
    bugs: [],
  },
  {
    id: "3",
    title: "Yet Another Project",
    author: "John Smith",
    githubLink: "https://github.com/johnsmith/yetanotherproject",
    description: "This is yet another sample project.",
    bugs: [],
  },
  {
    id: "4",
    title: "One More Project",
    author: "Jane Smith",
    githubLink: "https://github.com/janesmith/onemoreproject",
    description: "This is one more sample project.",
    bugs: [],
  },
  {
    id: "5",
    title: "Final Project",
    author: "John Doe",
    githubLink: "https://github.com/johndoe/finalproject",
    description: "This is the final sample project.",
    bugs: [],
  },
];

const enum Action {
    seeCode,
    seeProject,
    reportBug
}

const Projects = observer(() => {
    const handleAction = (action : Action, project: ProjectObj) => {
        switch(action) {
            case Action.seeCode:
                window.open(project.githubLink);
                break;
            case Action.seeProject:
            case Action.reportBug:
                break;
        }
    }

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        pageSize: 3,
      }}
      dataSource={data}
      renderItem={(item: ProjectObj) => (
        <List.Item key={item.id} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Card
            style={{ padding: 0 }}
            title={
              <>
                <span style={{ fontSize: 20 }}>{item.title}</span>{" "}
                <span style={{ fontSize: 14 }}>by {item.author}</span>
              </>
            }
            actions={[
                <CodeOutlined onClick={() => handleAction(Action.seeCode, item)} style={{color: NEON_GREEN_COLOUR}} key="seeCode" />,
                <EyeOutlined onClick={() => handleAction(Action.seeCode, item)} style={{color: NEON_GREEN_COLOUR}} key="seeProject" />,
                <BugOutlined onClick={() => handleAction(Action.seeCode, item)} style={{color: NEON_GREEN_COLOUR}} key="reportBug" />
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

export default Projects;
