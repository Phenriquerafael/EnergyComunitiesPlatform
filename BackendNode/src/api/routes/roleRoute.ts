import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from '../../container';
import IRoleController from '../../controllers/IControllers/IRoleController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/roles', route);

  const ctrl = Container.get(config.controllers.role.name) as IRoleController;
  console.log('RoleController in route:', ctrl); // Debug: Inspect the ctrl object
  console.log('Has createRole:', typeof ctrl.createRole); // Debug: Check if createRole exists

  if (!ctrl || typeof ctrl.createRole !== 'function') {
    throw new Error(`RoleController not properly loaded: ${JSON.stringify(ctrl)}`);
  }

  route.post('/',
    celebrate({
      body: Joi.object({
        name: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createRole(req, res, next) );

  route.put('/',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required()
      }),
    }),
    (req, res, next) => ctrl.updateRole(req, res, next) );

  route.get('/id/:id',
    celebrate({ 
      params: Joi.object({
        id: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.getRole(req, res, next) );

  route.get('/name/:name',
    celebrate({
      params: Joi.object({
        name: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.findByName(req, res, next) );

  route.get('/all',
    (req, res, next) => ctrl.findAll(req, res, next) );

};