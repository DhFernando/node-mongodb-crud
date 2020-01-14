var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient 
var objectID = require('mongodb').ObjectID 

var url = "mongodb://localhost:27017/";
var updateData= []
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template/index', { title: 'Express' , condition : !true , numbers: [1,2,3] });
});

router.get('/todos/',function(req,res,next){
  var todos = []
  mongo.connect(url,function(err,db){
    var dbo = db.db("acme");
    var cursor = dbo.collection('todos').find();
    cursor.forEach(function(doc,err){
      if (err) throw err;
      todos.push(doc) 
    })
    db.close();
    res.render('template/todo',{title:"TODOS",todos:todos,update:{exist:true,updateData:updateData}})
  })
})

router.post('/todos/insert',function(req,res,next){
  var todo = {
    work : req.body.work,
    where : req.body.where
  };

  mongo.connect(url, function(err, db){
    var dbo = db.db("acme");
    dbo.collection("todos").insertOne(todo, function(err, res) {
      if (err) throw err;
      db.close();
    })
  })
  res.redirect('/todos/')
})

router.get('/todos/toUpdateFrom/:id',function(req,res,next){
  var id =  req.params.id
  mongo.connect(url,function(err,db){
    var dbo = db.db("acme");
    updateDatagetQuery = dbo.collection('todos').find({'_id':objectID(id)});
    updateDatagetQuery.forEach(function(doc,err){
      if (err) throw err;
      updateData.push(doc) 
    })
    db.close();
    res.redirect('/todos/')
  })
})

router.get('/todos/removeTodo/:id',function(req,res,next){
  var id =  req.params.id
  mongo.connect(url,function(err,db){
    var dbo = db.db("acme");
    dbo.collection('todos').deleteOne({'_id':objectID(id)},function(err,result){
      db.close()
    })
  })
  res.redirect('/todos/')
})

router.post('/todos/update/',function(req,res,next){
  var updatedTodo =  {
                      id:req.body.id,
                      work:req.body.work,
                      where:req.body.where
                    }
  mongo.connect(url,function(err,db){
    var dbo = db.db("acme");
    dbo.collection('todos').updateOne({'_id':objectID(updatedTodo.id)},{$set:updatedTodo},function(err,result){
      db.close()
      updateData=[]
    })
  })
  res.redirect('/todos/')
})

router.get('/test/:id/:id2', function(req, res, next) {
    res.render('template/test', { 
      output : {
        id1 : req.params.id,
        id2 : req.params.id2
    } 
  });
});
// ** one way
router.post('/test/',function(req,res,next){
    res.render('template/test', { 
      output : {
        id1 : req.body.id,
        id2 : 09
    } 
  });
})

//** an other what
// router.post('/test/submit',function(req,res,next){
//   var id = req.body.id;
//   res.redirect('/test/'+id+'/9')
// });
//



router.get('/details', function(req, res, next) {
  res.send('details');
});
module.exports = router;
