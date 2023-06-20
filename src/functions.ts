export const getRequestMethod = (value: any): string => {
  return Object.keys(value)[0];
};

export const getRequestData = (value: any) => {
  return Object.values(value)[0];
};

export const getElementColor = (value: RequestMethod) => {
  switch (value) {
    case "get":
      return "bg-blue-50 border-blue-400";
    case "post":
      return "bg-green-50 border-green-400";
    case "delete":
      return "bg-red-50 border-red-400";
    case "put":
      return "bg-yellow-50 border-yellow-400";
    case "patch":
      return "bg-purple-50 border-purple-400";
    case "options":
      return "bg-indigo-50 border-indigo-400";
    case "head":
      return "bg-pink-50 border-pink-400";
    default:
      return "bg-gray-50 border-gray-400";
  }
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
