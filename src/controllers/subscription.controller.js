import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if (!channelId?.trim()) {
        throw new ApiError(400, "channel is missing")
    }

    const user = await User.findById(req.user._id)

    if(!user) {
        throw new ApiError(404, "Please login first")
    }

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscription = await Subscription
    .findOne({subscriber: user._id, channel: channelId})

    if(subscription) {
        await Subscription.findByIdAndDelete(subscription._id)
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Unsubscribed successfully"))
    } else {
        const newSubscription = await Subscription
        .create({
            subscriber: user._id,
            channel: channelId
        })
        return res
        .status(200)
        .json(new ApiResponse(200, newSubscription, "Subscribed successfully"))
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params

    if (!subscriberId?.trim()) {
        throw new ApiError(400, "channel is missing")
    }

    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const user = await User.findById(req.user._id)

    if(!user) {
        throw new ApiError(404, "Please login first")
    }   

    const subscriptions = await Subscription
    .find({channel: subscriberId})
    .populate({
        path: "subscriber",
        select: "username"
    })
    .lean() 


    // const subscribersList = await Subscription.aggregate([
    //     {
    //         $match: {
    //             channel: new mongoose.Types.ObjectId(subscriberId)
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "subscriber",
    //             foreignField: "_id",
    //             as: "subscriber"
    //         }   
    //     },
    //     {
    //        $addFields: {
    //            subscriber: {
    //                $first: "$subscriber.username"
    //            }
    //        }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             subscriber: 1
    //         }
    //     }
    // ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribers fetched successfully"))

})
6
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!channelId?.trim()) {
        throw new ApiError(400, "channel id is missing")
    }

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const user = await User.findById(req.user._id)

    if(!user) {
        throw new ApiError(404, "Please login first")
    }

    // if(req.user._id !== channelId) {
    //     throw new ApiError(403, "Unauthorized request")
    // }

    const subscriptions = await Subscription
    .find({subscriber: channelId})
    .populate({
        path: "channel",
        select: "username" 
    })
    .lean();

    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Channels fetched successfully"))     

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}