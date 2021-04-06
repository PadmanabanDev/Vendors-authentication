const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
// welcome page
router.get("/", (req, res) => {
  res.render("welcome");
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name,
    product: req.user.productName,
    state: req.user.state,
    city: req.user.city,
    Description: req.user.productDescription,
    material:req.user.productType,
    
  });
});

module.exports = router;
