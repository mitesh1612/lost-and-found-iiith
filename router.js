var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var multer	=	require('multer');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var app = express();
var router = express.Router();
var User = require('./models/user');
var LostItem = require('./models/LostItem');
var FoundItem = require('./models/FoundItem');
var ClaimItem = require('./models/Claim');
var ClaimFoundItem = require('./models/ClaimFound');
var sessi;
var storage = multer.diskStorage({
  destination: function(req,res,cb) {
    cb(null,'uploads/');
  },
  filename: function(req,file,cb) {
    cb(null,file.originalname);
  }
});
var upload = multer({
  storage: storage
});
// router.get('/',(req,res)=>{
//   res.render('pages/test',{"sess" : req.session.email});
// });
router.get('/',(req,res)=> {
  // res.render('pages/index',{"sess" : req.session});
  res.render('pages/FrontPage/index',{"sess" : req.session});
});
router.get('/SignUplogin',(req,res)=> {
  res.render('pages/login',{"sess" : req.session});
});
router.get('/postLostItem',(req,res)=> {
  // res.render('pages/postLostItem',{"sess" : req.session.email});
  res.render('pages/postLostPage/postLostItem',{"sess" : req.session});
});
router.get('/postFoundItem',(req,res)=> {
  // res.render('pages/postFoundItem',{"sess" : req.session.email});
  res.render('pages/postFoundPage/postFoundItem',{"sess" : req.session});
});

/**/
/*RMS: Unregistered User*/
router.get('/UnregisteredUser',(req,res)=>{
  // res.render('pages/UnregisteredUser',{"sess" : req.session.email});
  res.render('pages/errorPage/UnregisteredUser');
});
/**/

/**/
/*RMS: Unregistered User*/
router.get('/aboutUs',(req,res) => {
  res.render('pages/aboutUsPage/aboutUs');
})
/**/

/* -------------------------------------------------------------------------------------------- */
/*RMS: Register And Login  */
router.post('/register',urlencodedParser,(req,res,next) => {
  if(req.body.passwd!=req.body.cnfpwd)
  {
    var err = new Error('Passwords Do Not Match.');
    err.status = 400;
    res.send("Passwords Don't Match");
    return next(err);
  }
  else {
    if(req.body.username && req.body.emailid && req.body.passwd && req.body.cnfpwd)
    {
      var userData = {
        email: req.body.emailid,
        username: req.body.username,
        password: req.body.passwd,
        passwordConf: req.body.cnfpwd,
      }
      var emailID=req.body.emailid;
      var emailValid = /[a-z0-9]{1,}\@students\.iiit\.ac\.in/;
      //console.log(emailValid.test(emailID));
      if(!emailValid.test(emailID))
      {
        res.render("pages/loginerr",{"sess" : req.session.email,"err": "Invalid emailID:Should be of type @students.iiit.ac"});
        return ;
      }
      User.find({"email" : req.body.emailid}, function(err,user) {
            if(err) {
                res.send(err);
                return;
            }
            else {
              if(user[0])
              {
                //console.log("ID already exitsss"+JSON.stringify(user));
                res.render("pages/loginerr",{"sess" : req.session.email,"err": "User Id already exists"});
                return ;
              }
              else {
                User.create(userData, (err,user) => {
                  if(err) {
                    console.log("Inside error ");
                    console.log(err);
                    //res.redirect('profile/index',{"sess" : sess});
                    return res.redirect('/');
                  }
                  else {
                    //sess=req.session;
                    req.session.userId = user._id;
                    req.session.username=user.username;
                    console.log('Sessionn id'+ req.session.userId);

                    console.log('NULL User Object Returned was: '+JSON.stringify(user));
                    console.log('Session Saved!' + user._id);
                    return res.redirect('/');
                  }
                });

              }

            }
        });


      //res.send("I inserted the data...");
    }
  }
});
router.post('/login',urlencodedParser, (req,res) => {
  if(req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail,req.body.logpassword, (err,user) => {
      if(err||!user) {
        res.render("pages/loginerr",{"sess" : req.session.email,"err": "Invalid email or password"});
        return ;
      } else {
         req.session.email=req.body.logemail;
         req.session.userID = user._id;
         req.session.userName=user.username;
         return res.redirect('/');
      }
    });
  } else {
    var err = new Error('All Fields Required');
    err.status = 400;
    return next(err);
  }
});

/*----------------------------------------------------------------------------------------------*/



