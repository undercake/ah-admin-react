import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from "react-router-dom";
import Layout from './Layout';
import Loading from './components/Status/Loading';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    <Suspense fallback={<div className='bg-gray-200 dark:bg-gray-800' style={{
      width: '100vw',
      height: '100vh'
      }}><Loading /></div>}><Layout /></Suspense>
  </HashRouter>
);

reportWebVitals();
