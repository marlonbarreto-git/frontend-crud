import React, { useState,useEffect } from "react";
import {Modal, ModalBody, ModalHeader} from 'react-bootstrap';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Snackbar,Alert } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';


//Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import SaveIcon from '@mui/icons-material/Save';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import WcIcon from '@mui/icons-material/Wc';
import HouseIcon from '@mui/icons-material/House';
import EventIcon from '@mui/icons-material/Event';

import API from '../services/http-common.js'

const Person = () => {

    const [title, setTitle] = useState(''); //Titulo modal, cambia dependiendo la operacion que se vaya a realizar
    const [operation,setOperation]= useState('');//configura la operacion que se va a realizar
    const [initialValues, setInitialValues] = useState('');//Valores iniciales
    const [dataPeople,setDataPeople] = useState([]);
    const [dataHouse,setDataHouse] = useState([]);
    const [personId, setPersonId] = useState('');
    const [personName, setPersonName] = useState('');
    const [idHome,setIdHome] = useState('');
    const [personSex,setPersonSex] = useState('');

    const [message,setMessage]=useState('');
    const [error,setError]=useState('');

    //Variable  gestion llamada modal verificacion borrado
    const[showModalDelete,setShowModalDelete] = useState('');

    const handleCloseModalDelete = () => setShowModalDelete(false);

    const handleShowModalDelete = (id,forename,surname) => {
        setShowModalDelete(true);
        setPersonId(id);
        setPersonName(forename+' '+surname);
    }

    //Variables gestion llamada modal formulario
    const [showModalForm, setShowModalForm] = useState(false);

    const handleCloseModalForm = () => setShowModalForm(false);

    const handleShowModalForm =(op,id,forename,surname,birthdate,sex,home) =>{
        setShowModalForm(true);
        setPersonId(id);
        setIdHome(home);
        setPersonSex(sex);
        if(op === 1){
            console.log(personSex)
            setTitle('Registrar Persona');
            setPersonSex('');
            setIdHome('');
            setOperation('Register');
            setInitialValues({
                id:'',
                forename:'',
                surname:'',
                birthdate:'',
                sex:'',
                idHome:''
            })
        }else if(op === 2){
            setTitle('Editar Persona');
            setOperation('Edit');
            setInitialValues({
                id:id,
                forename:forename,
                surname:surname,
                birthdate:birthdate,
                sex:sex,
                idHome:home
            })

        }
    }


    //Mostrar verificación de envio
    const [showSendVerification, setShowSendVerification] = useState(false);

    const handleCloseSendVerification = () => setShowSendVerification(false);


    const getPerson = async () =>{ 
        return await API.get('read/people').then((response) =>{
        setDataPeople(JSON.parse(JSON.stringify(response.data)));
    }).catch((error)=>{
        console.log(error);
    })
    };

    const getHouse = async () =>{ 
        return await API.get('read/houses').then((response) =>{
        setDataHouse(JSON.parse(JSON.stringify(response.data)));
    }).catch((error)=>{
        console.log(error);
    })
    };


    useEffect(() => {
        getPerson();
    }, [showSendVerification]);

    useEffect(() => {
        getHouse();
    }, []);


    const formik  = useFormik({
        enableReinitialize: true, //Permite cambiar los valores iniciales
        initialValues:initialValues,
        validationSchema:Yup.object({
            id:Yup.string().required("Este campo es requerido"),
            forename:Yup.string().required("Este campo es requerido").matches( /^[a-zA-ZÀ-ÿ\s]{1,40}$/,"Solo permite letras y espacios"),
            surname:Yup.string().required("Este campo es requerido").matches( /^[a-zA-ZÀ-ÿ\s]{1,40}$/,"Solo permite letras y espacios")
        }),
        onSubmit: values =>{
            const person_data =JSON.stringify(values, null, 2);

            if(operation === "Register"){//Envio de datos cuando se va a registrar
                API.post('write/people',person_data).then((response)=>{//Envio de datos realizado correctamente
                    if(response.status === 201){
                        formik.resetForm();//Borrar datos de formulario
                        setShowSendVerification(true);//Mostrar mensaje de confirmación
                    }
                    
                }).catch(error =>{
                    var error_data = error.response.data["error"] ;//Obtener errores y mostarlos
                    setMessage(error_data);
                    setError(true)
                    setTimeout(() => setError(false),3000);
                });

            }else if(operation === "Edit"){//Envio de datos operacion editar
                API.patch('write/people/'+personId,person_data).then((response)=>{
                    if(response.status === 200){
                        // formik.resetForm();
                        // setSendVerification(true);
                        // setTimeout(() => setSendVerification(false),6000);
                        setShowSendVerification(true);
                    }
                    
                }).catch(error =>{
                    var error_data = error.response.data["error"] ;
                    setMessage(error_data);
                    setError(true)
                    setTimeout(() => setError(false),4000);
                });
            }
            
        },
    });


    const deletePerson= () =>{
        API.delete('write/people/'+personId).then((response)=>{
            if(response.status === 204){
                // formik.resetForm();
                // setSendVerification(true);
                // setTimeout(() => setSendVerification(false),6000);
                setShowSendVerification(true);
                setShowModalDelete(false)
            }
        }).catch(error =>{
            var error_data = error.response.data["error"] ;
            setMessage(error_data);
            setError(true)
            setTimeout(() => setError(false),4000); 
        });
    }

    return (  <>
        <div className="App">
            <h1 className="pt-3">Personas</h1>
                <div className="container-fluid_">
                    <div className="mt-3">
                        <div className="col-md-4 offset-md-4">
                            <div className="d-grid mx-auto">
                                <button className="btn btn-dark"onClick={() => handleShowModalForm(1) }>
                                    <AddCircleOutlineIcon />Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="col-12 col-lg-12 offset-0 offset-lg-12">
                        <div className="table-responsive">
                            <table className="table table-bordered ml-4 mr-4">
                                <thead>
                                    <tr>
                                        <th>id</th> 
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Fecha de nacimiento</th>
                                        <th>Sexo</th>
                                        <th>Vivienda</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {
                                        dataPeople.map((person,id)=>(
                                            <tr key={id}>
                                                <td>{person.id}</td> 
                                                <td>{person.forename}</td>
                                                <td>{person.surename}</td>
                                                <td>{person.birthdate}</td>
                                                <td>{person.sex}</td>
                                                <td>{dataHouse.map((house,id)=>{
                                                                if(person.idHome === house.id){
                                                                    return house.address
                                                                }
                                                            })  }</td>
                                                <td>   
                                                    <button 
                                                    className="btn btn-warning" onClick={()=> handleShowModalForm(2,person.id,person.forename,person.surename,person.birthdate,person.sex,person.idHome)}>
                                                        <i><EditIcon/></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-danger" onClick={() => handleShowModalDelete(person.id,person.forename,person.surename)}>
                                                        <i><DeleteIcon/></i>
                                                    </button>  
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            {/* modal que contiene formularios tanto para crear como modificar */}
            <Modal show={showModalForm} onHide={handleCloseModalForm}>
                <ModalHeader closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </ModalHeader>
                
                <ModalBody>
                    <form className="form mt-0" onSubmit={formik.handleSubmit}>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><BadgeIcon/></span>
                            <input 
                                className="form-control"
                                type="text" 
                                id="id" 
                                name= "id"
                                placeholder="Numero de identificación"
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur}
                                value={formik.values.id} 
                            />
                        </div >
                        {formik.touched.id && formik.errors.id ? <div className="error">{formik.errors.id}</div> : null}

                        <div className="input-group mb-3">
                            <span className="input-group-text"><PersonIcon/></span>
                            <input 
                                className="form-control"
                                type="text" 
                                id="forename" 
                                name= "forename"
                                placeholder="Nombre "
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur}
                                value={formik.values.forename} 
                            />
                        </div >
                        {formik.touched.forename && formik.errors.forename ? <div className="error">{formik.errors.forename}</div> : null}

                        <div className="input-group mb-3">
                            <span className="input-group-text"><PersonIcon/></span>
                            <input 
                                className="form-control"
                                type="text" 
                                id="surname" 
                                name= "surname"
                                placeholder="Apellido"
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur}
                                value={formik.values.surname} 
                            />
                        </div >
                        {formik.touched.surname && formik.errors.surname ? <div className="error">{formik.errors.surname}</div> : null}

                        {/*fecha de nacimiento */}


                        <div className="input-group mb-3">
                            <span className="input-group-text"><WcIcon/></span>
                            <select name="sex" id="sex" className="form-control" aria-label="Default select example"
                            defaultValue={(personSex === '') ? 'placeholder': personSex} onChange={formik.handleChange}  onBlur={formik.handleBlur}>
                                <option value='placeholder'disabled>Sexo</option>
                                <option value='M'>Masculino</option>
                                <option value='F'>Femenino</option>
                            </select>
                        </div>

                        {(operation==="Edit") ? (<></>):
                        (<>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><HouseIcon/></span>
                            <select name="idHome" id="idHome" className="form-control" aria-label="Default select example"
                            defaultValue={(idHome === '') ? 'placeholder': idHome} onChange={formik.handleChange}  onBlur={formik.handleBlur}>
                                <option value='placeholder'disabled>Seleccione una vivienda</option>
                                {dataHouse.map((house,id) =>(
                                    <option key={id} value={house.id}>{house.address}</option>
                                ))}
                            </select>
                        </div> 
                        </>)}

                        <div> 
                            <button className="btn btn-success" type="submit"><SaveIcon className="mr-1"/>Guardar</button>
                        </div>
                        {error && <p className="error mt-2">{message}</p>}
                    </form> 
                </ModalBody>
            </Modal>

            {/* Envio exitos informacion de formulario */}
            <Snackbar open={showSendVerification} autoHideDuration={6000} onClose={handleCloseSendVerification}>
                <Alert onClose={handleCloseSendVerification} severity="success" sx={{ width: '100%' }}>
                    Formulario enviado con exito
                </Alert>
            </Snackbar>

            {/* Modal de verificacion de borrado*/}
            <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                <ModalHeader closeButton>
                        <Modal.Title><HelpIcon/> Eliminar Persona</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    <div className="Container">
                        <h5 className="mb-3">¿Está seguro que desea eliminar esta persona con</h5>
                        <h5 className="mb-2">Id: {personId}</h5>
                        <h5>Nombre: {personName}</h5>
                        
                    </div>
                    <div className="d-flex justify-content-around mt-3">
                        <button onClick={deletePerson} className="btn btn-success"><CheckIcon/>SI</button>
                        <button onClick={handleCloseModalDelete} className="btn btn-danger"><CloseIcon/>NO</button>
                    </div>

                </ModalBody>
            </Modal>

        </div>
        
    </>);
}

export default Person;