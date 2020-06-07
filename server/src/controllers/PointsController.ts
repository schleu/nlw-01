import {Request, Response} from 'express';
import knex from '../database/connection';


class PointsController{

    async index(request: Request, response: Response){
        // Pega parametros
        const { city, uf, itens } = request.query;
        
        // Separa os itens
        const parsedItens = String(itens)
            .split(',')
            .map(item => Number(item.trim()))

        // Executa consulta
        const points = await knex('points')
            .join('points_itens','points.id','=','points_itens.idPoints')
            .whereIn('points_itens.IdItens', parsedItens)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');


        const serealizedItems = points.map(point =>{
            return {
                ... point,
                image_url: `http://192.168.15.3:3333/uploads/${point.image}`,
            }
        })

        // Retorna consulta
        return response.json(serealizedItems);
    }

    // Insert
    async create(request: Request, response: Response){
        // Recebe requisicao
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            itens
        } = request.body
    
        //Rollback
        const trx = await knex.transaction();

        // Variavel com dados do Point
        const point = {
            image:request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
    
        // Insere o point novo e retornda os dados
        const insertedIds = await trx('points').insert(point);
    
        // Id do Point
        const idPoints = insertedIds[0];
    
        // Tabela de relacionamento
        const pointItems = itens
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((IdItens : number) => {
            return {
                idPoints,
                IdItens
            };
        });
    
        // Insere relacionamentos
        await trx('points_itens').insert(pointItems);

    
        // Commita
        await trx.commit();

        // Retorna Json com Dados do Point cadastrado
        return response.json({
            id: idPoints,
            ... point,
        });
        
    }

    // item unico
    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({Message:'Point not found.'})
        }

        
        const serealizedItems = {
            ... point,
            image_url: `http://192.168.15.3:3333/uploads/${point.image}`,
        }
        
        const itens = await knex('itens')
            .join('points_itens','itens.id','=','points_itens.IdItens')
            .where('points_itens.idPoints',id)
            .select('itens.name');
        
        return response.json({point: serealizedItems, itens})
    
    }
    
}

export default PointsController;