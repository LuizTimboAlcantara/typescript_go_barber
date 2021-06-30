import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

import CreateUserService from "../services/CreateUserService";
import UpdateAvatarUserService from "../services/UpdateAvatarUserService";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    try {
      const updateAvatarUserService = new UpdateAvatarUserService();

      const user = await updateAvatarUserService.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

export default usersRouter;