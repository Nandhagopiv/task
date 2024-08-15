import React, { Fragment } from 'react';
import Auth from './components/Auth';
import EmailList from './components/EmailList';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ViewMail from './components/ViewMail';

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />}></Route>
          <Route path='/emails' element={<EmailList />}></Route>
          <Route path='/view' element={<ViewMail/>}></Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;