import { withSwagger } from "next-swagger-doc";
import packageJson from "../../../package.json";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Client Portal API",
      version: packageJson.version,
    },
  },
  apiFolder: "src/pages/api",
});
export default swaggerHandler();
