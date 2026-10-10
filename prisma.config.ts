import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    // Map your contract configuration directly
      contract: "./src/prisma/contract.ts", 
    
    // Map the generated targets
    output: "./src/prisma",
    
    db: { 
      connection: "postgresql://postgres.ggurnjxifrnongninhoq:9531823Pp!239854tHi@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    },
  }),
});