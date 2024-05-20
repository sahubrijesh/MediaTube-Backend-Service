import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = -1 } = req.query;

    // Construct the filter/search conditions based on the query if provided
    const searchCondition = query ? { $text: { $search: query } } : {};

    // Fetch the videos from the database with pagination and sorting
    const videos = await Video
        .find(searchCondition)
        .populate({ path: "owner", select: "username" })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ [sortBy]: sortType })
        .lean();

    // Send the response with the videos
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));


})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail are required")
    }
    const videoCloudinaryPath = await uploadOnCloudinary(videoLocalPath)
    const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoCloudinaryPath || !thumbnailCloudinaryPath) {
        throw new ApiError(500, "Something went wrong while uploading video and thumbnail")
    }
    
    const videoDuration = await videoCloudinaryPath.duration;

    const newVideo = await Video.create({
        videoFile: videoCloudinaryPath.url,
        thumbnail: thumbnailCloudinaryPath.url,
        title,
        description,
        isPublished : true,
        owner : req.user._id,
        duration : videoDuration?videoDuration: 0
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, newVideo, "Video published successfully")
    )
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId);

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video found successfully"));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const { title, description } = req.body

    const thumbnailLocalPath = req.file?.path

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is required")
    }

    if(!thumbnailLocalPath || !title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnailCloudinaryPath) {
        throw new ApiError(500, "Something went wrong while uploading thumbnail")
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnailCloudinaryPath.url
            }
        },
        {
            new: true
        }
    )   

    if(!updatedVideo) {
        throw new ApiError(404, "Video not found")
    }   

    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }


    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    await Video.findByIdAndDelete(videoId)


    return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"))

    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is required");
    }

    const {toggleStatus} = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    // Toggle the publication status
    video.isPublished = toggleStatus? toggleStatus : !video.isPublished;

    // Save the changes to the video document
    const updatedVideo = await video.save();

    // Send the response with the updated video details
    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video publication status toggled successfully"));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}