import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import configurePassport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";
<<<<<<< HEAD
import locationRoutes from "./routes/location.routes.js";
import soilAssessmentRoutes from "./routes/soil-assessment.routes.js";
import aiTipsRoutes from "./routes/ai-tips.routes.js";
=======
>>>>>>> 6ad8092987c6f2c85308bb539bd414b51e66823e
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport
configurePassport();
app.use(passport.initialize());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/disease", diseaseRoutes);
<<<<<<< HEAD
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/soil-assessment", soilAssessmentRoutes);
app.use("/api/v1/ai", aiTipsRoutes);
=======
>>>>>>> 6ad8092987c6f2c85308bb539bd414b51e66823e

// Error Handler
app.use(errorHandler);

export default app;
