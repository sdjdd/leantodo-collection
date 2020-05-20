"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = function (url, _a) {
    var _b = _a === void 0 ? {} : _a, method = _b.method, data = _b.data, headers = _b.headers;
    return new Promise(function (resolve, reject) {
        tt.request({
            url: url,
            method: method,
            header: headers,
            data: data,
            success: function (res) {
                res.status = res.statusCode;
                res.ok = !(res.status >= 400);
                resolve(res);
            },
            fail: function (res) { return reject(new Error(res.errMsg)); },
        });
    });
};
exports.upload = function (url, file, _a) {
    var _b = _a === void 0 ? {} : _a, headers = _b.headers, data = _b.data, onprogress = _b.onprogress;
    if (!(file && file.data && file.data.uri)) {
        return Promise.reject(new TypeError("File data must be an object like { uri: localPath }."));
    }
    return new Promise(function (resolve, reject) {
        var _a;
        var task = tt.uploadFile({
            url: url,
            header: headers,
            filePath: file.data.uri,
            name: file.field,
            formData: data,
            success: function (res) {
                res.status = res.statusCode;
                res.ok = !(res.statusCode >= 400);
                resolve(res);
            },
            fail: function (res) { return reject(new Error(res.errMsg)); },
        });
        var progressHandler = function (_a) {
            var progress = _a.progress, totalBytesSent = _a.totalBytesSent, totalBytesExpectedToSend = _a.totalBytesExpectedToSend;
            onprogress === null || onprogress === void 0 ? void 0 : onprogress({
                percent: progress,
                loaded: totalBytesSent,
                total: totalBytesExpectedToSend,
            });
        };
        (_a = task === null || task === void 0 ? void 0 : task.onProgressUpdate) === null || _a === void 0 ? void 0 : _a.call(task, progressHandler);
    });
};
//# sourceMappingURL=http.js.map