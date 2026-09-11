//import './App.css'
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Task from './pages/Task';
import Navbar from './componentes/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <>
      <Navbar>
        <Routes>
          <Route 
            path="/" 
            element={
              <Login 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated} 
              />
            } 
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/task"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Task />
              </ProtectedRoute>
            } />
        </Routes>
      </Navbar>      
    </>
  )
}

export default App