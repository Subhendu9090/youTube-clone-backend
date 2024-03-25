import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js"
import mongoose, { isValidObjectId } from "mongoose";

const toogleSubscription = asyncHandeler(async (req, res) => {
    const { chhanelId } = req.params

    if (!isValidObjectId(chhanelId)) {
        throw new ApiError(400, "invalid channel objectId")
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user._id,
        channel: chhanelId
    })
    if (isSubscribed) {
        await Subscription.findByIdAndDelete(isSubscribed?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: false }, "unsubscribed successfully"))
    }

    await Subscription.create(
        {
            subscriber: req.user._id,
            channel: chhanelId
        }
    )

    return res.status(200)
        .json(new ApiResponse(200, { subscribed: true }, "subscribed successfully"))
})

const userChannelSubscriber = asyncHandeler(async (req, res) => {
    let { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid object Id")
    }
    channelId = new mongoose.Types.ObjectId(channelId);


})

const userSubscribedChannels = asyncHandeler(async(req,res)=>{
    const {subscriberId}= req.params;

})


export {
    toogleSubscription,
    userChannelSubscriber,
    userSubscribedChannels
}