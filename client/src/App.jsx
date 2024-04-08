import { useState,lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Home = lazy(()=> import("./pages/Home"));
const Login = lazy(()=> import("./pages/Login"));
const Chat = lazy(()=> import("./pages/Chat"));
const Groups = lazy(()=> import("./pages/Groups"));



function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/chat" element={<Chat/>} />
      <Route path="/groups" element={<Groups/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
