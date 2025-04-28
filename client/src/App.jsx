import "./styles/main.scss"
import 'react-image-crop/src/ReactCrop.scss'
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoadingSpinner from "./Components/LoadingSpinner";
import { LoadingProvider } from "./LoadingContext";
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import('./Pages/Home'));
const FullPost = lazy(() => import('./Pages/FullPost'));
const CreatePost = lazy(() => import('./Pages/CreatePost'));
const EditPost = lazy(() => import('./Pages/EditPost'));
const Search = lazy(() => import('./Pages/Search'));
const Profile = lazy(() => import('./Pages/Profile'));
const Signup = lazy(() => import('./Pages/Signup'));
const Login = lazy(() => import('./Pages/Login'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./Pages/NotFound'));

function App(){
  return(
    <LoadingProvider>
      <Router>
        <Navbar />

        <Toaster position="top-right" containerStyle={{ top: 85 }}/>

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/post/:recipe_id" element={<FullPost />}/>

            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile/:user_name?" element={<Profile />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/edit/:recipe_id" element={<EditPost />} />
            </Route>
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </Router>
    </LoadingProvider>
  )
}

export default App;