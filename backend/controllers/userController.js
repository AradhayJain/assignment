import asyncHandler from 'express-async-handler'
import { User } from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'

export const registerUser= asyncHandler(async (req,res)=>{
    const {name,email,password,pic}= req.body
    if(!name ||!email||!password){
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }

    const user=await User.create({
        name,
        email,
        password,
        pic
    })
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id),
            friends:user.friends,
        })
    }
    else{
        res.status(400)
        throw new Error("Invalid user data")
    }

})

export const loginUser= asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(user && (await user.mathPassword(password))){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id),
            friends:user.friends,
            friendRequests:user.friendRequests
        })
    }
    else{
        res.status(401)
        throw new Error("Invalid credentials")

    }
})

export const addFriend= asyncHandler(async (req,res)=>{
    const {userId}=req.params//jisko add karna hai

    const user=await User.findById(req.user._id)
    const friend=await User.findById(userId)
    if(user && friend){
        user.friends.push(friend)
        await user.save()
        res.status(200).json({message:"Friend added"})
    }
    else{
        res.status(400)
        throw new Error("Invalid user")
    }
})

export const sendRequest = asyncHandler(async (req, res) => {
    const userId = req.params.id; // jisko add karna hai

    if (!userId) {
        res.status(400);
        throw new Error("Invalid user");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $push: { friendRequests: req.user._id } },
        { new: true } // Return the updated document
    ).populate("friendRequests", "name email"); // Populate friendRequests with name and email fields

    if (user) {
        res.status(200).json({
            message: "Request sent",
            updatedUser: user,
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

export const acceptRequest = asyncHandler(async (req, res) => {
    const userId = req.params.id; // jisko add karna hai

    const user = await User.findById(req.user._id).populate("friendRequests", "name email");
    const friend = await User.findById(userId).populate("friends", "name email");


    if (!user || !friend) {
        res.status(404);
        throw new Error("User not found");
    }

    if (!user.friendRequests.some((request)=>request._id.toString() === userId)) {
        res.status(400);
        throw new Error("Friend request not found");
    }

    // Remove userId from friendRequests and add friend._id to friends
    await User.findByIdAndUpdate(req.user._id, {
        $pull: { friendRequests: userId },
        $push: { friends: friend._id },
    });

    // Add user._id to friend's friends array
    await User.findByIdAndUpdate(friend._id, {
        $push: { friends: req.user._id },
    });

    // Reload user and friend with populated data
    const updatedUser = await User.findById(req.user._id).populate("friends", "name email");
    const updatedFriend = await User.findById(friend._id).populate("friends", "name email");

    res.status(200).json({
        message: "Request accepted",
        updatedUser,
        updatedFriend,
    });
});
export const rejectRequest = asyncHandler(async (req, res) => {
    const userId = req.params.id; // The ID of the user whose request is being rejected

    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Remove the request from the user's friendRequests array
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { friendRequests: userId } }, // $pull removes the matching userId from the array
        { new: true } // Return the updated document
    ).populate("friendRequests", "name email");

    if (!updatedUser) {
        res.status(400);
        throw new Error("Failed to reject the request");
    }

    res.status(200).json({
        message: "Friend request rejected",
        updatedUser,
    });
});
export const removeFriend = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
  
    if (!userId) {
      res.status(400);
      throw new Error("User ID is required.");
    }
  
    // Remove friend from the user's friends list
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { friends: userId } },
      { new: true } // Return the updated document
    );
    const friend = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: req.user._id } },
        { new: true } // Return the updated document
    );
  
    if (!user || !friend) {
      res.status(404);
      throw new Error("User not found or invalid user ID.");
    }
  
    res.status(200).json({
      message: "Friend removed successfully.",
      user,
      friend // Return the updated friends list
    });
  });
  


export const getAllFriends = asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user._id).populate("friends","name email pic")
    if(user){
        res.status(200).json(user.friends)
    }
    else{
        res.status(400)
        throw new Error("Invalid user")
    }
})
export const getFriendRequests=asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user._id).populate("friendRequests","name email pic")
    if(user){
        res.status(200).json(user.friendRequests)
    }
    else{
        res.status(400)
        throw new Error("Invalid user")
    }
})

export const getSuggestedUsers = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
  
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found." });
    }
  
    // Extract current user's friends and interests
    const currentUserFriends = currentUser.friends.map((friend) => friend.toString());
    const currentUserHobbies = currentUser.interests || [];
  
    // Query for suggested users
    const suggestedUsers = await User.find({
      _id: { $nin:[...currentUserFriends,currentUserId] }, // Exclude current user
       // Exclude current user's friends
      $or: [
        { friends: { $in: currentUserFriends } }, // Common friends
        { interests: { $in: currentUserHobbies } }, // Common hobbies
      ],
    })
      .select("_id name pic email interests") // Select specific fields to return
      .limit(5); // Limit to 5 suggestions
  
    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(404).json({ message: "No suggested users found." });
    }
  
    // Return the suggested users
    res.status(200).json(suggestedUsers);
  });
  
export const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
})

export const getAllRegisteredUsers=asyncHandler(async (req,res)=>{
    const user=await User.find({}).select("-password -friends -interests");
   
    if(!user){
        return res.status(400).json({
            success:false,
            message:"No user found"
        })
    }
    res.status(200).json(user)

})




