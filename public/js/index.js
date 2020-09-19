const token = window.location.search.match(/\?token=([0-9a-zA-Z@\.\-_]+)/)[1];
if (token) {
    localStorage.setItem('token', token);
}