import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body


    if(!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const newTweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    
    return res
    .status(201)
    .json(new ApiResponse(201, newTweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {

    const {page = 1, limit = 10} = req.query

    const tweets = await Tweet
    .find({owner: req.user._id})
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({createdAt: -1})
    .populate({ path: "owner", select: "username" })
    .lean()


    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {

    const {tweetId} = req.params
    const {content} = req.body

    if(!tweetId?.trim()) {
        throw new ApiError(400, "tweetId is required")
    }

    if(!content?.trim()) {  
        throw new ApiError(400, "Content is required")
    }       

    const tweet = await Tweet.findById(tweetId)

    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }   

    if(tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {

    const {tweetId} = req.params    

    if(!tweetId?.trim()) {
        throw new ApiError(400, "tweetId is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}