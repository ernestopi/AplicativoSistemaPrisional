const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = "3HcukC1v6FN98lEoz1fSxWgGus03";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Usuário agora é ADMIN!");
  })
  .catch(console.error);
