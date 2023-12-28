import { Avatar, Button, Form, Input, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { ProjectObj, projectStore } from "../stores/projectsStore";
import TextArea from "antd/es/input/TextArea";
import { userStore } from "../stores/userStore";
import { observer } from "mobx-react";
import { serverTimestamp } from "firebase/firestore";
import ProjectsList from "../components/reusable/ProjectsList";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { User } from "firebase/auth";

const Profile = observer(() => {
  const params = useParams();
  const [newProjectFormIsOpen, setNewProjectFormIsOpen] =
    useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [userInView, setUserInView] = useState<User>();

  useEffect(() => {
    setProjectsLoading(true);
    Promise.all([
      projectStore.fetchByUser(params.userId!),
      userStore.fetchAllUsers(),
    ]);
  }, []);

  useEffect(() => {
    if (userStore.users) {
      setUserInView(userStore.users[params.userId!]);
      setProjectsLoading(false);
    }
  }, [userStore.users]);

  const handleFinishForm = async (newProject: ProjectObj) => {
    setFormLoading(true);
    newProject.authorId = params.userId!;
    newProject.timestamp = serverTimestamp();
    await projectStore.addToDb(newProject);
    setFormLoading(false);
    setNewProjectFormIsOpen(false);
  };

  const renderForm = () => {
    return (
      <Spin tip="Adding project..." spinning={formLoading}>
        <Form
          name="addProjectForm"
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
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
    );
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: 10 }}>
        <Avatar size={100} icon={<UserOutlined />} />
        <div>{userInView?.email}</div>
        <div style={{ display: "flex", justifyContent: "center", columnGap: 10 }}>
          <span>Projects: {projectStore.currentViewProjects.length}</span>
          <span>Bugs: 0</span>
        </div>
      </div>
      {params.userId === userStore.currentUser!.uid && <Button
        onClick={(e) => setNewProjectFormIsOpen((prev) => !prev)}
        style={{ width: 200 }}
      >
        Add new project
      </Button>}
      <Modal
        width="650px"
        title="Add New Project"
        open={newProjectFormIsOpen}
        onCancel={() => setNewProjectFormIsOpen(false)}
        footer={null}
      >
        <Spin tip="Adding project..." spinning={formLoading}>
          {renderForm()}
        </Spin>
      </Modal>
      <Spin tip="Loading projects..." spinning={projectsLoading}>
        <ProjectsList />
      </Spin>
    </div>
  );
});

export default Profile;
