import { NavLink } from "react-router-dom";
import { linkStyle, sidebarStyle } from "./styles";

const routes = [
  { to: "/global-dashboard", label: "Global Dashboard" },
  { to: "/fleet-manager-dashboard", label: "Fleet Manager Dashboard" },
  { to: "/driver-portal", label: "Driver Portal" },
  { to: "/parts-manager-dashboard", label: "Parts Manager Dashboard" },
  { to: "/compliance-dashboard", label: "Compliance Dashboard" },
  { to: "/silent-master-key-dashboard", label: "Silent Master Key Dashboard" },
];

export function Sidebar() {
  return (
    <nav style={sidebarStyle}>
      {routes.map((route) => (
        <NavLink key={route.to} to={route.to} style={linkStyle}>
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
}
