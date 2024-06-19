import { Controller, Get, Post, Body, Query, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { LinkPortalDto } from './dto/link-portal.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  /**
   * When the user clicks the frontend button, this route is triggered
   * with parameters from createPaymentDto.
   *
   * This method will create a session and redirect the user
   * to Stripe to complete the payment.
   */
  @Post()
  @Redirect('https://docs.nestjs.com', 302)
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const url = await this.paymentService.create(createPaymentDto);
    return { url };
  }

  /**
   * When the payment is successfully made, this success route is called.
   * This route will capture the session ID, query the database to identify
   * this session, check the current status of this session in Stripe,
   * and update the database according to the latest status.
   *
   * Finally, it redirects to a desired URL.
   */
  @Get('success')
  @Redirect('https://docs.nestjs.com', 302)
  async paymentSuccess(@Query() query: any) {
    await this.paymentService.successPayment(query.session_id);
    return { url: 'https://tnovato.com' };
  }

  /**
   * When the user clicks the cancel (back) button, this canceled route is called.
   *
   * The business rule varies from project to project. Here, for example, I can
   * capture the sessionId, query the session in the database, and update
   * its status to canceled.
   *
   * Finally, it can also redirect to a system URL, whether static or dynamic.
   */
  @Get('canceled')
  @Redirect('https://tnovato.com', 302)
  async paymentCanceled(@Query() query: any) {
    return this.paymentService.canceledPayment(query.session_id);
  }

  /**
   * This route receives the sessionId to generate the portal link. This portal
   * manages the financial aspects, allowing actions like canceling the current plan,
   * changing payment methods (e.g., card), and viewing all past charges.
   *
   * Ideally, the customerId should be passed as a parameter, where this customer
   * should have been registered previously. However, from the sessionId, it is also possible
   * to retrieve the customerId.
   */
  @Post('portal')
  @Redirect('https://tnovato.com', 302)
  async generateLinkPortal(@Body() linkPortalDto: LinkPortalDto) {
    const url = await this.paymentService.generateLinkPortal(linkPortalDto);
    return { url };
  }
}
