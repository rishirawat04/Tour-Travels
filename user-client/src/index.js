import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from './components/SnackbarProvider';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from './redux/store';
import { checkAuthStatus } from "./utils/checkAuthStatus";

const suppressResizeObserverError = () => {
  const resizeObserverErr = window.console.error;
  window.console.error = (...args) => {
    if (args[0]?.includes("ResizeObserver loop")) {
      return; 
    }
    resizeObserverErr(...args);
  };
};

suppressResizeObserverError();

const theme = createTheme({

  palette: {
    primary: {
      main: '#147d78',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Check authentication status when app starts
checkAuthStatus(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
  <SnackbarProvider>
  <ThemeProvider theme={theme}>
  <BrowserRouter future={{ v7_startTransition: true }}>
  <App />
  </BrowserRouter>
  </ThemeProvider>
  </SnackbarProvider>
  </PersistGate>
  </Provider>
);



