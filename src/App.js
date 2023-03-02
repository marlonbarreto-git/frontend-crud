import './App.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainView from './layouts/MainView.js';
import House from './components/House.js';
import Person from './components/Person.js';
import ResponsiblePerson from './components/ResponsiblePerson.js';
import Municipality from './components/Municipality.js';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="main/"element={<MainView/>}>
            <Route path='house' element={<House/>}/>
            <Route path='municipality' element={<Municipality/>}/>
            <Route path='responsiblePerson' element={<ResponsiblePerson/>}/>
            <Route path='person' element={<Person/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
