import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";

import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import UpdateAvatarUserService from "@modules/users/services/UpdateAvatarUserService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const usersRepository = new UsersRepository();
  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({ name, email, password });

  return response.json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const updateAvatarUserService = new UpdateAvatarUserService(usersRepository);

    const user = await updateAvatarUserService.execute({
      user_id: request.user.id,
      avatarFilename: request.file!.filename,
    });

    return response.json(user);
  }
);

export default usersRouter;
