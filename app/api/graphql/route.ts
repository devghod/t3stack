import { NextRequest } from "next/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { server } from "@/graphql/users";

const handler = startServerAndCreateNextHandler<NextRequest>(server);
export { handler as GET, handler as POST };