import express from "express";
import { createUser,getUserByUid,getLevels} from "../controllers/userController.js";

const router = express.Router();


router.post("/", createUser);

// get user by using the token (UID)
router.get("/levels",getLevels)

router.get("/:uid" , getUserByUid)

//getting all the levels (for testing pourpse)





export default router;