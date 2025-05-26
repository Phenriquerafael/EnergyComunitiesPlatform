/* 
Agora sabendo que este é a route do backend das communities 'import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import ICommunityController from "../../controllers/IControllers/ICommunityController";
import { celebrate, Joi, Segments } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use('/communities', route);

  const ctrl = Container.get(config.controllers.community.name) as ICommunityController;

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
    
}' e esta do communityManager 'import { Router } from "express";
import config from "../../../config";
import { Container } from "../../container";
import  ICommunityManagerController  from "../../controllers/IControllers/ICommunityManagerController";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
    app.use('/communityManager', route);
    const ctrl = Container.get(config.controllers.communityManager.name) as ICommunityManagerController;

    if (!ctrl || typeof ctrl.createCommunityManager !== 'function') {
        throw new Error(`CommunityManagerController not properly loaded: ${JSON.stringify(ctrl)}`);
    }

    route.post(
            '/',
            celebrate({
                body: Joi.object({
                    userId: Joi.string().required(),
                    communityId: Joi.string().required(),
                }),}),
            (req, res, next) => ctrl.createCommunityManager(req, res, next)
        );

    route.patch(
            '/',
            celebrate({
                body: Joi.object({
                    id: Joi.string().required(),
                    userId: Joi.string().optional(),
                    batteryId: Joi.string().optional(),
                }),}),
            (req, res, next) => ctrl.updateCommunityManager(req, res, next)
        )

    route.get(
            '/id/:id',
            (req, res, next) => ctrl.getCommunityManager(req, res, next)
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
            '/community/:id',
            (req, res, next) => ctrl.findByCommunityId(req, res, next)
    );

    };' e usando metodos do refine cria (dividindo em componentes de achares pertinente) 
    uma pagina de gestão de communities onde se verifica se o utilizador atual possui communityId, 
    se sim faz a busca da community e se não apresenta um forms para criar a communidade e 
    selecionar os prosumers da lista de prosumers. */