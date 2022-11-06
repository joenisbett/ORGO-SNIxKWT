import asyncHandler from "express-async-handler";
import axios from 'axios'
import mongoose from 'mongoose'
import {parse, stringify, toJSON, fromJSON} from 'flatted';


//@desc  report A bug 
//@route   Post /api/clickup/create
//@access  public
//desc  
const ReportABug = asyncHandler(async (req, res) => {
   const report = await axios.post('https://api.clickup.com/api/v2/list/199143821/task',
    {name:req.body.name,description:req.body.description},
    {
        headers:{
            Authorization: `pk_48976629_MULBD5VSTW1HV569YHW84IT5NX0GC4JX`,
            accept: '*/*',

        
        },
})


   if(report){
    
    res.send({id:report.data.id,customTaskId:report.data.custom_id,teamId:report.data.team_id})
   }else{
    res.json({msg:'Error submitting bug'})
   }
});

//@desc     Attach a file to a bug
//@route   Post /api/clickup/attach
//@access  public
//desc  
const attachImage = asyncHandler(async (req, res) => {
    const report = await axios.post(`https://api.clickup.com/api/v2/task/${taskId}/attachment?custom_task_ids=${customTaskId}&team_id=${teamId}`,
     {attachment,filename},
     {
         headers:{
             Authorization: `pk_48976629_MULBD5VSTW1HV569YHW84IT5NX0GC4JX`,
             accept: '*/*',
 
         
         },
 })
 
 
    if(report){
     let responseReport = JSON.parse(stringify(report))
 
     
     res.send(responseReport)
    }else{
     res.json({msg:'Error submitting bug'})
    }
 });

export {ReportABug,attachImage}


