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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: '/new-chat',
            element: <NewChat />
          },
          {
            path: '/chat/:conversation_id',
            element: <Chat />
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
