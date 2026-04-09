import Sidebar from "./Sidebar.jsx";

export default function AppLayout({ children, currentUser, onLogout }) {
  return (
    <div className="app">
      <div className="app-shell">
        <Sidebar currentUser={currentUser} onLogout={onLogout} />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
