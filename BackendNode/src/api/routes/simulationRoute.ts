import { Router } from 'express';
import config from '../../../config';
import { Container } from '../../container';
import ISimulationController from '../../controllers/IControllers/ISimulationController';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/simulations', route);

  const ctrl = Container.get(config.controllers.simulation.name) as ISimulationController;

  if (!ctrl || typeof ctrl.createSimulation !== 'function') {
    throw new Error(`ProsumerController not properly loaded: ${JSON.stringify(ctrl)}`);
  }
  route.post(
    '/',
    celebrate({
      body: Joi.object({
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        description: Joi.string().optional(),
        communityId: Joi.string().required(),
        profileLoad: Joi.boolean().required(),
        stateOfCharge: Joi.boolean().required(),
        photovoltaicEnergyLoad: Joi.boolean().required(),
      }),
    }),
    (req, res, next) => ctrl.createSimulation(req, res, next),
  );

  route.patch(
    '/update/:id',
    celebrate({
      body: Joi.object({
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional(),
        description: Joi.string().optional(),
        communityId: Joi.string().optional(),
        profileLoad: Joi.boolean().optional(),
        stateOfCharge: Joi.boolean().optional(),
        photovoltaicEnergyLoad: Joi.boolean().optional(),
      }),
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.updateSimulation(req, res, next),
  );

  route.get(
    '/id/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.getSimulation(req, res, next),
  );

  route.get('/all', (req, res, next) => ctrl.findAll(req, res, next));

  route.get('/all2', (req, res, next) => ctrl.findAll2(req, res, next));

  route.delete(
    '/id/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.delete(req, res, next),
  );

  route.delete('/all', (req, res, next) => ctrl.deleteAll(req, res, next));
};
