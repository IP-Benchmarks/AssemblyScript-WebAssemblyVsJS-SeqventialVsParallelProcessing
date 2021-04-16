const parse = (str: string) => {
    return JSON.parse(str, (key, value) => {
        var prefix;

        if (typeof value != 'string') {
            return value;
        }
        if (value.length < 8) {
            return value;
        }

        prefix = value.substring(0, 8);

        if (prefix === 'function') {
            return eval('(' + value + ')');
        }
        if (prefix === '_PxEgEr_') {
            return eval(value.slice(8));
        }
        if (prefix === '_NuFrRa_') {
            return eval(value.slice(8));
        }

        return value;
    });
};

type Message = {
    quicksort: string;
    arr: number[];
};
onmessage = ({ data }) => {
    const { quickSort, arr } = data;
    const quickSortFct = parse(quickSort);
    postMessage(quickSortFct(arr));
};
