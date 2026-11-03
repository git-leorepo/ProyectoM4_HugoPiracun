import type { JSX } from "react/jsx-runtime"
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignUp from "./pages/SignUp";
import RequireAuth from "./componentes/RequireAuth";


function App(): JSX.Element {

  return <div>
    <Routes>
      {/* pagina de registro */}
      <Route path="/" element={<SignUp />} />
      {/* pagina de login */}
      <Route path='/login' element={<LoginPage />} />
      {/* pagina de dashboard */}
      <Route path='/dashboard' element={
        <RequireAuth>
          <DashboardPage />
        </RequireAuth>
      } />
    </Routes>
  </div >

}

export default App