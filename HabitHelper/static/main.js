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
        id_: habitId
    }, function(data) {
        refreshPage();
    });
}

function entryCreate(habitId) {
    $('#spinner').show();
    $.post('entry_create', {
        id_: habitId
    }, function(data) {
        refreshPage();
    });
}

function entryDelete(entryId) {
    $('#spinner').show();
    $.get('entry_delete', {
        id_: entryId
    }, function(data) {
        refreshPage();
    });
}