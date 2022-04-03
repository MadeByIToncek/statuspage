function parseHTML(e) { var t = document.createElement("div"); return t.innerHTML = e.trim(), t.firstChild }

function dom(e, t) { var n = document.createElement(e); for (var o in t) "innerText" == o || "className" == o ? n[o] = t[o] : n.setAttribute(o, t[o]); return n }

function replace(e, t) { e && e.parentNode.replaceChild(t, e) }

function ready(e) {
    (document.attachEvent ? "complete" === document.readyState : "loading" !== document.readyState) ? e(): document.addEventListener("DOMContentLoaded", e)
}

function first(e, t) { return (t || document).querySelector(e) }

function all(e, t) { return (t || document).querySelectorAll(e) }

function byId(e) { return document.getElementById(e) }

function addClass(e, t) {
    if (e) {
        var n = e.className.split(" ");
        afind(n, t) || (n.unshift(t), e.className = n.join(" "))
    }
}

function remClass(e, t) {
    if (e) {
        var n = e.className.split(" ");
        arem(n, t), e.className = n.join(" ")
    }
}

function hasClass(e, t) { return afind(e.className.split(" "), t) }

function toggleClass(e, t, n) { e && (n ? addClass(e, t) : remClass(e, t)) }

function toggleAttribute(e, t, n) { e && (n ? e.setAttribute(t, t) : e.removeAttribute(t)) }

function arem(e, t) { var n = apos(e, t); return 0 <= n && e.splice(n, 1), e }

function afind(e, t) { var n = apos(e, t); return 0 <= n ? e[n] : null }

function apos(e, t) { return "function" == typeof t ? posf(e, t) : Array.prototype.indexOf.call(e, t) }

function posf(e, t) {
    for (var n = 0; n < e.length; n++)
        if (t(e[n])) return n;
    return -1
}

function distinct(e) { return e.filter(function(e, t, n) { return n.indexOf(e) === t }) }

function on(n, e, o, a) {
    a === undefined && (a = o, o = undefined), e.split(" ").forEach(function(e) {
        n.addEventListener(e, function(e) {
            if (!o) return a.call(e, n, e);
            for (var t = e.target; t && t != n; t = t.parentNode)
                if (t.matches(o)) return a.call(e, t, e)
        }, !1)
    })
}

function trigger(e, t) {
    var n = document.createEvent("HTMLEvents");
    n.initEvent(t, !0, !1), e.dispatchEvent(n)
}

function spinner(e, t) {
    function n() { e.textContent = a[c + 1], spinner(e, t) }

    function o() { e.textContent = a[c - 1], spinner(e, t) }
    var a = JSON.parse(e.getAttribute("data-labels")),
        r = JSON.parse(e.getAttribute("data-values")),
        i = parseHTML('<a class="spinner btnup">' + SVG.chevronUp + "</a>"),
        l = parseHTML('<a class="spinner btndown">' + SVG.chevronDown + "</a>"),
        c = apos(a, e.textContent); - 1 == c && (c = 0), c >= a.length - 1 ? addClass(i, "disabled") : (i.addEventListener("click", n), i.addEventListener("tap", n)), c <= 0 ? addClass(l, "disabled") : (l.addEventListener("click", o), l.addEventListener("tap", o)), e.appendChild(i), e.appendChild(l), e.setAttribute("data-value", r[c]), t()
}

function formatPrice(e) { var t = 2; return 100 < e ? t = 0 : 10 < e && (t = 1), e.toFixed(t) }

function computePrice() {
    var e = byId("var-price");
    if (e) {
        var t = byId("var-websites").getAttribute("data-value"),
            n = byId("var-period").getAttribute("data-value");
        if (0 < t && 0 < n) {
            var o = 40 * t * 60 / n * 60 * 24 * 30.5 / 3e6;
            e.textContent = formatPrice(o)
        }
    }
}

function cycleQuotes(e) {
    var t = e.firstChild;
    t.style.opacity = 0, setTimeout(function() { e.appendChild(t), e.firstChild.style.opacity = 1 }, 500)
}

function update_form(e) { e && (type = e.querySelector("#check_type").value, toggleAttribute(e.querySelector(".icon-search"), "disabled", "icmp" == type), e.querySelector("#check_string_match").disabled = "icmp" == type, placeholder = "icmp" == type ? "[2607:5300:60:2437::1]" : "tcp" == type ? "198.27.83.55:22" : "www.website.com", e.querySelector(".request-options").style.display = afind(["http", "https"], type) ? "" : "none", e.querySelector("#check_url").setAttribute("placeholder", placeholder)) }

function custom_header_form(e) {
    var t = e.closest("form"),
        n = t.querySelector('input[name="check[http_verb]"]').value,
        o = '<div class="verb" data-with-body="' + !afind(VERBS_WITHOUT_BODY, n) + '"><label for="http-verb" class="request-options-title">Verb:</label><select name="http-verb" id="http-verb">' + VERB.map(function(e) { return '<option value="' + e + '"' + (e == n ? ' selected="selected"' : "") + ">" + e.toUpperCase() + "</option>" }).join("") + "</select></div>",
        a = '<div class="body"><label for="http-body" class="request-options-title">Body:</label>' + dom("textarea", { name: "http-body", id: "http-body", innerText: t.querySelector('input[name="check[http_body]"]').value }).outerHTML + "</div>",
        r = JSON.parse(t.querySelector('input[name="check[headers_json]"]').value),
        i = distinct(Object.keys(DEFAULT_HEADERS).concat(Object.keys(r))).map(function(e) { return '<div class="header edit' + ("Content-Type" == e ? " with-body" : "") + '"><label>' + e + ":</label>" + dom("input", { type: "text", className: "edit-value", name: e, value: r[e] || "", placeholder: DEFAULT_HEADERS[e] }).outerHTML + "</div>" }).join("");
    return "<h3>" + e.title + "</h3>" + o + '<div class="header"><div class="request-options-title">Headers:</div></div>' + i + '<div class="header new">+ <input type="text" placeholder="Header: value" name="new-header" pattern="[a-zA-Z0-9-_]+:.+" /></div>' + a
}

