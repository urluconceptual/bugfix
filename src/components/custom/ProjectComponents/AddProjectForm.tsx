import { Button, Form, Input, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import { ProjectObj, projectStore } from "../../../stores/projectsStore";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { userStore } from "../../../stores/userStore";

const AddProjectForm = observer(({ userId }: { userId: string | undefined }) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [newProjectFormIsOpen, setNewProjectFormIsOpen] =
    useState<boolean>(false);
    const isOwnProfile = userId === (userStore.currentUser? userStore.currentUser!.uid : "");

  const handleFinishForm = async (newProject: ProjectObj) => {
    setFormLoading(true);
    newProject.authorId = userId!;
    newProject.timestamp = serverTimestamp();
    await projectStore.addToDb(newProject);
    setFormLoading(false);
    setNewProjectFormIsOpen(false);
  };

  return (
    <>
      {isOwnProfile && (
        <Button
          onClick={(e) => setNewProjectFormIsOpen((prev) => !prev)}
          style={{ width: 200 }}
        >
          Add new project
        </Button>
      )}
      <Modal
        width="650px"
        title="Add New Project"
        open={newProjectFormIsOpen}
        onCancel={() => setNewProjectFormIsOpen(false)}
        footer={null}
      >
        <Spin tip="Adding project..." spinning={formLoading}>
          <Form
            name="addProjectForm"
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinishForm}
            autoComplete="off"
          >
            <Form.Item<ProjectObj>
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Please fill in the title of your project.",
                },
              ]}
            >
              <Input style={{ width: 400 }} placeholder="MyProject" />
            </Form.Item>
            <Form.Item<ProjectObj>
              name="githubLink"
              label="GitHub Link"
              rules={[
                {
                  required: true,
                  message: "Please fill in the link to the GitHub repository.",
                },
                {
                  pattern:
                    /^(https?:\/\/github\.com\/)[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/,
                  message: "Please enter a valid GitHub repository link.",
                },
              ]}
            >
              <Input
                style={{ width: 400 }}
                placeholder="https://github.com/johnsmith/myproject"
              />
            </Form.Item>
            <Form.Item<ProjectObj>
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please tell us a bit about your project.",
                },
              ]}
            >
              <TextArea
                rows={4}
                maxLength={200}
                style={{ width: 600 }}
                placeholder="MyProject is an app that..."
              />
            </Form.Item>
            <Form.Item>
              <Button style={{ width: 600 }} htmlType="submit">
                Done
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
});

export default AddProjectForm;
