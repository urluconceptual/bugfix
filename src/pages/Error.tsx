import { Button, Result } from "antd";
import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/private-profile":
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Result
            status="warning"
            title="This profile is private."
            extra={
              <Button>
                <Link to="/welcome">Back Home</Link>
              </Button>
            }
          />
        </div>
      );
    default:
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
  }
};

export default ErrorPage;
