import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

import Stripe from 'stripe';
import { LinkPortalDto } from './dto/link-portal.dto';
const stripe = new Stripe('YOUR_KEY', { apiVersion: '2022-11-15' });

const YOUR_DOMAIN = 'http://localhost:3000';

@Injectable()
export class PaymentService {
  async create(createPaymentDto: CreatePaymentDto) {
    const session = await stripe.checkout.sessions.create({
      customer_email: createPaymentDto.email,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: createPaymentDto.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/payment/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/payment/canceled?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    // Here you would save the payment intent to your database
    const paymentIntent = {
      user: createPaymentDto.email,
      price: createPaymentDto.priceId,
      session: session.id,
      status: session.status,
    };

    return session.url;
  }

  async successPayment(sessionId: string) {
    /**
     * Here you would retrieve the session saved in your database when the link was generated,
     * then check the current status and update it in your database according to the new status.
     *
     * Here you can also implement business rules, such as enabling functionalities,
     * sending notifications, etc.
     */

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(
      '🚀 ~ file: payment.service.ts:51 ~ PaymentService ~ successPayment ~ session',
      session,
    );

    // Update in database with the new status.

    return session;
  }

  async canceledPayment(sessionId: string) {
    /**
     * Here you would retrieve the session saved in your database when the link was generated,
     * then check the current status and update it in your database according to the new status.
     *
     * Here you can also implement business rules, such as enabling functionalities, etc.
     */
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update in database with the new status.

    return session;
  }

  async generateLinkPortal(dto: LinkPortalDto) {
    /**
     * Here you would retrieve the session saved in your database when the link was generated,
     * then generate a portal link based on the customerId.
     */
    const session = await stripe.checkout.sessions.retrieve(dto.sessionId);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customer.toString(),
      return_url: 'http://tnovato.com',
    });

    return portalSession.url;
  }
}
