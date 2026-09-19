import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TenantSelector } from "./TenantSelector";
import { layoutStyle, mainStyle, shellStyle } from "./styles";

export function Layout() {
  return (
    <div style={shellStyle}>
      <Header />
      <div style={layoutStyle}>
        <Sidebar />
        <main style={mainStyle}>
          <TenantSelector />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
