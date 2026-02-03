export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  status?: "active" | "inactive";
  subCategories: ISubCategory[];
}
export interface ICategoryResponse {
  data: ICategory[];
}
export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  status?: "active" | "inactive";
}
