import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { userSearchableFields } from "../user/user.constants";
import { prisma } from "../../config/prismaInstance";

// get all user service
const getAllUsers = async (options: IOptions, filter: any) => {
  const { page, limit, skip, sort, order } = paginationHelper(options);
  const { search, ...filterData } = filter;

  const prismaAndConditions: Prisma.UserWhereInput[] = [];

  if (search) {
    prismaAndConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    prismaAndConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // console.log(prismaAndConditions);
  const whereConditions: Prisma.UserWhereInput =
    prismaAndConditions.length > 0
      ? {
          AND: prismaAndConditions,
        }
      : {};

  const users = await prisma.user.findMany({
    skip,
    take: limit,

    where: whereConditions,
    orderBy: {
      [sort]: order,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: users,
  };
};

export const AdminServices = {
  getAllUsers,
};
