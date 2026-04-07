import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Fabrics from "./pages/Fabrics.jsx";
import Factories from "./pages/Factories.jsx";
import StageOfMaterial from "./pages/StageOfMaterial.jsx";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/factories" element={<Factories />} />
        <Route path="/fabrics" element={<Fabrics />} />
        <Route path="/stage-of-material" element={<StageOfMaterial />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
