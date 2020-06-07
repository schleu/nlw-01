import express from 'express';
import PointController from './controllers/PointsController';
import ItemController from './controllers/ItensController';
import multer from 'multer'
import {celebrate, Joi} from 'celebrate'

import multerConfig from './config/multer'

const pointController = new PointController();
const itemController = new ItemController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/itens', itemController.index);

routes.post('/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name:       Joi.string().required(),
            email:      Joi.string().required().email(),
            whatsapp:   Joi.number().required(),
            latitude:   Joi.number().required(),
            longitude:  Joi.number().required(),
            city:       Joi.string().required(),
            uf:         Joi.string().required().max(2),
            itens:      Joi.string().required()
        }),    
    },
    {
        abortEarly: false
    }),
    pointController.create);

routes.get('/points/', pointController.index);
routes.get('/points/:id', pointController.show);

export default routes;