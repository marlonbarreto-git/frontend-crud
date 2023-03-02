import { NavLink } from "react-router-dom";
import React from "react";

//Icons
import HouseIcon from '@mui/icons-material/House';
import FlagIcon from '@mui/icons-material/Flag';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

const Sidebar = () => {
    return(
        <div className="sidebar ml-0 pl-0">
            <ul>
                <li>
                    <NavLink to='house' exact className= "text-dark rounded py-2 w-100 d-inline-block px-3 d-flex justify-content-start" 
                    activeclassname="active"><HouseIcon className="mr-2" /> Viviendas</NavLink>
                </li>

                <li>  
                    <NavLink to='municipality' exact className= "text-dark rounded py-2 w-100 d-inline-block px-3 d-flex justify-content-start" 
                    activeclassname="active"><FlagIcon className="mr-2"/> Municipios</NavLink>
                </li>

                <li>  
                    <NavLink to='person' exact className= "text-dark rounded py-2 w-100 d-inline-block px-3 d-flex justify-content-start" 
                    activeclassname="active"><PersonIcon className="mr-2"/> Personas</NavLink>
                </li>

                <li>
                    <NavLink to='responsiblePerson' exact className= "text-dark rounded py-2 w-100 d-inline-block px-3 d-flex justify-content-start" 
                    activeclassname="active"><GroupsIcon className="mr-2"/> Personas(CF)</NavLink>
                </li>
            </ul>
        </div>

    );

};

export default Sidebar;