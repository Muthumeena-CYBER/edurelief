import { Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CampaignDetails from './pages/CampaignDetails';
import CreateCampaign from './pages/CreateCampaign';
import StudentDashboard from './pages/StudentDashboard';
import DonorDashboard from './pages/DonorDashboard';
import Profile from './pages/Profile';
import ExternalApi from './pages/ExternalApi';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';


const ProtectedRoute = ({ children, role }) => {
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
  };
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'STUDENT') return <StudentDashboard />;
  if (user?.role === 'DONOR') return <DonorDashboard />;
  return <Navigate to="/" />;
};

const ProtectedProfile = withAuthenticationRequired(Profile, {
  onRedirecting: () => <div>Loading profile...</div>,
});

const ProtectedExternalApi = withAuthenticationRequired(ExternalApi, {
  onRedirecting: () => <div>Loading external API page...</div>,
});

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-primary">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route path="/external-api" element={<ProtectedExternalApi />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />

            {/* Role Based Dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* Student Specific */}
            <Route
              path="/create-campaign"
              element={
                <ProtectedRoute role="STUDENT">
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
