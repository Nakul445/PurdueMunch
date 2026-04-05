const db = firebase.firestore();
const auth = firebase.auth();
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

let currentUser = null;
let userVote = null; // 'dish1', 'dish2', 'dish3', or null

auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        pollRef.collection('userVotes').doc(user.uid).get().then((doc) => {
            userVote = doc.exists ? doc.data().vote : null;
            highlightVotedButton(userVote);
        });
    } else {
        userVote = null;
        highlightVotedButton(null);
    }
});

function highlightVotedButton(vote) {
    [dish1Btn, dish2Btn, dish3Btn].forEach(btn => btn.classList.remove('voted'));
    if (vote === 'dish1') dish1Btn.classList.add('voted');
    else if (vote === 'dish2') dish2Btn.classList.add('voted');
    else if (vote === 'dish3') dish3Btn.classList.add('voted');
}

function castVote(newVote) {
    if (!currentUser) {
        alert('Please log in to vote.');
        return;
    }
    if (newVote === userVote) return; // Already voted for this option

    const previousVote = userVote;
    const userVoteRef = pollRef.collection('userVotes').doc(currentUser.uid);

    db.runTransaction(async (transaction) => {
        const pollDoc = await transaction.get(pollRef);
        const data = pollDoc.exists ? pollDoc.data() : { dish1: 0, dish2: 0, dish3: 0 };

        const updates = {};
        updates[newVote] = (data[newVote] || 0) + 1;
        if (previousVote) {
            updates[previousVote] = Math.max(0, (data[previousVote] || 0) - 1);
        }

        if (pollDoc.exists) {
            transaction.update(pollRef, updates);
        } else {
            transaction.set(pollRef, { dish1: 0, dish2: 0, dish3: 0, ...updates });
        }
        transaction.set(userVoteRef, { vote: newVote });
    }).then(() => {
        userVote = newVote;
        highlightVotedButton(newVote);
    });
}

// Real-time listener
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

dish1Btn.addEventListener('click', () => castVote('dish1'));
dish2Btn.addEventListener('click', () => castVote('dish2'));
dish3Btn.addEventListener('click', () => castVote('dish3'));
