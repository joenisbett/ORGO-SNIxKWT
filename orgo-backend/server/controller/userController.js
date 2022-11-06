import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { customAlphabet } from "nanoid";
import OTP from "../models/otpModel.js"
import nodemailer from 'nodemailer'
import geoip from 'geoip-lite'
import { attestClaim, createFullDid, generateAccount, generateCredentials, generateLightDid } from "../utils/kilt.js";
import Evidence from "../models/evidenceModel.js";


//@desc  Auth user and get token
//@route   post /api/users/me
//@access  private
//desc  When user revisits the website it checks whether the tokenis expired or not
const meApi = asyncHandler(async (req, res) => {
  let token = req.headers?.authorization?.split(" ")[1];
  if (token) {
    res.json({ ...req.user._doc, token });
  } else {
    res.json("Session expired please log in");
  }
});

//@desc  Test user name
//@route   Get /api/users/:name
//@access  public
//desc  When user revisits the website it checks whether the tokenis expired or not
const testUniqueName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const doesExists = await User.findOne({ username: name });
  if (doesExists) {
    res.json("Username exists");
  } else {
    res.json("Username available");
  }
});

//@desc  Auth user and get token
//@route   post /api/user/login
//@access  public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email:email.toLowerCase()})
  // if (user.verified === false) {
  //   res.status(403);
  //   throw new Error("User is not verified");
  // }
  // if(user && user.verified === true){
  if (user && (await user.matchPassword(password))) {
    res.json({
      name:user.name,
      _id:user._id,
      username:user.username,
      email:user.email.toLowerCase(),
      type:user.type,
      phone:user.phone,
      address:user.address,
      firstName:user.firstName,
      lastName:user.lastName,
      city:user.city,
      inactive:user.inactive,
      verified:user.verified,
      address: user.address,
      bio:user.bio,
      avatar:user.avatar,
      facebookLink:user.facebookLink,
      linkedinLink:user.linkedinLink,
      website:user.website,
      instagramLink:user.instagramLink,
      redditLink:user.redditLink,
      twitterLink:user.twitterLink,
      token:generateToken(user._id),
      locationOnMap:user.locationOnMap,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
// }
  // else{
  //   res.status(401);
  //   throw new Error("User is not verified");
  // }
});





//@desc  Register user
//@route   POST /api/users
//@access  public
//@details register a new  user
const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password, phone, type,firstName,lastName } = req.body;
  const userExist = await User.findOne({ email:email.toLowerCase() });

  if (userExist) {
    res.status(400);
    throw new Error("Email already Exist");
  }

  const usernameExist = await User.findOne({ username });

  if (usernameExist) {
    res.status(400);
    throw new Error("Username already Exist");
  }
  const user = new User({
    username,
    name:firstName + " " + lastName,
    email:email.toLowerCase(),
    password,
    firstName,
    lastName,
    type,
    phone,
  });

  await user.save();



  if (user) {
    const nanoid = customAlphabet("123456789ABCDEFGHIJKLMNPQRSTUVWXYZ", 6);
    const otP = nanoid();
    const newOTP = new OTP({
      otp:otP,id:user._id
    })
    await newOTP.save()
   //send email 

   let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});
 
let mailDetails = {
    from: process.env.EMAIL,
    to: `${email}`,
    subject: 'Orgo Earth - verify your account',
    text: `Use this OTP to verify your email : ${otP}`,
    html:`<p>Use this OTP to verify your email : ${otP}</p>`
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
});

await generateAccount(user._id)
const fullDid = await createFullDid(user._id)
if(fullDid){
  res.json({
    username:user.username,
    _id:user._id,
    name:user.name,
    firstName:user.firstName,
        lastName:user.lastName,
    email:user.email.toLowerCase(),
    type:user.type,
    phone:user.phone,
    city:user.city,
    inactive:user.inactive,
    verified:user.verified,
    address: user.address,
    bio:user.bio,
    avatar:user.avatar,
    facebookLink:user.facebookLink,
    linkedinLink:user.linkedinLink,
    instagramLink:user.instagramLink,
    redditLink:user.redditLink,
    twitterLink:user.twitterLink,
    locationOnMap:user.locationOnMap,
    website:user.website,
    token:generateToken(user._id)})
}else{
  res.send("Full did not created")
}

  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc  Resend verification email
