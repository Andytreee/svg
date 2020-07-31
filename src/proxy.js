export function defineReactive(obj, key, setFunc) {
    let value = null;
    Object.defineProperty(obj, key, {
        enumerable:true,
        configurable:true,
        get() {
            return value;
        },
        set(newValue) {
            if(value !== null && setFunc ){
                requestAnimationFrame(() => {
                    setFunc(newValue)
                })
            }
            value = newValue
        }
    });
}

function redefinePush(arr, generator, reactive ) {
    arr.push = function(...data) {
        let items = [];
        data.forEach(item => {
            item.target = generator(item)
            items.push(reactive(item));
        })
        Array.prototype.push.apply(arr,items);
    }
}

function redefinePop( arr ) {
    arr.pop = function() {
        arr[arr.length -1].target.clear();
        Array.prototype.pop.apply(arr);
    }
}

function redefineShift( arr ) {
    arr.shift = function() {
        arr[0].target.clear();
        Array.prototype.shift.apply(arr);
    }
}

function redefineUnshift( data, arr, generator, reactive) {
    arr.unshift = function(...data) {
        let items = [];
        data.forEach(item => {
            item.target = generator(item)
            items.push(reactive(item));
        })
        Array.prototype.unshift.apply(arr, items);
    }
}

function redefineSplice( arr, generator, reactive ) {
    arr.splice = function(start, num, ...data) {
        for(let i= start; i < start + num; i++) {
            arr[i].target.clear();
        }
        let items = [];
        data.forEach(item => {
            item.target = generator(item)
            items.push(reactive(item));
        })
        return Array.prototype.splice.apply(arr, [start,  num, ...items]);
    }
}

export function redefineArr(arr, generator, reactive) {
    redefinePush(arr, generator, reactive);
    redefinePop(arr);
    redefineShift(arr);
    redefineUnshift(arr, generator, reactive);
    redefineSplice(arr, generator, reactive);
}