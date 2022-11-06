import asyncHandler from "express-async-handler";
import Community from "../models/communityModel.js";
import User from "../models/userModel.js";
import sendEmaill from "../utils/sendEmaill.js";
import Notification from "../models/notificationModel.js";
import mongoose from "mongoose";



//@desc  Create  a community
//@route   Post /api/communities/create
//@access  private
//desc  Any Volunteer can create multiple community
const createCommunity = asyncHandler(async (req, res) => {
    const { name,city,website,description,moto,phone,profileImage,logo,locationOnMap,twitterLink,facebookLink,redditLink,instagramLink,linkedinLink,createdBy } = req.body;

    const exists = await  Community.findOne({name:name});
    if(exists){
        return res.status(400).json({
            error: `Community with name ${name} already exists`
        })}
        else{

        
    const community =new Community({
        name,
        city,
        description,
        moto,
        phone,
        profileImage,
        logo,
        locationOnMap,
        twitterLink,
        facebookLink,
        redditLink,
        instagramLink,
        linkedinLink,
        website,
        createdBy

    })
    await community.save();
    if(community){
        res.status(200).json(
            community
        )
    res.status(400).json("Something went wrong")
    }
        }
  });


  //@desc  Create  a community
//@route   Post /api/communities/create/:username
//@access  private
//desc  Any Volunteer can create multiple community
const createCommunityWithUserName = asyncHandler(async (req, res) => {
    const { name,city,description,moto,phone,profileImage,logo,locationOnMap,twitterLink,facebookLink,redditLink,instagramLink,linkedinLink,website } = req.body;
    const {username} = req.params;
    const theUser = await User.findOne({username:username});
    if(!theUser){
        return res.status(400).json({
            error: `User with username ${username} does not exist`
        })}
    else{

    const exists = await  Community.findOne({name:name});
    if(exists){
        return res.status(400).json({
            error: `Community with name ${name} already exists`
        })}
        else{

        
    const community =new Community({
        name,
        city,
        description,
        moto,
        phone,
        profileImage,
        logo,
        locationOnMap,
        twitterLink,
        facebookLink,
        redditLink,
        instagramLink,
        linkedinLink,
        createdBy:theUser._id,
        website

    })
    await community.save();
    if(community){
        res.status(200).json(
            community
        )
    res.status(400).json("Something went wrong")
    }
        }}
  });


  //@desc  Update a community
//@route   Post /api/communities/update/:communityId
//@access  private
//desc  a community creator or admin can update the community
const upadateCommunity = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.communityId);
    if (community) {
        community.name =req.body.name || community.name;
        community.city=req.body.city  || community.city
        community.description=req.body.description  || community.description
        community.moto=req.body.moto  || community.moto
        community.phone=req.body.phone  || community.phone
        community.profileImage=req.body.profileImage  || community.profileImage
        community.logo=req.body.logo  || community.logo
        community.locationOnMap=req.body.locationOnMap  || community.locationOnMap
        community.twitterLink=req.body.twitterLink  || community.twitterLink
        community.facebookLink=req.body.facebookLink  || community.facebookLink
        community.redditLink=req.body.redditLink  || community.redditLink
        community.instagramLink=req.body.instagramLink  || community.instagramLink
        community.linkedinLink=req.body.linkedinLink  || community.linkedinLink
        community.website = req.body.website|| community.website
    
    const updatedCommunity = await community.save()
    if(updatedCommunity){
        res.status(200).json(
            updatedCommunity
        )
    res.status(400).json("Something went wrong")
    }  
    }
    res.status(404).json("Community Not Found")

});

//@desc  delete a community
//@route   Post /api/communities/delete/:communityId
//@access  private
//desc  makes a community inactive
const deleteCommunity = asyncHandler(async (req, res) => {
   const community = await Community.findById(req.params.communityId);
    if (community) {
        community.inactive = true;
        }
    await community.save();
    if(community){
        res.status(200).json({
            success:true,
            data:community
        })
    res.status(400).json("Something went wrong")
    }

});

