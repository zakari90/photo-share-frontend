import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainNavigation from './components/navBar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './context/auth-context';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import NewPost from './pages/newPost';
import RegistrationPage from './pages/registration';
import MyPostsPage from './pages/userPost';

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || '');
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');

  const login = (userToken: string, loginUserId: string, loginUsername: string) => {
    if (userToken) {
      setToken(userToken);
      localStorage.setItem('token', userToken);
    }
    if (loginUserId) {
      setUserId(loginUserId);
      localStorage.setItem('userId', loginUserId);
    }
    if (loginUsername) {
      setUsername(loginUsername);
      localStorage.setItem('username', loginUsername);
    }
  };

  const logout = () => {
    setToken('');
    setUserId('');
    setUsername('');
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, username, login, logout }}>
        <div className="min-h-screen flex flex-col">
          <MainNavigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {token && <Route path="/login" element={<Navigate replace to="/" />} />}
              <Route path="/login" element={<LoginPage />} />
              {token && <Route path="/register" element={<Navigate replace to="/" />} />}
              <Route path="/register" element={<RegistrationPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/newPost" element={<NewPost />} />
                <Route path="/userPage" element={<MyPostsPage />} />
              </Route>
            </Routes>
          </main>

          <footer className="text-center p-4 bg-gray-100 text-gray-600">
            &copy; {new Date().getFullYear()} Photo Share. All rights reserved.
          </footer>
        </div>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
