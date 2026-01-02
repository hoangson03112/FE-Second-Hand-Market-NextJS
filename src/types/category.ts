export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  subCategories: ISubCategory[];
}
export interface ICategoryResponse {
  data: ICategory[];
}
export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
}
