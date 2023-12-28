import { List } from "antd";
import { observer } from "mobx-react";
import { ProjectData, projectStore } from "../../stores/projectsStore";
import { userStore } from "../../stores/userStore";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

const ProjectsList = observer(() => {
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (userStore.users)
      setDataSource(
        projectStore.currentViewProjects.map((item) => {
          return {
            ...item,
            authorEmail: userStore.users[item.authorId]["email"],
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
          <ProjectCard project={item} />
        </List.Item>
      )}
      style={{ width: 1200 }}
    />
  );
});

export default ProjectsList;