//@desc  get a community by id
//@route   Get /api/communities/get/:id
//@access  public
//desc  
const getCommunityById = asyncHandler(async (req, res) => {
   const community = await Community.findOne({_id:req.params.id,inactive:false});
   if(community){
         res.status(200).json(
              community
         )
   }else{

       res.status(400).json("Something went wrong")
   }

});

//@desc  get a community by name
//@route   Get /api/communities/getbyname/:name
//@access  public
//desc  
const getCommunityName = asyncHandler(async (req, res) => {
    const community = await Community.findOne({name:req.params.name,inactive:false}).populate("createdBy");
   if(community){
         res.status(200).json(
              community
         )
   }else{ 
    res.status(400).json("Something went wrong")

   }
});

//@desc  search a community 
//@route   Get /api/communities/search/:name
//@access  public
//desc  
const searchCommunity = asyncHandler(async (req, res) => {
    const community = await Community.find({ name: { $regex: req.params.name.toLowerCase(), $options: "i" },inactive:false}).select("_id name logo city locationOnMap");
   if(community){
         res.status(200).json(
              community
         )
   }else{ 
    res.status(400).json("Something went wrong")

   }
});

//@desc  get all communities
//@route   Get /api/communities/getall
//@access  private
//desc  
const getAllCommunities = asyncHandler(async (req, res) => {
   const communities = await Community.find({inactive:false}).populate("createdBy");
    if(communities){
         res.status(200).json(
              communities
         )
   }else{
    res.status(404).json("No  communities found")
   }
});

//@desc  get all communities by creater id 
//@route   Get /api/communities/getall/:userId
//@access  private
//desc  
const getAllCommunitiesByUserId = asyncHandler(async (req, res) => {
    const communities = await Community.find({$or:[{createdBy:req.params.userId},{"members.userId":req.params.userId}],inactive:false});
    if(communities){
         res.status(200).json(
              communities
         )
   }else{
    res.status(404).json("No  communities found")
   }
});

//@desc  get all communities location
//@route   Get /api/communities/getalllocation
//@access  private
//desc  
const getAllCommunitiesLocation = asyncHandler(async (req, res) => {
    const communities = await Community.find({inactive:false}).select("locationOnMap city name logo");
    if(communities){
         res.status(200).json(
              communities
         )
   }else{
    res.status(404).json("No  communities found")
   }
});

//@desc  get all communities members
//@route   Get /api/communities/getallmembers/:communityId
//@access  private/community
//desc  
const getAllMembers = asyncHandler(async (req, res) => {
    const communities = await Community.findOne({_id:req.params.communityId,inactive:false}).select("members").populate({
        path:'members',
        populate:{
          path:'userId',
          model:'User'
        }
      })
    if(communities){
         res.status(200).json(
              communities
         )
   }else{
    res.status(404).json("No  communities found")
   }
});

//@desc  Test user name
//@route   Get /api/communities/getall/location/:location
//@access  private
//desc  
const getAllCommunitiesWithinALocation = asyncHandler(async (req, res) => {
   
});

//@desc  Request a membership to a community
//@route   Get /api/communities/requestmembership/:communityId
//@access  private
//desc  
const requestMembership = asyncHandler(async (req, res) => {
   
});

//@desc  approve or disapprove a membership to a community
//@route   Get /api/communities/approve/members/:communityId/:userId
//@access  private
//desc  
const approveMembership = asyncHandler(async (req, res) => {
   
});
// //@desc  Create a new community member
// //@route   post /api/communities/add/member/:communityId/:userId
// //@access  private
// //desc 

