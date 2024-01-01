import { List } from "antd";
import { observer } from "mobx-react";
import { ProjectData, projectStore } from "../../stores/projectsStore";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

const ProjectsList = observer(() => {
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  useEffect(() => {
    setDataSource(projectStore.currentViewProjects);
  }, [projectStore.currentViewProjects]);

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={dataSource}
      pagination={
        dataSource.length > 1
          ? {
              pageSize: 3,
            }
          : false
      }
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
