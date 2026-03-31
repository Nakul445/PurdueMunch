const auth = firebase.auth();
const submitBtn = document.getElementById('submit');
const errorDiv = document.getElementById('error');

submitBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            errorDiv.style.display = 'none';
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'index.html';
        })
        .catch(() => {
            errorDiv.style.display = 'block';
        });
});
