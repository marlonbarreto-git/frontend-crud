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
import PinIcon from '@mui/icons-material/Pin';
import FlagIcon from '@mui/icons-material/Flag';

import API from '../services/http-common.js'

const Municipality = () => {

    const [title, setTitle] = useState(''); //Titulo modal, cambia dependiendo la operacion que se vaya a realizar
    const [operation,setOperation]= useState('');//configura la operacion que se va a realizar
    const [initialValues, setInitialValues] = useState('');//Valores iniciales
    const [dataMunicipality,setDataMunicipality] = useState([]);
    const [municipalityId, setMunicipalityId] = useState('');
    const [municipalityName, setMunicipalityName] = useState('');

    const [message,setMessage]=useState('');
    const [error,setError]=useState('');

    //Variable  gestion llamada modal verificacion borrado
    const[showModalDelete,setShowModalDelete] = useState('');

    const handleCloseModalDelete = () => setShowModalDelete(false);

    const handleShowModalDelete = (id,name) => {
        setShowModalDelete(true);
        setMunicipalityId(id);
        setMunicipalityName(name);
    }

    //Variables gestion llamada modal formulario
    const [showModalForm, setShowModalForm] = useState(false);

    const handleCloseModalForm = () => setShowModalForm(false);

    const handleShowModalForm =(op, id, name) =>{ // Configura el formulario si es para editar o registratr, depende del caso
        setShowModalForm(true);
        setMunicipalityId(id);
        if(op === 1){
            setTitle('Registrar Municipio');
            setOperation('Register');
            setInitialValues({
                name:""
            })
        }else if(op === 2){
            setTitle('Editar Municipio');
            setOperation('Edit');
            setInitialValues({
                name:name
            })

        }
    }


    //Mostrar verificación de envio
    const [showSendVerification, setShowSendVerification] = useState(false);

    const handleCloseSendVerification = () => setShowSendVerification(false);


    const getMunicipality = async () =>{ //Llamado a api, para obtención de conjunto de municipios a mostar
        return await API.get('read/municipalities').then((response) =>{
        setDataMunicipality(JSON.parse(JSON.stringify(response.data)));
    }).catch((error)=>{
        console.log(error);
    })
    };


    useEffect(() => {
        getMunicipality();
    }, [showSendVerification]);//Si el valor de la variable de verificación de envio cambia se va a recargar los valores a mostrar


    const formik  = useFormik({
        enableReinitialize: true, //Permite cambiar los valores iniciales
        initialValues:initialValues,
        validationSchema:Yup.object({
            name:Yup.string().required("Este campo es requerido").matches( /^[a-zA-ZÀ-ÿ\s]{1,40}$/,"Solo permite letras y espacios"),
            id:Yup.string().required("Este campo es requerido")
        }),
        onSubmit: values =>{
            const municipality_data =JSON.stringify(values, null, 2);

            if(operation === "Register"){//Envio de datos cuando se va a registrar
                API.post('write/municipalities',municipality_data).then((response)=>{//Envio de datos realizado correctamente
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
                API.patch('write/municipalities/'+municipalityId,municipality_data).then((response)=>{
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


    const deleteMunicipality= () =>{
        API.delete('write/municipalities/'+municipalityId).then((response)=>{
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
            <h1 className="pt-3">Municipios</h1>
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
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {
                                        dataMunicipality.map((municipality,id)=>(
                                            <tr key={id}>
                                                <td>{municipality.id}</td> 
                                                <td>{municipality.name}</td>
                                                <td>   
                                                    <button 
                                                    className="btn btn-warning" onClick={()=> handleShowModalForm(2,municipality._id,municipality.name)}>
                                                        <i><EditIcon/></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-danger" onClick={() => handleShowModalDelete(municipality._id,municipality.name)}>
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
                                    <span className="input-group-text"><FlagIcon/></span>
                                    <input 
                                        className="form-control"
                                        type="text" 
                                        id="name" 
                                        name= "name"
                                        placeholder="Nombre del municipio"
                                        onChange={formik.handleChange} 
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name} 
                                    />
                                </div >
                                {formik.touched.name && formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
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
                        <h5 className="mb-2">Id: {municipalityId}</h5>
                        <h5>Nombre: {municipalityName}</h5>
                        
                    </div>
                    <div className="d-flex justify-content-around mt-3">
                        <button onClick={deleteMunicipality} className="btn btn-success"><CheckIcon/>SI</button>
                        <button onClick={handleCloseModalDelete} className="btn btn-danger"><CloseIcon/>NO</button>
                    </div>

                </ModalBody>
            </Modal>

        </div>
        
    </>);
}

export default Municipality;