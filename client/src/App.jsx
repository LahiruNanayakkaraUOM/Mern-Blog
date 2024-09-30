import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import FooterCom from './components/Footer.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx'
import CreatePost from './pages/CreatePost.jsx'
import UpdatePost from './pages/UpdatePost.jsx'
import SinglePost from './pages/SinglePost.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Navigate to={'/'} />} />
        <Route path='/about' element={<About />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/post/:postSlug' element={<SinglePost />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost  />} />
        </Route>
        {/* <Route path='*' element={<Navigate to={"/"} />} /> */}
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}
