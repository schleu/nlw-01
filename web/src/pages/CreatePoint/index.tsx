import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import api from '../../services/api'
import './styles.css';
import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone'


interface Item{
    id: number
    name: string
    image: string
}

interface IBGEUFResponse{
    sigla:string
}

interface IBGECityResponse{
    nome:string
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [citys, setCitys] = useState<string[]>([])
    
    const [selectedInitialPosition,setSelectedInitialPosition] = useState<[number,number]>([0,0])
    
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        whatsapp:'',
    })

    const [selectedUf,setSelectedUf] = useState('0')
    const [selectedCity,setSelectedCity] = useState('0')
    const [selectedItems,setSelectedItems] = useState<number[]>([])
    const [selectedPosition,setSelectedPosition] = useState<[number,number]>([0,0])
    const [selectedFile,setSelectedFile] = useState<File>()

    const history = useHistory()


    function getModalStyle() {
        const top = 50;
        const left = 50;
      
        return {
          top: `${top}%`,
          left: `${left}%`,
          transform: `translate(-${top}%, -${left}%)`,
        };
    }
      
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            paper: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1d1be3',
            color:'#fff',
            display: "flex",
            flexDirection: "column",
            justifyContent:"center",
            alignItems: "center",
            fontSize: 30,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            
            },
            svg: {
                color:"#34cb79",
                fontSize: 60,
            }
        }),
    );
    const classes = useStyles();


    // Geolocalizacao
    useEffect( () =>{
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setSelectedInitialPosition([latitude, longitude])
        })
    }) 

    // Itens de Coleta
    useEffect( () => {
        api.get('itens').then(response => {
            setItems(response.data)
        })
    },[])

    // UFs
    useEffect( () => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    },[])

    // Citys
    useEffect( () => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCitys(cityNames)
        })
    },[selectedUf])



    // Selecionar um Estado
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value

        setSelectedUf(uf)
    }

    // Selecionar uma Cidade
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value

        setSelectedCity(city)
    }

    // Clicar no mapa
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])

    }

    // Nome, Email e Telefone
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target

        setFormData({...formData, [name]: value})
    }

    // Selecionar um item
    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item == id)

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }else{
            setSelectedItems([...selectedItems,id])
        }

    }


    async function handleSummit(event: FormEvent){
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const itens = selectedItems

        const data = new FormData();

        
            data.append('name',name);
            data.append('email',email);
            data.append('whatsapp',whatsapp);
            data.append('city',city)
            data.append('uf',uf)
            data.append('latitude',String(latitude));
            data.append('longitude',String(longitude));
            data.append('itens',itens.join(','));
            if(selectedFile){
                data.append('image',selectedFile);
            }

        // Executa insert na tabela points
        await api.post('points', data)

        handleOpen();
        
        // Redireciona para a home
        setTimeout(() => {history.push('/')}, 2000);
        
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSummit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                
                <Dropzone onFileUploaded={setSelectedFile}/>
                
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatapp">Whatapp</label>
                            <input type="text" name="whatapp" id="whatapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={selectedInitialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {citys.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))} 
                            </select>
                        </div>
                    </div>


                </fieldset>

                {/* Intes de Coleta */}
                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} 
                                onClick={() => handleSelectItem(item.id)} 
                                className={selectedItems.includes(item.id) ? 'selected':''}>
                                <img src={item.image} alt={item.name}/>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>


            </form>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
              <div className={classes.paper}>
                <FiCheckCircle className={classes.svg}/>
                Cadastrado concluído!
              </div>
          </Modal>
        </div>
    )
}



export default CreatePoint;