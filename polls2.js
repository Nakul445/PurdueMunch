const db = firebase.firestore();
const pollRef = db.collection('polls').doc('cookie-poll');

const dish1Btn = document.getElementById('dish1-btn');
const dish2Btn = document.getElementById('dish2-btn');
const dish3Btn = document.getElementById('dish3-btn');
const dish1Progress = document.getElementById('dish1-progress');
const dish2Progress = document.getElementById('dish2-progress');
const dish3Progress = document.getElementById('dish3-progress');
const dish1Percentage = document.getElementById('dish1-percentage');
const dish2Percentage = document.getElementById('dish2-percentage');
const dish3Percentage = document.getElementById('dish3-percentage');

// Real-time listener — re-renders whenever any user votes
pollRef.onSnapshot((doc) => {
    if (!doc.exists) {
        pollRef.set({ dish1: 0, dish2: 0, dish3: 0 });
        return;
    }
    const { dish1, dish2, dish3 } = doc.data();
    updateUI(dish1, dish2, dish3);
});

function updateUI(d1, d2, d3) {
    const total = d1 + d2 + d3;
    const pct = (v) => total === 0 ? 0 : (v / total) * 100;

    dish1Progress.style.width = `${pct(d1).toFixed(1)}%`;
    dish2Progress.style.width = `${pct(d2).toFixed(1)}%`;
    dish3Progress.style.width = `${pct(d3).toFixed(1)}%`;

    dish1Percentage.textContent = `${pct(d1).toFixed(1)}%`;
    dish2Percentage.textContent = `${pct(d2).toFixed(1)}%`;
    dish3Percentage.textContent = `${pct(d3).toFixed(1)}%`;
}

const increment = firebase.firestore.FieldValue.increment(1);

dish1Btn.addEventListener('click', () => pollRef.update({ dish1: increment }));
dish2Btn.addEventListener('click', () => pollRef.update({ dish2: increment }));
dish3Btn.addEventListener('click', () => pollRef.update({ dish3: increment }));
