import "./styles/main.scss"
import 'react-image-crop/src/ReactCrop.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import CreatePost from "./Pages/CreatePost";
import Search from "./Pages/Search";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Reports from "./Pages/Reports";
import Notifications from "./Pages/Notifications";
import ProtectedRoute from "./Components/ProtectedRoute";



function App(){
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/post" element={<CreatePost />} />
          <Route path="/profile/:user_name?" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;