import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from 'react-redux'
import { store, persistor } from './state/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvide from './components/ThemeProvide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvide>
        <App />
      </ThemeProvide>
    </Provider>
    </PersistGate>
  </StrictMode>,
)
