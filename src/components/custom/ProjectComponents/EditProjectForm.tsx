import { Button, Form, Input, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import { ProjectData, ProjectObj, projectStore } from "../../../stores/projectsStore";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { EditOutlined } from "@ant-design/icons";
import { NEON_GREEN_COLOUR } from "../../../models/constants";

const EditProjectForm = observer(({ project }: { project: ProjectData }) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formIsOpen, setFormIsOpen] =
    useState<boolean>(false);

  const handleFinishForm = async (newProject: ProjectObj) => {
    setFormLoading(true);
    newProject.timestamp = serverTimestamp();
    await projectStore.editInDb({...project, ...newProject});
    setFormLoading(false);
    setFormIsOpen(false);
  };

  return (
    <>
      <EditOutlined
        onClick={() => setFormIsOpen(true)}
        style={{ color: NEON_GREEN_COLOUR }}
        key="reportBug"
      />
      <Modal
        width="650px"
        title="Edit Project"
        open={formIsOpen}
        onCancel={() => setFormIsOpen(false)}
        footer={null}
      >
        <Spin tip="Saving Project..." spinning={formLoading}>
          <Form
            name="editProjectForm"
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{...project}}
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

export default EditProjectForm;
