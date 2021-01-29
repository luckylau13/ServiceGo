import { Router } from 'express';
import {
  postPayment,
  getPaymentPage,
  cancelPayment,
  sharePayment,
  getServiceProviderPayment,
  paypalPayment,
  cancelProviderPayment,
  shareProviderPayment
} from '../controllers/payment.controller';
import { isLoggedIn } from '../middlewares/auth';

export const paymentRouter = Router();

paymentRouter
  .route('/')
  .get(isLoggedIn, getPaymentPage)
  .post(isLoggedIn, postPayment);

// paymentRouter.route('/provider').get(isLoggedIn, getServiceProviderPayment);
paymentRouter.route('/paypal').post(isLoggedIn, paypalPayment);
// cancelProviderPayment for user
paymentRouter.route('/cancelPayment/:email').post(isLoggedIn, cancelPayment);
// Share the payment for for user
paymentRouter.route('/sharePayment/:userEmail').post(isLoggedIn, sharePayment);

//cancel the service provider payment
paymentRouter
  .route('/cancelProviderPayment/:email')
  .post(isLoggedIn, cancelProviderPayment);
//share the service provider invoice
paymentRouter
  .route('/shareProviderPayment/:userEmail')
  .post(isLoggedIn, shareProviderPayment);
