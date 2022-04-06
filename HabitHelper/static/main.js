function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function habitCreate() {
    $('#spinner').show();
    $.post('habit_create', {
        description: $('#description').val(),
        frequency: $('#frequency').val()
    }, function(data) {
        refreshPage();
    });
}

function habitUpdate(habitId) {
    $('#spinner').show();
    $.post('habit_update', {
        id_: habitId,
        description: $('#description' + habitId).val(),
        frequency: $('#frequency' + habitId).val()
    }, function(data) {
        refreshPage();
    });
}

function habitDelete(habitId) {
    $('#spinner').show();
    $.get('habit_delete', {
        id_: habitId,
        description: $('#description').val()
    }, function(data) {
        refreshPage();
    });
}