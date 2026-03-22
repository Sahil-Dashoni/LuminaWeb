import stripe from "../config/stripe.js";
import User from "../models/userModel.js";

export const stripeWebhook=async (req, res) => {
    const sig= req.headers['stripe-signature']
    let event
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: `Webhook Error: ${error.message}` })
    }

    if(event.type === 'checkout.session.completed'){
            const session= event.data.object;
            const userId= session.metadata.userId;
            const plan= session.metadata.plan;
            const credits= Number(session.metadata.credits);
            await User.findByIdAndUpdate(userId, plan, {$inc: { credits} })
        }
    return res.status(200).json({ message: "Webhook received successfully" });

}