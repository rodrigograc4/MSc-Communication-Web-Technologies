import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ToDoList from "./ex1/pages/ToDoList";
import ToDoListPropTypes from "./ex2/pages/ToDoList";
import ATM from "./ex3/pages/ATM";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact={true} element={<Index />} />
          <Route path="*" exact={true} element={<NotFound />} />
          <Route path="/todolist" exact={true} element={<ToDoList />} />
          <Route path="/todolist-proptypes" exact={true} element={<ToDoListPropTypes />} />
          <Route path="/atm" exact={true} element={<ATM />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
