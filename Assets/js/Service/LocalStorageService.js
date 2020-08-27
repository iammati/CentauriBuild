class CentauriLocalStorageService {
    keys = {};

    set(key, value) {
        this.keys[key] = value;
        this.key = value;
    }

    get(key) {
        return this.findByKey(key);
    }

    findAll() {
        return this.keys;
    }

    findByKey(key) {
        if(Centauri.isNotUndefined(this.keys[key])) {
            return this.keys[key];
        }

        return false;
    }
}

