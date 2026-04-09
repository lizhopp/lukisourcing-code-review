import { NavLink } from "react-router-dom";

export default function Sidebar({ currentUser, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        Luki<span>Sourcing</span>
      </div>

      {currentUser ? (
        <section className="sidebar-user">
          <p className="sidebar-user-name">
            {currentUser.first_name} {currentUser.last_name}
          </p>
          <p className="sidebar-user-meta">{currentUser.company}</p>
          <p className="sidebar-user-meta">{currentUser.email}</p>
        </section>
      ) : null}

      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/factories">Factories</NavLink>
        <NavLink to="/fabrics">Fabrics</NavLink>
        <NavLink to="/stage-of-material">Stage of Material</NavLink>
      </nav>

      <button className="button sidebar-logout" onClick={onLogout}>
        Log Out
      </button>
    </aside>
  );
}
