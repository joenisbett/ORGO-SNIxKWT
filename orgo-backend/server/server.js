import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import clickupRoutes from "./routes/clickupRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import sponsorshipRoutes from "./routes/sponsorshipRoutes.js";

import formTemplateRoutes from "./routes/formTemplateRoutes.js";
import cors from "cors";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { getAllCommunities } from "./controller/communityController.js";

dotenv.config();

connectDB();
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/evidences", evidenceRoutes);
app.use("/api/notificaions",notificationRoutes)
app.use("/api/clickup",clickupRoutes)
app.use("/api/templates",formTemplateRoutes)
app.use("/api/sponsorships",sponsorshipRoutes)
app.use("/api/carts",cartRoutes)





app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
