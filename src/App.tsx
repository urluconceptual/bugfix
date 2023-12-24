import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Projects from "./pages/Projects";
import RootLayout from "./pages/Root/Root";
import ErrorPage from "./pages/Error";
import Profiles from "./pages/Profiles";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            colorBgLayout: "#0d0d0d",
            headerBg: "#242424",
            colorTextHeading: "#e3e7e0",
            colorIconHover: "#e3e7e0",
          },
          Menu: {
            colorBgContainer: "#242424",
            colorText: "#e3e7e0",
            horizontalItemHoverColor: "#d8fe51",
            horizontalItemSelectedColor: "#d8fe51",
          },
          Button: {
            colorBgContainer: "#0d0d0d",
          },
          Input: {
            colorBgContainer: "#0d0d0d",
            activeBorderColor: "#d8fe51",
            colorTextPlaceholder: "#8b8b8d",
          }
        },
        token: {
          fontFamily: "Sometype Mono",
          colorText: "#e3e7e0",
          colorPrimaryHover: "#d8fe51",
          colorError: "#af2821"
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
