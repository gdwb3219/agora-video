// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MeetingPage from "./pages/MeetingPage";
import AdminPage from "./pages/AdminPage";
import MeetingPage2 from "./pages/MeetingPage2";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/meeting' element={<MeetingPage />} />
          <Route path='/meeting2' element={<MeetingPage2 />} />
          <Route path='/admin' element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
