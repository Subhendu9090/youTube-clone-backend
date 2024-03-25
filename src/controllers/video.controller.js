import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudenary.js";
import { Video } from "../models/video.model.js";


const getAllVideos = asyncHandeler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

})

const publishAVideo = asyncHandeler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => field.trim() === "")) {
        throw new ApiError(400, "please provide title and description")
    }

    const videoLocalPath = req.fields?.videoFile[0]?.path
    const thumbnailPath = req.fields?.thumbnail[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, " video file is required")
    }
    if (!thumbnailPath) {
        throw new ApiError(400, " thumbnail file is required")
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailPath);

    if (!videoFile?.url) {
        throw new ApiError(400, " video url is not found")
    }
    if (!thumbnailFile?.url) {
        throw new ApiError(400, " thumbnail url is not found")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnailFile.url,
        duration: videoFile.duration,
        owner: req.user._id,
        isPublished: false
    })

    const uploadedVideo = Video.findById(video._id)

    if (!uploadedVideo) {
        throw new ApiError(500, " video uploaded is unsuccessful please try again")
    }

    return res.status(200)
        .json(new ApiResponse(200, video, "video uploaded successfully"))

})

const getVideoById = asyncHandeler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "videoId is mising")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "Invalid userId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is not found")
    }

    return res.status(200).json(new ApiResponse(200, video, "video details fetched"))

})

const updateVideo = asyncHandeler(async (req, res) => {
    const { title, description } = req.body
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id is not valid")
    }
    if (!(title && description)) {
        throw new ApiError(400, " please provide all data")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is missing")
    }

    if (video?.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, " you are not able to update the video")
    }

    const thumnailLocalpath = req.file?.path;
    if (!thumnailLocalpath) {
        throw new ApiError(400, "thumbnail path is missing")
    }

    const thumbnail = await uploadOnCloudinary(thumnailLocalpath)

    if (!thumbnail) {
        throw new ApiError(400, "thumbnail is missing")
    }

    const updatedvideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        { new: true }
    )

    if (!updatedvideo) {
        throw new ApiError(400, "video updation unsuccessfull please try again")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedvideo, "video updated successfully"))
})

const deleteVideo = asyncHandeler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video id is not avalable")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id is not valid")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is not find")
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, " you are not able to delete the video")
    }

    const deletedvideo = await Video.findByIdAndDelete(video._id)

    if (!deletedvideo) {
        throw new ApiError(400, "video is not deleted please try again")
    }

    return res.status(200)
        .json(200, {}, "video deleted successfully")

})

const toogleVideo = asyncHandeler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id is not valid")
    }

  const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "video is not available")
    }

    if (!video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "you are not able to toogle the video")
    }

    const publishedvideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {
            new: true
        }
    )

    if (!publishedvideo) {
        throw new ApiError(400, "operation failed please try again")
    }

    return res.status(200)
        .json(new ApiResponse(200, { isPublished: publishedvideo.isPublished }, "video published successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    toogleVideo
}