function update_http_options(e) {
    var t = e.querySelector('input[name="check[http_verb]"]').value,
        n = e.querySelector("div.verb");
    if (afind(VERBS_WITHOUT_BODY, t)) {
        n.dataset.withBody = !1;
        var o = e.querySelector(".header.with-body");
        o.querySelector("input").value = "";
        var a = e.querySelector('input[name="check[headers_json]"]'),
            r = JSON.parse(a.value);
        delete r[o.querySelector("input").name], a.value = JSON.stringify(r)
    } else n.dataset.withBody = !0
}

function location_selector(e) {
    var n = e.closest("form"),
        o = JSON.parse(e.dataset.locations),
        t = n.querySelectorAll('input[name^="check[locations"]:not([value="false"])').length;
    return "<h3>" + e.title + '</h3><div class="limit">' + t + " active locations" + (t <= 2 ? " (minimum) " + SVG.warning : "") + "</div>" + Object.keys(o).map(function(e) { var t = "false" != n.querySelector('input[name="check[locations[' + e + ']]"]').value; return '<div class="location ' + (t ? "active" : "inactive") + '" data-name="' + e + '">' + (t ? SVG.toggleOn : SVG.toggleOff) + " <span>" + o[e].city + ", " + o[e].country + "</span>" + (o[e].ip6 ? "" : " <small>(no ipv6)</small>") + "</div>" }).join("") + '<div class="disclamer">Tested one at a time (randomly).<br/>Does not impact the price.\xa0<a href="/about" target="_blank">View IPs \u2197</a></div>'
}

