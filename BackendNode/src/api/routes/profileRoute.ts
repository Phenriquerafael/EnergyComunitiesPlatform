import { Router } from 'express';
import config from '../../../config';
import IProfileController from '../../controllers/IControllers/IProfileController';
import { Container } from '../../container';
import { celebrate, Joi, errors } from 'celebrate';

const route = Router();

export default (app: Router) => {
  const ctrl = Container.get(config.controllers.profile.name) as IProfileController;

  if (!ctrl || typeof ctrl.createProfile !== 'function') {
    throw new Error(`ProfileController not properly loaded: ${JSON.stringify(ctrl)}`);
  }

  route.post(
    '/',
    celebrate(
      {
        body: Joi.object({
          prosumerId: Joi.string().required(),
          date: Joi.string().required(),
          intervalOfTime: Joi.string().required(),
          numberOfIntervals: Joi.number().required(),
          stateOfCharge: Joi.string().required(),
          energyCharge: Joi.string().required(),
          energyDischarge: Joi.string().required(),
          photovoltaicEnergyLoad: Joi.string().required(),
          boughtEnergyAmount: Joi.string().required(),
          boughtEnergyPrice: Joi.string().optional(),
          soldEnergyAmount: Joi.string().required(),
          soldEnergyPrice: Joi.string().optional(),
          peerOutputEnergyLoad: Joi.string().required(),
          peerOutPrice: Joi.string().optional(),
          peerInputEnergyLoad: Joi.string().required(),
          peerInPrice: Joi.string().optional(),
          profileLoad: Joi.string().required(),
        }).unknown(true),
      },
      { abortEarly: false },
    ),
    (req, res, next) => ctrl.createProfile(req, res, next),
  );

  route.post(
    '/optimize-results',
    celebrate({
      body: Joi.object({
        total_objective_value: Joi.string().optional(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        description: Joi.string().optional(),
        communityId: Joi.string().optional(),
        active_attributes: Joi.array()
          .items(
            Joi.object({
              prosumerId: Joi.string().required(),
              profileLoad: Joi.boolean().required(),
              stateOfCharge: Joi.boolean().required(),
              photovoltaicEnergyLoad: Joi.boolean().required(),
            }),
          )
          .optional(),
        detailed_results: Joi.array().items(
          Joi.object({
            DateTime: Joi.string().required(),
            Time_Step: Joi.number().required(),
            Prosumer: Joi.string().required(),
            P_buy: Joi.string().required(),
            P_sell: Joi.string().required(),
            SOC: Joi.string().required(),
            P_ESS_ch: Joi.string().required(),
            P_ESS_dch: Joi.string().required(),
            P_PV_load: Joi.string().required(),
            /* P_PV_ESS: Joi.string().required(), */
            P_Peer_out: Joi.string().required(),
            P_Peer_in: Joi.string().required(),
            P_Load: Joi.string().required(),
          }),
        ),
      }),
    }),
    (req, res, next) => {
      /* console.log('Request body:', req.body); */
      ctrl.createFromOptimizationResults(req, res, next);
    },
  );

  route.patch(
    '/',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        userId: Joi.string().optional(),
        intervalOfTime: Joi.string().optional(),
        numberOfIntervals: Joi.number().optional(),
        stateOfCharge: Joi.string().optional(),
        photovoltaicEnergyLoad: Joi.string().optional(),
        boughtEnergyAmount: Joi.string().optional(),
        boughtEnergyPrice: Joi.string().optional(),
        soldEnergyAmount: Joi.string().optional(),
        soldEnergyPrice: Joi.string().optional(),
        profileLoad: Joi.string().optional(),
      }),
    }),
    (req, res, next) => ctrl.updateProfile(req, res, next),
  );

  route.get('/id/:id', (req, res, next) => ctrl.getProfile(req, res, next));

  route.get('/all', (req, res, next) => ctrl.findAll(req, res, next));

  route.get('/prosumer/:id', (req, res, next) => ctrl.findByProsumerId(req, res, next));

  route.get('/community/:id', (req, res, next) => ctrl.findByCommunityId(req, res, next));

  route.get('/community/:communityId/simulation/:simulationId', (req, res, next) =>
    ctrl.findByCommunityIdAndSimulationId(req, res, next),
  );

  route.get('/prosumer/:prosumerId/simulation/:simulationId', (req, res, next) =>
    ctrl.findByProsumerIdAndSimulationId(req, res, next),
  );

  route.get('/simulation/:simulationId', (req, res, next) => ctrl.findBySimulationId(req, res, next));

  route.delete(
    '/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.deleteProfile(req, res, next),
  );

  route.delete(
    '/community/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.deleteByCommunityId(req, res, next),
  );

  route.delete(
    '/prosumer/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.deleteByProsumerId(req, res, next),
  );

  route.get('/simulationStats/:id/', (req, res, next) => ctrl.getSimulationStats(req, res, next));

  app.use('/profiles', route);

  // Middleware de erro do celebrate
  app.use(errors());
};
