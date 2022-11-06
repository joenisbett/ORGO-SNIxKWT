import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    },
    cart:[
        {
            projectId:{
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                ref: "Sponsorship",
            },
            
        }
    ],
    

  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
