import {ref, shallowRef} from 'vue';

export const showConfig = shallowRef(true);
export const locales = shallowRef(null);
export const translationEntries = shallowRef([]);
export const reference = ref(null);
export const referenceFile = shallowRef(null);
export const working = ref(null);
export const workingFile = ref(null);

const COMMAND_REGEX = /^commands\..*?\.usage$/;

export function populateEntries() {
    const workingMap = workingFile.value, referenceMap = referenceFile.value;
    if (!workingMap || !referenceMap) return;
    const entries = [];
    for (const [key, reference] of referenceMap) {
        const value = workingMap.get(key);
        entries.push({
            'key': key,
            'value': value,
            'mark': value
                ? reference === value && !COMMAND_REGEX.test(key)
                    ? 'equal'
                    : 'none'
                : 'missing'
        });
    }
    translationEntries.value = entries;
}

export function dumpEntries() {
    const workingMap = workingFile.value, referenceMap = referenceFile.value;
    if (!workingMap || !referenceMap) return;
    const object = {};
    for (const key of referenceMap.keys()) {
        object[key] = workingMap.get(key);
    }
    const url = URL.createObjectURL(new Blob(
        [JSON.stringify(object, null, 2)],
        {type: 'application/json'}
    ));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${working.value ?? 'lang'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}