//@route   POST /api/users/resend/email
//@access  public
//@details Resend the verification email
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const {email } = req.body;
  const user = await User.findOne({ email:email.toLowerCase() });

  if (user) {
    
    await OTP.findOneAndDelete({id:user._id});
    const nanoid = customAlphabet("123456789ABCDEFGHIJKLMNPQRSTUVWXYZ", 6);
    const otP = nanoid();
    const newOTP = new OTP({
      otp:otP,id:user._id
    })
    await newOTP.save()
   //send email 

   let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});
 
let mailDetails = {
    from: process.env.EMAIL,
    to: `${email}`,
    subject: 'Test mail',
    text: 'Orgo Earth - verity your email',
    html:`<p>Use this OTP to verify your email : ${otP}</p>`
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
});


res.json({
  username:user.username,
  _id:user._id,
  name:user.name,
  firstName:user.firstName,
      lastName:user.lastName,
  email:user.email.toLowerCase(),
  type:user.type,
  phone:user.phone,
  city:user.city,
  inactive:user.inactive,
  verified:user.verified,
  address: user.address,
  bio:user.bio,
  avatar:user.avatar,
  facebookLink:user.facebookLink,
  linkedinLink:user.linkedinLink,
  instagramLink:user.instagramLink,
  redditLink:user.redditLink,
  twitterLink:user.twitterLink,
  token:generateToken(user._id)})
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc  Verify Email
//@route   Post /api/users/verify
//@access  public
const verifyEmail = asyncHandler(async (req, res) => {
  const { id, otp } = req.body;
  if (!id || !otp) res.send("Invalid request, missing parameters!");
  else {
    const user = await User.findOne({_id:id});
    if (!user) {
      res.send("User not found!!!");
    } else {
      if (user.verified) res.send("This user is already verified");
      else {
        const key = await OTP.findOne({id,otp});
        if (!key) {
          res.send("Your OTP expired, send verification OTP again");
        } else {
         
            user.verified = true;
            await OTP.findOneAndDelete({_id:key._id});
            await user.save();
            const token=  generateToken(user._id)
            
            res.json({ username:user.username,
              _id:user._id,
              name:user.name,
              firstName:user.firstName,
                  lastName:user.lastName,
              email:user.email.toLowerCase(),
              type:user.type,
              phone:user.phone,
              city:user.city,
              inactive:user.inactive,
              verified:user.verified,
              address: user.address,
              bio:user.bio,
              avatar:user.avatar,
              facebookLink:user.facebookLink,
              linkedinLink:user.linkedinLink,
              instagramLink:user.instagramLink,
              redditLink:user.redditLink,
              twitterLink:user.twitterLink
              ,token:token});
          
        }
      }
    }
  }
});

//@desc  Get specific user profile
//@route   GET /api/users/profile/:id
//@access  private/admin
//@details get a user details by admin in profile edit screen by admin
const getSpecificUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({username:req.params.username}).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});



//@desc    Update user profile
//@route   PUT /api/user/profile
//@access  private
//@details update user details  from profile page
const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.body.email ) {
    const user = await User.findOne({
    email: req.body.email 
    });
    if (user) {
      res.status(409);
      throw new Error("Email already exists");
    }
  }

  if (req.body.username ) {
    const user = await User.findOne({
    username: req.body.username 
    });
    if (user) {
      res.status(409);
      throw new Error("Username already exists");
    }
  }
  // if (req.body.phone) {
  //   const user = await User.findOne({ phone: req.body.phone });
  //   if (user) {
  //     res.status(409);
  //     throw new Error("Phone already exists");
  //   }
  // }

  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username
    user.firstName=req.body.firstName|| user.firstName;
    user.lastName=req.body.lastName||user.lastName,
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address,

    user.city = req.body.city || user.city,
    user.adress = req.body.address || user.address;
    user.avatar = req.body.avatar || user.avatar;
    (user.type = req.body.type || user.type),
      (user.facebookLink = req.body.facebookLink || user.facebookLink);
    user.instagramLink = req.body.instagramLink || user.instagramLink;
    user.linkedinLink = req.body.linkedinLink || user.linkedinLink;
    user.redditLink = req.body.redditLink || user.redditLink;
    user.twitterLink = req.body.twitterLink || user.twitterLink;
    user.bio = req.body.bio || user.bio;
    user.locationOnMap=req.body.locationOnMap|| user.locationOnMap


    if (req.body.password) {
      if (await user.matchPassword(req.body.oldPassword)) {
        user.password = req.body.password;
      } else {
        res.status(401);
        throw new Error("Incorrect Password");
      }
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      // name:user.username,
      // email: updatedUser.email,
      phone: updatedUser.phone,
      city:updatedUser.city,
      address:updatedUser.address,

      type: updatedUser.type,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      facebookLink: updatedUser.facebookLink,
      instagramLink: updatedUser.instagramLink,
      linkedinLink: updatedUser.linkedinLink,
      redditLink: updatedUser.redditLink,
      locationOnMap:user.locationOnMap,

      token: generateToken(updatedUser._id),
    });
  }
});

