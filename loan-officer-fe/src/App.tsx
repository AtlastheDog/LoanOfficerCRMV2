import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import LeadsList from "./pages/leads/LeadsList"
import LeadDetail from "./pages/leads/LeadDetail"
import CreateLead from "./pages/leads/CreateLead"
import EditLead from "./pages/leads/EditLead"
import RateSheetUpload from "./pages/rates/RateSheetUpload"
import RateSheetResults from "./pages/rates/RateSheetResults"
import AnalyzeLeads from "./pages/leads/AnalyzeLeads"
import Layout from "./components/Layout"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="leads">
              <Route index element={<LeadsList />} />
              <Route path="new" element={<CreateLead />} />
              <Route path=":id" element={<LeadDetail />} />
              <Route path=":id/edit" element={<EditLead />} />
              <Route path="analyze" element={<AnalyzeLeads />} />
            </Route>
            <Route path="rates">
              <Route path="upload" element={<RateSheetUpload />} />
              <Route path="results" element={<RateSheetResults />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
