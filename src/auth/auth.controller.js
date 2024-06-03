import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-JWT.js";
import User from "../modules/user/user.model.js";
import {validateCommunity, validateExistentEmail, validateEmail, validatePassword } from "../helpers/data-methods.js";

export const register = async (req, res) => {
  const { name, lastName, phone, email, pass, img, idCommunity } = req.body;
  let role;
  let user;
  try {
    validateExistentEmail(email);
    validateEmail(email);
    // validateCommunity(idCommunity);
    validatePassword(pass);

    if (email.includes("admin.god.gt")){
      role = "Sp_ADMIN";
    } else if (email.includes("admin.org.gt")) {
      role = "ADMIN";
    } else {
      role = "USER"; 
    }

    user = new User({ name, lastName, phone, email, pass, img, role, idCommunity });
    const salt = bcryptjs.genSaltSync();
    user.pass = bcryptjs.hashSync(pass, salt);
    await user.save();
    res.status(200).json({user});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, pass } = req.body;
  
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .send("Upss!, email or password are incorrect.");
    }

    if (!user.status) {
      return res.status(400).send("Upss!, user is not active. Contact the administrator.");
    }

    const validPassword = await bcryptjs.compareSync(pass, user.pass);

    if (!validPassword) {
      return res.status(400).send("Upss!, email or password are incorrect.");
    } else {
      const token = await generateJWT(user.id, user.email);

      res.status(200).json({
        msg: "Login ok",
        userDetails: {
          id: user._id,
          name: user.name,
          email: user.email,
          img: user.img,
          role: user.role,
          status: user.status,
          token: token,
        },
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Please contact the administrator/support.",
    });
  }
};
