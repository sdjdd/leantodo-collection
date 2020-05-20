"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = {
    getItem: function (key) {
        return tt.getStorageSync(key);
    },
    setItem: function (key, value) {
        return tt.setStorageSync(key, value);
    },
    removeItem: function (key) {
        return tt.removeStorageSync(key);
    },
    clear: function () {
        return tt.clearStorageSync();
    }
};
//# sourceMappingURL=storage.js.map