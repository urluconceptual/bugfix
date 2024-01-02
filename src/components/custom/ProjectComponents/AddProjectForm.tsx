import { Button, Form, Input, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import { ProjectObj, projectStore } from "../../../stores/projectsStore";
import { serverTimestamp } from "firebase/firestore";
import { userStore } from "../../../stores/userStore";
import ProjectForm from "../../reusable/ProjectForm";
import { FormSubmitType } from "../../../models/enums";

const AddProjectForm = observer(
  ({ userId }: { userId: string | undefined }) => {
    const isOwnProfile =
      userId === (userStore.currentUser ? userStore.currentUser!.uid : "");

    const handleFinishForm = async (newProject: ProjectObj) => {
      newProject.authorId = userId!;
      newProject.timestamp = serverTimestamp();
      await projectStore.addToDb(newProject);
    };

    return (
      <>
        {isOwnProfile && (
          <Button
            onClick={() => userStore.setOpenModal('addProjectForm')}
            style={{ width: 200 }}
          >
            Add new project
          </Button>
        )}
        <ProjectForm name='addProjectForm' newProject={null} submitType={FormSubmitType.add} submitAction={handleFinishForm}/>
      </>
    );
  }
);

export default AddProjectForm;
