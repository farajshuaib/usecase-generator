interface Swagger {
  "x-generator": string;
  swagger: string;
  info: SwaggerInfo;
  host: string;
  schemes: string[];
  produces: string[];
  paths: SwaggerPaths;
  definitions: SwaggerDefinitions;
  securityDefinitions: securityDefinitions;
  security: SwaggerSecurity[];
}

interface SwaggerPaths {
  [key: string]: SwaggerPathKeys;
}
interface SwaggerInfo {
  title: string;
  version: string;
}
interface SwaggerDefinitions {
  [key: string]: any;
}

interface SwaggerDefinitionProperty {
  type: "object" | "string" | "integer" | "array" | "boolean" | "number";
  required: string[];
  properties: object;
}

interface securityDefinitions {}
interface SwaggerSecurity {}

type RequestMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "options"
  | "head"
  | "patch";

interface SwaggerPathKeys {
  [key: RequestMethod]: SwaggerPathOptions;
}

interface SwaggerPathOptions {
  tags: string[];
  operationId: string;
  parameters: SwaggerPathParameter[];
  responses: {
    "200": SwaggerPathResponse;
  };
  security: [];
}

interface SwaggerPathParameter {
  type: string;
  name: string;
  in: "query" | "body" | "path" | "formData" | "header";
  "x-nullable": boolean;
  enum?: string[] | number[];
  description: string;
}

interface SwaggerPathResponse {
  "x-nullable": boolean;
  description: string;
  schema: {
    $ref: string;
  };
}

interface ReqestContent {
  method: RequestMethod;
  url: string;
  boadyParamns: any[];
  queryParamns: any[];
  operationId: string;
  response: any;
}
