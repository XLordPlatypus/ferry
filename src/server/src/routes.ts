import {app} from "./main";
import customerRouter from "./controllers/customer/customerController";
import authenticationRouter from "./controllers/authenticationController";
import tripRouter from "./controllers/tripController";
import {isAuthenticated} from "./authentication/auth";
import accountRouter from "./controllers/account/accountController";
import reservationRouter from "./controllers/reservationController/reservationController";
import sizeController from "./controllers/sizeController";
import myBookingsController from "./controllers/myBookingsController";

export const setupRoutes = () => {
    app.use('/auth', authenticationRouter)
    app.use('/customer', isAuthenticated, customerRouter)
    app.use('/trip', tripRouter)
    app.use('/account', isAuthenticated, accountRouter)
    app.use('/reservation', reservationRouter)
    app.use('/vehicleSize', sizeController)
    app.use('/myBookings', isAuthenticated, myBookingsController)
}