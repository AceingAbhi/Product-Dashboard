import { Layout, Typography, Button, Tooltip } from "antd";
import { AppstoreOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useThemeMode } from "../contexts/ThemeModeContext";
import "../styles/product-cards.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { mode, toggle } = useThemeMode();

  return (
    <Layout className="app-background" style={{ minHeight: "100vh", background: "transparent" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#2b2118",
          paddingInline: 16,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#f5f1e8",
            textDecoration: "none",
          }}
        >
          <AppstoreOutlined style={{ fontSize: 22 }} />
          <Title level={4} style={{ color: "#f5f1e8", margin: 0, fontFamily: "var(--font-display)" }}>
            Product Dashboard
          </Title>
        </Link>
        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          <Button
            shape="circle"
            icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggle}
            aria-label="Toggle color theme"
            style={{ background: "transparent", borderColor: "rgba(245,241,232,0.4)", color: "#f5f1e8" }}
          />
        </Tooltip>
      </Header>
      <Content style={{ padding: "24px 16px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        {children}
      </Content>
      <Footer
        style={{
          textAlign: "center",
          color: "var(--color-text-muted)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        Product Management Dashboard — built with React, TypeScript, Redux Toolkit &amp; Ant Design
      </Footer>
    </Layout>
  );
}
