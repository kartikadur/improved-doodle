import "dotenv/config";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

async function main() {
  // console.log(
  //   "GOOGLE_APPLICATION_CREDENTIALS:",
  //   process.env.GOOGLE_APPLICATION_CREDENTIALS
  //     ? "set"
  //     : "NOT SET"
  // );

  initializeApp({
    // credential: applicationDefault(),
    projectId: process.env.GCLOUD_PROJECT || 'demo-famobi-analytics'
  });

  const db = getFirestore();


  // A harmless read that verifies authentication + Firestore access.
  await db.collection("_health").limit(1).get();

  console.log("✓ Firebase credentials are valid");
  console.log("✓ Firestore is accessible");
}

main().catch((error) => {
  console.error("✗ Firebase check failed");
  console.error(error);
  process.exit(1);
});