const createANewMember = asyncHandler(async (req, res) => {
   const community = await Community.findById(req.params.communityId);
   const volunteer = await User.findById(req.params.userId);
   if(community){
    const alreadyMember = community.members?.filter(member => member.userId.toString() === req.params.userId)
    if(alreadyMember.length > 0){
        community.members.find(async member=>{ 
            if(member.userId.toString()===req.params.userId){

                res.status(400).json("This user is already a member of this community")
            }
        })
    }
    else{
        community.members.push({userId:req.params.userId,role:"admin",status:'approved'})
        await community.save()
        //send email notification
        sendEmaill({email:volunteer.email,subject:"Orgo Earth - Community Invitation",
        text:`You have been added to ${community.name}. `,
        html:`<p>You have been added to <a href="">${community.name}</a> . </p>`
    })
         //add notification
         await Notification.create({
            
            description:`You have been  added to ${community.name} .`,
            involvedUsers:[{     
                _id:mongoose.Types.ObjectId(),
                userId:volunteer._id,
                seen:false,
                linkTo:`/community/dashboard/${community._id}`
            },],
            type:"invitation",
            userId:community.createdBy,
        })
        res.status(200).json("Member added")

    }
   }else{
    res.status(404).json("Community Not Found")
   }
});

// //@desc  Create a new community member
// //@route   post /api/communities/add/member/:communityId/:userId
// //@access  private
// //desc 

const deleteAMember = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.communityId);
    const volunteer = await User.findById(req.params.userId);

 
    if(community){
     const newMmberList = community.members?.filter(member => member.userId.toString() !== req.params.userId)
      community.members = newMmberList;
      await community.save()
      await Notification.create({
            
        description:`You have been  removed from ${community.name} .`,
        involvedUsers:[{     
            _id:mongoose.Types.ObjectId(),
            userId:volunteer._id,
            seen:false,
            linkTo:`/community/dashboard/${community._id}`
        },],
        type:"removal",
        userId:community.createdBy,
    })
      res.status(200).json(community)
    }
    else{
     res.status(404).json("Community Not Found")
    }
         })
     
   

 
 


// //@desc  Update a  community role
// //@route   Get /api/communities/update/member/role/:communityId/:userId
// //@access  private
// //desc 
const updateCommunityMemberRole = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.communityId);
    if(community){
        community.members.find(member=>{
            if(member.userId==req.params.userId){
                member.role=req.body.role
            }
        }
        )
        await community.save()
        res.status(200).json(community)
    }else{
     res.status(404).json("Community Not Found")
    }
 });

 // //@desc  Respond to community request
// //@route   post /api/communities/respond/request/:communityId
// //@access  private
// //desc 
// const responseToCommunity = asyncHandler(async (req, res) => {
//     const community = await Community.findById(req.params.communityId).populate("createdBy");
    
//     if(community){
//         community.members.find(member=>{
//             if(member.userId.toString()==req.user._id.toString()){
//                 member.status=req.body.status
//             }
//         }
//         )
//         await community.save()
//         //send email notification
//         sendEmaill({email:community.createdBy._id,subject:"Orgo Earth - Community Invitation Response",
//         text:`${req.user.name} has ${req.body.status} invitation to join ${community.name} community. `,
//         html:`<p>${req.user.name} has ${req.body.status} invitation to join <a href="">${community.name}</a> community.</p>`
//     })
//          //add notification
//          await Notification.create({
            
//             description:`${req.user.name} has ${req.body.status} invitation to join ${community.name} community.`,
//             involvedUsers:[{     
//                 _id:mongoose.Types.ObjectId(),
//                 userId:community.createdBy,
//                 seen:false,
//                 linkTo:`/community/${community._id}`
//             },],
//             type:"invitation response",
//             userId:req.user._id,
//         })
//         res.status(200).json(community)
//     }else{
//      res.status(404).json("Community Not Found")
//     }
//  });

export { 
    // responseToCommunity,
    getAllMembers,createCommunityWithUserName,searchCommunity,
    updateCommunityMemberRole,deleteAMember,requestMembership,approveMembership,createANewMember,createCommunity,getAllCommunitiesWithinALocation,getAllCommunitiesByUserId,getAllCommunitiesLocation,getAllCommunities,getCommunityName,getCommunityById,deleteCommunity,upadateCommunity };