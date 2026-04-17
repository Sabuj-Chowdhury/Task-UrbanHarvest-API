import { CertificationStatus, Prisma, Role } from "@prisma/client";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { userSearchableFields } from "../user/user.constants";
import { prisma } from "../../config/prismaInstance";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

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

// get all vendor where certification is pending
const getVendorProfiles = async () => {
  const vendors = await prisma.vendorProfile.findMany({
    where: {
      certificationStatus: CertificationStatus.PENDING,
    },
  });

  return vendors;
};

const verifyCertification = async (
  vendorId: string,
  status: CertificationStatus,
) => {
  return await prisma.$transaction(async (tx) => {
    //  vendor
    const vendor = await tx.vendorProfile.findUniqueOrThrow({
      where: { id: vendorId },
    });

    //  certification exists
    const certification = await tx.sustainabilityCert.findFirst({
      where: { vendorId },
    });

    if (!certification) {
      throw new AppError(httpStatus.NOT_FOUND, "Certification not submitted");
    }

    const previousStatus = vendor.certificationStatus;

    // Prevent duplicate state
    if (previousStatus === status) {
      throw new AppError(httpStatus.BAD_REQUEST, "Already in this state");
    }

    //  Update vendor certification status
    const updatedVendor = await tx.vendorProfile.update({
      where: { id: vendorId },
      data: {
        certificationStatus: status,
      },
    });

    // update roles
    if (status === CertificationStatus.APPROVED) {
      await tx.user.update({
        where: { id: vendor.userId },
        data: { role: Role.VENDOR },
      });
    }

    if (
      status === CertificationStatus.REJECTED &&
      previousStatus === CertificationStatus.APPROVED
    ) {
      await tx.user.update({
        where: { id: vendor.userId },
        data: { role: Role.CUSTOMER },
      });
    }

    return updatedVendor;
  });
};

const getAllOrders = async (options: IOptions, filter: any) => {
  const { page, limit, skip, sort, order } = paginationHelper(options);
  const { search, ...filterData } = filter;

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          status: {
            equals: search as any,
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const where: Prisma.OrderWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const data = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sort]: order },
    include: {
      user: true,
      produce: true,
      vendor: true,
    },
  });

  const total = await prisma.order.count({ where });

  return {
    meta: { page, limit, total },
    data,
  };
};

const getAllProduce = async (options: IOptions, filter: any) => {
  const { page, limit, skip, sort, order } = paginationHelper(options);
  const { search, ...filterData } = filter;

  const andConditions: Prisma.ProduceWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const where: Prisma.ProduceWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const data = await prisma.produce.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sort]: order },
    include: {
      vendor: true,
    },
  });

  const total = await prisma.produce.count({ where });

  return {
    meta: { page, limit, total },
    data,
  };
};

const getAllRentalSpaces = async (options: IOptions, filter: any) => {
  const { page, limit, skip, sort, order } = paginationHelper(options);
  const { search, ...filterData } = filter;

  const andConditions: Prisma.RentalSpaceWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { location: { contains: search, mode: "insensitive" } },
        { size: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const where: Prisma.RentalSpaceWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const data = await prisma.rentalSpace.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sort]: order },
    include: {
      vendor: true,
    },
  });

  const total = await prisma.rentalSpace.count({ where });

  return {
    meta: { page, limit, total },
    data,
  };
};

export const AdminServices = {
  getAllUsers,
  getVendorProfiles,
  verifyCertification,
  getAllOrders,
  getAllProduce,
  getAllRentalSpaces,
};
