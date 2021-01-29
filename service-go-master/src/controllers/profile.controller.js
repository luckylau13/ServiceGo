import { Profile } from "../models/profile.model";
import { Review } from "../models/review.model";
import fs from "fs";

var mockProfileList = [
  { id: 1, firstName: "Yuhao", lastName: "Pan" },
  { id: 2, firstName: "Bowen", lastName: "Han" },
  { id: 3, firstName: "Jack", lastName: "Zhao" },
  { id: 4, firstName: "Tom", lastName: "Lee" }
];

export const logTheProfileListController = (req, res) => {
  res.render("profileList", { Profile: mockProfileList, title: "test" });
};

export const logTheProfileController = (req, res) => {
  res.render("profile");
};

export const getProfile = (req, res, next) => {
  Profile.findOne({ handle: req.params.handle })
    .then(pRespond => {
      Review.find({serviceProvider: pRespond.userId}).then(respond=>{
        var sum = 0;
        for(var i in respond){
          sum += respond[i].stars;
        }
        var review = sum/respond.length;
        res.render("profile", {
          handle: req.params.handle,
          profile: pRespond,
          review,
        });
      });
    })
    .catch(err => console.log(err));
};

export const uploadImage = (req, res) => {
  var file =
    req.file.destination + "/" + req.file.filename + req.file.originalname;
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      // res.json({
      //   message: 'File uploaded successfully',
      //   filename: req.file.filename
      // });
      Profile.findOneAndUpdate(
        {
          email: req.query.email
        },
        {
          $set: {
            photoName: req.file.filename + req.file.originalname
          }
        },
        {
          new: true
        }
      ).then(response => {
        res.redirect("/user/edit-profile");
      });
    }
  });
};
