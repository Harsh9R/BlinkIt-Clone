import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './route/index'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

// Configure router with future flags to prepare for React Router v7
const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true, // Enable new relative route resolution
    v7_startTransition: true    // Enable React.startTransition for state updates
  },
  basename: '/', // Add basename to ensure proper routing
  window: window // Explicitly pass window object
})

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider 
        router={router}
        fallbackElement={<div>Loading...</div>}
      />
    </Provider>
  </StrictMode>
)
