import { Router } from "express";
import config from "../../../config";
import IProfileController from "../../controllers/IControllers/IProfileController";
import { Container } from "../../container";

const route = Router();

export default (app: Router) => {
  app.use('/profiles', route);

    const ctrl = Container.get(config.controllers.profile.name) as IProfileController;
    
    
    if (!ctrl || typeof ctrl.createProfile !== 'function') {
        throw new Error(`ProfileController not properly loaded: ${JSON.stringify(ctrl)}`);
    }

    route.post(
        '/',
        (req, res, next) => ctrl.createProfile(req, res, next)
    );

    route.put(
        '/',
        (req, res, next) => ctrl.updateProfile(req, res, next)
    );

    route.get(
        '/:id',
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