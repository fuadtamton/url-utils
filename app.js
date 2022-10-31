/* todo - 
    url encoder
    url decoder
    query params parser
    url parser -> domain, prototype, path

*/
let result = '';

function onLoadPage() {
    const theme = getUserTheme();
    toggleTheme(theme);
    $('#light-theme-handle').click(() => toggleTheme('light'));
    $('#dark-theme-handle').click(() => toggleTheme('dark'));
    setActiveFormType(getFormType());

    $('#more-tools li').click(setActiveForm);
}

function openForm() {
    const formType = getFormType();

}

function toggleTheme(theme) {
    if (theme == 'light') {
        $('#dark-theme-handle').show();
        $('#light-theme-handle').hide();
        $('body').attr('theme', 'light');
    } else {
        theme = 'dark';
        $('#light-theme-handle').show();
        $('#dark-theme-handle').hide();
        $('body').attr('theme', 'dark');
    }
    localStorage.setItem('theme', theme);
}

function onSubmitForm(event) {
    event.preventDefault();
    const url = $('#user-input').val().trim();
    // const formType = getFormType();
    const encoded = encodeURIComponent(url);
    $('#result').html(encoded);
    result = encoded;
    $('.result').show('fast');
}

function copyResult() {
    const result = $('#result')[0];
    var range,
        selection;

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(result);
        range.select();
        document.execCommand('copy', true);
    }
    else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(result);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
    }
    window.getSelection().removeAllRanges();

    $('#copyResultBtnText').html('Copied to clipboard');
    setTimeout(() => {
        $('#copyResultBtnText').html('Copy');
    }, 2000);
}

function getFormType() {
    return $('body').attr('form-type');
};


function getUserTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return $('body').attr('theme');
}

function setActiveForm(event) {
    const newType = event.target.id.split('link-')[1];
    if (newType !== getFormType()) {
        setActiveFormType(newType);
        openForm(newType);
    }
}

function setActiveFormType(formType) {
    $('#more-tools li').removeClass('active');
    $('#link-' + formType).addClass('active');
    $('body').attr('form-type', formType);
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?ft=' + formType;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}