const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", 
{ useNewUrlParser: true,useUnifiedTopology: true })
.then(res => console.log('Connected to db'));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema);

//requests targeting all articles

app.route("/articles")

.get(function(req, res){
    Article.find({}, function(err, foundArticle){
            if(!err){
                res.send(foundArticle);
                
            }else{
                res.send(err)
            }
    });

})


.post(function(req, res){
    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });    
    newArticle.save(function(err){
       if(!err){
        res.send("Successfully added a new article");
       }else{
           res.send(err);
       }
    });
    })


.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
         res.send("Successfully deleted all items!"); 
        }else{
         res.send(err);
                }
    })
})

//requests targeting specific articles

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title:req.params.articleTitle}, function(err, foundItem){
        if(!err){
            res.send(foundItem);
        }else{
            res.send("No article matchig that title was found");
        }
    });
})

.put(function(req, res){
    Article.update({title:req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite:true},
        function(err){
  if(!err){
      res.send("Successfully updated article");
  }    else{
      res.send("Article could ot be updated!")
  }  
    });
})

.patch(function(req, res){
    Article.update({title:req.params.articleTitle}, 
        {$set: req.body},
        function(err){
  if(!err){
      res.send("Successfully updated article");
  }    else{
      res.send("Article could ot be updated!")
  }  
    });
})

.delete(function(req, res){
    Article.deleteOne({title:req.params.articleTitle}, 
                function(err){
  if(!err){
      res.send("Successfully deleted article");
  }    else{
      res.send("Article could ot be deleted!")
  }  
    });
})

app.listen(3000, function(){
    console.log("Server started on port 3000");   
})
