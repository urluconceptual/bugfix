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
import { BLACK_COLOUR, DARK_GREY_COLOUR, EXPLORE_LINK, LIGHT_GREY_COLOUR, MY_PROFILE_LINK, NEON_GREEN_COLOUR, RED_COLOUR, TRANSPARENT_GREY_COLOUR, WELCOME_LINK } from "./models/constants";

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            colorBgLayout: BLACK_COLOUR,
            headerBg: DARK_GREY_COLOUR,
            colorTextHeading: LIGHT_GREY_COLOUR
          },
          Menu: {
            colorBgContainer: DARK_GREY_COLOUR,
            colorText: LIGHT_GREY_COLOUR,
            horizontalItemHoverColor: NEON_GREEN_COLOUR,
            horizontalItemSelectedColor: NEON_GREEN_COLOUR,
          },
          Button: {
            colorBgContainer: BLACK_COLOUR,
          },
          Input: {
            colorBgContainer: BLACK_COLOUR,
            activeBorderColor: NEON_GREEN_COLOUR,
            colorTextPlaceholder: TRANSPARENT_GREY_COLOUR,
          },
          Card: {
            colorBgContainer: BLACK_COLOUR,
          },
          Pagination: {
            colorBgContainer: BLACK_COLOUR,
            colorPrimary: LIGHT_GREY_COLOUR
          }
        },
        token: {
          fontFamily: "Sometype Mono",
          colorText: LIGHT_GREY_COLOUR,
          colorTextDescription: LIGHT_GREY_COLOUR,
          colorPrimaryHover: NEON_GREEN_COLOUR,
          colorError: RED_COLOUR
        }
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to={WELCOME_LINK} replace />} />
            <Route path={WELCOME_LINK} element={<Welcome />} />
            <Route path={EXPLORE_LINK} element={<Projects />} />
            <Route path={MY_PROFILE_LINK} element={<Profiles />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
