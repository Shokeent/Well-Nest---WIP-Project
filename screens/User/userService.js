import { db, auth } from '../../utils/firebaseConfig';

const addUserProfile = (userId, userData) => {
  return db.collection("users").doc(userId).set({
    ...userData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
  .then(() => console.log("User profile added"))
  .catch(error => console.error("Error adding user profile:", error));
};
