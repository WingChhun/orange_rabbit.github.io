/*
Require
Express, BodyParser, InstagramPosts, InstagramAnalytics.
*/
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  instagramPosts = require("instagram-posts"),
  instagramAnalytics = require("instagram-analytics"),
  instaProfilePhoto = require("instagram-profile-picture");



//CONFIGURATION
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");




//ROUTES

app.get("/", function(req, res) {

  var ipp = "";
  var instaUser = {};
  //call instagram profile photo
  instaProfilePhoto("wingchhun").then(user => {
    ipp = user;
    //call instagram analytics
    instagramAnalytics('wingchhun').then(stats => {
      //console.log(stats);
      //create object of instaUser

      instaUser = {
        userName: stats.username,
        description: stats.description,
        followers: stats.followers,
        following: stats.following,
        fullName: stats.fullName,
        numPosts: stats.posts,
        linkInsta: stats.url
      };
      //end of instagram analytics

      //Call instagramposts
      instagramPosts('wingchhun', {
        count: 5
      }).then(posts => {


        //render index.ejs
        res.render("index", {
          posts: posts,
          userInfo: instaUser,
          user: ipp
        });

      });
    });
  });
});
//Go here when user types somethnig in search box, by default it will go here.
app.post("/search", function(req, res) {

  var searchUser = req.body.searchUser,
    ipp = "",
    instaUser = {};

  //call instagram profile photo
  instaProfilePhoto(searchUser).then(user => {
    ipp = user;
    //call instagram analytics
    instagramAnalytics(searchUser).then(stats => {
      //console.log(stats);
      //create object of instaUser

      instaUser = {
        userName: stats.username,
        description: stats.description,
        followers: stats.followers,
        following: stats.following,
        fullName: stats.fullName,
        numPosts: stats.posts,
        linkInsta: stats.url
      };
      //end of instagram analytics

      //Call instagramposts
      instagramPosts(searchUser, {
        count: 6
      }).then(posts => {

        console.log(posts);
        //render index.ejs
        res.render("search", {
          posts: posts,
          userInfo: instaUser,
          user: ipp
        });

      });
    });
  });
});
app.get("*", function(req, res) {
  res.redirect("/");
});

//START SERVER
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("server has started!");
});
