// importing the required keys.
import api from '../../apis';
const express = require('express');
const app = express();
//importing payment model.
import { Payment } from '../models/payment.model';
//importing the stripe and it's API key but the API key must be hidden later
const stripe = require('stripe')('sk_test_60kRokwEOZtIS3BGVFXimgaD00F3H1hvpa');

import paypal from 'paypal-rest-sdk';
//importing all the functions from paymentController.
import {
  sendPaymentReceipt,
  sharePaymentRecepit
} from '../controllers/sendMail.controller';
import { userInfo } from 'os';

// ClientID and ClientSecret
paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: api.PAYPAL_ID,
  client_secret: api.PAYPAL_SECRET
});
// Payment history of the Service Provider
export const getServiceProviderPayment = async (req, res) => {
  const currentUser = req.user.name;
  const currentUserEmail = req.user.email;
  try {
    //Finds all the payment hisory associated with that email and stores in the provided email.
    const paymentHistory = await Payment.find({
      providerEmail: currentUserEmail
    });
    //If failed, it will show the message as Failed to the view.
    if (!paymentHistory) {
      return res.render('providerpayment', {
        message: 'Failed'
      });
    }
    //After successfull seeing the payment history then it renders payment page along with paymentHistory and current user.
    res.render('providerpayment', {
      paymentHistory,
      currentUser,
      currentUserEmail
    });
  } catch (error) {
    //If server fails then it sends an error.
    res.status(404).send(error);
  }
};
//Making a payment from Paypal
export const paypalPayment = async (req, res) => {
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      // return_url: 'http://localhost:3000/user/payment',
      // cancel_url: 'http://localhost:3000/user/payment'
      return_url: 'https://service-go.herokuapp.com/user/payment',
      cancel_url: 'https://service-go.herokuapp.com/user/payment'

      // cancel_url: 'https://service-go.herokuapp.com/user/payment'
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Service Go',
              sku: '001',
              price: '20.00',
              currency: 'AUD',
              quantity: 1
            }
          ]
        },
        amount: {
          currency: 'AUD',
          total: '20.00'
        },
        description: 'Book your favourite Service Provider'
      }
    ]
  };
  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
  try {
    //Saving the data to the mongo db all the payment data from paypal
    const payment = new Payment({
      customerEmail: req.user.email,
      paymentType: 'paypal',
      customerName: req.user.name,
      providerEmail: 'luitelpramish7@gmail.com', // Service Provider email
      providerName: 'Sharad', //Service Provider Name
      amount: 20,
      paymentStatus: 'Paid',
      serviceName: 'Cleaner',
      serviceLocation: 'Sydney',
      serviceDate: '30 Spetember 2019'
    });
    await payment.save();
    // Sending the payment receipt to the service provider
    sendPaymentReceipt(
      'luitelpramish7@gmail.com',
      'https://pay.stripe.com/receipts/acct_1F6zKOKQyyZnJyy5/ch_1FLZNDKQyyZnJyy5YgNclupo/rcpt_FrHxph6StoKJqIzqFmkjro0eIwgFOzI', // payment receipt
      'luitelpramish7@gmail.com'
    ); //I have to change the service provider email
  } catch (error) {
    res.send(error);
  }
};

