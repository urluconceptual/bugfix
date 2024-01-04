import { List } from "antd";
import { observer } from "mobx-react";
import { ProjectData, projectStore } from "../../stores/projectsStore";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import Search from "antd/es/input/Search";

const ProjectsList = observer(() => {
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setDataSource(projectStore.currentViewProjects);
  }, [projectStore.currentViewProjects]);

  const filteredDataSource =
    searchValue === ""
      ? dataSource
      : dataSource.filter(
          (item) =>
            item.title.includes(searchValue) ||
            item.authorEmail.includes(searchValue) ||
            item.githubLink.includes(searchValue) ||
            item.description.includes(searchValue)
        );

  return (
    <div>
      {dataSource.length > 1 && (
        <>
          <Search
            placeholder="Search..."
            onSearch={(input) => setSearchValue(input)}
            style={{ width: 300, paddingTop: 20, paddingBottom: 20 }}
          />
          <div> {filteredDataSource.length} results</div>
        </>
      )}

      <List
        itemLayout="vertical"
        size="large"
        dataSource={filteredDataSource}
        pagination={
          dataSource.length > 1
            ? {
                pageSize: 4,
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
    </div>
  );
});

export default ProjectsList;
