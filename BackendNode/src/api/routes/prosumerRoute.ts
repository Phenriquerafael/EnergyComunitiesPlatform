import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import IProsumerController from "../../controllers/IControllers/IProsumerController";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/prosumers', route);

  const ctrl = Container.get(config.controllers.prosumer.name) as IProsumerController;  

  if (!ctrl || typeof ctrl.createProsumer !== 'function') {
    throw new Error(`ProsumerController not properly loaded: ${JSON.stringify(ctrl)}`);
  }

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                batteryId: Joi.string().required(),
                communityId: Joi.string().optional(),
            }),}),
        (req, res, next) => ctrl.createProsumer(req, res, next)
    );

    route.patch(
        '/',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                userId: Joi.string().optional(),
                batteryId: Joi.string().optional(),
                communityId: Joi.string().optional(),
            }),}),
        (req, res, next) => ctrl.updateProsumer(req, res, next)
    );

    route.get(
        '/id/:id',
        (req, res, next) => ctrl.getProsumer(req, res, next)
    );

    route.get(
        '/all',
        (req, res, next) => ctrl.findAll(req, res, next)
    );

    route.get(
        '/all2',
        (req, res, next) => ctrl.findAll2(req, res, next)
    );

    route.get(
        '/community/:id',
        (req, res, next) => ctrl.findByCommunityId(req, res, next)
    );

    route.get(
        '/user/:id',
        (req, res, next) => ctrl.findByUserId(req, res, next)
    );

    route.get(
        '/battery/:id',
        (req, res, next) => ctrl.findByBatteryId(req, res, next)
    );    
    
    route.delete(
        '/:id',
        (req, res, next) => ctrl.deleteProsumer(req, res, next)
    );

}