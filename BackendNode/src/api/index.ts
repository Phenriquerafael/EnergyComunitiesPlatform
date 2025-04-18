import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import battery from './routes/batteryRoute';
import prosumer from './routes/prosumerRoute';
import profile from './routes/profileRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	battery(app);
	prosumer(app);
	profile(app);
	
	return app
}