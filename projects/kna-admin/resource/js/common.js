/**
 * SNB
 *  **/
function updateButtons() {
    let items = $('.item');
    items.find('._btnMenuUp, ._btnMenuDown').removeClass('disabled');
    items.first().find('._btnMenuUp').addClass('disabled');
    items.last().find('._btnMenuDown').addClass('disabled');
}

// Move up
$('._btnMenuUp').on('click', function () {
    if ($(this).hasClass("disabled")) return;
    let parent = $(this).closest('.item');
    parent.prev().before(parent);
    updateButtons();
});

// Move down
$('._btnMenuDown').on('click', function () {
    if ($(this).hasClass("disabled")) return;
    let parent = $(this).closest('.item');
    parent.next().after(parent);
    updateButtons();
});

// Remove
$('._btnMenuRemove').on('click', function () {
    $(this).closest('.item').remove();
    updateButtons();
});

updateButtons();

/**
 * *************************************************************
 *  **/
