import prisma from "../../../prisma/client.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.body.authId;
    const { courseId, amount, currency } = req.body;

    if (!userId) return res.status(401).jsend.fail("Unauthorized");
    if (!courseId) return res.status(400).jsend.fail("Missing courseId");

    // Create a successful payment record for simplicity (demo/test flow)
    const payment = await prisma.payment.create({
      data: {
        userId,
        courseId,
        amount: typeof amount === "number" ? amount : 0,
        currency: currency || "VND",
        status: "SUCCESS",
      },
    });

    // Debug log: payment created
    console.log(
      `[payments.checkout] payment created id=${payment.id} user=${payment.userId} course=${payment.courseId} status=${payment.status}`
    );

    res.jsend.success(payment);
  } catch (err) {
    console.error(err);
    res.status(500).jsend.fail(err.message);
  }
};
