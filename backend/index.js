import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import connectDB from "./utils/mongoDB.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path"


dotenv.config({});

const app=express();
app.use(express.json());
// app.use(cookieParser());


const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
}
app.use(cors(corsOptions));


app.use('/api/user',userRoutes)

const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})

const __dirname=path.resolve()
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'frontend', 'dist')))
    app.get("*",(req,res)=>res.sendFile 
    (path.resolve(__dirname,"frontend","dist", "index.html")))
}
else{
    app.get("/",(req,res)=>{
        res.send("API is running")
    })
}