app.get('/', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: '25.00'
        }
      }
    ]
  };
  paypal.payment.execute(paymentId, execute_payment_json, function(
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      try {
        // var ss = req.session; //using session to get service name, service location, service date
        res.redirect('/user/payment');
      } catch (error) {
        res.send(error);
      }
    }
  });
});
// Payment history of the particular user
export const getPaymentPage = async (req, res) => {
  const currentUser = req.user.name;
  const currentUserEmail = req.user.email;
  const currentUserID = req.user._id;
  try {
    //Finds all the payment hisory associated with that email and stores in the provided email.
    const paymentHistory = await Payment.find({
      customerEmail: req.user.email
    });
    //If failed, it will show the message as Failed to the view.
    if (!paymentHistory) {
      return res.render('payment', {
        message: 'Failed'
      });
    }
    //After successfull seeing the payment history then it renders payment page along with paymentHistory and current user.
    res.render('payment', { paymentHistory, currentUser, currentUserEmail });
  } catch (error) {
    //If server fails then it sends an error.
    res.status(404).send(error);
  }
};
//Cancelling the payment
export const cancelPayment = async (req, res) => {
  try {
    //will look after all the payment made by the provided user email and remove it.
    const _ = await Payment.findOneAndRemove({
      customerEmail: req.params.email
    });
    //After successfull payment it will redirect to payment page.
    res.redirect('/user/payment');
  } catch (error) {
    //If server fails then it will send the error.
    res.status(404).send(error);
  }
};
export const cancelProviderPayment = async (req, res) => {
  try {
    //will look after all the payment made by the provided user email and remove it.
    const _ = await Payment.findOneAndRemove({
      providerEmail: req.user.email
    });
    //After successfull payment it will redirect to payment page.
    res.redirect('/user/service');
  } catch (error) {
    //If server fails then it will send the error.
    res.status(404).send(error);
  }
};
//Making a payment from card
export const postPayment = async (req, res) => {
  var ss = req.session; //using session to get service name, service location, service date
  try {
    const payment = new Payment({
      customerEmail: req.user.email,
      paymentType: 'card',
      customerName: req.user.name,
      providerEmail: 'luitelpramish7@gmail.com', // Service Provider email
      providerName: 'Sharad', //Service Provider Name
      amount: 20,
      paymentStatus: 'Paid',
      serviceName: ss.serviceType,
      serviceLocation: ss.serviceLocation,
      serviceDate: ss.date
    });
    //creating a customer in stripe for admin.
    const customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    });
    //saves the payment into the database
    await payment.save();
    //if we can create customer in stripe then
    if (customer) {
      let stripeResult = await stripe.charges.create({
        amount: 2000,
        description: 'ServiceGo',
        currency: 'Aud',
        customer: customer.id,
        receipt_email: req.body.stripeEmail
      });
      // if we can create customer in stripe then we can send the payment receipt to the customer and share as well.
      if (stripeResult.status == 'succeeded') {
        try {
          await sendPaymentReceipt(
            req.body.stripeEmail,
            'https://pay.stripe.com/receipts/acct_1F6zKOKQyyZnJyy5/ch_1FLZNDKQyyZnJyy5YgNclupo/rcpt_FrHxph6StoKJqIzqFmkjro0eIwgFOzI', // payment receipt
            req.user.email
          );
          // await sharePaymentRecepit(  // I don't have to share the email here.
          //   req.body.stripeEmail,
          //   stripeResult.receipt_url,
          //   'luitelpramish7@gmail.com' //This must be dynamic
          // );
        } catch (error) {
          res.status(404).send(error);
        }
        // req.session.destroy();
        //After successful payment it will redirect to payment page
        res.redirect('/user/payment');
      }
    }
  } catch (error) {
    //any error it will send the error.
    res.status(404).send(error);
  }
};

//sharing the payment receipt to other friends
export const sharePayment = async (req, res) => {
  try {
    await sharePaymentRecepit(
      req.user.email, //I have to put the sender email.
      'https://pay.stripe.com/receipts/acct_1F6zKOKQyyZnJyy5/ch_1FLZNDKQyyZnJyy5YgNclupo/rcpt_FrHxph6StoKJqIzqFmkjro0eIwgFOzI', // payment receipt
      'luitelpramish7@gmail.com' // sender email receiver and has to be changed.
    );
    res.redirect('/user/payment');
  } catch (error) {
    console.log(error);
    res.redirect('/user/payment');
  }
};

//sharing the payment receipt from provider to other friends
export const shareProviderPayment = async (req, res) => {
  try {
    const userEmail = req.params.userEmail; //The userEmail to be shared and is not getting anything

    const paymentReceipt = 'Hello this is a link to payment invoice'; //I have to get the invoice url
    await sharePaymentRecepit(
      req.user.email, //I have to put the sender email.
      'https://pay.stripe.com/receipts/acct_1F6zKOKQyyZnJyy5/ch_1FLZNDKQyyZnJyy5YgNclupo/rcpt_FrHxph6StoKJqIzqFmkjro0eIwgFOzI', // payment receipt
      'luitelpramish7@gmail.com' // sender email receiver and has to be changed.
    );
    res.redirect('/user/service');
  } catch (error) {
    console.log(error);
    res.redirect('/user/service');
  }
};
