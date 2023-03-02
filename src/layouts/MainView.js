import React from "react";

import {  Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar.js";
import Sidebar from "../components/Sidebar.js";
import House from "../components/House.js";
import Municipality from "../components/Municipality.js";
import Person from "../components/Person.js";
import ResponsiblePerson from "../components/ResponsiblePerson.js";

const MainView = () => {
    return (<>
        <Navbar/>
        <div className="flex">
            <Sidebar/>
            <div className="content w-100">
                <Routes>
                    <Route path='house' element={<House/>}/>
                    <Route path='municipality' element={<Municipality/>}/>
                    <Route path='person' element={<Person/>}/>
                    <Route path='responsiblePerson' element={<ResponsiblePerson/>}/>
                </Routes>
                
            </div>

        </div>

    </>);
}
 
export default MainView;
