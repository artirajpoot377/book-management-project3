const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken")

const {nameValidate, phoneValidate, emailValidate, passValidate} = require("../validations/validators");

//__create_user
const createUser = async  (req, res) => {
  try {
    let userdata = req.body;

    if (Object.keys(userdata) == 0){
        return res.status(400).send({ status: false, msg: "please provide neccessary details" });
    }

    let { title, name, phone, email, password, address } = userdata;

    if (!title || !name || !phone || !email || !password){
      return res.status(400).send({status: false,msg: "title/name/phone/email/password is mandatory",});
    }

    if (title !== "Mr" && title !== "Miss" && title !== "Mrs"){
      return res.status(400).send({ status: false, msg: "title should be in Mr/Mrs/Miss" });
    }

    if (!nameValidate.test(name)){
      return res.status(400).send({ status: false, msg: "enter valid name" });
    } 

    if (!phoneValidate.test(phone)){
      return res.status(400).send({ status: false, msg: " enter a valid mobile number" });
    }

    let CheckPhoneInDB = await userModel.findOne({ phone: phone });
    if (CheckPhoneInDB){
      return res.status(403).send({ status: false, msg: "phone number is already exists" });
    }

    if (!emailValidate.test(email)){
      return res.status(400).send({ status: false, msg: "enter a valid email" });
    }

    let checkEmailInDB = await userModel.findOne({ email: email });
    if (checkEmailInDB){
      return res.status(403).send({ status: false, msg: "email is already exits" });
    }

    if(!passValidate.test(password)){
        return res.status(400).send({status:false, msg:"password must between(8 to 15) and one UPPER case and one lower case"})
    }

    const createdUser = await userModel.create(userdata);
    return res.status(201).send({ status: true, data: createdUser });

  } catch (err) {
    console.log("catch err", err);
    return res.status(500).send({ status: false, msg: err.message });
  }
};



//__login_user



module.exports.createUser = createUser
