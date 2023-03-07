import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic<{
  url?: string;
}>(import("swagger-ui-react"), { ssr: false });

function Docs() {
  return (
    <main>
      <SwaggerUI url="/api/swagger.json" />
    </main>
  );
}
export default Docs;
