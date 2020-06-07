import {Request, Response} from 'express';
import knex from '../database/connection';

class ItensController{
    async index(request: Request, response: Response){

        const itens = await knex('itens').select('*');
    
        const serealizedItems = itens.map(item =>{
            return {
                id: item.id,
                name: item.name,
                image: `http://192.168.15.3:3333/uploads/${item.image}`,
            }
        })
    
        response.json(serealizedItems);
    }
}

export default ItensController;