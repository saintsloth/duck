import React, { createContext, useEffect } from 'react';
import './App.css';

import { Navigate, useRoutes } from 'react-router-dom';
import PageNotFound from './views/etc/page-not-found';
import Frame from './views/frame/frame';
import Registration from './views/registration/registration';
import { GlobalErrorHandler } from './components/global-error-handler';
import Signin from './views/signin/signin';
import Main from './views/main/main';
// import { Provider } from 'react-redux';
// import store from './slices/index.js';

function App() {
  const LocalesContext = createContext({ smth: 'string' });

  const routes = {
    path: '/',
    element: <Frame />,
    children: [
      { path: '/', element: <Main /> },
      { path: '/registration', element: <Registration /> },
      { path: '/signin', element: <Signin /> },
      { path: '*', element: <Navigate to='/404' /> },
      { path: '404', element: <PageNotFound /> },
    ],
  };

  const routing = useRoutes([routes]);

  useEffect(() => {
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      const errorHandler = require('./components/global-error-handler')
      errorHandler.catcherOfAsyncAndHandlersErrors(msg, url, lineNo, columnNo, error);
    }
  }, [routing])

  return (
    // <Provider store={store}>
    // </Provider>
    <GlobalErrorHandler>
      <LocalesContext.Provider value={{ smth: 'string' }}>
        {routing}
      </LocalesContext.Provider>
    </GlobalErrorHandler>
  );
}

export default App;
