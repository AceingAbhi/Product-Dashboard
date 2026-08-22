import { ConfigProvider, App as AntApp, theme } from "antd";
import App from "./App";
import { useThemeMode } from "./contexts/ThemeModeContext";

export default function AppProviders() {
  const { mode } = useThemeMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2b2118",
          colorLink: "#8b6b3d",
          colorBgLayout: mode === "dark" ? "#1c1712" : "#f5f1e8",
          borderRadius: 12,
          fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
        },
        components: {
          Button: { borderRadius: 999, controlHeight: 40 },
          Modal: { borderRadiusLG: 16 },
        },
      }}
    >
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  );
}
