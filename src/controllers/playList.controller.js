import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PlayList } from "../models/playList.model.js"
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";


const createPlaylist = asyncHandeler(async (req, res) => {
    const { name, description } = req.body;

    if (!(name && description)) {
        throw new ApiError(400, " name and description required")
    }

    const playlist = await PlayList.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!playlist) {
        throw new ApiError(400, "playlist create failed try again")
    }

    return res.status(200)
        .json(new ApiResponse(200, playlist, "playlist create successfully"))
})

const addVideoToPlaylist = asyncHandeler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!(isValidObjectId(playlistId) && isValidObjectId(videoId))) {
        throw new ApiError(400, "invalid playlistId and videoId")
    }

    const playlist = await PlayList.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(400, " playlist not found")
    }
    if (!video) {
        throw new ApiError(400, " video not found")
    }

    if (playlist.owner.toString() && video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, " only owner can add owned video in playlist")
    }

    const updatedPlayList = await PlayList.findByIdAndUpdate(playlist?._id,
        {
            $addToSet: {
                video: videoId
            }
        },
        { new: true }
    )

    if (!updatedPlayList) {
        throw new ApiError(400, "video not added please try again")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedPlayList, "video added successfully"))
})

const removeVideoFromPlaylist = asyncHandeler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid playlist Id or invalid video Id")
    }

    const video = await PlayList.findById(playlistId);
    const playlist = await Video.findById(videoId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }
    if (!video) {
        throw new ApiError(400, "video not found")
    }

    if (video.owner.toString() && playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "only owner can delete the video from playlist")
    }

    const updatedPlayList = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videoId
            }
        },
        { new: true }
    )

    return res.status(200)
        .json(new ApiResponse(200, { updatedPlayList }, "removed video successfully"))
})

const updatePlaylist = asyncHandeler(async(req,res)=>{
    const {name , description} = req.body;
    const {playlistId} = req.params

    if (!name || !description) {
        throw new ApiError(400,"please provide name or description for update")
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"invalid playlist id")
    }

   const playlist = await PlayList.findById(playlistId)

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400,'only owner can modify their playlist')
    }
   const updatePlaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description
            }
        },
        {new: true}
    )
    return res
           .status(200)
           .json(new ApiResponse(200,updatePlaylist,'playlist updated successfully'))
})

const deletePlaylist = asyncHandeler(async(req,res)=>{
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"playlist id is invalid")
    }
    const playlist = PlayList.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400,"playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400," only owner can modify their playlist")
    }

    await PlayList.findByIdAndDelete(playlist._id)

    return res.status(200)
    .json(new ApiResponse(200,{},"playlist deleted successfully"))

})

const getPlaylistById = asyncHandeler(async(req,res)=>{
    const {playlistId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"invalid playlist Id")
    }

    const playlist = PlayList.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "playlist not found")
    }

// aggregation pipeline


})

const getUserPlaylist = asyncHandeler(async(req,res)=>{
    const {userId} = req.body

    if (!isValidObjectId(userId)) {
        throw new ApiError(400,"invalid user Id")
    }

    // aggregation pipeline

}
)

export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylist
}