import { Router } from "express";
import config from "../../../config";
import IProfileController from "../../controllers/IControllers/IProfileController";
import { Container } from "../../container";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/profiles', route);

    const ctrl = Container.get(config.controllers.profile.name) as IProfileController;
    
    
    if (!ctrl || typeof ctrl.createProfile !== 'function') {
        throw new Error(`ProfileController not properly loaded: ${JSON.stringify(ctrl)}`);
    }

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                prosumerId: Joi.string().required(),
                intervalOfTime: Joi.string().required(),
                numberOfIntervales: Joi.number().required(),
                stateOfCharge: Joi.string().required(),
                photovoltaicEnergyLoad: Joi.string().required(),
                boughtEnergyAmount: Joi.string().required(),
                boughtEnergyPrice: Joi.string().required(),
                soldEnergyAmount: Joi.string().required(),
                soldEnergyPrice: Joi.string().required(),
                profileLoad: Joi.string().required()
            }),
        }),

        (req, res, next) => ctrl.createProfile(req, res, next)
    );

    route.patch(
        '/',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                prosumerId: Joi.string().optional(),
                intervalOfTime: Joi.string().optional(),
                numberOfIntervales: Joi.number().optional(),
                stateOfCharge: Joi.string().optional(),
                photovoltaicEnergyLoad: Joi.string().optional(),
                boughtEnergyAmount: Joi.string().optional(),
                boughtEnergyPrice: Joi.string().optional(),
                soldEnergyAmount: Joi.string().optional(),
                soldEnergyPrice: Joi.string().optional(),
                profileLoad: Joi.string().optional()
            }),
        }),
        (req, res, next) => ctrl.updateProfile(req, res, next)
    );

    route.get(
        '/id/:id',
        (req, res, next) => ctrl.getProfile(req, res, next)
    );

    route.get(
        '/all',
        (req, res, next) => ctrl.findAll(req, res, next)
    );

    route.get(
        '/user/:id',
        (req, res, next) => ctrl.findByProsumerId(req, res, next)
    );

}