import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import IBatteryController from "../../controllers/IControllers/IBatteryController";
import { celebrate, Joi, Segments } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/batteries', route);
  const ctrl = Container.get(config.controllers.battery.name) as IBatteryController;

    if (!ctrl || typeof ctrl.createBattery !== 'function') {
        throw new Error(`ProsumerBatteryController not properly loaded: ${JSON.stringify(ctrl)}`);
    }


    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                name: Joi.string().optional(),
                description: Joi.string().optional(),
                efficiency: Joi.string().required(),
                maxCapacity: Joi.string().required(),
                initialCapacity: Joi.string().required(),
                maxChargeDischarge: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.createBattery(req, res, next)
    );

    route.patch(
        '/:id',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                name: Joi.string().optional(),
                description: Joi.string().optional(),
                efficiency: Joi.string().optional(),
                maxCapacity: Joi.string().optional(),
                maxChargeDischarge: Joi.string().optional(),
            }),
        }),
        (req, res, next) => ctrl.updateBattery(req, res, next)
    );

    route.post('/batteryList',
        celebrate({
            body: Joi.object({
                batteryList: Joi.array().items(
                    Joi.object({
                    name: Joi.string().optional(),
                    description: Joi.string().optional(),
                    efficiency: Joi.string().required(),
                    maxCapacity: Joi.string().required(),
                    initialCapacity: Joi.string().required(),
                    maxChargeDischarge: Joi.string().required(),})
                ),
            }),
        }),
        (req, res, next) => ctrl.createBatteries(req, res, next)

    );

    route.delete(
        '/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.deleteBattery(req, res, next)
    );

    route.get(
        'id/:id',
        (req, res, next) => ctrl.getBattery(req, res, next)
    );

    route.get(
        '/all',
        (req, res, next) => ctrl.findAll(req, res, next)
    );
    
}