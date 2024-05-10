import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user input from frontend
  //validate user input(not empty)
  //check if user already exists: username, email
  //check images, avator
  //upload them to cloudinary, avator
  //create user object - create entry in database
  //remove password and refreshToken from response
  //check for user creation
  //return res

  const { username, email, fullname, password } = req.body;
  console.log("email : ", email);

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(409, "User with that username or email already exists");
  }

  const avatorLocalPath = req.files?.avator[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatorLocalPath) {
    throw new ApiError(400, "Avator is required");
  }

  const avator = await uploadOnCloudinary(avatorLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avator) {
    throw new ApiError(400, "Avator upload failed");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avator: avator.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );

});

export { registerUser };
