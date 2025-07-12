
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import RegisterRole from './pages/RegisterRole'
import RegisterChef from './pages/RegisterChef'
import RegisterFoodLover from './pages/RegisterFoodLover'
function App() {

  return (
    <>
        <BrowserRouter>
        <Toaster/>
          <Routes>
            <Route
              path="/login"
              element={<Login />}
            />
            <Route path="/register" element={<RegisterRole />} />
            <Route path="/register-chef" element={<RegisterChef />} />
            <Route path="/register-foodlover" element={<RegisterFoodLover />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
