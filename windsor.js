const db = firebase.firestore();
const auth = firebase.auth();

const itemRows = document.querySelectorAll("[data-item]");
let currentUser = null;
let userLikes = {}; // { "Quinoa and Potato Salad": true, ... }

// ---------- Auth state ----------
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  if (user) {
    const userDoc = await db.collection("userLikes").doc(user.uid).get();
    userLikes = userDoc.exists ? (userDoc.data().items || {}) : {};
  } else {
    userLikes = {};
  }
  refreshHeartIcons();
});

function refreshHeartIcons() {
  itemRows.forEach((row) => {
    const itemName = row.dataset.item;
    const icon = row.querySelector(".icon-toggle");
    if (userLikes[itemName]) {
      icon.classList.remove("bi-heart");
      icon.classList.add("bi-heart-fill", "heart-fill");
    } else {
      icon.classList.remove("bi-heart-fill", "heart-fill");
      icon.classList.add("bi-heart");
    }
  });
}

// ---------- Global totals (real-time) ----------
itemRows.forEach((row) => {
  const itemName = row.dataset.item;
  const counter = row.querySelector(".like-counter");

  db.collection("itemTotals").doc(itemName).onSnapshot((doc) => {
    const count = doc.exists ? (doc.data().count || 0) : 0;
    counter.textContent = count;
  });
});

// ---------- Click handling ----------
itemRows.forEach((row) => {
  const itemName = row.dataset.item;
  const icon = row.querySelector(".icon-toggle");

  icon.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Please log in to like items.");
      return;
    }

    const alreadyLiked = !!userLikes[itemName];
    const userRef = db.collection("userLikes").doc(currentUser.uid);
    const totalRef = db.collection("itemTotals").doc(itemName);

    try {
      await db.runTransaction(async (transaction) => {
        const totalDoc = await transaction.get(totalRef);
        const currentCount = totalDoc.exists ? (totalDoc.data().count || 0) : 0;
        const newCount = alreadyLiked
            ? Math.max(0, currentCount - 1)
            : currentCount + 1;

        transaction.set(totalRef, { count: newCount }, { merge: true });

        // Ensure the user doc exists, then update just this item field
        transaction.set(userRef, { items: {} }, { merge: true });
        const itemUpdate = {};
        itemUpdate[`items.${itemName}`] = alreadyLiked
            ? firebase.firestore.FieldValue.delete()
            : true;
        transaction.update(userRef, itemUpdate);
      });

      // Update local state + UI immediately
      if (alreadyLiked) {
        delete userLikes[itemName];
      } else {
        userLikes[itemName] = true;
      }
      refreshHeartIcons();
    } catch (err) {
      console.error("Failed to update like:", err);
      alert("Could not save your like. Please try again.");
    }
  });
});