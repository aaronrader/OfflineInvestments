import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router"
import App from './App.js';
import { Summary } from './pages/summary.jsx';

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import data from "./data/account1.json";
import { Account } from './classes';
import { Security } from './pages/security.jsx';

const account = new Account(data);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Summary account={account}/>} />
        <Route path="security" element={<Security account={account}/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
