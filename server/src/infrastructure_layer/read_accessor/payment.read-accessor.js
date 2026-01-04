export class PaymentReadAccessor {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async isPaymentSuccessful(userId, courseId) {
    const count = await this.prisma.payment.count({
      where: {
        userId,
        courseId,
        status: "SUCCESS",
      },
    });

    // Return true if there is at least one successful payment for this user/course
    console.log(`[PaymentReadAccessor] user=${userId} course=${courseId} successPayments=${count}`);
    return count > 0;
  }
}
