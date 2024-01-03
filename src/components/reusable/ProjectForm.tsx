import { Button, Form, Input, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { ProjectData, ProjectObj } from "../../stores/projectsStore";
import { FormSubmitType } from "../../models/enums";
import { PROJECT_FORM_LABELS } from "../../models/constants";
import { userStore } from "../../stores/userStore";

const ProjectForm = observer(
  ({
    name,
    newProject,
    submitType,
    submitAction,
  }: {
    name: string;
    newProject: ProjectData | null;
    submitType: FormSubmitType;
    submitAction: (newProject: ProjectObj) => Promise<void>;
  }) => {
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const formHandler = (newObject: ProjectObj) => {
      setFormLoading(true);
      setFormLoading(false);
      submitAction(newObject);
      userStore.setOpenModal(null);
      form.resetFields();
    };

    return (
      <>
        <Modal
          width="650px"
          title={PROJECT_FORM_LABELS[submitType]["PROJECT_TITLE"]}
          open={userStore.openModal === name}
          onCancel={() => userStore.setOpenModal(null)}
          footer={null}
        >
          <Spin tip={PROJECT_FORM_LABELS[submitType]["LOADING"]} spinning={formLoading}>
            <Form
              form={form}
              name={name}
              layout="horizontal"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ ...newProject }}
              onFinish={formHandler}
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
                    message:
                      "Please fill in the link to the GitHub repository.",
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
  }
);

export default ProjectForm;
