import {Dashboard} from './pages/Dashboard'
import {Signup} from './pages/Signup'
import { Signin } from './pages/Signin'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Shared } from './pages/Shared'

function App() 
{
  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/shared/:shareLink" element={<Shared/>}/>
    </Routes>
    </BrowserRouter>
}

export default App
