import { Button, Form, Input, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import {
  ProjectData,
  ProjectObj,
  projectStore,
} from "../../../stores/projectsStore";
import { serverTimestamp } from "firebase/firestore";
import { EditOutlined } from "@ant-design/icons";
import { NEON_GREEN_COLOUR } from "../../../models/constants";
import ProjectForm from "../../reusable/ProjectForm";
import { FormSubmitType } from "../../../models/enums";
import { userStore } from "../../../stores/userStore";

const EditProjectForm = observer(({ project }: { project: ProjectData }) => {
  const handleFinishForm = async (newProject: ProjectObj) => {
    newProject.timestamp = serverTimestamp();
    await projectStore.editInDb({ ...project, ...newProject });
  };

  return (
    <>
      <span onClick={() => userStore.setOpenModal('editProjectForm')}>
        <EditOutlined style={{ color: NEON_GREEN_COLOUR }} key="reportBug" />{" "}
        Edit project
      </span>
      <ProjectForm
        name="editProjectForm"
        newProject={project}
        submitType={FormSubmitType.edit}
        submitAction={handleFinishForm}
      />
    </>
  );
});

export default EditProjectForm;
