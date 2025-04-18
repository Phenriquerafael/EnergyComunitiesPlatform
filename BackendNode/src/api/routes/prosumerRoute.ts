import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import IProsumerController from "../../controllers/IControllers/IProsumerController";

const route = Router();

export default (app: Router) => {
  app.use('/roles', route);

  const ctrl = Container.get(config.controllers.prosumer.name) as IProsumerController;  

  if (!ctrl || typeof ctrl.createProsumer !== 'function') {
    throw new Error(`ProsumerController not properly loaded: ${JSON.stringify(ctrl)}`);
  }

    route.post(
        '/',
        (req, res, next) => ctrl.createProsumer(req, res, next)
    );

    route.put(
        '/',
        (req, res, next) => ctrl.updateProsumer(req, res, next)
    );

    route.get(
        '/:id',
        (req, res, next) => ctrl.getProsumer(req, res, next)
    );

    route.get(
        '/all',
        (req, res, next) => ctrl.findAll(req, res, next)
    );

    route.get(
        '/user/:id',
        (req, res, next) => ctrl.findByUserId(req, res, next)
    );

    route.get(
        '/battery/:id',
        (req, res, next) => ctrl.findByBatteryId(req, res, next)
    );


}