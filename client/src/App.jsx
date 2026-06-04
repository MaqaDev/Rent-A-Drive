import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";

// Pages
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Cars } from "./pages/Cars.jsx";
import { CarDetail } from "./pages/CarDetail.jsx";
import { Checkout } from "./pages/Checkout.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { AdminPanel } from "./pages/AdminPanel.jsx";
import { NotFound } from "./pages/NotFound.jsx";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='flex flex-col min-h-screen'>
          <Navbar />
          <main className='flex-grow'>
            <Routes>
              <Route
                path='/'
                element={<Home />}
              />
              <Route
                path='/login'
                element={<Login />}
              />
              <Route
                path='/register'
                element={<Register />}
              />
              <Route
                path='/cars'
                element={<Cars />}
              />
              <Route
                path='/cars/:id'
                element={<CarDetail />}
              />

              <Route
                path='/checkout/:carId'
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/admin'
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />

              <Route
                path='*'
                element={<NotFound />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position='top-right' />
      </Router>
    </AuthProvider>
  );
}

export default App;
