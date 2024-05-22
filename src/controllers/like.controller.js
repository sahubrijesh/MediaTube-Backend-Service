import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId?.trim()) {
        throw new ApiError(400, "videoId is required")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    const like = await Like.findOne({video: videoId, likedBy: req.user._id})

    if(like) {
        await Like.findByIdAndDelete(like._id)
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Unliked successfully"))
    } else {
        const newLike = await Like
        .create({
            likedBy: req.user._id,
            video: videoId
        })
        return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked successfully"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    

    if(!commentId?.trim()) {
        throw new ApiError(400, "commentId is required")
    }

    const comment = await Comment.findById(commentId)

    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const like = await Like.findOne({comment: commentId, likedBy: req.user._id})

    if(like) {
        await Like.findByIdAndDelete(like._id)
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Unliked successfully"))
    } else {
        const newLike = await Like
        .create({
            likedBy: req.user._id,
            comment: commentId
        })
        return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
 
    if(!tweetId?.trim()) {
        throw new ApiError(400, "tweetId is required")
    }   

    const tweet = await Tweet.findById(tweetId)

    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const like = await Like.findOne({tweet: tweetId, likedBy: req.user._id})

    if(like) {
        await Like.findByIdAndDelete(like._id)
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Unliked successfully"))
    } else {
        const newLike = await Like
        .create({
            likedBy: req.user._id,
            tweet: tweetId
        })
        return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked successfully"))
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likes = await Like
    .find({likedBy: req.user._id})
    .populate("video")
    
    return res
    .status(200)
    .json(new ApiResponse(200, likes, "Liked videos fetched successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}