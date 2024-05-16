import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId,comment} = req.body

    if (!videoId?.trim() || !comment?.trim()) {
        throw new ApiError(400, "videoId and comment are required")
    }
    
    const newComment = await Comment.aggregate([
        {
            $match: {
                video: mongoose.Types.ObjectId(videoId),
                owner: mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $set: {
                content: comment
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                content: 1,
                owner: {
                    _id: 1,
                    fullName: 1,
                    userName: 1,
                    avatar: 1
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, newComment[0], "Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params

    if (!commentId?.trim()) {
        throw new ApiError(400, "commentId is required")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: req.body.comment
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if (!commentId?.trim()) {
        throw new ApiError(400, "commentId is required")
    }

    const deletedComment = await Comment.deleteOne(
        {
            _id: commentId
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }