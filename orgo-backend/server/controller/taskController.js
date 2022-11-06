import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";
import Evidence from "../models/evidenceModel.js";
// import Involvement from "../models/involvementModel.js";

//@desc     Create a task
//@route    POST /api/task/create
//@access   private/community
//@details  A community can create a task
const createTask = asyncHandler(async (req, res) => {
  const {
    name,
    communityId,
    description,
    address,
    people,
    startDate,
    evidence, 
    rewards,
    priority,
    status,
    hours,
    locationOnMap
  } = req.body;

  const task = new Task({
    name,
    creatorVolunteer: req.user._id,
    creator:communityId,
    creatorCommunityName:req.user.name,
    description,
    address,
    people,
    startDate,
    evidence, 
    rewards,
    priority,
    status,
    hours,
    locationOnMap
  });

  await task.save();


  if (task) {
    res.status(200).json({task});
  } else {
    res.status(400);
    throw new Error("Invalid task data");
  }
});

//@desc     Create multiple task
//@route    POST /api/task/create/multiple
//@access   private/community
//@details  A community can create multiple task
const createMultipleTask = asyncHandler(async (req, res) => {
//   const {
//     tasks
//   } = req.body;
//   const promise = tasks.map(t=>{
//     const task = new Task({
//       name:t.name,
//       creator: req.user._id,
//       creatorCommunityName:req.user.name,
//       description:t.description,
//       address:t.address,
//       people:t.people,
//       startDate:t.startDate,
//       evidence:t.evidence, 
//       rewards:t.rewards,
//       priority:t.priority,
//       status:t.status,
//       hours:t.hours,
//       submitted:t.submitted
//     });
  
//     await task.save();
//   })

 
// Promise.all(promise).then(()=>{
//   res.status(200).json({message:"Tasks created successfully"});
// }
// )
 
//     res.status(400);
//     throw new Error("Invalid task data");
  
});
//@desc     fetch all task
//@route    GET /api/task
//@access   public
//@details  List all the available tasks
const getAllTask = asyncHandler(async (req, res) => {
  const stat = req.query.status ? { status: req.query.status } : {};
  const tasks = await Task.find({ ...stat }).populate("creator").populate("creatorVolunteer");
  if (tasks) {
    res.json({ tasks });
  } else {
    res.json("NO tasks Found");
  }
});
// //@desc     fetch all task of a volunteer
// //@route    GET /api/task/user/:id
// //@access   private/volunteer
// //@details  List all the involved tasks of a volunteer
// const getAllMyTask = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   // const {pageNumber} = re.query
//   const tasks = await Involvement.find({ userId: id }).populate(
//     "taskId",
//     "name creator address description address hours people deadline startDate rewards evidence"
//   );
//   res.json({ tasks });
// });

//@desc     fetch all task of a community
//@route    GET /api/task/community/:id
//@access   private/community
//@details  List all the involved tasks of a community
const getAllCommunityTask = asyncHandler(async (req, res) => { 
  const { id } = req.params;

  const stat = req.query.status
    ? { status: req.query.status, creator: id }
    : { creator: id };

  const tasks = await Task.find({ ...stat }).populate("creator").populate('creatorVolunteer');
  res.json({ tasks });
});

//@desc     fetch all address of task
//@route    GET /api/task/address
//@access   public
//@details  List all the addresss
const getAllLocation = asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).select("address");
  res.json({ tasks });
});

//@desc     fetch all Tasks  of a address
//@route    GET /api/task/task/:address
//@access   public
//@details  List all the tasks in that address
const getTasksWithinLocation = asyncHandler(async (req, res) => {
  const {address} = req.params
  const tasks = await Task.find({ address:address}).populate("creator").populate('creatorVolunteer')
  res.json({ tasks });
});

//@desc     Update a task
//@route    PUT /api/task/:id
//@access   private/community
//@details  A community can update a task
const updateATask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate("creator").populate('creatorVolunteer');
  const evidence = await Evidence.findOne({ taskId: req.params.id });
  if (task ){
    if(!evidence){
      
      task.name = req.body.name || task.name;
      task.description = req.body.description || task.description;
      task.address = req.body.address || task.address;
      task.hours = req.body.hours || task.hours;
      task.people = req.body.people || task.people;
      task.deadline = req.body.deadline || task.deadline;
      task.startDate = req.body.startDate || task.startDate;
      task.rewards = req.body.rewards || task.rewards;
      task.evidence = req.body.evidence || task.evidence;
      task.priority = req.body.priority || task.priority
      task.status = req.body.status || task.status
      task.locationOnMap = req.body.locationOnMap || task.locationOnMap
      await task.save();
      res.status(200).json({task});

    }else{
      res.status(403);
    throw new Error("Evidence already exists for the task. Cannot edit now.");
    }
  }else{
    res.status(400);
    throw new Error("Task couldn't not be updated");
  }
 
 
});

//@desc     Update a task
//@route    PUT /api/task/:id
//@access   private/community
//@details  A community can fetch a task data
const getATask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({_id:id}).populate("creator").populate('creatorVolunteer');
  res.json(task);
});

// //@desc     enroll in  a task
// //@route    POST /api/task/:id
// //@access   private/volunteer
// //@details  A volunteer can join a task
// const enrollInATask = asyncHandler(async (req, res) => {
//   const { userId, taskId } = req.params;
//   const involvement = await Involvement.findOne({ userId, taskId });

//   const task = await Task.findOne({ _id: taskId });

//   if (task.enrolledPeople.length === task.people) {
//     res.json("This task already has enough volunteers.");
//   }

//   if (involvement) {
//     res.json("You have already enrolled");
//   } else {
//     const inv = new Involvement({
//       taskId,
//       userId,
//       status: "active",
//     });
//     task.enrolledPeople = [...task.enrolledPeople, { id: userId }];
//     await task.save();
//     if (inv) {
//       res.json(inv);
//     } else {
//       res.json("Something went wrong, Please try again");
//     }
//   }
// });

//@desc     leave a task
//@route    DELETE /api/task/:id
//@access   private/volunteer
//@details  A community can leave a task
// const leaveATask = asyncHandler(async (req, res) => {
//   const { userId, taskId } = req.params;
//   await Involvement.findOneAndDelete({ userId, taskId });
//   res.json("You have left a task");
// });

const deleteATask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Task.findByOneAndDelete({ _id: id });
  res.json();
});

export {
  // enrollInATask,
  // leaveATask,
  createTask,
  getAllTask,
  // getAllMyTask,
  getAllCommunityTask,
  updateATask,
  createMultipleTask,
  getATask,
  deleteATask,
  getAllLocation,
  getTasksWithinLocation
};
