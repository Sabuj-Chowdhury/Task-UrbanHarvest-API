import { Role } from "@prisma/client";
import { envVariable } from "../config/env";
import { prisma } from "../config/prismaInstance";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findUnique({
      where: {
        email: envVariable.ADMIN_EMAIL,
      },
    });
    if (isSuperAdminExist) {
      console.log("ADMIN already exist!");
      return;
    }

    console.log("Trying to create Super Admin .....");

    const hashedPassword = await bcryptjs.hash(
      envVariable.ADMIN_PASSWORD,
      Number(envVariable.BCRYPT_SALT_ROUND),
    );

    const payload = {
      name: "Admin",
      email: envVariable.ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
    };
    const admin = await prisma.user.create({
      data: payload,
    });
    console.log("Super Admin Created successfully! \n");
    console.log(admin);
    return admin;
  } catch (error) {
    console.log(error);
  }
};
