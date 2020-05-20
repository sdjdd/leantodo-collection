"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var event_target_shim_1 = require("event-target-shim");
var EVENTS = ["open", "error", "message", "close"];
var WS = /** @class */ (function (_super) {
    __extends(WS, _super);
    function WS(url, protocol) {
        var _this = this;
        if (!url) {
            throw new TypeError("Failed to construct 'WebSocket': url required");
        }
        _this = _super.call(this) || this;
        if (protocol) {
            var pstr = void 0;
            if (typeof protocol === "string") {
                pstr = protocol;
                protocol = [protocol];
            }
            else {
                pstr = protocol.join(",");
            }
            var sp = url.includes("?") ? "&" : "?";
            url += sp + "subprotocol=" + pstr;
        }
        _this._protocol = protocol;
        _this._url = url;
        _this._readyState = WS.CONNECTING;
        var openHandler = function () {
            _this._readyState = WS.OPEN;
            _this.dispatchEvent({ type: "open" });
        };
        var errorHandler = function (err) {
            _this.dispatchEvent({ type: "error", message: err.errMsg });
            _this.close();
        };
        var messageHandler = function (msg) {
            _this.dispatchEvent({ type: "message", data: msg.data });
        };
        var closeHandler = function () {
            _this._readyState = WS.CLOSED;
            _this.dispatchEvent({ type: "close" });
        };
        var st = tt.connectSocket({ url: url, protocols: protocol });
        st.onOpen(openHandler);
        st.onError(errorHandler);
        st.onMessage(messageHandler);
        st.onClose(closeHandler);
        _this._socketTask = st;
        return _this;
    }
    Object.defineProperty(WS.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WS.prototype, "protocol", {
        get: function () {
            return this._protocol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WS.prototype, "readyState", {
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    WS.prototype.send = function (data) {
        if (this.readyState !== WS.OPEN) {
            throw new Error("INVALID_STATE_ERR");
        }
        if (!(typeof data === "string" || data instanceof ArrayBuffer)) {
            throw new TypeError("only String/ArrayBuffer supported");
        }
        this._socketTask.send({ data: data });
    };
    WS.prototype.close = function () {
        if (this.readyState === WS.CLOSED)
            return;
        this._socketTask.closeSocket();
    };
    WS.CONNECTING = 0;
    WS.OPEN = 1;
    WS.CLOSING = 2;
    WS.CLOSED = 3;
    return WS;
}(event_target_shim_1.EventTarget(EVENTS)));
exports.WebSocket = WS;
//# sourceMappingURL=websocket.js.map