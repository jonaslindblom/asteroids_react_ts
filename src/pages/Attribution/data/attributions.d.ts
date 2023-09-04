declare module "*.json" {
  const value: {
    name: string;
    author: string;
    licenseType: string;
    link: string;
  }[];
  export default value;
}
