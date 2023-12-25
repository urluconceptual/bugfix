import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button>
            <Link to="/welcome">Back Home</Link>
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
