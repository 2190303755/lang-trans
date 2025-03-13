import {locales} from '@/Global.js';

const langRequests = new Map();
let localeRequest;

function makeUrl(path) {
    return 'https://api.github.com/repos/DragonMounts-Team/DragonMounts2-Expanded/contents/' + path;
}

export const SOURCE = 'en_us';

export async function getLocales() {
    if (localeRequest) return localeRequest;
    if (locales.value) return Promise.resolve(locales.value);
    return localeRequest = fetch(
        makeUrl('src/main/resources/assets/dragonmounts/lang')
    ).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error with status ${response.status}`);
        }
        return response.json();
    }).then(files => {
        const array = files.filter(file =>
            file.type === 'file' && file.name.endsWith('.lang')
        ).map(file => file.name.substring(0, 5));
        if (!array.includes(SOURCE)) throw new Error(`Default locale ${SOURCE} is missing!`);
        return locales.value = array;
    }).catch(error => {
        localeRequest = null;
        throw error;
    });
}

export async function getLang(locale) {
    if (langRequests.has(locale)) {
        const request = langRequests.get(locale);
        if (request.promise) return request.promise;
        return Promise.resolve(request.data);
    }
    const promise = fetch(makeUrl('src/main/resources/assets/dragonmounts/lang/' + locale + '.lang'), {
        headers: {
            'Accept': 'application/vnd.github.v3.raw'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error with status ${response.status}`);
        }
        return response.text();
    }).then(lang => {
        const data = new Map();
        for (const line of lang.split("\n")) {
            const separator = line.indexOf("=");
            if (separator === -1) continue;
            let comment = line.indexOf("#");
            if (comment === -1) {
                comment = line.length;
            }
            if (comment > separator) {
                data.set(
                    line.substring(0, separator),
                    line.substring(separator + 1, comment)
                );
            }
        }
        langRequests.set(locale, {data: data});
        return data;
    }).catch(error => {
        langRequests.delete(locale);
        throw error;
    });
    langRequests.set(locale, {promise: promise});
    return promise;
}