import fs from "fs";
import path from "path";
import { getRepository } from "typeorm";

import uploadConfig from "@config/upload";

import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateAvatarUserService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError("Only authenticated users can change avatar.", 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateAvatarUserService;
