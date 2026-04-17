export interface IOptions {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  order?: string;
}

interface IResponse {
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: string;
}

export const paginationHelper = (options: IOptions): IResponse => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;

  const sort: string = options.sort || "createdAt";
  const order: string = options.order || "desc";

  return { page, limit, skip, sort, order };
};
