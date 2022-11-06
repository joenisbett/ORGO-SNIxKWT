import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Evidence from "../models/evidenceModel.js";
import Task from "../models/taskModel.js";
import Notification from "../models/notificationModel.js";
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import { createCType } from "../utils/kilt.js";

//@desc Get all evidences
//@route   get /api/evidences
//@access  private
//desc  submit an evidence
const submitEvidence = asyncHandler(async (req, res) => {
  const { taskId,templateId,formData, userId,tags
    //  evidenceDetails, evidenceImages, tags,latitude,longitude
     } = req.body;
  const taglist= []
  tags?.map(t=>{
    taglist.push({id:t.trim()})
  })
  const task = await Task.findById(taskId);


    const evidence = new Evidence({
      taskId,
      templateId,
      formData,
      // latitude,
      // longitude,
      userId, 
      // evidenceDetails,
      // evidenceImages,
      helpers: taglist,
    });
    const tagsForInvolvedUsers =[]
     tags?.map(t=>{
      tagsForInvolvedUsers.push({      _id:mongoose.Types.ObjectId(),
        userId:t.toString(),seen:false,linkTo:`https://app.orgo.earth/volunteer/evidence/details/${evidence._id}`})
    }
     )
    const involvedUsers = [{ 
      _id:mongoose.Types.ObjectId(),
      userId:task.creator.toString(),
      seen:false,
      linkTo:`/community/evidence/details/${evidence._id}`},...tagsForInvolvedUsers]
    const notification = new Notification({
      description:`An evidence has been submitted for task ${task.name}`,
      involvedUsers,
      type:"evidence submission",
      userId:req.user._id,
    })
    await notification.save()
    await evidence.save();
    const promise = involvedUsers?.map(async i=>{
      const email = await User.findById(i).select("email") 
      let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
     
    let mailDetails = {
        from: process.env.EMAIL,
        to: `${email?.email}`,
        subject: 'Orgo Earth - Evidence Submitted',
        text: `A new Evidence has been added in task ${task.name}`,
        html:`<p>A new Evidence has been added in task ${task.name}</p>`
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
    
    })
    // const promises = tags.map(async t=>{
    //   const index = tags.findIndex(a=>a===t)
    //   const tempTags = tags.slice(index,index+1)
    //   const evi = new Evidence({
    //   taskId,
    //   userId:t,
    //   evidenceDetails,
    //   evidenceImages,
    //   helpers: [...tempTags,userId],
    //   })
    //   await evi.save()
    // })

    Promise.all(promise).then(function () {
      res.json(evidence);
    });
    
  
});

//@desc     Approve an evidence
//@route    Post api/evidences/:evidenceId
//@access   private/community
//@details  Approve an evidence by community
const approveEvidence = asyncHandler(async (req, res) => {
  const evidence = await Evidence.findOne({ 
    _id: req.params.evidenceId,
  })

  const user =await User.findById(evidence.userId)
       user.points=Number(user.points)+1
       await user.save()
  if (evidence) {
    let tags = []
    evidence?.helpers?.map(h=>{
      tags.push(h.id.toString())
    })
    const tagsForInvolvedUsers =[]
    tags?.map(async t=>{
     tagsForInvolvedUsers.push({      _id:mongoose.Types.ObjectId(),
       userId:t.toString(),seen:false,linkTo:`https://app.orgo.earth/volunteer/evidence/details/${evidence._id}`})
       const user = User.findById(t)
       user.points=user.points+1
       await user.save()
   }
    )

    evidence.status = "approved";
    evidence.statusApprovedDate=new Date()
    const saveEvidence=new Promise(async()=>await evidence.save());
    const involvedUsers = [{
      _id:mongoose.Types.ObjectId(),
      userId:evidence.userId.toString(),
      seen:false,
      linkTo:`/volunteer/evidence/details/${evidence._id}`}
      ,...tagsForInvolvedUsers]
    const notification = new Notification({
      description:`The evidence has been approved ${evidence._id}`,
      involvedUsers,
      type:"evidence approval",
      userId:req.user._id,
     })
    await notification.save()

     const promise = involvedUsers.map(async i=>{
      const email =await User.findById(i).select("email") 
      let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
     
    let mailDetails = {
        from: process.env.EMAIL,
        to: `${email?.email}`,
        subject: 'Orgo Earth - Evidence Approved',
        text: `Your Evidence has been approved`,
        html:`<p>Your Evidence has been approved /p>`
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
    })
    Promise.all(promise).then(()=>{
      res.json("Evidence Approved");
    })
     
    
    
  } else {
    res.json("NO evidence Found");
  }
});

//@desc     Deny an evidence
//@route    Post api/evidences/deny/:evidenceId 
//@access   private/community
//@details  Deny an evidence by community
const denyEvidence = asyncHandler(async (req, res) => {
   
  const evidence = await Evidence.findOne({
    _id: req.params.evidenceId,
    
  })
   
  if (evidence) {
    let tags = []
    evidence?.helpers?.map(h=>{
      tags.push(h.id.toString())
    })

    const tagsForInvolvedUsers =[]
    tags?.map(t=>{
      tagsForInvolvedUsers.push({      _id:mongoose.Types.ObjectId(),
       userId:t.toString(),seen:false,
       linkTo:`https://app.orgo.earth/volunteer/evidence/details/${evidence._id}`})
   }
    )
    
    evidence.status = "denied";
    evidence.reason= req.body.reason;
    const saveEvidence=new Promise(async()=>await evidence.save());

    const involvedUsers = [{
      _id:mongoose.Types.ObjectId(),
      userId:evidence.userId.toString(),
      seen:false,
      linkTo:`/volunteer/evidence/details/${evidence._id}`}
      ,...tagsForInvolvedUsers]
    const notification = new Notification({
      description:`The evidence has been denied ${evidence._id}`,
      involvedUsers,
      type:"deny evidence",
      userId:req.user._id,
      
     })
     const promise = involvedUsers.map(async i=>{
      const email =await User.findById(i).select("email") 
      let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
     
    let mailDetails = {
        from: process.env.EMAIL,
        to: `${email?.email}`,
        subject: 'Orgo Earth - Evidence Denied',
        text: `Your Evidence has been denied `,
        html:`<p>Your Evidence has been denied</p>`
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
    saveEvidence.then(async()=>{
      await notification.save()
      Promise.all(promise).then(()=>{
        res.json("Evidence Denied");
      })
    })
  })
   
     
    
  } else {
    res.json("NO evidence Found");
  }
});

//@desc     fetch all evidences of a user
//@route    GET /api/evidences/:userId
//@access   Private
//@details  List all the available tasks
const getAllEvidences = asyncHandler(async (req, res) => {
  const approval =
    req.query.approval === "approved" 
      ? { userId: req.params.userId, status: "approved" }
      : req.query.approval === "To be approved"
      ? { userId: req.params.userId, status: "To be approved" }
      : { userId: req.params.userId };
  const evidence = await Evidence.find({ ...approval }).populate("userId").populate("taskId").populate({
    path:'helpers',
    populate:{
      path:'id',
      model:'User'
    }
  }).populate("taskId").populate({
    path:'comments',
    populate:{
      path:'sender',
      model:'User'
    }})
  
  let evidences = [...evidence]
  if(evidence){
        const newEvidences =  await Evidence.find({"helpers.id":req.params.userId}).populate("userId").populate("taskId").populate({
          path:'helpers',
          populate:{
            path:'id',
            model:'User'
          }
        }).populate("taskId").populate({
          path:'comments',
          populate:{
            path:'sender',
            model:'User'
          }})
        evidences = [...evidences,...newEvidences]
        res.json(evidences)
  } else {
    res.json("NO evidences Found");
  }
});

//@desc     fetch all evidences of a user
//@route    GET /api/evidences/community/:communityId
//@access   private/community
//@details  List all the to be reviewed evidences
const getAllEvidencesCommunity = asyncHandler(async (req, res) => {
  
  const tasks = await Task.find({ creator: req.params.communityId }).populate("userId").populate("taskId").populate({
    path:'helpers',
    populate:{
      path:'id', 
      model:'User'
    }
  }).populate("taskId").populate({
    path:'comments',
    populate:{
      path:'sender',
      model:'User'
    }})
  let allEvidences = [];
  var promises = tasks?.map(async (task) => {
    const approval =
    req.query.status
      ? { taskId: task._id, status: req.query.status }
      : { taskId: task._id};
    const evidences = await Evidence.find({
      ...approval
    }).populate("taskId").populate("userId");
    allEvidences = [...allEvidences, ...evidences];
  });
  Promise.all(promises).then(() => res.json(allEvidences));
 
});



//@desc     fetch all evidences of a task
//@route    GET /api/evidences/task/:taskId
//@access   private/community
//@details  List all the evidences of a task
const getAllEvidencesTask = asyncHandler(async (req, res) => {
  
  const tasks = await Evidence.find({ taskId:req.params.taskId }).populate("userId").populate("taskId")
 
    res.json(tasks);


 
});




//@desc     fetch an evidence by id
//@route    GET /api/evidences/evidence:id
//@access   private
//@details  
const getEvidenceById = asyncHandler(async (req, res) => {
  const evidence = await Evidence.findOne({ _id:req.params.id}).populate("userId").populate("taskId").populate({
    path:'helpers',
    populate:{
      path:'id',
      model:'User'
    }
  }).populate("taskId").populate({
    path:'comments',
    populate:{
      path:'sender',
      model:'User'
    }})
  if(evidence){
    res.json(evidence)
  }else{
    res.json("Evidence not found")
  }
  
});


//@desc     fetch an evidence by id for credentials
//@route    GET /api/evidences/evidence/credentials/:id/:userId
//@access   private
//@details  
const getEvidenceCredentials = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
  const evidence = await Evidence.findOne({ _id:req.params.id}).populate("userId").populate("taskId")
  const communityCreator = await User.findOne({_id:evidence.taskId.creatorVolunteer})
  
  if(evidence){
    const credentials = {volunteer:user.name,task:evidence.taskId.name,community:evidence.taskId.creatorCommunityName,
      communityCreatorName:communityCreator.name,
      completedDate:evidence.createdAt,
      approvedDate:evidence.approvedDate}
    res.json(credentials)
  }else{ 
    res.json("Evidence not found")
  }
  
});




//@desc     Post a comment on a specific evidence
//@route    POST /api/evidences/add/comment/:id
//@access   private 
//@details  
const postAComment = asyncHandler(async (req, res) => {
  const {message} = req.body
  const evidence = await Evidence.findOne({ _id:req.params.id}).populate("taskId").populate("userId");
  let tags = []
  evidence?.helpers?.map(h=>{
    tags.push(h.id.toString())
  })
  const tagsForInvolvedUsers =[]
  tags?.map(t=>{
   tagsForInvolvedUsers.push({      _id:mongoose.Types.ObjectId(),
     userId:t.toString(),seen:false,linkTo:`https://app.orgo.earth/volunteer/evidence/details/${evidence._id}`})
 }
  )
  const involved=[...tagsForInvolvedUsers,
    {     
      _id:mongoose.Types.ObjectId(),
      userId:evidence?.userId._id.toString(),
      seen:false,
      linkTo:`https://app.orgo.earth/volunteer/evidence/details/${evidence._id}`},
    {
      _id:mongoose.Types.ObjectId(),
      userId:evidence?.taskId.creatorVolunteer.toString(),
      seen:false,
      linkTo:`/evidence/details/${evidence._id}`}]
  const filteredInvolved = involved.filter(a=>a.toString()!==req.user._id.toString())

  if(evidence){
     const notification = new Notification({
      description:`There is a new comment on evidence ${evidence._id}`,
      involvedUsers:filteredInvolved,
      type:"post comment",
      userId:req.user._id,
     })
     await notification.save()
    const comments = evidence.comments
    const tempComments = [...comments,{sender:req.user._id,message:message}]
    evidence.comments = tempComments
    await evidence.save()


    //send Email
    const promise = filteredInvolved?.map(async i=>{
      const email = await User.findById(i).select("email") 
      let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
     
    let mailDetails = {
        from: process.env.EMAIL,
        to: `${email?.email}`,
        subject: 'Orgo Earth - Evidence Submitted',
        text: `A new Evidence has been added`,
        html:`<p>A new Evidence has been added</p>`
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    })
  })
  Promise.all(promise).then(()=>res.json(evidence))

    
  }else{
    res.json("Evidence not found")
  }
  
});



//@desc     Delete a comment on a specific evidence
//@route    Delete /api/evidences/delete/comment/:evidenceId/:commentId
//@access   private
//@details  
const deleteAComment = asyncHandler(async (req, res) => {
  const evidence = await Evidence.findOne({_id:req.params.evidenceId});
  if(evidence){
    const comments = evidence.comments
    const index = comments.findIndex(c=>c._id===req.params.commentId)
    const tempComments = comments.splice(index,1)
    evidence.comments = comments
    await evidence.save()
    res.json(evidence)
  }else{
    res.json("Evidence not found")
  }
  
});




export {
  submitEvidence,
  getEvidenceById,
  approveEvidence,
  denyEvidence,
  getAllEvidences,
  getAllEvidencesCommunity,
  deleteAComment,
  postAComment,
  getEvidenceCredentials,
  getAllEvidencesTask
};