function recipient_selector(e) {
    var t = e.closest("form"),
        n = JSON.parse(e.dataset.recipients),
        o = t.querySelectorAll('input[name^="check[recipients"]:not([value="false"])').length,
        a = 1 < t.querySelectorAll('input[name^="check[recipients"]').length ? '\xa0\xb7\xa0<a href="/checks/recipients" target="_blank">Bulk update \u2197</a>' : "",
        r = 30 < n.length ? "big" : 15 < n.length ? "medium" : "small";
    return "<h3>" + e.title + '</h3><div class="limit">' + o + " active recipients" + (o < 1 ? " " + SVG.warning : "") + a + '</div><div class="list ' + r + '">' + n.map(function(e) { return state = t.querySelector('input[name="check[recipients[' + e.id + ']]"]'), active = "false" != state.value, icon = SVG.recipient[e.type], '<div class="recipient ' + (active ? "active" : "inactive") + '" data-name="' + e.id + '" data-disabled="' + e.immutable + '">' + (active ? SVG.toggleOn : SVG.toggleOff) + " " + icon + "<span>" + e.name + "</span> <small>(" + e.type + ")</small></div>" }).join("") + '</div><div class="disclamer">Add more recipients from your settings.</div>'
}(function() {
    var e = this;
    (function() {
        (function() { this.Rails = { linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]", buttonClickSelector: { selector: "button[data-remote]:not([form]), button[data-confirm]:not([form])", exclude: "form button" }, inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]", formSubmitSelector: "form:not([data-turbo=true])", formInputClickSelector: "form:not([data-turbo=true]) input[type=submit], form:not([data-turbo=true]) input[type=image], form:not([data-turbo=true]) button[type=submit], form:not([data-turbo=true]) button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])", formDisableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled", formEnableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled", fileInputSelector: "input[name][type=file]:not([disabled])", linkDisableSelector: "a[data-disable-with], a[data-disable]", buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]" } }).call(this)
    }).call(e);
    var g = e.Rails;
    (function() {
        (function() {
            var t;
            t = null, g.loadCSPNonce = function() { var e; return t = null != (e = document.querySelector("meta[name=csp-nonce]")) ? e.content : void 0 }, g.cspNonce = function() { return null != t ? t : g.loadCSPNonce() }
        }).call(this),
            function() {
                var o, n;
                n = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector, g.matches = function(e, t) { return null != t.exclude ? n.call(e, t.selector) && !n.call(e, t.exclude) : n.call(e, t) }, o = "_ujsData", g.getData = function(e, t) { var n; return null != (n = e[o]) ? n[t] : void 0 }, g.setData = function(e, t, n) { return null == e[o] && (e[o] = {}), e[o][t] = n }, g.$ = function(e) { return Array.prototype.slice.call(document.querySelectorAll(e)) }
            }.call(this),
            function() {
                var n, o, a;
                n = g.$, a = g.csrfToken = function() { var e; return (e = document.querySelector("meta[name=csrf-token]")) && e.content }, o = g.csrfParam = function() { var e; return (e = document.querySelector("meta[name=csrf-param]")) && e.content }, g.CSRFProtection = function(e) { var t; if (null != (t = a())) return e.setRequestHeader("X-CSRF-Token", t) }, g.refreshCSRFTokens = function() { var e, t; if (t = a(), e = o(), null != t && null != e) return n('form input[name="' + e + '"]').forEach(function(e) { return e.value = t }) }
            }.call(this),
            function() {
                var a, t, r, n;
                r = g.matches, "function" != typeof(a = window.CustomEvent) && ((a = function(e, t) { var n; return (n = document.createEvent("CustomEvent")).initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n }).prototype = window.Event.prototype, n = a.prototype.preventDefault, a.prototype.preventDefault = function() { var e; return e = n.call(this), this.cancelable && !this.defaultPrevented && Object.defineProperty(this, "defaultPrevented", { get: function() { return !0 } }), e }), t = g.fire = function(e, t, n) { var o; return o = new a(t, { bubbles: !0, cancelable: !0, detail: n }), e.dispatchEvent(o), !o.defaultPrevented }, g.stopEverything = function(e) { return t(e.target, "ujs:everythingStopped"), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation() }, g.delegate = function(e, n, t, o) { return e.addEventListener(t, function(e) { var t; for (t = e.target; t instanceof Element && !r(t, n);) t = t.parentNode; if (t instanceof Element && !1 === o.call(t, e)) return e.preventDefault(), e.stopPropagation() }) }
            }.call(this),
            function() {
                var t, o, e, a, r, i;
                a = g.cspNonce, o = g.CSRFProtection, g.fire, t = { "*": "*/*", text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript", script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, g.ajax = function(n) { var o; return n = r(n), o = e(n, function() { var e, t; return t = i(null != (e = o.response) ? e : o.responseText, o.getResponseHeader("Content-Type")), 2 === Math.floor(o.status / 100) ? "function" == typeof n.success && n.success(t, o.statusText, o) : "function" == typeof n.error && n.error(t, o.statusText, o), "function" == typeof n.complete ? n.complete(o, o.statusText) : void 0 }), !(null != n.beforeSend && !n.beforeSend(o, n)) && (o.readyState === XMLHttpRequest.OPENED ? o.send(n.data) : void 0) }, r = function(e) { return e.url = e.url || location.href, e.type = e.type.toUpperCase(), "GET" === e.type && e.data && (e.url.indexOf("?") < 0 ? e.url += "?" + e.data : e.url += "&" + e.data), null == t[e.dataType] && (e.dataType = "*"), e.accept = t[e.dataType], "*" !== e.dataType && (e.accept += ", */*; q=0.01"), e }, e = function(e, t) { var n; return (n = new XMLHttpRequest).open(e.type, e.url, !0), n.setRequestHeader("Accept", e.accept), "string" == typeof e.data && n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), e.crossDomain || (n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o(n)), n.withCredentials = !!e.withCredentials, n.onreadystatechange = function() { if (n.readyState === XMLHttpRequest.DONE) return t(n) }, n }, i = function(e, t) {
                    var n, o;
                    if ("string" == typeof e && "string" == typeof t)
                        if (t.match(/\bjson\b/)) try { e = JSON.parse(e) } catch (error) {} else if (t.match(/\b(?:java|ecma)script\b/))(o = document.createElement("script")).setAttribute("nonce", a()), o.text = e, document.head.appendChild(o).parentNode.removeChild(o);
                            else if (t.match(/\b(xml|html|svg)\b/)) { n = new DOMParser, t = t.replace(/;.+/, ""); try { e = n.parseFromString(e, t) } catch (error) {} }
                    return e
                }, g.href = function(e) { return e.href }, g.isCrossDomain = function(e) {
                    var t, n;
                    (t = document.createElement("a")).href = location.href, n = document.createElement("a");
                    try { return n.href = e, !((!n.protocol || ":" === n.protocol) && !n.host || t.protocol + "//" + t.host == n.protocol + "//" + n.host) } catch (error) { return error, !0 }
                }
            }.call(this),
            function() {
                var a, r;
                a = g.matches, r = function(e) { return Array.prototype.slice.call(e) }, g.serializeElement = function(e, t) { var n, o; return n = [e], a(e, "form") && (n = r(e.elements)), o = [], n.forEach(function(t) { if (t.name && !t.disabled && !a(t, "fieldset[disabled] *")) return a(t, "select") ? r(t.options).forEach(function(e) { if (e.selected) return o.push({ name: t.name, value: e.value }) }) : t.checked || -1 === ["radio", "checkbox", "submit"].indexOf(t.type) ? o.push({ name: t.name, value: t.value }) : void 0 }), t && o.push(t), o.map(function(e) { return null != e.name ? encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value) : e }).join("&") }, g.formElements = function(e, t) { return a(e, "form") ? r(e.elements).filter(function(e) { return a(e, t) }) : r(e.querySelectorAll(t)) }
            }.call(this),
            function() {
                var t, a, n;
                a = g.fire, n = g.stopEverything, g.handleConfirm = function(e) { if (!t(this)) return n(e) }, g.confirm = function(e) { return confirm(e) }, t = function(e) {
                    var t, n, o;
                    if (!(o = e.getAttribute("data-confirm"))) return !0;
                    if (t = !1, a(e, "confirm")) {
                        try { t = g.confirm(o, e) } catch (error) {}
                        n = a(e, "confirm:complete", [t])
                    }
                    return t && n
                }
            }.call(this),
            function() {
                var n, o, a, r, i, l, t, c, s, u, d, f;
                u = g.matches, c = g.getData, d = g.setData, f = g.stopEverything, t = g.formElements, g.handleDisabledElement = function(e) { if (this.disabled) return f(e) }, g.enableElement = function(e) {
                    var t;
                    if (e instanceof Event) {
                        if (s(e)) return;
                        t = e.target
                    } else t = e;
                    return u(t, g.linkDisableSelector) ? l(t) : u(t, g.buttonDisableSelector) || u(t, g.formEnableSelector) ? r(t) : u(t, g.formSubmitSelector) ? i(t) : void 0
                }, g.disableElement = function(e) { var t; return t = e instanceof Event ? e.target : e, u(t, g.linkDisableSelector) ? a(t) : u(t, g.buttonDisableSelector) || u(t, g.formDisableSelector) ? n(t) : u(t, g.formSubmitSelector) ? o(t) : void 0 }, a = function(e) { var t; if (!c(e, "ujs:disabled")) return null != (t = e.getAttribute("data-disable-with")) && (d(e, "ujs:enable-with", e.innerHTML), e.innerHTML = t), e.addEventListener("click", f), d(e, "ujs:disabled", !0) }, l = function(e) { var t; return null != (t = c(e, "ujs:enable-with")) && (e.innerHTML = t, d(e, "ujs:enable-with", null)), e.removeEventListener("click", f), d(e, "ujs:disabled", null) }, o = function(e) { return t(e, g.formDisableSelector).forEach(n) }, n = function(e) { var t; if (!c(e, "ujs:disabled")) return null != (t = e.getAttribute("data-disable-with")) && (u(e, "button") ? (d(e, "ujs:enable-with", e.innerHTML), e.innerHTML = t) : (d(e, "ujs:enable-with", e.value), e.value = t)), e.disabled = !0, d(e, "ujs:disabled", !0) }, i = function(e) { return t(e, g.formEnableSelector).forEach(r) }, r = function(e) { var t; return null != (t = c(e, "ujs:enable-with")) && (u(e, "button") ? e.innerHTML = t : e.value = t, d(e, "ujs:enable-with", null)), e.disabled = !1, d(e, "ujs:disabled", null) }, s = function(e) { var t, n; return null != (null != (n = null != (t = e.detail) ? t[0] : void 0) ? n.getResponseHeader("X-Xhr-Redirect") : void 0) }
            }.call(this),
            function() {
                var c;
                c = g.stopEverything, g.handleMethod = function(e) { var t, n, o, a, r, i, l; if (l = (i = this).getAttribute("data-method")) return r = g.href(i), n = g.csrfToken(), t = g.csrfParam(), o = document.createElement("form"), a = "<input name='_method' value='" + l + "' type='hidden' />", null == t || null == n || g.isCrossDomain(r) || (a += "<input name='" + t + "' value='" + n + "' type='hidden' />"), a += '<input type="submit" />', o.method = "post", o.action = r, o.target = i.target, o.innerHTML = a, o.style.display = "none", document.body.appendChild(o), o.querySelector('[type="submit"]').click(), c(e) }
            }.call(this),
            function() {
                var c, s, u, d, f, p, m, h, v, b = [].slice;
                p = g.matches, u = g.getData, h = g.setData, s = g.fire, v = g.stopEverything, c = g.ajax, d = g.isCrossDomain, m = g.serializeElement, f = function(e) { var t; return null != (t = e.getAttribute("data-remote")) && "false" !== t }, g.handleRemote = function(e) { var t, n, o, a, r, i, l; return !f(a = this) || (s(a, "ajax:before") ? (l = a.getAttribute("data-with-credentials"), o = a.getAttribute("data-type") || "script", p(a, g.formSubmitSelector) ? (t = u(a, "ujs:submit-button"), r = u(a, "ujs:submit-button-formmethod") || a.method, i = u(a, "ujs:submit-button-formaction") || a.getAttribute("action") || location.href, "GET" === r.toUpperCase() && (i = i.replace(/\?.*$/, "")), "multipart/form-data" === a.enctype ? (n = new FormData(a), null != t && n.append(t.name, t.value)) : n = m(a, t), h(a, "ujs:submit-button", null), h(a, "ujs:submit-button-formmethod", null), h(a, "ujs:submit-button-formaction", null)) : p(a, g.buttonClickSelector) || p(a, g.inputChangeSelector) ? (r = a.getAttribute("data-method"), i = a.getAttribute("data-url"), n = m(a, a.getAttribute("data-params"))) : (r = a.getAttribute("data-method"), i = g.href(a), n = a.getAttribute("data-params")), c({ type: r || "GET", url: i, data: n, dataType: o, beforeSend: function(e, t) { return s(a, "ajax:beforeSend", [e, t]) ? s(a, "ajax:send", [e]) : (s(a, "ajax:stopped"), !1) }, success: function() { var e; return e = 1 <= arguments.length ? b.call(arguments, 0) : [], s(a, "ajax:success", e) }, error: function() { var e; return e = 1 <= arguments.length ? b.call(arguments, 0) : [], s(a, "ajax:error", e) }, complete: function() { var e; return e = 1 <= arguments.length ? b.call(arguments, 0) : [], s(a, "ajax:complete", e) }, crossDomain: d(i), withCredentials: null != l && "false" !== l }), v(e)) : (s(a, "ajax:stopped"), !1)) }, g.formSubmitButtonClick = function() { var e, t; if (t = (e = this).form) return e.name && h(t, "ujs:submit-button", { name: e.name, value: e.value }), h(t, "ujs:formnovalidate-button", e.formNoValidate), h(t, "ujs:submit-button-formaction", e.getAttribute("formaction")), h(t, "ujs:submit-button-formmethod", e.getAttribute("formmethod")) }, g.preventInsignificantClick = function(e) { var t, n, o, a; if (a = ((o = this).getAttribute("data-method") || "GET").toUpperCase(), t = o.getAttribute("data-params"), n = (e.metaKey || e.ctrlKey) && "GET" === a && !t, null != e.button && 0 !== e.button || n) return e.stopImmediatePropagation() }
            }.call(this),
            function() {
                var e, o, t, n, a, r, i, l, c, s, u, d, f, p, m;
                if (r = g.fire, t = g.delegate, l = g.getData, e = g.$, m = g.refreshCSRFTokens, o = g.CSRFProtection, f = g.loadCSPNonce, a = g.enableElement, n = g.disableElement, s = g.handleDisabledElement, c = g.handleConfirm, p = g.preventInsignificantClick, d = g.handleRemote, i = g.formSubmitButtonClick, u = g.handleMethod, "undefined" != typeof jQuery && null !== jQuery && null != jQuery.ajax) {
                    if (jQuery.rails) throw new Error("If you load both jquery_ujs and rails-ujs, use rails-ujs only.");
                    jQuery.rails = g, jQuery.ajaxPrefilter(function(e, t, n) { if (!e.crossDomain) return o(n) })
                }
                g.start = function() { if (window._rails_loaded) throw new Error("rails-ujs has already been loaded!"); return window.addEventListener("pageshow", function() { return e(g.formEnableSelector).forEach(function(e) { if (l(e, "ujs:disabled")) return a(e) }), e(g.linkDisableSelector).forEach(function(e) { if (l(e, "ujs:disabled")) return a(e) }) }), t(document, g.linkDisableSelector, "ajax:complete", a), t(document, g.linkDisableSelector, "ajax:stopped", a), t(document, g.buttonDisableSelector, "ajax:complete", a), t(document, g.buttonDisableSelector, "ajax:stopped", a), t(document, g.linkClickSelector, "click", p), t(document, g.linkClickSelector, "click", s), t(document, g.linkClickSelector, "click", c), t(document, g.linkClickSelector, "click", n), t(document, g.linkClickSelector, "click", d), t(document, g.linkClickSelector, "click", u), t(document, g.buttonClickSelector, "click", p), t(document, g.buttonClickSelector, "click", s), t(document, g.buttonClickSelector, "click", c), t(document, g.buttonClickSelector, "click", n), t(document, g.buttonClickSelector, "click", d), t(document, g.inputChangeSelector, "change", s), t(document, g.inputChangeSelector, "change", c), t(document, g.inputChangeSelector, "change", d), t(document, g.formSubmitSelector, "submit", s), t(document, g.formSubmitSelector, "submit", c), t(document, g.formSubmitSelector, "submit", d), t(document, g.formSubmitSelector, "submit", function(e) { return setTimeout(function() { return n(e) }, 13) }), t(document, g.formSubmitSelector, "ajax:send", n), t(document, g.formSubmitSelector, "ajax:complete", a), t(document, g.formInputClickSelector, "click", p), t(document, g.formInputClickSelector, "click", s), t(document, g.formInputClickSelector, "click", c), t(document, g.formInputClickSelector, "click", i), document.addEventListener("DOMContentLoaded", m), document.addEventListener("DOMContentLoaded", f), window._rails_loaded = !0 }, window.Rails === g && r(document, "rails:attachBindings") && g.start()
            }.call(this)
    }).call(this), "object" == typeof module && module.exports ? module.exports = g : "function" == typeof define && define.amd && define(g)
}).call(this);
var SVG = { chevronDown: '<svg viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-chevron-down"><polyline points="20 9 12 17 4 9"></polyline></svg>', chevronUp: '<svg viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-chevron-up"><polyline points="20 15 12 7 4 15"></polyline></svg>', spinner: '<svg viewbox="0 0 512 512" class="icon icon-spinner"><path fill="currentColor" d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z"></path></svg>', toggleOff: '<svg viewbox="0 0 576 512" height="16px" class="icon icon-toggle-off"><path fill="currentColor" d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM48 256c0-79.583 64.404-144 144-144 79.582 0 144 64.404 144 144 0 79.582-64.404 144-144 144-79.582 0-144-64.404-144-144zm336 144h-65.02c86.704-76.515 86.683-211.504 0-288H384c79.582 0 144 64.404 144 144 0 79.582-64.404 144-144 144z"></path></svg>', toggleOn: '<svg viewbox="0 0 576 512" height="16px" class="icon icon-toggle-on"><path fill="currentColor" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 336c-79.6 0-144-64.4-144-144s64.4-144 144-144 144 64.4 144 144-64.4 144-144 144z"></path></svg>', warning: '<svg height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-warning"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>', recipient: { email: '<svg height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>', sms: '<svg height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-sms"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="10" y1="18" x2="14" y2="18"></line></svg>', slack: '<svg viewbox="0 0 190 190" height="30px" class="icon icon-slack-bw"><path fill="currentColor" d="M39.9 120c0 11-8.97 20-20 20C9 140 0 131 0 120s8.97-20 20-20h20v20zm10.1 0c0-11 8.97-20 20-20s20 8.97 20 20v50c-.1 11-9.1 20-20.1 20C59 190 50 181 50 170v-50zm19.9-80.1c-11 0-20-8.97-20-20C50 9 59 0 69.9 0c11 0 20 8.97 20 20v20h-20zm0 10.1c11 0 20 8.97 20 20s-8.97 20-20 20h-50C9 89.9 0 80.9 0 69.9 0 59 8.97 50 20 50h50zM150 70c0-11 8.97-20 20-20s20 8.97 20 20-8.97 20-20 20h-20V70zm-10.1 0c0 11-8.97 20-20 20s-20-8.97-20-20V20c0-11 9-20 20-20s20 8.97 20 20v50zm-20 80.1c11 0 20 8.97 20 20s-8.97 20-20 20-20-8.97-20-20v-20h20zm0-10.1c-11 0-20-8.97-20-20s8.97-20 20-20h50c11 0 20 8.97 20 20s-8.97 20-20 20h-50z"></path></svg>', slack_compatible: '<svg viewbox="0 0 190 190" height="30px" class="icon icon-slack-bw"><path fill="currentColor" d="M39.9 120c0 11-8.97 20-20 20C9 140 0 131 0 120s8.97-20 20-20h20v20zm10.1 0c0-11 8.97-20 20-20s20 8.97 20 20v50c-.1 11-9.1 20-20.1 20C59 190 50 181 50 170v-50zm19.9-80.1c-11 0-20-8.97-20-20C50 9 59 0 69.9 0c11 0 20 8.97 20 20v20h-20zm0 10.1c11 0 20 8.97 20 20s-8.97 20-20 20h-50C9 89.9 0 80.9 0 69.9 0 59 8.97 50 20 50h50zM150 70c0-11 8.97-20 20-20s20 8.97 20 20-8.97 20-20 20h-20V70zm-10.1 0c0 11-8.97 20-20 20s-20-8.97-20-20V20c0-11 9-20 20-20s20 8.97 20 20v50zm-20 80.1c11 0 20 8.97 20 20s-8.97 20-20 20-20-8.97-20-20v-20h20zm0-10.1c-11 0-20-8.97-20-20s8.97-20 20-20h50c11 0 20 8.97 20 20s-8.97 20-20 20h-50z"></path></svg>', webhook: '<svg viewbox="0 0 576 512" height="16px" class="icon icon-code"><path fill="currentColor" d="M234.8 511.7L196 500.4c-4.2-1.2-6.7-5.7-5.5-9.9L331.3 5.8c1.2-4.2 5.7-6.7 9.9-5.5L380 11.6c4.2 1.2 6.7 5.7 5.5 9.9L244.7 506.2c-1.2 4.3-5.6 6.7-9.9 5.5zm-83.2-121.1l27.2-29c3.1-3.3 2.8-8.5-.5-11.5L72.2 256l106.1-94.1c3.4-3 3.6-8.2.5-11.5l-27.2-29c-3-3.2-8.1-3.4-11.3-.4L2.5 250.2c-3.4 3.2-3.4 8.5 0 11.7L140.3 391c3.2 3 8.2 2.8 11.3-.4zm284.1.4l137.7-129.1c3.4-3.2 3.4-8.5 0-11.7L435.7 121c-3.2-3-8.3-2.9-11.3.4l-27.2 29c-3.1 3.3-2.8 8.5.5 11.5L503.8 256l-106.1 94.1c-3.4 3-3.6 8.2-.5 11.5l27.2 29c3.1 3.2 8.1 3.4 11.3.4z"></path></svg>', telegram: '<svg viewbox="0 0 496 512" class="icon icon-telegram-bw"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"></path></svg>', zapier: '<svg width="400" height="400" viewbox="0 0 400 400" class="icon icon-zapier-bw"><path fill="currentColor" d="M250 200.087c-.01 14.862-2.727 29.09-7.68 42.224-13.132 4.955-27.366 7.68-42.234 7.69h-.172c-14.86-.01-29.09-2.727-42.222-7.68-4.954-13.132-7.682-27.366-7.692-42.232v-.173c.01-14.862 2.732-29.09 7.678-42.223 13.138-4.954 27.37-7.68 42.236-7.69h.172c14.868.01 29.102 2.736 42.233 7.69 4.952 13.134 7.67 27.362 7.68 42.224v.173zm147.22-33.42H280.474l82.55-82.55a200.92 200.92 0 0 0-21.612-25.548l-.004-.006a201.057 201.057 0 0 0-25.524-21.59l-82.55 82.55V2.782A201.232 201.232 0 0 0 200.104 0h-.212a201.23 201.23 0 0 0-33.226 2.78v116.747l-82.55-82.55a200.942 200.942 0 0 0-25.535 21.6l-.03.027a201.01 201.01 0 0 0-21.574 25.512l82.55 82.55H2.78S.004 188.596 0 199.926v.145a201.324 201.324 0 0 0 2.78 33.264h116.746l-82.55 82.55a201.137 201.137 0 0 0 47.14 47.14l82.55-82.548V397.22A201.347 201.347 0 0 0 199.86 400h.286a201.44 201.44 0 0 0 33.19-2.78V280.473l82.55 82.55a201.038 201.038 0 0 0 25.528-21.592l.02-.017a201.182 201.182 0 0 0 21.59-25.527l-82.55-82.552H397.22a201.347 201.347 0 0 0 2.78-33.19v-.287a201.44 201.44 0 0 0-2.78-33.19z" fill-rule="evenodd"></path></svg>', statuspage: '<svg role="img" viewbox="0 0 24 24" class="icon icon-statuspage-bw"><path fill="currentColor" d="M12.008 9.597a5.623 5.623 0 1 1 0 11.245 5.623 5.623 0 0 1 0-11.245zM.154 8.717l3.02 3.574a.639.639 0 0 0 .913.068c4.885-4.379 10.97-4.379 15.84 0a.642.642 0 0 0 .916-.068l3.006-3.574a.646.646 0 0 0-.075-.906c-7.1-6.204-16.462-6.204-23.555 0a.65.65 0 0 0-.065.906z"></path></svg>' } };
ready(function() {
    all("#pricing var").forEach(function(e) { spinner(e, computePrice) });
    var e = byId("quotes");
    e && setInterval(cycleQuotes, 1e4, e)
}), "" != location.hash && all('a[href^="/users/auth"]').forEach(function(e) { e.setAttribute("href", e.getAttribute("href") + location.hash) });
var localStorageAvailable = function() { if ("undefined" == typeof localStorage) return !1; try { return localStorage["updown-test"] = !0, localStorage.removeItem("updown-test"), !0 } catch (e) { return !1 } }();
localStorageAvailable && ((signout = first("a.sign-out")) && signout.addEventListener("click", function() { localStorage.removeItem("autologin") }, !1), (destroy = first('form[action="/account/destroy"]')) && destroy.addEventListener("submit", function() { localStorage.removeItem("autologin") }, !1), (session = first("#session .signed-in")) ? (localStorage["autologin-provider"] = session.getAttribute("data-provider") || "", localStorage["autologin-account"] = session.getAttribute("data-account") || "", "" != localStorage["autologin-account"] && "" != localStorage["autologin-provider"] ? localStorage.autologin = !0 : localStorage.removeItem("autologin"), session.getAttribute("data-hint") && (localStorage["autologin-hint"] = session.getAttribute("data-hint"))) : (section = first("section#signin")) && localStorage.autologin && "" != localStorage["autologin-provider"] && (link = first('a[href^="/users/auth/' + localStorage["autologin-provider"] + '"]', section)) && (url = link.getAttribute("href"), localStorage["autologin-hint"] && (parts = url.split("#"), parts[0] += "?login_hint=" + localStorage["autologin-hint"], url = parts.join("#")), localStorage.removeItem("autologin"), link.setAttribute("href", url), link.click(), section.className = "processing", icon = localStorage["autologin-provider"].split("_")[0], all("button, input").forEach(function(e) { e.disabled = !0 }), first("#signin .msg").innerHTML = "Automatically signing you in as " + first("svg", link).outerHTML + " <strong>" + localStorage["autologin-account"] + "</strong>\u2026", replace(first("svg", link), parseHTML(SVG.spinner)))), all('a[href^="/users/auth"]').forEach(function(e) { e.addEventListener("click", function() { replace(first("svg", this), parseHTML(SVG.spinner)), addClass(byId("signin"), "processing"), all("input").forEach(function(e) { e.disabled = !0 }) }) }), all(".flash").forEach(function(e) {
    var t = hasClass(e, "alert") ? 1e4 : 5e3,
        n = function n() { e.style.marginTop = "-3em" };
    e.addEventListener("click", n), setTimeout(n, t)
}), Tooltip = function(e) {
    function o() {
        f || (f = document.createElement("div"), p = document.createElement("div"), m = document.createElement("div"), f.className = s, p.className = "arrow", m.className = s + "-inner", f.appendChild(p), f.appendChild(m), "body" == n && document.body.appendChild(f)), "after" == n && d.insertAdjacentElement("afterend", f), h && (clearInterval(h), h = null), m.innerHTML = u(d);
        var e = d.dataset.position || c;
        f.style.display = "", t(d, e), addClass(f, "in")
    }

    function a() { "click" == l ? (f.style.display = "none", remClass(f, "in")) : h = setTimeout(function() { remClass(f, "in"), h = setTimeout(function() { f.style.display = "none", h = null }, 150) }, 100) }

    function t(e, t) {
        var n = e.getBoundingClientRect(),
            o = undefined,
            a = undefined;
        (o = n.left + (e.offsetWidth - f.offsetWidth) / 2) <= i && (o = i), o + f.offsetWidth >= document.documentElement.clientWidth - i && (o = document.documentElement.clientWidth - f.offsetWidth - i);
        var r = n.left + e.offsetWidth / 2 - o;
        p.style.left = r + "px", "bottom" == t ? (a = n.bottom + i) + f.offsetHeight >= document.documentElement.clientHeight - i && (a = n.top - f.offsetHeight - i, t = "top") : (a = n.top - f.offsetHeight - i) <= i && (a = n.bottom + i, t = "bottom"), o = 2 * Math.round(o / 2), a = 2 * Math.round(a / 2), f.style.left = o + "px", f.style.top = a + pageYOffset + "px", f.className = s + " " + t
    }
    var i = e.distance || 5,
        r = e.selector || "[rel=tooltip]",
        n = e.inject || "body",
        l = e.trigger || "hover",
        c = e.position || "top",
        s = e.klass || "tooltip",
        u = e.content || function(e) { return e.title && (e.dataset.originalTitle = e.title, e.removeAttribute("title")), e.dataset.originalTitle },
        d = undefined,
        f = undefined,
        p = undefined,
        m = undefined,
        h = undefined;
    "hover" == l || "focus" == l ? (document.body.addEventListener("focus" == l ? "focusin" : "mouseover", function(e) {
        if (!d) {
            var t = e.target.closest(r);
            t && (t.title || t.dataset.originalTitle) && (d = t, o())
        }
    }), document.body.addEventListener("focus" == l ? "focusout" : "mouseout", function(e) {
        if (d) {
            for (var t = e.relatedTarget; t;) {
                if (t == d) return;
                t = t.parentNode
            }
            a(d), d = null
        }
    })) : "click" == l ? document.body.addEventListener("click", function(e) {
        var t = e.target.closest(r);
        if (t) {
            e.preventDefault();
            var n = d;
            d && (a(d), d = null), n && n == t || o(d = t)
        }
    }) : console.warn('Tooltip: invalid trigger ("' + l + '")')
}, new Tooltip({ selector: "[rel=tooltip]", trigger: "hover" }), new Tooltip({ selector: "[rel=focushelp]", trigger: "focus" }), ready(function() {
    if (all("form[data-auto-submit=true]").forEach(function(e) { on(e, "change", function() { return e.submit() }), (submit = first("input[type=submit]", e)) && submit.remove() }), all("input.fancy[type=checkbox]").forEach(function(e) { toggle = parseHTML('<div class="toggle"><b class="on">' + e.dataset.on + '</b><b class="off">' + e.dataset.off + "</b></div>"), enable = first(".on", toggle), disable = first(".off", toggle), addClass(e.checked ? enable : disable, "selected"), on(enable, "click", function() { e.checked || (addClass(enable, "selected"), remClass(disable, "selected"), e.checked = !0, trigger(e, "change")) }), on(disable, "click", function() { e.checked && (addClass(disable, "selected"), remClass(enable, "selected"), e.checked = !1, trigger(e, "change")) }), e.style.display = "none", e.parentNode.insertBefore(toggle, e) }), error = first("form .errors")) {
        var e = error.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: e, left: 0, smooth: !0 })
    }
    on(document, "click", ".multiple-fields .add", function(e) {
        var t = e.parentNode,
            n = t.cloneNode(!0);
        t.insertAdjacentElement("afterend", n), all("input", n).forEach(function(e) { e.value = "", e.focus() })
    }), on(document, "click", ".multiple-fields .remove", function(e) { return e.parentNode.remove() }), on(document, "click", ".embedded-multiple-fields .add", function(e) {
        var t, n = e.parentNode,
            o = first("input, select, textarea", n).name.match(/\]\[(\d+)\]\[/),
            a = n.cloneNode(!0);
        o && (t = parseInt(o[1], 10), all("input, select, textarea", a).forEach(function(e) { e.name = e.name.replace(/\]\[(\d+)\]\[/g, "][" + (t + 1) + "][") })), n.insertAdjacentElement("afterend", a), all("input", a).forEach(function(e) { e.value = "", e.focus() })
    }), on(document, "click", ".embedded-multiple-fields .remove", function(e) {
        var t = e.parentNode;
        first('input[name*="[_destroy]"]', t).value = !0;
        var n = t.previousElementSibling;
        n && n.matches(".errors.inline") && n.remove(), t.style.display = "none"
    })
}), on(document, "click", "#checks li a.edit", function(e, t) {
    t.preventDefault();
    var n = e.closest("li");
    if (hasClass(n, "locked")) return !1;
    Rails.ajax({
        url: e.dataset.href,
        type: "GET",
        success: function o(e) {
            var t = e.body.firstChild;
            n.insertAdjacentElement("afterend", t), n.style.display = "none", update_form(t.querySelector("form"))
        }
    }), addClass(n, "locked")
}), on(document, "click", "#checks li a.cancel", function(e, t) {
    t.preventDefault();
    var n = e.closest("li");
    if (hasClass(n, "locked")) return !1;
    remClass(n.previousElementSibling, "locked"), n.previousElementSibling.style.display = "", n.remove()
}), on(document, "submit", "#checks li.edit form", function(n, e) {
    if (e.preventDefault(), li = n.closest("li"), hasClass(li, "locked")) return !1;
    Rails.ajax({
        url: n.action,
        type: "POST",
        data: new FormData(n),
        success: function o(e) {
            var t = e.body.firstChild;
            hasClass(t, "form") || li.previousElementSibling.remove(), replace(li, t)
        },
        error: function a(e, t) { n.insertBefore(parseHTML('<div class="errors floating">' + t + "</div>"), n.firstChild), li.querySelector("button[type=submit]").disabled = !1, remClass(li, "locked") }
    }), li.querySelector("button[type=submit]").disabled = !0, addClass(li, "locked")
}), on(document, "click", "#checks li.edit a.delete", function(e, t) { return t.preventDefault(), li = e.closest("li"), form = e.closest("form"), !hasClass(li, "locked") && (!!confirm("Do you really want to delete this check?") && (Rails.ajax({ url: e.href, type: "DELETE", success: function n() { li.previousElementSibling.remove(), li.remove() }, error: function o(e, t) { form.insertBefore(parseHTML('<div class="errors floating">' + t + "</div>"), form.firstChild), li.querySelector("button[type=submit]").disabled = !1, remClass(li, "locked") } }), li.querySelector("button[type=submit]").disabled = !0, void addClass(li, "locked"))) }), on(document, "change", "#check_type", function(e) { return update_form(e.closest("form")) }), on(document, "change keyup", "#check_url", function(e) {
    if (e.value) {
        var t = e.value.match(/^(\w{3,5}):\/\//);
        if (t) {
            var n = t[1],
                o = e.closest("form"),
                a = o.querySelector("#check_type");
            a.querySelector('option[value="' + n + '"]') && (a.value = n, e.value = e.value.replace(/^(\w{3,5}):\/\//, ""), update_form(o))
        }
    }
}), ready(function() { update_form(first("#checks form#new_check")), first(".suggestions") && on(first(".suggestions"), "click", "a", function(e) { form = first("#checks form#new_check"), field = form.querySelector("#check_url"), field.value = e.dataset.url, trigger(field, "change"), replace(e.querySelector("svg"), parseHTML(SVG.spinner)), form.submit() }), ua = navigator.userAgent.toLowerCase(), -1 != ua.indexOf("safari") && (-1 < ua.indexOf("chrome") ? addClass(first("html"), "chrome") : addClass(first("html"), "safari")) }), ready(function() {
    all("output[data-increment]").forEach(function(t) {
        function n(e) { var t = /(\d+)(\d{3})/; for (e += ""; t.test(e);) e = e.replace(t, "$1,$2"); return e }

        function e() {
            if (!document.hidden) {
                var e = Math.round(o + (new Date - r) * a / 3600 / 1e3);
                (e = n(Math.max(e, 0))) != t.textContent && (t.textContent = e)
            }
        }
        var o = parseInt(t.textContent),
            a = t.getAttribute("data-increment"),
            r = new Date;
        if (t.getAttribute("data-time") && (r = new Date(1e3 * t.getAttribute("data-time"))), e(), .1 < Math.abs(a)) {
            var i = 36e5 / Math.abs(a);
            i < 90 && (i = 90), setInterval(e, i)
        }
    })
}), ready(function() {
    function t() {
        var t = afind(e, function(e) { return e.checked });
        all("[data-toggle]").forEach(function(e) { toggleClass(e, "hidden", !afind(e.dataset.toggle.split(" "), t.id)) }), window.location.hash = t.id
    }
    var e = all(".method-toggle input[type='radio']");
    if (0 != e.length) {
        if (e.forEach(function(e) { e.addEventListener("change", t) }), "" != window.location.hash) {
            var n = document.querySelector(".method-toggle " + window.location.hash);
            n && n.click()
        }
        t()
    }
}), ready(function() {
    function a(e) {
        e.forEach(function(e) {
            var t = e.parentNode,
                n = e.checked;
            toggleClass(t, "checked", n), toggleClass(t, "changed", e.dataset.originallyChecked != n.toString())
        })
    }

    function r(e, t, n) {
        var o = parseInt(e.dataset.counter);
        o += n ? t : -t, e.dataset.counter = o, first(".counter", e).textContent = "(" + o + ")"
    }
    var e = first("#bulk-update-table");
    e && (on(e, "click", ".recipient-column > div", function(e) {
        e = e.parentNode;
        var t = 0 == parseInt(e.dataset.counter),
            n = all("input:" + (t ? "not(:checked)" : "checked") + ':enabled[data-recipient-identifier="' + e.dataset.recipientIdentifier + '"]');
        r(e, n.length, t), n.forEach(function(e) { e.checked = t, r(first("th", e.parentNode.parentNode), 1, t) }), a(n)
    }), on(e, "click", ".check-row", function(e) {
        var t = e.parentNode,
            n = 0 == all('input:checked:enabled[data-check-id="' + e.dataset.checkId + '"]', t).length,
            o = all("input:" + (n ? "not(:checked)" : "checked") + ':enabled[data-check-id="' + e.dataset.checkId + '"]', t);
        r(e, o.length, n), o.forEach(function(e) { e.checked = n, r(first('th.recipient-column[data-recipient-identifier="' + e.dataset.recipientIdentifier + '"]'), 1, n) }), a(o)
    }), on(e, "change", 'input[type="checkbox"]', function(e) {
        var t = e.checked,
            n = first('th.recipient-column[data-recipient-identifier="' + e.dataset.recipientIdentifier + '"]'),
            o = first('th.check-row[data-check-id="' + e.dataset.checkId + '"]', e.parentNode.parentNode);
        r(n, 1, t), r(o, 1, t), a([e])
    }), on(e, "click", "td", function(e, t) { t.target == e && first("input", e).click() }))
});
var VERB = ["get/head", "post", "put", "patch", "delete", "options"],
    VERBS_WITHOUT_BODY = ["get/head", "options"],
    DEFAULT_HEADERS = { "User-Agent": "updown.io daemon 2.6", Accept: "*/*", Connection: "Close", "Accept-Language": "en", "Content-Type": "application/x-www-form-urlencoded" };
on(document, "keyup keypress focusout", ".popover .new.header input", function(e, t) {
    if ((13 == t.which || "focusout" == t.type) && (t.preventDefault(), 0 != e.checkValidity())) {
        var n = e.closest("form"),
            o = n.querySelector(".request-options"),
            a = e.value.split(":");
        if (!(a.length < 2)) {
            var r = n.querySelector('input[name="check[headers_json]"]'),
                i = JSON.parse(r.value);
            i[a[0].trim()] = a[1].trim() || "", r.value = JSON.stringify(i), e.closest(".popover-inner").innerHTML = custom_header_form(o), n.querySelector(".new.header input").focus()
        }
    }
}), on(document, "change", ".popover .verb select", function(e) {
    var t = e.closest("form");
    t.querySelector('input[name="check[http_verb]"]').value = e.value, update_http_options(t)
}), on(document, "keyup keypress focusout", ".popover .body textarea", function(e) { e.closest("form").querySelector('input[name="check[http_body]"]').value = e.value }), on(document, "keyup keypress focusout blur", ".popover .edit.header input", function(e, t) {
    13 == t.keyCode && t.preventDefault();
    var n = e.closest("form").querySelector('input[name="check[headers_json]"]'),
        o = JSON.parse(n.value);
    0 < e.value.length ? o[e.name] = e.value : delete o[e.name], n.value = JSON.stringify(o)
}), new Tooltip({ selector: ".subform.request-options", trigger: "click", position: "bottom", inject: "after", klass: "popover", content: custom_header_form }), on(document, "click", ".popover .location", function(e) {
    var t = e.closest("form"),
        n = t.querySelector(".locations"),
        o = t.querySelector('input[name="check[locations[' + e.dataset.name + ']]"]'),
        a = n.dataset.minimum,
        r = t.querySelectorAll('input[name^="check[locations"]:not([value="false"])').length;
    if ("false" == o.value) o.value = "", r += 1;
    else {
        if (r <= a) return;
        o.value = "false", r -= 1
    }
    e.closest(".popover-inner").innerHTML = location_selector(n), n.dataset.count = r
}), new Tooltip({ selector: ".subform.locations", trigger: "click", position: "bottom", inject: "after", klass: "popover", content: location_selector }), on(document, "click", ".popover .recipient", function(e) {
    if ("true" != e.dataset.disabled) {
        var t = e.closest("form"),
            n = t.querySelector(".recipients"),
            o = t.querySelector('input[name="check[recipients[' + e.dataset.name + ']]"]'),
            a = t.querySelectorAll('input[name^="check[recipients"]:not([value="false"])').length;
        "false" == o.value ? (o.value = "", a += 1) : (o.value = "false", a -= 1), e.closest(".popover-inner").innerHTML = recipient_selector(n), n.dataset.count = a
    }
}), new Tooltip({ selector: ".subform.recipients", trigger: "click", position: "bottom", inject: "after", klass: "popover", content: recipient_selector });