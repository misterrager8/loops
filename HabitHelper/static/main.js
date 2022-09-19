$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('HabitHelper'));
});

function changeTheme(theme) {
    localStorage.setItem('HabitHelper', theme);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('HabitHelper'));
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}
