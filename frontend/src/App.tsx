import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Login  from './pages/Login'
import  SignUp  from './pages/SignUp'
import { Chat } from './pages/Chat'
import NotFound from './pages/NotFound'
import { useAuth } from './context/AuthContext'
function App() {
  console.log(useAuth()?.isLoggedIn);
  const auth = useAuth();
  return <main>
    <Header/>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<SignUp />}/>
     {
     auth?.isLoggedIn && auth.user &&  (<Route path='/chat' element={<Chat />}/>)
     }
      <Route path='*' element={<NotFound />}/>

    </Routes>
  </main>;
}

export default App;