//@desc    Delete user
//@route   delete /api/user/profile
//@access  private
//@details update user details  from profile page
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    $or: [{ phone: req.body.phone }, { email: req.body.email.toLowerCase() }],
  });
  if (user) {
    user.inactive = true;
    await user.save();
    res.json("User Deactivated");
  } else {
    res.json("There is no such user");
  }
});

//@desc  Get  user by name
//@route   GET /api/users/user/:name
//@access  private/Admin
//@details get all the users for admin
const getUsers = asyncHandler(async (req, res) => {
  
  const users = await User.find({ inactive: false,username: {
    $regex: req.params.name,
    $options: "i",
  } })
    
  res.json({users});
});



//@desc  Get  all community locations
//@route   GET /api/users/community/locations
//@access  public
//@details get all the community locations in map
// const getAllcommunityLocations = asyncHandler(async (req, res) => {
  
//   const locations = await User.find({ inactive: false,type:"community" }).select("location");
//     if(locations){
//       res.json({locations});
//     }else{
//       res.json({locations:[]});
//     }
//   res.json({locations});
// });

//@desc  Get all users
//@route   GET /api/users/all
//@access  
//@details get all the users 
const getAllUsers = asyncHandler(async (req, res) => {
  
  const users = await User.find({ inactive: false})
    
  res.json(users);
});

//@desc  Get  user leaderboard
//@route   GET /api/users/leaderboard
//@access  public
//@details get all the users sorted by points
const getLeaderBoard = asyncHandler(async (req, res) => {
  
  const users = await User.find({ inactive: false }).sort({points:-1}).select("username avatar points")
    
  res.json({users});
});


//@desc     fetch few stats in volunteer profile
//@route    GET /api/users/profile/stats/:userId
//@access   private
//@details  
const getUserprofileStats = asyncHandler(async (req, res) => {
  const taskCompleted = await Evidence.find({$or:[{userId:req.params.userId},{"helpers.id":req.params.userId}],status:"approved" }).populate("taskId")
  const uniqueCommunities = [...new Map(taskCompleted.map(item =>
    [item.taskId.creator, item])).values()];
 
    res.json({communities:uniqueCommunities.length,task:taskCompleted.length})

  
});


//@desc  Get all community users
//@route   GET /api/users/communityusers
//@access  private
//@details get all the community users 
// const getAllCommunityUsers = asyncHandler(async (req, res) => {
  
//   const users = await User.find({ inactive: false,type:'community' })
    
//   res.json({users});
// });

//@desc  Get claim attested
//@route   GET /api/users/claim/attestaion/:volunteerId/:communityId
//@access  private
//@details 
const createAndAttestCredentials = asyncHandler(async (req, res) => {
 const credential =await generateCredentials(req.params.volunteerId, req.body)
// The attester checks the attributes and attests the provided credential.
await attestClaim(req.params.commmunityId, credential)
return credential
});

//@desc  create Kilt Account
//@route   GET /api/users/create/Kilt/:userId
//@access  private
//@details 
const createKilt = asyncHandler(async (req, res) => {
  
  await generateAccount(req.params.userId)
const fullDid = await createFullDid(req.params.userId)
res.json(fullDid,mneumonics)
 });


export {
  meApi,
  // getAllcommunityLocations,
  authUser,
  registerUser,
  verifyEmail,
  updateUserProfile,
  getUsers,
  getAllUsers,
  deleteUser,
  getSpecificUserProfile,
  testUniqueName,
  // getAllCommunityUsers,
  resendVerificationEmail,
  getLeaderBoard,
  createAndAttestCredentials,
  createKilt,
  // authCommunityUser,
  getUserprofileStats,
};
