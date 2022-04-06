function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function habitCreate() {
    $.post('habit_create', {
        description: $('#description').val()
    }, function(data) {
        refreshPage();
    });
}

function habitUpdate(habitId) {
    $.post('habit_update', {
        id_: habitId,
        description: $('#description').val()
    }, function(data) {
        refreshPage();
    });
}

function habitDelete(habitId) {
    $.get('habit_delete', {
        id_: habitId,
        description: $('#description').val()
    }, function(data) {
        refreshPage();
    });
}