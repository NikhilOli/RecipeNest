
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
import ChefsList from './pages/chefs/ChefList'
import ChefDetails from './pages/chefs/ChefDetails'
import RecipeList from './pages/recipes/RecipeList'
import RecipeDetails from './pages/recipes/RecipeDetails'
import { ProtectedRoute } from './components/ProtectedRoute'
import ChefDashboard from './pages/chefs/ChefDashboard'
import { AuthProvider } from './context/AuthContext'
import AddRecipe from './components/recipe/AddRecipe'
import FoodLoverProfile from './pages/foodLovers/FoodLoverProfile'
import AdminDashboard from './pages/admin/AdminDashbard'
import Users from './pages/admin/Users'
import AdminLayout from './components/admin/AdminLayout'
import Recipes from './pages/admin/Recipes'
import UserDetails from './pages/admin/UserDetails'
import Analytics from './pages/admin/Analytics'
function App() {

  return (
    <>  
        <div className='min-h-screen w-full overflow-x-hidden bg-[#171717]'>     
          <BrowserRouter>
            <AuthProvider>
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
                <Route path="/chefs" element={<ChefsList />} />
                <Route path="/chefs/:id" element={<ChefDetails />} />
                <Route path="/recipes" element={<RecipeList />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                <Route path="/chef/add-recipe" element={<AddRecipe />} />
                <Route
                  path="/chef/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["Chef"]}>
                      <ChefDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile" element={<FoodLoverProfile />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="recipes" element={<Recipes />} />
                  <Route path="/admin/users/:id" element={<UserDetails />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  {/* other admin routes */}
                </Route>
              </Routes>
              <Footer />
              </AuthProvider>
          </BrowserRouter>
        </div>
    </>
  )
}

export default App
