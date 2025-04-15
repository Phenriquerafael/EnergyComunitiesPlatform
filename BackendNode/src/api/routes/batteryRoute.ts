import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import IBatteryController from "../../controllers/IControllers/IProsumerBatteryController";

const route = Router();

export default (app: Router) => {
  app.use('/prosumerBatteries', route);
  const ctrl = Container.get(config.controllers.battery.name) as IBatteryController;

    if (!ctrl || typeof ctrl.createProsumerBattery !== 'function') {
        throw new Error(`ProsumerBatteryController not properly loaded: ${JSON.stringify(ctrl)}`);
    }

    route.post(
        '/',
        (req, res, next) => ctrl.createProsumerBattery(req, res, next)
    );

    route.put(
        '/',
        (req, res, next) => ctrl.updateProsumerBattery(req, res, next)
    );

    route.get(
        '/:id',
        (req, res, next) => ctrl.getProsumerBattery(req, res, next)
    );

    route.get(
        '/all',
        (req, res, next) => ctrl.findAll(req, res, next)
    );
    
}