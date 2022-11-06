import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";



//@desc    Create a cart
//@route   POST /api/carts/create
//@access  private
//desc  
const addCartItem = asyncHandler(async (req, res) => {
    const {userId, projectId} = req.body;
    const prevCart =  await Cart.findOne({userId})
    if(prevCart){
      let alreadyExist = prevCart.cart?.filter(p=>
        p.projectId.toString()===projectId
      )
      if(alreadyExist.length!==0){
        res.json("Item Already exists on cart")
      }else{
        prevCart.cart.push({projectId:projectId})
        let newCart =await prevCart.save()
        res.json({newCart})
      }
    }else{
      
        const theCart = new Cart({userId });
        theCart.cart.push({projectId:projectId})
        const  saved = await theCart.save();
        if(saved){
        res.json(saved);
        }else{  
        res.json({msg:'Error creating Cart'});
        }
    }
   
      });


//@desc Delete a CartItem
//@route   POST /api/carts/delete/:userId/:projectId
//@access  private
//desc  
const deleteCartItem = asyncHandler(async (req, res) => {
    const prevCart =  await Cart.findOne({userId:req.params.userId})
console.log(req.params.projectId)
    let newCart = prevCart.cart.filter((c)=>
        c.projectId.toString()!==req.params.projectId.toString()
    )
    console.log("newCart",newCart)
    prevCart.cart = newCart
    const deletedCart =await prevCart.save()
    if(deletedCart){
      res.json({deletedCart})
    }else{
      res.json("Couldn't delete. Something went wrong")

    }
      });


//@desc Get cartitems of a user
//@route   Get /api/carts/get/:userId
//@access  private
//desc  
const getCartItemsUser = asyncHandler(async (req, res) => {
    const cart =  await Cart.findOne({userId:req.params.userId}).populate({
      path:'cart',
      populate:{
        path:'projectId',
        model:'Sponsorship'
      }
    })
    
    if(cart){
    res.json(cart);
    }else{  
    res.json({msg:"No Cart Found"});
    }
      });


      export {
        addCartItem,deleteCartItem,getCartItemsUser

      }