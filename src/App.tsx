import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Dashboard from "./pages/Dashboard"
import Intents from "./pages/Intents"
import Offers from "./pages/Offers"
import Distribution from "./pages/Distribution"
import Layout from "./components/Layout"
import { useAuth } from "./hooks/useAuth"

function AuthenticatedRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/intents" element={<Intents />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/distribution" element={<Distribution />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <AuthenticatedRoutes /> : <Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={user ? <AuthenticatedRoutes /> : <Login />} />
      <Route path="/intents/*" element={user ? <AuthenticatedRoutes /> : <Login />} />
      <Route path="/offers/*" element={user ? <AuthenticatedRoutes /> : <Login />} />
      <Route path="/distribution/*" element={user ? <AuthenticatedRoutes /> : <Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
