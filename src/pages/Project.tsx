import { observer } from "mobx-react";
import ProjectsList from "../components/reusable/ProjectsList";

const Project = observer(() => {
  return <ProjectsList />;
});

export default Project;
