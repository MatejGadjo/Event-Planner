import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import EventList from './pages/EventList'
import UserList from './pages/UsersList'
import Register from './pages/Register'
import AddResource from './pages/AddResource'
import EventDetail from './pages/EventDetail'
import EventCreate from './pages/EventCreate'
import Profile from "./pages/Profile.jsx";
import ListItems from "./components/Example/ListItems.jsx";
import Login from "./pages/Login.jsx";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "./Firebase/firebase.jsx";
import {useEffect, useState} from "react";
import {AuthProvider} from "./Firebase/AuthContext.jsx";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile user={user}/>
              </ProtectedRoute>
            }/>
            <Route path='/events/public' element={<EventList user={user} />} />
            <Route path='/events/private' element={<EventList user={user}/>} />
            <Route path='/users' element={
              <ProtectedRoute>
                <UserList user={user}/>
              </ProtectedRoute>
            } />
            <Route path='/register' element={<Register />} />
            <Route path="/login" element={<Login />}/>
            <Route path='/addresource' element={<AddResource />} />
            <Route path='/eventdetail/:id' element={<EventDetail user={user} />} />
            <Route path='/createevent' element={<EventCreate user={user} />} />
            <Route path='/list' element={<ListItems />} />
          </Routes>
        </div>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
