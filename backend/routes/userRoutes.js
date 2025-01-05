import express from "express";
import { protect } from "../Authentication/authentication.js";
import { acceptRequest, allUsers, getAllFriends, getAllRegisteredUsers, getFriendRequests, getSuggestedUsers, loginUser, registerUser, rejectRequest, removeFriend, sendRequest } from "../controllers/userController.js";
const Router = express.Router();

Router.route("/").post(registerUser).get(protect,allUsers)
Router.route("/login").post(loginUser)
Router.route("/:id/request").put(protect,sendRequest)
Router.route("/:id/accept").put(protect,acceptRequest)
Router.route("/:id/reject").put(protect,rejectRequest)
Router.route("/:id/remove").put(protect,removeFriend)
Router.route("/allfriends").get(protect,getAllFriends)
Router.route("/allrequests").get(protect,getFriendRequests)
Router.route("/suggested").get(protect,getSuggestedUsers)
Router.route("/allRegistered").get(protect,getAllRegisteredUsers)





export default Router;
