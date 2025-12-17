export class PaymentReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async isPaymentSuccessful(userId, courseId) {
        const count = await this.prisma.payment.count({
            where:
            {
                userId,
                courseId,
                status: "SUCCESS",
            },
        })

        return count == 1;
    }
}