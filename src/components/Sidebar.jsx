import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Luki<span>Sourcing</span>
      </div>

      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/factories">Factories</NavLink>
        <NavLink to="/fabrics">Fabrics</NavLink>
        <NavLink to="/stage-of-material">Stage of Material</NavLink>
      </nav>
    </aside>
  );
}
