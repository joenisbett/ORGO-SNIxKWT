import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
 
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
