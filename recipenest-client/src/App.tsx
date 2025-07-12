
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import RegisterRole from './pages/RegisterRole'
import RegisterChef from './pages/RegisterChef'
import RegisterFoodLover from './pages/RegisterFoodLover'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
function App() {

  return (
    <>
        <div className='min-h-screen w-full overflow-x-hidden bg-[#171717]'>     
        <BrowserRouter>
        <Toaster/>
        <Navbar />
          <Routes>
            <Route
              path="/"
              element={<LandingPage />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route path="/register" element={<RegisterRole />} />
            <Route path="/register-chef" element={<RegisterChef />} />
            <Route path="/register-foodlover" element={<RegisterFoodLover />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        </div>   
    </>
  )
}

export default App
