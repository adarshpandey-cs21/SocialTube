import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation not empty fields
    //check if user already exists-email,username
    //check for image and avtar
    //upload image to cloudinary ,avatar
    //create user object - create user in db
    //remove password and refresh token from user object
    //check for user creation
    //return result

    const { fullName, email, password, username } = req.body;
    if([fullName,email,password,username].some((field)=>field?.trim()==='')){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser= await User.findOne({
        $or: [{email}, {username}]
    });

    if(existedUser){
        throw new ApiError(409, "User with this email or username already exists");
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files&& Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files?.coverImage[0]?.path;
    }


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Failed to upload image");
    }

   const user=await User.create({
        fullName,
        email,
        password,
        username:username.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverImage?.url||""
    });

    const createdUser=await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User Registered successfully"));

});


export { registerUser };