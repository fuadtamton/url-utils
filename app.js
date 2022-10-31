let result = '';

const FormMeta = {
    'encode-url': {
        title: 'Encode URL | URL Utils',
        h1: 'Encode URL',
        input: {
            placeholder: 'Enter/Paste URL',
        },
        result: {
            title: 'Encoded URL'
        },
        generateResult: encodeURI
    },
    'decode-url': {
        title: 'Decode URL | URL Utils',
        h1: 'Decode URL',
        input: {
            placeholder: 'Enter/Paste URL',
        },
        result: {
            title: 'Decoded URL'
        },
        generateResult: decodeURI
    },
    'parse-params': {
        title: 'Parse Query Params | URL Utils',
        h1: 'Parse Query Params',
        input: {
            placeholder: 'Enter/Paste URL',
        },
        result: {
            title: 'Result'
        },
        generateResult: parseParams
    },
    'parse-url': {
        title: 'Parse URL | URL Utils',
        h1: 'Parse URL',
        input: {
            placeholder: 'Enter/Paste URL',
        },
        result: {
            title: 'Result'
        },
        generateResult: parseURL
    },
}

function onLoadPage() {
    const theme = getUserTheme();
    toggleTheme(theme);
    $('#light-theme-handle').click(() => toggleTheme('light'));
    $('#dark-theme-handle').click(() => toggleTheme('dark'));
    setActiveFormType(getFormType());

    $('#more-tools li').click(setActiveForm);
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
    const formType = getFormType();
    const config = FormMeta[formType];
    if (config) {
        const input = $('#user-input').val().trim();
        const result = config.generateResult(input);
        $('#result').html(result);
        $('.result').show('fast');
    }
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
    const formType = parseParams(window.location.search, true).ft;
    return formType || $('body').attr('form-type');
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
    $('.result').hide('fast');
    $('#user-input').val('');
    setTimeout(() => {
        $('#result').html('');
    }, 500);

    const config = FormMeta[formType];
    if (config) {
        document.title = config.title;
        $('h1').html(config.h1);
        $('.result label').html(config.result.title);
        $('#user-input').prop('placeholder', config.input.placeholder);
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    }
}

function parseParams(param = '', jsonOutput = false) {
    if (param.includes('?')) param = '?' + param.split('?')[1];
    usp = new URLSearchParams(param);
    const keys = usp.keys();
    const result = {};
    for (const key of keys) {
        if (!result[key]) {
            result[key] = usp.getAll(key);
        } else {
            result[key] = [...result[key], ...usp.getAll(key)]
        }
    }
    for (const key in result) {
        const element = result[key];
        result[key] = Array(...new Set(element));
        if (result[key].length <= 1) result[key] = result[key][0];
    }
    if (jsonOutput) return result;
    return JSON.stringify(result, null, 4);
}


function parseURL(url = '') {
    try {
        const urlObj = new URL(url);
        const result = {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            origin: urlObj.origin,
            pathname: urlObj.pathname,
            port: urlObj.port,
            hash: urlObj.hash,
            username: urlObj.username,
            password: urlObj.password,
            queryParams: parseParams(urlObj.search, true)
        }
        Object.keys(result).map(key => {
            if (!result[key]) result[key] = undefined;
        });
        return JSON.stringify(result, null, 2);
    } catch {

    }
}