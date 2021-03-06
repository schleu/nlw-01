import React from 'react'
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const routes = () =>{
    return(
        <BrowserRouter>
            <Route component={Home} path='/' exact />
            <Route component={CreatePoint} path='/Create-Point' />
        </BrowserRouter>
    )
}

export default routes;