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
import PersonIcon from '@mui/icons-material/Person';

import API from '../services/http-common.js'

const ResponsiblePerson = () => {

    const [title, setTitle] = useState(''); 
    const [operation,setOperation]= useState('');
    const [initialValues, setInitialValues] = useState('');
    const [dataResponsibles,setDataResponsibles] = useState([]);
    const [dataPersons,setDataPersons] = useState([]);
    const [responsibleId, setResponsibleId] = useState('');
    const [personId, setPersonId] = useState('');

    const [message,setMessage]=useState('');
    const [error,setError]=useState('');


    const[showModalDelete,setShowModalDelete] = useState('');

    const handleCloseModalDelete = () => setShowModalDelete(false);

    const handleShowModalDelete = (id,person) => {
        setShowModalDelete(true);
        setResponsibleId(id);
        setPersonId(person);
    }

    const [showModalForm, setShowModalForm] = useState(false);

    const handleCloseModalForm = () => setShowModalForm(false);

    const handleShowModalForm =(op, responsible, person) =>{ 
        setShowModalForm(true);
        setResponsibleId(responsible);
        setPersonId(person);
        if(op === 1){
            setTitle('Registrar Responsable');
            setOperation('Register');
            setResponsibleId('');
            setPersonId('');
            setInitialValues({
                idResponsible:'',
                idPerson:''
            })
        }else if(op === 2){
            setTitle('Editar Responsable');
            setOperation('Edit');
            setInitialValues({
                idResponsible:responsible,
                idPerson:person
            })

        }
    }

    const [showSendVerification, setShowSendVerification] = useState(false);

    const handleCloseSendVerification = () => setShowSendVerification(false);


    const getResponsibles = async () =>{ 
        return await API.get('read/responsibles').then((response) =>{
        setDataResponsibles(JSON.parse(JSON.stringify(response.data)));
    }).catch((error)=>{
        console.log(error);
    })
    };

    const getPersons = async () =>{ 
        return await API.get('read/people').then((response) =>{
        setDataPersons(JSON.parse(JSON.stringify(response.data)));
    }).catch((error)=>{
        console.log(error);
    })
    };


    useEffect(() => {
        getResponsibles();
    }, [showSendVerification]);

    useEffect(() => {
        getPersons();
    }, []);

    const formik  = useFormik({
        enableReinitialize: true,
        initialValues:initialValues,
        validationSchema:Yup.object({
        }),
        onSubmit: values =>{
            const responsible_data =JSON.stringify(values, null, 2);

            if(operation === "Register"){
                API.post('write/responsibles',responsible_data).then((response)=>{
                    if(response.status === 201){
                        formik.resetForm();
                        setShowSendVerification(true);
                    }
                    
                }).catch(error =>{
                    var error_data = error.response.data["error"] ;
                    setMessage(error_data);
                    setError(true)
                    setTimeout(() => setError(false),3000);
                });

            }else if(operation === "Edit"){
                API.patch('write/responsibles/'+responsibleId,responsible_data).then((response)=>{
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


    const deleteResponsible= () =>{
        API.delete('write/responsibles/'+responsibleId).then((response)=>{
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
            <h1 className="pt-3">Cabezas de familia</h1>
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
                                        <th>Responsable</th> 
                                        <th>dependiente</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {
                                        dataResponsibles.map((responsible,id)=>(
                                            <tr key={id}>
                                                <td>{dataPersons.map((person,id)=>{
                                                                if(responsible.idResponsible === person.id){
                                                                    return person.forename+' '+person.surname ;
                                                                }
                                                            })  }</td>
                                                <td>{dataPersons.map((person,id)=>{
                                                                if(responsible.idPerson === person.id){
                                                                    return person.forename+' '+person.surname ;
                                                                }
                                                            })  }</td>
                                                <td>   
                                                    <button 
                                                    className="btn btn-warning" onClick={()=> handleShowModalForm(2,responsible.idResponsible,responsible.idPerson)}>
                                                        <i><EditIcon/></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-danger" onClick={() => handleShowModalDelete(responsible.idResponsible,responsible.idPerson)}>
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
                            <span className="input-group-text"><PersonIcon/></span>
                            <select name="idResponsible" id="idResponsible" className="form-control" aria-label="Default select example"
                            defaultValue={(responsibleId === '') ? 'placeholder': responsibleId} onChange={formik.handleChange}  onBlur={formik.handleBlur}>
                                <option value='placeholder'disabled>Seleccione un responsable</option>
                                {dataPersons.map((person,id) =>(
                                    <option key={id} value={person.id}>{person.forename+' '+person.surname}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text"><PersonIcon/></span>
                            <select name="idPerson" id="idPerson" className="form-control" aria-label="Default select example"
                            defaultValue={(personId === '') ? 'placeholder': personId} onChange={formik.handleChange}  onBlur={formik.handleBlur}>
                                <option value='placeholder'disabled>Seleccione un dependiente</option>
                                {dataPersons.map((person,id) =>(
                                    <option key={id} value={person.id}>{person.forename+' '+person.surname}</option>
                                ))}
                            </select>
                        </div>

                        
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
                        <Modal.Title><HelpIcon/> Eliminar municipio</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    <div className="Container">
                        <h5 className="mb-3">¿Está seguro que desea eliminar este municipio con</h5>
                        <h5 className="mb-2">Id: {responsibleId}</h5>
                        
                    </div>
                    <div className="d-flex justify-content-around mt-3">
                        <button onClick={deleteResponsible} className="btn btn-success"><CheckIcon/>SI</button>
                        <button onClick={handleCloseModalDelete} className="btn btn-danger"><CloseIcon/>NO</button>
                    </div>

                </ModalBody>
            </Modal>

        </div>
        
    </>);
}

export default ResponsiblePerson;