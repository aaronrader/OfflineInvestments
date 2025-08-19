import ReactDOM from 'react-dom/client';
import { Routes, Route, HashRouter } from "react-router"
import { Provider } from 'react-redux';

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from './App.js';
import { SummaryPage } from './pages/summaryPage.jsx';
import { SecurityPage } from './pages/securityPage.jsx';

import store from "./code/store.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<SummaryPage />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </Provider>
);
