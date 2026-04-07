import Sidebar from "./Sidebar.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="app">
      <div className="app-shell">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
