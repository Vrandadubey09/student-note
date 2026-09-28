const { MongoClient } = require("mongodb");

async function initReplicaSet() {
  const uri = "mongodb://127.0.0.1:27018/?directConnection=true";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB on port 27018.");
    const admin = client.db("admin");
    const status = await admin.command({ replSetInitiate: {} });
    console.log("Replica Set initiated successfully:", status);
  } catch (err) {
    if (err.message.includes("already initialized")) {
      console.log("Replica set is already initialized.");
    } else {
      console.error("Error initiating replica set:", err.message);
    }
  } finally {
    await client.close();
  }
}

initReplicaSet();
