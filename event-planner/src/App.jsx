import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from "./pages/Home"
import EventList from './pages/EventList'
import UserList from './pages/UsersList'
import Register from './pages/Register'
import AddResource from './pages/AddResource'
import EventDetail from './pages/EventDetail'
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/events/public' element={<EventList />} />
          <Route path='/events/private' element={<EventList />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/register' element={<Register />} />
          <Route path='/addresource' element={<AddResource />} />
          <Route path='/eventdetail' element={<EventDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
