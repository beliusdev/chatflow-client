import { Route, Routes } from 'react-router-dom';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Verification from './pages/Verification';

import Auth from './components/Auth';
import Profile from './pages/Profile';
import Layout from './components/Layout';

export default function App() {
  return (
    <Layout>
      <Auth>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/verification/:token" element={<Verification />} />
          <Route path="/*" element={<div>// todo: not found</div>} />
        </Routes>
      </Auth>
    </Layout>
  );
}
