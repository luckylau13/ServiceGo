import catData from "../data/categories.json";
import profileData from "../data/profile.json";
import _ from "underscore";

import { Profile } from "../models/profile.model";

export const getHomePage = (req, res, next) => {
  res.render("homepage");
};

// Search Controller
export const getSearch = (req, res, next) => {
  res.render("searchpage");
};

export const getSearchCategory = (req, res) => {
  // TODO: GET data from DB
  res.json(catData);
};

export const getSearchedProfile = async (req, res) => {
  const profile = await Profile.find();

  let profiles = profile.filter(pro => {
    if (pro.provider) {
      let type = req.body.type;
      const regEx = new RegExp(`^${type}`, "gi");
      return pro.category.match(regEx);
    }
  });

  res.json(profiles);
};

// Returns a object by checking whether some one is logged in or not.
export const checkLoggedIn = (req, res) =>
  req.user ? res.json({ loggedIn: true }) : res.json({ loggedIn: false });
