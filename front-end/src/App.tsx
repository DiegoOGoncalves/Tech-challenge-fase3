import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Layout } from './components/Layout';
import { PrivateRoute, TeacherRoute } from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Admin } from './pages/Admin';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { PostDetails } from './pages/PostDetails';
import { PostForm } from './pages/PostForm';
import { GlobalStyles } from './styles';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/posts" element={<Home />} />
                  <Route path="/posts/:id" element={<PostDetails />} />
                  <Route path="/post/:id" element={<PostDetails />} />
                  <Route element={<TeacherRoute />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/create" element={<PostForm />} />
                    <Route path="/admin/edit/:id" element={<PostForm />} />
                  </Route>
                </Route>
                <Route path="*" element={<Login />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