/*----------------------------------------------------------------------------------------------*/
/*RMS: Post Lost or Found */
router.post('/LostItem',upload.single('myImage'),(req,res)=>{
  //console.log('Item is'+ req.body.ItemName);
  //console.log('Descr is '+ req.body.ItemDesc);
//  console.log('Date is '+ req.body.ItemDate);
  if(req.body.ItemName && req.body.ItemDesc)
  {
    var imageData = {
      Itemname: req.body.ItemName,
      ItemDescription: req.body.ItemDesc,
      MissingDate: Date.parse(req.body.ItemDate),
      postedBy: req.session.userName,
      imgPath: req.file.path
      //imgOriginalName: req.file.path
      //LostImg: req.body.LostImg,
    }
    console.log(imageData);
    LostItem.create(imageData, (err,user) => {
      if(err) {
        console.log(err);
        return res.redirect('/');
      }
      else {
        //req.session.userId = user._id;
        console.log('after creation Data Inserted');
        //console.log('NULL User Object Returned was: '+JSON.stringify(user));
        //console.log('Session Saved!' + user._id);
      return res.redirect('/');
      }
    });
    //res.send("I inserted the data...");
  }
  else {
    console.log('Cant Data Inserted');
  }
});

router.post('/FoundItem',upload.single('FoundImg'),(req,res)=>{
  //console.log('Item is'+ req.body.ItemName);
  //console.log('Descr is '+ req.body.ItemDesc);
//  console.log('Date is '+ req.body.ItemDate);
  if(req.body.ItemName && req.body.ItemDesc)
  {
    var imageData = {
      Itemname: req.body.ItemName,
      ItemDescription: req.body.ItemDesc,
      FoundDate: Date.parse(req.body.ItemDate),
      postedBy: req.session.userName,
      imgPath: req.file.path
      //LostImg: req.body.LostImg,
    }
    console.log(imageData);
    FoundItem.create(imageData, (err,user) => {
      if(err) {
        console.log(err);
        return res.redirect('/');
      }
      else {
        //req.session.userId = user._id;
        console.log('after creation Data Inserted');
        //console.log('NULL User Object Returned was: '+JSON.stringify(user));
        //console.log('Session Saved!' + user._id);
      //return res.redirect('/',{"sess" : sess});
      return res.redirect('/');
      }
    });
    //res.send("I inserted the data...");
  }
  else {
    console.log('Cant Data Inserted');
  }
});

/*-----------------------------------------------------------------------------------------------*/



/*-----------------------------------------------------------------------------------------------*/
/*RMS: CLaimed Lost or Found */

router.get('/project-detail',(req,res,next)=> {
  var id = req.query['mitesh'];
//  console.log("mitesh ki id"+id);
  LostItem.findById(id,(err, lostitem) => {
    if(err)
      return next(err);
    else {
      //console.log(lostitem);
      res.render("pages/project-detail-page",{"lostitem" : lostitem , "sess" : req.session});
    }
  });
});


router.get('/claimTable',(req,res)=>{
  var ItemId=req.query.Swati;
  var ItemName=req.query.Itemname;
  console.log('baba dukkk dukk dukkkkkk');
  ClaimItem.find({ItemId:ItemId},(err,Item)=>
{
  console.log('aabaaa jaabaa daabaaaaaaaaaaaaaa');
  if(err)
    console.log(err);
    else {
      if(!Item[0])
      {
        {
          var obj={
            ItemId: ItemId,
            Users: new Array(req.session.emailid)
          }
          ClaimItem.create(obj,(err,item) => {
            if(err) {
              console.log(err);
            }
            else {
              console.log("NEW CLAIM CREATED: "+JSON.stringify(item));
              //res.send('<p>OBJECT CLAIMED. Click <a href="/">here </a> to Redirect!</p>');
              //res.render('pages/ClaimDetail',{"sess" : req.session.email});
              console.log(item.Users);
              LostItem.find({"_id": ItemId},(err,image)=>{
                if(err)
                  throw err;
                else{
                  console.log("Image path to be used " + JSON.stringify(image));
                //  console.log(image[0].imgPath);
                //  console.log((item[0].Users));

                //  console.log("FOUND: "+JSON.stringify(item.1.Users));
                  return res.render('pages/ClaimDetail',{"sess" : req.session.email,"item" : item.Users,
                    "Itemname" : ItemName , "Imagepath" : image[0].imgPath });
                //  console.send('<p>image.imgPath</p>');
                }
              });
            }
          });
        }

      }
      else {
        //display table
          console.log("Mitesh pagal haiiiii ............................." + JSON.stringify(Item));
          ClaimItem.update({"ItemId": ItemId},
           {$push: { 'Users' : req.session.email }},{upsert:true}, function(err, data) {
              if(err)
                throw err;
              else {
              //  res.render(,{"data":data,"sess":req.session.emailid})
              console.log("New data added" + JSON.stringify(data));
              ClaimItem.find({"ItemId": ItemId},(err,item) => {
                if(err)
                  throw err;
                  else{
                    LostItem.find({"_id": ItemId},(err,image)=>{
                      if(err)
                        throw err;
                      else{
                        console.log("Image path to be used " + JSON.stringify(image));
                      //  console.log(image[0].imgPath);
                      //  console.log((item[0].Users));

                      //  console.log("FOUND: "+JSON.stringify(item.1.Users));
                      return res.render('pages/ClaimDetail',{"sess" : req.session.email,"item" : item[0].Users,
                          "Itemname" : ItemName , "Imagepath" : image[0].imgPath });
                      //  console.send('<p>image.imgPath</p>');
                      }
                    });

                }
              });
            //  res.send('<p>OBJECT CLAIMED. Click <a href="/">here </a> to Redirect!</p>');
            //console.log(data);

              }
           });
      }
    }
});
});



