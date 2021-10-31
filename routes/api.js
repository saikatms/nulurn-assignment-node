const express = require("express");
const router = express.Router();
const { apiAuth } = require("../config/authentication");
const indexCon = require("../controller/apiController/indexCon");
const masterCon = require("../controller/apiController/masterCon");

////////////// Firebase idToken verify /////////
// router.post("/fbToken-verify", indexCon.idTokenVerify);

//Users
router.post("/sign-up", indexCon.userRegistration);
router.post("/login", indexCon.userLogin);
router.get("/logout", apiAuth, indexCon.userLogout);
router.post("/search-user", apiAuth, indexCon.searchUser);

router.post("/get-new-token", indexCon.getNewTokens);

router.get("/phone-no-check/:phone", masterCon.checkPhoneNo);

router.get("*", async (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Sorry! API your are looking for has not been found",
  });
});
router.post("*", async (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Sorry! API your are looking for has not been found",
  });
});

module.exports = router;
