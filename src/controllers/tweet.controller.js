import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { isValidObjectId } from "mongoose";

const createTweet = asyncHandeler(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "please provide the content")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(401, "tweet is not created try again")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "tweet is added successfully"))
})

const updateTweet = asyncHandeler(async (req, res) => {
    const { content } = req.body
    const { tweetId } = req.params

    if (!content) {
        throw new ApiError(400, "please provide tweet content")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, " tweet id is not a valid id")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(400, " tweet is not found")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(402, 'you are not able to update the tweet')
    }

    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )
    if (!newTweet) {
        throw new ApiError(400, "tweet is no created please try again")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "tweet is updated suscessfylly"))
})

const deleteTweet = asyncHandeler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, " tweet id is missing")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(400,"tweet is missing")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "only owner can delete the tweet")
    }

     await Tweet.findByIdAndDelete(tweetId)

    return res
        .status(200)
        .json(200, { tweetId }, "tweet is deleted")
})

const getUserTweets = asyncHandeler((req,res)=>{
    const {userId} = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400,"invalid user id")
    }
})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets
}