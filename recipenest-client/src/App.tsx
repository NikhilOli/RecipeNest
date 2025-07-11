
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
function App() {

  return (
    <>
        <BrowserRouter>
        <Toaster/>
          <Routes>
            <Route
              path="/"
              element={<Login />}
            />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
