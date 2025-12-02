const validater = require("validator");

function validate(req) {
  const { firstName, lastName, emailId, password } = req.body;

  if (validater.isEmpty(firstName) || validater.isEmpty(lastName)) {
    throw new Error("Invalid Name");
  } else if (!validater.isEmail(emailId)) {
    throw new Error("Invalid Email!");
  } else if (!validater.isStrongPassword(password)) {
    throw new Error("Password Must Be Strong Password!");
  }
  return true;
}

function validateAllowedItems(req) {
  const allowedItems = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoURL",
    "about",
    "skills",
  ];
  const UserReqItems = Object.keys(req.body);

  // console.log(UserReqItems);

  if (UserReqItems.every((keys) => allowedItems.includes(keys))) return true;
}

module.exports = {
  validate,
  validateAllowedItems,
};
