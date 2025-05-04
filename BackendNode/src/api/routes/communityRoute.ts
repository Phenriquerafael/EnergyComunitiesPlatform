import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import ICommunityController from "../../controllers/IControllers/ICommunityController";
import { celebrate, Joi, Segments } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/community', route);
  const ctrl = Container.get(config.controllers.battery.name) as ICommunityController;

    if (!ctrl || typeof ctrl.createCommunity !== 'function') {
        throw new Error(`CommunityController not properly loaded: ${JSON.stringify(ctrl)}`);
    }


    route.post(
        '/',
        celebrate({
            body: Joi.object({
                name: Joi.string().optional(),
                description: Joi.string().optional(),
            }),
        }),
        (req, res, next) => ctrl.createCommunity(req, res, next)
    );

    route.patch(
        '/',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                name: Joi.string().optional(),
                description: Joi.string().optional(),
            }),
        }),
        (req, res, next) => ctrl.updateCommunity(req, res, next)
    );

    route.get(
        'id/:id',
        (req, res, next) => ctrl.getCommunity(req, res, next)
    );

    route.get(
        '/all',
        (req, res, next) => ctrl.findAll(req, res, next)
    );
    
}