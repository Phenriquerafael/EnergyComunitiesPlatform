import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import battery from './routes/batteryRoute';
import prosumer from './routes/prosumerRoute';
import profile from './routes/profileRoute';
import communityManager from './routes/communityManagerRoute';
import community from './routes/communityRoute';
import simulation from './routes/simulationRoute';


export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	battery(app);
	prosumer(app);
	profile(app);
	communityManager(app);
	community(app);
	simulation(app);
	return app
}