router.get('/ClaimFound',(req,res,next)=> {
  var id = req.query['mitesh'];
  console.log("mitesh ki id"+id);
  FoundItem.findById(id,(err,founditem) => {
    if(err)
      return next(err);
    else {
      console.log(founditem);
      res.render("pages/ClaimFound",{"founditem" : founditem , "sess" : req.session});
    }
  });
});


router.get('/claimFoundTable',(req,res)=>{
  var ItemId=req.query.ItemID;
  var ItemName=req.query.Itemname;
  ClaimFoundItem.find({ItemId:ItemId},(err,Item)=>
{
  if(err)
    console.log(err);
    else {
      if(Item)
      {
        //display table

        ClaimFoundItem.update({"ItemId": ItemId},
         {$push: { 'Users' : req.session.email }},{upsert:true}, function(err, data) {
            if(err)
              throw err;
            else {
            //  res.render(,{"data":data,"sess":req.session.emailid})
            //console.log("New data added" + JSON.stringify(data));
            ClaimFoundItem.find({"ItemId": ItemId},(err,item) => {
              if(err)
                throw err;
                else{
                  FoundItem.find({"_id": ItemId},(err,image)=>{
                    if(err)
                      throw err;
                    else{
                      res.render('pages/ClaimFoundDetail',{"sess" : req.session.email,"item" : item[0].Users,
                        "Itemname" : ItemName , "Imagepath" : image[0].imgPath });
                    }
                  });
              }
            });
            }
         });
      }
      else {
        {
          var obj={
            ItemId: ItemId,
            Users: new Array(req.session.emailid)
          }
          ClaimFOundItem.create(obj,(err,item) => {
            if(err) {
              console.log(err);
            }
            else {
              res.render('pages/ClaimFoundDetail',{"sess" : req.session.email,"item" : item[0].Users,
                "Itemname" : ItemName , "Imagepath" : image[0].imgPath });
            }
          });
        }
      }
    }
});
});

/*-----------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------*/
/*RMS: Resolve Lost Items*/

router.get('/resolveItem',(req,res) => {
  var id=req.query.Swati;
  console.log("Delete Item Id: "+id);
  LostItem.findById(id,(err,result) => {
    if(err) {
      res.send(err);
      return;
    } else {
      console.log("The Query Result: "+result);
      console.log("The User trying to delete: "+req.session.userName);
      if(result.postedBy == req.session.userName) {
        //ALLOW To DELETE
        LostItem.findByIdAndRemove(id,(err,delRes) => {
          if(err) {
            res.send(err);
            return;
          } else {
            console.log("ITEM WAS REMOVED");
            return res.redirect('/viewAllLost');
          }
        });
      } else {
        //SHOW AN ERROR
        res.render('pages/errorPage/UnauthorizedResolve');
      }
    }
  });
});

/*-----------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------*/
/*RMS: View Lost or Found Items*/

router.get('/viewAllLost',(req,res)=> {
  LostItem.find({}, function(err, lostitem) {
        if(err) {
            res.send(err);
            return;
        }
        else {
          //console.log('Object Returned was: '+JSON.stringify(lostitem));
           //console.log('Object Returned was: '+lostitem[0].Itemname);
          res.render('pages/viewAllLost',{"lostitem" : lostitem , "sess" : req.session});
        }
    });
});
router.get('/viewAllFound',(req,res)=> {
  FoundItem.find({}, function(err, viewAllFound) {
        if(err) {
            res.send(err);
            return;
        }
        else {
          //console.log('Object Returned was: '+JSON.stringify(viewAllFound));
           //console.log('Object Returned was: '+lostitem[0].Itemname);
          res.render('pages/viewAllFound',{"viewAllFound" : viewAllFound, "sess" : req.session});
        }
    });
});


/*-----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------- */
/*RMS: Searching  */
router.get('/searchFound',(req,res)=>{
  var query=req.query.searchstring;
  FoundItem.find({"Itemname": {"$regex": query}},(err,viewFound) => {
    if(err) {
      res.send(err);
      return;
    } else {
      res.render('pages/viewAllFound',{"viewAllFound" : viewFound, "sess" : req.session.email});
    }
  });
});

router.get('/searchLost',(req,res) => {
  var query=req.query.searchstring;
  LostItem.find({"Itemname": {"$regex": query}},(err,viewLost) => {
    if(err) {
        res.send(err);
        return;
    }
    else {
      res.render('pages/viewAllLost',{"lostitem" : viewLost , "sess" : req.session.email});
    }
  });
});

/*-----------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------*/
/*RMS: Logout*/
router.get('/Logout', (req,res,next) => {
  if(req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        //return res.render('pages/index',{"sess" : sess});
        return res.redirect('/');
      }
    });
  }
});
/*------------------------------------------------------------------------------------------------*/

module.exports = router;
