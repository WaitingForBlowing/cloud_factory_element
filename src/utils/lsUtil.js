import Vue from 'vue'

const ls = {
    set_value: (key, value, time) => {
        Vue.ls.set(key, value, time)
    },
    get_value: key => Vue.ls.get(key),
    clear: () => Vue.ls.clear(),
    remove: (key) => Vue.ls.remove(key)
}

export default ls
