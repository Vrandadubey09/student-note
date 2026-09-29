const { PrismaClient } = require("@prisma/client");

let dbUrl =
  process.env.DATABASE_URL ||
  "mongodb+srv://vrandad8_db_user:kAtQR83HpgYgl4DM@cluster0.tuat1dh.mongodb.net/studentnotes?appName=Cluster0";

// Automatically correct any cluster hostname typo (letter 'l' instead of number '1')
if (dbUrl.includes("tuatldh.mongodb.net")) {
  dbUrl = dbUrl.replace("tuatldh.mongodb.net", "tuat1dh.mongodb.net");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

module.exports = prisma;
