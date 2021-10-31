const Users = require("../../model/users");

module.exports = {
  checkPhoneNo: async (req, res) => {
    try {
      const phoneNo = req.params.phone;
      if (phoneNo && phoneNo !== "" && phoneNo !== null) {
        const checkUser = await Users.find({ $or: [{ phone: phoneNo }] });
        console.log(checkUser);
        if (checkUser.length === 0) {
          res.status(200).json({ status: "success" });
        } else {
          res
            .status(203)
            .json({ status: "error", error: "Already registered" });
        }
      } else {
        res
          .status(203)
          .json({ status: "error", error: "Sorry! Something went wrong." });
      }
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  },
};
