import {BrowserRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import {ClerkProvider} from '@clerk/clerk-react'
import App from './App.jsx'
import {Provider} from 'react-redux';
import store from './app/store.js';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY) {
  throw new Error("Missing key : VITE_CLERK_PUBLISHABLE_KEY");
} 

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <BrowserRouter>
  <Provider store={store}>
    <App />
    </Provider>
  </BrowserRouter>
  </ClerkProvider>,
)
