import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import  store  from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/SignUp.jsx'
import AppLayout from './components/AppLayout.jsx'
import NewChat from './pages/NewChat.jsx'
import Chat from './pages/Chat.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import Home from './pages/Home.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        )
      },
      {
        element: 
        <AppLayout />,
        children: [
          {
            path: '/new-chat',
            element: (
            <AuthLayout authentication={true}>
              <NewChat />
            </AuthLayout>
            )
          },
          {
            path: '/chat/:conversation_id',
            element: (
              <AuthLayout authentication={true}>
                  <Chat />
              </AuthLayout>
            )
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
