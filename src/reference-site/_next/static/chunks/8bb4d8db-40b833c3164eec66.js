try {
    let e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {},
        t = (new e.Error).stack;
    t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "df6491a8-59f5-4879-a1f7-9442d4aa3087", e._sentryDebugIdIdentifier = "sentry-dbid-df6491a8-59f5-4879-a1f7-9442d4aa3087")
} catch (e) {
}
"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[9249], {
    43482: (e, t, n) => {
        n.d(t, {
            DL: () => eM,
            It: () => ew,
            Mk: () => q,
            SV: () => f,
            XF: () => Z,
            bv: () => eh,
            iB: () => eL,
            iQ: () => eE,
            kp: () => ea,
            s3: () => eo,
            s9: () => em,
            we: () => ep,
            zR: () => ec
        });
        var r, o = n(7620), u = n(69587), l = n(54568), i = n(4548), c = n(14148), s = n(97509), a = n(60496);

        function f(e) {
            let t = o.useRef(void 0), n = o.useCallback(t => {
                let n = e.map(e => {
                    if (null != e) {
                        if ("function" == typeof e) {
                            let n = e(t);
                            return "function" == typeof n ? n : () => {
                                e(null)
                            }
                        }
                        return e.current = t, () => {
                            e.current = null
                        }
                    }
                });
                return () => {
                    n.forEach(e => null == e ? void 0 : e())
                }
            }, e);
            return o.useMemo(() => e.every(e => null == e) ? null : e => {
                t.current && (t.current(), t.current = void 0), null != e && (t.current = n(e))
            }, e)
        }

        let d = "active", v = "selected", m = "ArrowLeft", p = "ArrowRight", g = "ArrowUp", E = "ArrowDown",
            b = {...r || (r = n.t(o, 2))}, h = !1, y = 0,
            R = () => "floating-ui-" + Math.random().toString(36).slice(2, 6) + y++, w = b.useId || function () {
                let [e, t] = o.useState(() => h ? R() : void 0);
                return (0, u.OS)(() => {
                    null == e && t(R())
                }, []), o.useEffect(() => {
                    h = !0
                }, []), e
            }, x = o.createContext(null), k = o.createContext(null), M = () => {
                var e;
                return (null == (e = o.useContext(x)) ? void 0 : e.id) || null
            }, S = () => o.useContext(k);

        function L(e) {
            return "data-floating-ui-" + e
        }

        function C(e) {
            -1 !== e.current && (clearTimeout(e.current), e.current = -1)
        }

        let A = L("safe-polygon");

        function T(e, t, n) {
            if (n && !(0, u.Go)(n)) return 0;
            if ("number" == typeof e) return e;
            if ("function" == typeof e) {
                let n = e();
                return "number" == typeof n ? n : null == n ? void 0 : n[t]
            }
            return null == e ? void 0 : e[t]
        }

        function O(e) {
            return "function" == typeof e ? e() : e
        }

        function q(e, t) {
            void 0 === t && (t = {});
            let {open: n, onOpenChange: r, dataRef: l, events: c, elements: s} = e, {
                    enabled: a = !0,
                    delay: f = 0,
                    handleClose: d = null,
                    mouseOnly: v = !1,
                    restMs: m = 0,
                    move: p = !0
                } = t, g = S(), E = M(), b = (0, u.SE)(d), h = (0, u.SE)(f), y = (0, u.SE)(n), R = (0, u.SE)(m),
                w = o.useRef(), x = o.useRef(-1), k = o.useRef(), L = o.useRef(-1), q = o.useRef(!0), P = o.useRef(!1),
                W = o.useRef(() => {
                }), j = o.useRef(!1), D = (0, u.Jt)(() => {
                    var e;
                    let t = null == (e = l.current.openEvent) ? void 0 : e.type;
                    return (null == t ? void 0 : t.includes("mouse")) && "mousedown" !== t
                });
            o.useEffect(() => {
                if (a) return c.on("openchange", e), () => {
                    c.off("openchange", e)
                };

                function e(e) {
                    let {open: t} = e;
                    t || (C(x), C(L), q.current = !0, j.current = !1)
                }
            }, [a, c]), o.useEffect(() => {
                if (!a || !b.current || !n) return;

                function e(e) {
                    D() && r(!1, e, "hover")
                }

                let t = (0, u.YE)(s.floating).documentElement;
                return t.addEventListener("mouseleave", e), () => {
                    t.removeEventListener("mouseleave", e)
                }
            }, [s.floating, n, r, a, b, D]);
            let I = o.useCallback(function (e, t, n) {
                void 0 === t && (t = !0), void 0 === n && (n = "hover");
                let o = T(h.current, "close", w.current);
                o && !k.current ? (C(x), x.current = window.setTimeout(() => r(!1, e, n), o)) : t && (C(x), r(!1, e, n))
            }, [h, r]), F = (0, u.Jt)(() => {
                W.current(), k.current = void 0
            }), Y = (0, u.Jt)(() => {
                if (P.current) {
                    let e = (0, u.YE)(s.floating).body;
                    e.style.pointerEvents = "", e.removeAttribute(A), P.current = !1
                }
            }), _ = (0, u.Jt)(() => !!l.current.openEvent && ["click", "mousedown"].includes(l.current.openEvent.type));
            o.useEffect(() => {
                if (a && (0, i.vq)(s.domReference)) {
                    let r = s.domReference, u = s.floating;
                    return n && r.addEventListener("mouseleave", o), p && r.addEventListener("mousemove", e, {once: !0}), r.addEventListener("mouseenter", e), r.addEventListener("mouseleave", t), u && (u.addEventListener("mouseleave", o), u.addEventListener("mouseenter", c), u.addEventListener("mouseleave", f)), () => {
                        n && r.removeEventListener("mouseleave", o), p && r.removeEventListener("mousemove", e), r.removeEventListener("mouseenter", e), r.removeEventListener("mouseleave", t), u && (u.removeEventListener("mouseleave", o), u.removeEventListener("mouseenter", c), u.removeEventListener("mouseleave", f))
                    }
                }

                function e(e) {
                    if (C(x), q.current = !1, v && !(0, u.Go)(w.current) || O(R.current) > 0 && !T(h.current, "open")) return;
                    let t = T(h.current, "open", w.current);
                    t ? x.current = window.setTimeout(() => {
                        y.current || r(!0, e, "hover")
                    }, t) : n || r(!0, e, "hover")
                }

                function t(e) {
                    if (_()) return void Y();
                    W.current();
                    let t = (0, u.YE)(s.floating);
                    if (C(L), j.current = !1, b.current && l.current.floatingContext) {
                        n || C(x), k.current = b.current({
                            ...l.current.floatingContext,
                            tree: g,
                            x: e.clientX,
                            y: e.clientY,
                            onClose() {
                                Y(), F(), _() || I(e, !0, "safe-polygon")
                            }
                        });
                        let r = k.current;
                        t.addEventListener("mousemove", r), W.current = () => {
                            t.removeEventListener("mousemove", r)
                        };
                        return
                    }
                    "touch" === w.current && (0, u.gR)(s.floating, e.relatedTarget) || I(e)
                }

                function o(e) {
                    !_() && l.current.floatingContext && (null == b.current || b.current({
                        ...l.current.floatingContext,
                        tree: g,
                        x: e.clientX,
                        y: e.clientY,
                        onClose() {
                            Y(), F(), _() || I(e)
                        }
                    })(e))
                }

                function c() {
                    C(x)
                }

                function f(e) {
                    _() || I(e, !1)
                }
            }, [s, a, e, v, p, I, F, Y, r, n, y, g, h, b, l, _, R]), (0, u.OS)(() => {
                var e, t;
                if (a && n && null != (e = b.current) && null != (e = e.__options) && e.blockPointerEvents && D()) {
                    P.current = !0;
                    let e = s.floating;
                    if ((0, i.vq)(s.domReference) && e) {
                        let n = (0, u.YE)(s.floating).body;
                        n.setAttribute(A, "");
                        let r = s.domReference,
                            o = null == g || null == (t = g.nodesRef.current.find(e => e.id === E)) || null == (t = t.context) ? void 0 : t.elements.floating;
                        return o && (o.style.pointerEvents = ""), n.style.pointerEvents = "none", r.style.pointerEvents = "auto", e.style.pointerEvents = "auto", () => {
                            n.style.pointerEvents = "", r.style.pointerEvents = "", e.style.pointerEvents = ""
                        }
                    }
                }
            }, [a, n, E, s, g, b, D]), (0, u.OS)(() => {
                n || (w.current = void 0, j.current = !1, F(), Y())
            }, [n, F, Y]), o.useEffect(() => () => {
                F(), C(x), C(L), Y()
            }, [a, s.domReference, F, Y]);
            let N = o.useMemo(() => {
                function e(e) {
                    w.current = e.pointerType
                }

                return {
                    onPointerDown: e, onPointerEnter: e, onMouseMove(e) {
                        let {nativeEvent: t} = e;

                        function o() {
                            q.current || y.current || r(!0, t, "hover")
                        }

                        (!v || (0, u.Go)(w.current)) && !n && 0 !== O(R.current) && (j.current && e.movementX ** 2 + e.movementY ** 2 < 2 || (C(L), "touch" === w.current ? o() : (j.current = !0, L.current = window.setTimeout(o, O(R.current)))))
                    }
                }
            }, [v, r, n, y, R]);
            return o.useMemo(() => a ? {reference: N} : {}, [a, N])
        }

        let P = () => {
        }, W = o.createContext({
            delay: 0,
            initialDelay: 0,
            timeoutMs: 0,
            currentId: null,
            setCurrentId: P,
            setState: P,
            isInstantPhase: !1
        });
        let j = 0;

        function D(e, t) {
            void 0 === t && (t = {});
            let {preventScroll: n = !1, cancelPrevious: r = !0, sync: o = !1} = t;
            r && cancelAnimationFrame(j);
            let u = () => null == e ? void 0 : e.focus({preventScroll: n});
            o ? u() : j = requestAnimationFrame(u)
        }

        function I(e, t) {
            if (!e || !t) return !1;
            let n = null == t.getRootNode ? void 0 : t.getRootNode();
            if (e.contains(t)) return !0;
            if (n && (0, i.Ng)(n)) {
                let n = t;
                for (; n;) {
                    if (e === n) return !0;
                    n = n.parentNode || n.host
                }
            }
            return !1
        }

        let F = {inert: new WeakMap, "aria-hidden": new WeakMap, none: new WeakMap};

        function Y(e) {
            return "inert" === e ? F.inert : "aria-hidden" === e ? F["aria-hidden"] : F.none
        }

        let _ = new WeakSet, N = {}, J = 0,
            B = () => "undefined" != typeof HTMLElement && "inert" in HTMLElement.prototype,
            K = e => e && (e.host || K(e.parentNode)), X = (e, t) => t.map(t => {
                if (e.contains(t)) return t;
                let n = K(t);
                return e.contains(n) ? n : null
            }).filter(e => null != e);

        function Q(e, t, n) {
            var r;
            void 0 === t && (t = !1), void 0 === n && (n = !1);
            let o = ((null == (r = e[0]) ? void 0 : r.ownerDocument) || document).body;
            return function (e, t, n, r) {
                let o = "data-floating-ui-inert", u = r ? "inert" : n ? "aria-hidden" : null, l = X(t, e), c = new Set,
                    s = new Set(l), a = [];
                N[o] || (N[o] = new WeakMap);
                let f = N[o];
                return l.forEach(function e(t) {
                    !(!t || c.has(t)) && (c.add(t), t.parentNode && e(t.parentNode))
                }), function e(t) {
                    !t || s.has(t) || [].forEach.call(t.children, t => {
                        if ("script" !== (0, i.mq)(t)) if (c.has(t)) e(t); else {
                            let e = u ? t.getAttribute(u) : null, n = null !== e && "false" !== e, r = Y(u),
                                l = (r.get(t) || 0) + 1, i = (f.get(t) || 0) + 1;
                            r.set(t, l), f.set(t, i), a.push(t), 1 === l && n && _.add(t), 1 === i && t.setAttribute(o, ""), !n && u && t.setAttribute(u, "inert" === u ? "" : "true")
                        }
                    })
                }(t), c.clear(), J++, () => {
                    a.forEach(e => {
                        let t = Y(u), n = (t.get(e) || 0) - 1, r = (f.get(e) || 0) - 1;
                        t.set(e, n), f.set(e, r), n || (!_.has(e) && u && e.removeAttribute(u), _.delete(e)), r || e.removeAttribute(o)
                    }), --J || (F.inert = new WeakMap, F["aria-hidden"] = new WeakMap, F.none = new WeakMap, _ = new WeakSet, N = {})
                }
            }(e.concat(Array.from(o.querySelectorAll("[aria-live]"))), o, t, n)
        }

        let V = {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: "1px",
            margin: "-1px",
            overflow: "hidden",
            padding: 0,
            position: "fixed",
            whiteSpace: "nowrap",
            width: "1px",
            top: 0,
            left: 0
        }, H = o.forwardRef(function (e, t) {
            let [n, r] = o.useState();
            (0, u.OS)(() => {
                (0, u.nr)() && r("button")
            }, []);
            let i = {ref: t, tabIndex: 0, role: n, "aria-hidden": !n || void 0, [L("focus-guard")]: "", style: V};
            return (0, l.jsx)("span", {...e, ...i})
        }), $ = o.createContext(null), G = L("portal");

        function Z(e) {
            let {children: t, id: n, root: r, preserveTabOrder: c = !0} = e, a = function (e) {
                    void 0 === e && (e = {});
                    let {id: t, root: n} = e, r = w(), l = z(), [c, s] = o.useState(null), a = o.useRef(null);
                    return (0, u.OS)(() => () => {
                        null == c || c.remove(), queueMicrotask(() => {
                            a.current = null
                        })
                    }, [c]), (0, u.OS)(() => {
                        if (!r || a.current) return;
                        let e = t ? document.getElementById(t) : null;
                        if (!e) return;
                        let n = document.createElement("div");
                        n.id = r, n.setAttribute(G, ""), e.appendChild(n), a.current = n, s(n)
                    }, [t, r]), (0, u.OS)(() => {
                        if (null === n || !r || a.current) return;
                        let e = n || (null == l ? void 0 : l.portalNode);
                        e && !(0, i.vq)(e) && (e = e.current), e = e || document.body;
                        let o = null;
                        t && ((o = document.createElement("div")).id = t, e.appendChild(o));
                        let u = document.createElement("div");
                        u.id = r, u.setAttribute(G, ""), (e = o || e).appendChild(u), a.current = u, s(u)
                    }, [t, n, r, l]), c
                }({id: n, root: r}), [f, d] = o.useState(null), v = o.useRef(null), m = o.useRef(null), p = o.useRef(null),
                g = o.useRef(null), E = null == f ? void 0 : f.modal, b = null == f ? void 0 : f.open,
                h = !!f && !f.modal && f.open && c && !!(r || a);
            return o.useEffect(() => {
                if (a && c && !E) return a.addEventListener("focusin", e, !0), a.addEventListener("focusout", e, !0), () => {
                    a.removeEventListener("focusin", e, !0), a.removeEventListener("focusout", e, !0)
                };

                function e(e) {
                    a && (0, u.Qp)(e) && ("focusin" === e.type ? u.yV : u.N)(a)
                }
            }, [a, c, E]), o.useEffect(() => {
                a && (b || (0, u.yV)(a))
            }, [b, a]), (0, l.jsxs)($.Provider, {
                value: o.useMemo(() => ({
                    preserveTabOrder: c,
                    beforeOutsideRef: v,
                    afterOutsideRef: m,
                    beforeInsideRef: p,
                    afterInsideRef: g,
                    portalNode: a,
                    setFocusManagerState: d
                }), [c, a]), children: [h && a && (0, l.jsx)(H, {
                    "data-type": "outside", ref: v, onFocus: e => {
                        if ((0, u.Qp)(e, a)) {
                            var t;
                            null == (t = p.current) || t.focus()
                        } else {
                            let e = f ? f.domReference : null, t = (0, u.XJ)(e);
                            null == t || t.focus()
                        }
                    }
                }), h && a && (0, l.jsx)("span", {
                    "aria-owns": a.id,
                    style: V
                }), a && s.createPortal(t, a), h && a && (0, l.jsx)(H, {
                    "data-type": "outside", ref: m, onFocus: e => {
                        if ((0, u.Qp)(e, a)) {
                            var t;
                            null == (t = g.current) || t.focus()
                        } else {
                            let t = f ? f.domReference : null, n = (0, u.vF)(t);
                            null == n || n.focus(), (null == f ? void 0 : f.closeOnFocusOut) && (null == f || f.onOpenChange(!1, e.nativeEvent, "focus-out"))
                        }
                    }
                })]
            })
        }

        let z = () => o.useContext($);

        function U(e) {
            return o.useMemo(() => t => {
                e.forEach(e => {
                    e && (e.current = t)
                })
            }, e)
        }

        let ee = [];

        function et() {
            return ee.slice().reverse().find(e => e.isConnected)
        }

        function en(e, t) {
            var n;
            if (!t.current.includes("floating") && !(null != (n = e.getAttribute("role")) && n.includes("dialog"))) return;
            let r = (0, u.kQ)(), o = (0, c.nq)(e, r).filter(e => {
                let t = e.getAttribute("data-tabindex") || "";
                return (0, c.AO)(e, r) || e.hasAttribute("data-tabindex") && !t.startsWith("-")
            }), l = e.getAttribute("tabindex");
            t.current.includes("floating") || 0 === o.length ? "0" !== l && e.setAttribute("tabindex", "0") : ("-1" !== l || e.hasAttribute("data-tabindex") && "-1" !== e.getAttribute("data-tabindex")) && (e.setAttribute("tabindex", "-1"), e.setAttribute("data-tabindex", "-1"))
        }

        let er = o.forwardRef(function (e, t) {
            return (0, l.jsx)("button", {...e, type: "button", ref: t, tabIndex: -1, style: V})
        });

        function eo(e) {
            let {
                    context: t,
                    children: n,
                    disabled: r = !1,
                    order: s = ["content"],
                    guards: a = !0,
                    initialFocus: f = 0,
                    returnFocus: d = !0,
                    restoreFocus: v = !1,
                    modal: m = !0,
                    visuallyHiddenDismiss: p = !1,
                    closeOnFocusOut: g = !0,
                    outsideElementsInert: E = !1,
                    getInsideElements: b = () => []
                } = e, {open: h, onOpenChange: y, events: R, dataRef: w, elements: {domReference: x, floating: k}} = t,
                M = (0, u.Jt)(() => {
                    var e;
                    return null == (e = w.current.floatingContext) ? void 0 : e.nodeId
                }), C = (0, u.Jt)(b), A = "number" == typeof f && f < 0, T = (0, u.WZ)(x) && A, O = B(), q = !O || a,
                P = !q || O && E, W = (0, u.SE)(s), j = (0, u.SE)(f), I = (0, u.SE)(d), F = S(), Y = z(),
                _ = o.useRef(null), N = o.useRef(null), J = o.useRef(!1), K = o.useRef(!1), X = o.useRef(-1),
                $ = null != Y, G = (0, u.nd)(k), Z = (0, u.Jt)(function (e) {
                    return void 0 === e && (e = G), e ? (0, c.Kr)(e, (0, u.kQ)()) : []
                }), eo = (0, u.Jt)(e => {
                    let t = Z(e);
                    return W.current.map(e => x && "reference" === e ? x : G && "floating" === e ? G : t).filter(Boolean).flat()
                });
            o.useEffect(() => {
                if (r || !m) return;

                function e(e) {
                    if ("Tab" === e.key) {
                        (0, u.gR)(G, (0, u.RS)((0, u.YE)(G))) && 0 === Z().length && !T && (0, u.jo)(e);
                        let t = eo(), n = (0, u.EW)(e);
                        "reference" === W.current[0] && n === x && ((0, u.jo)(e), e.shiftKey ? D(t[t.length - 1]) : D(t[1])), "floating" === W.current[1] && n === G && e.shiftKey && ((0, u.jo)(e), D(t[0]))
                    }
                }

                let t = (0, u.YE)(G);
                return t.addEventListener("keydown", e), () => {
                    t.removeEventListener("keydown", e)
                }
            }, [r, x, G, m, W, T, Z, eo]), o.useEffect(() => {
                if (!r && k) return k.addEventListener("focusin", e), () => {
                    k.removeEventListener("focusin", e)
                };

                function e(e) {
                    let t = (0, u.EW)(e), n = Z().indexOf(t);
                    -1 !== n && (X.current = n)
                }
            }, [r, k, Z]), o.useEffect(() => {
                if (!r && g && k && (0, i.sb)(x)) return x.addEventListener("focusout", t), x.addEventListener("pointerdown", e), k.addEventListener("focusout", t), () => {
                    x.removeEventListener("focusout", t), x.removeEventListener("pointerdown", e), k.removeEventListener("focusout", t)
                };

                function e() {
                    K.current = !0, setTimeout(() => {
                        K.current = !1
                    })
                }

                function t(e) {
                    let t = e.relatedTarget, n = e.currentTarget, r = (0, u.EW)(e);
                    queueMicrotask(() => {
                        let o = M(),
                            l = !((0, u.gR)(x, t) || (0, u.gR)(k, t) || (0, u.gR)(t, k) || (0, u.gR)(null == Y ? void 0 : Y.portalNode, t) || null != t && t.hasAttribute(L("focus-guard")) || F && ((0, u.CM)(F.nodesRef.current, o).find(e => {
                                var n, r;
                                return (0, u.gR)(null == (n = e.context) ? void 0 : n.elements.floating, t) || (0, u.gR)(null == (r = e.context) ? void 0 : r.elements.domReference, t)
                            }) || (0, u.$4)(F.nodesRef.current, o).find(e => {
                                var n, r, o;
                                return [null == (n = e.context) ? void 0 : n.elements.floating, (0, u.nd)(null == (r = e.context) ? void 0 : r.elements.floating)].includes(t) || (null == (o = e.context) ? void 0 : o.elements.domReference) === t
                            })));
                        if (n === x && G && en(G, W), v && n !== x && !(null != r && r.isConnected) && (0, u.RS)((0, u.YE)(G)) === (0, u.YE)(G).body) {
                            (0, i.sb)(G) && G.focus();
                            let e = X.current, t = Z(), n = t[e] || t[t.length - 1] || G;
                            (0, i.sb)(n) && n.focus()
                        }
                        if (w.current.insideReactTree) {
                            w.current.insideReactTree = !1;
                            return
                        }
                        (T || !m) && t && l && !K.current && t !== et() && (J.current = !0, y(!1, e, "focus-out"))
                    })
                }
            }, [r, x, k, G, m, F, Y, y, g, v, Z, T, M, W, w]);
            let eu = o.useRef(null), el = o.useRef(null), ei = U([eu, null == Y ? void 0 : Y.beforeInsideRef]),
                ec = U([el, null == Y ? void 0 : Y.afterInsideRef]);

            function es(e) {
                return !r && p && m ? (0, l.jsx)(er, {
                    ref: "start" === e ? _ : N,
                    onClick: e => y(!1, e.nativeEvent),
                    children: "string" == typeof p ? p : "Dismiss"
                }) : null
            }

            o.useEffect(() => {
                var e, t;
                if (r || !k) return;
                let n = Array.from((null == Y || null == (e = Y.portalNode) ? void 0 : e.querySelectorAll("[" + L("portal") + "]")) || []),
                    o = F ? (0, u.$4)(F.nodesRef.current, M()) : [], l = F && !m ? o.map(e => {
                        var t;
                        return null == (t = e.context) ? void 0 : t.elements.floating
                    }) : [], i = [k, null == (t = o.find(e => {
                        var t;
                        return (0, u.WZ)((null == (t = e.context) ? void 0 : t.elements.domReference) || null)
                    })) || null == (t = t.context) ? void 0 : t.elements.domReference, ...n, ...l, ...C(), _.current, N.current, eu.current, el.current, null == Y ? void 0 : Y.beforeOutsideRef.current, null == Y ? void 0 : Y.afterOutsideRef.current, W.current.includes("reference") || T ? x : null].filter(e => null != e),
                    c = m || T ? Q(i, !P, P) : Q(i);
                return () => {
                    c()
                }
            }, [r, x, k, m, W, Y, T, q, P, F, M, C]), (0, u.OS)(() => {
                if (r || !(0, i.sb)(G)) return;
                let e = (0, u.YE)(G), t = (0, u.RS)(e);
                queueMicrotask(() => {
                    let e = eo(G), n = j.current, r = ("number" == typeof n ? e[n] : n.current) || G,
                        o = (0, u.gR)(G, t);
                    A || o || !h || D(r, {preventScroll: r === G})
                })
            }, [r, h, G, A, eo, j]), (0, u.OS)(() => {
                var e;
                if (r || !G) return;
                let t = (0, u.YE)(G);

                function n(e) {
                    let {reason: t, event: n, nested: r} = e;
                    if (["hover", "safe-polygon"].includes(t) && "mouseleave" === n.type && (J.current = !0), "outside-press" === t) if (r) J.current = !1; else if ((0, u.YF)(n) || (0, u.Pg)(n)) J.current = !1; else {
                        let e = !1;
                        document.createElement("div").focus({
                            get preventScroll() {
                                return e = !0, !1
                            }
                        }), e ? J.current = !1 : J.current = !0
                    }
                }

                e = (0, u.RS)(t), ee = ee.filter(e => e.isConnected), e && "body" !== (0, i.mq)(e) && (ee.push(e), ee.length > 20 && (ee = ee.slice(-20))), R.on("openchange", n);
                let o = t.createElement("span");
                return o.setAttribute("tabindex", "-1"), o.setAttribute("aria-hidden", "true"), Object.assign(o.style, V), $ && x && x.insertAdjacentElement("afterend", o), () => {
                    R.off("openchange", n);
                    let e = (0, u.RS)(t), r = (0, u.gR)(k, e) || F && (0, u.CM)(F.nodesRef.current, M()).some(t => {
                        var n;
                        return (0, u.gR)(null == (n = t.context) ? void 0 : n.elements.floating, e)
                    }), l = function () {
                        if ("boolean" == typeof I.current) {
                            let e = x || et();
                            return e && e.isConnected ? e : o
                        }
                        return I.current.current || o
                    }();
                    queueMicrotask(() => {
                        let n = function (e) {
                            let t = (0, u.kQ)();
                            return (0, c.AO)(e, t) ? e : (0, c.Kr)(e, t)[0] || e
                        }(l);
                        I.current && !J.current && (0, i.sb)(n) && (n === e || e === t.body || r) && n.focus({preventScroll: !0}), o.remove()
                    })
                }
            }, [r, k, G, I, w, R, F, $, x, M]), o.useEffect(() => {
                queueMicrotask(() => {
                    J.current = !1
                })
            }, [r]), (0, u.OS)(() => {
                if (!r && Y) return Y.setFocusManagerState({
                    modal: m,
                    closeOnFocusOut: g,
                    open: h,
                    onOpenChange: y,
                    domReference: x
                }), () => {
                    Y.setFocusManagerState(null)
                }
            }, [r, Y, m, h, y, g, x]), (0, u.OS)(() => {
                !r && G && en(G, W)
            }, [r, G, W]);
            let ea = !r && q && (!m || !T) && ($ || m);
            return (0, l.jsxs)(l.Fragment, {
                children: [ea && (0, l.jsx)(H, {
                    "data-type": "inside",
                    ref: ei,
                    onFocus: e => {
                        if (m) {
                            let e = eo();
                            D("reference" === s[0] ? e[0] : e[e.length - 1])
                        } else if (null != Y && Y.preserveTabOrder && Y.portalNode) if (J.current = !1, (0, u.Qp)(e, Y.portalNode)) {
                            let e = (0, u.vF)(x);
                            null == e || e.focus()
                        } else {
                            var t;
                            null == (t = Y.beforeOutsideRef.current) || t.focus()
                        }
                    }
                }), !T && es("start"), n, es("end"), ea && (0, l.jsx)(H, {
                    "data-type": "inside",
                    ref: ec,
                    onFocus: e => {
                        if (m) D(eo()[0]); else if (null != Y && Y.preserveTabOrder && Y.portalNode) if (g && (J.current = !0), (0, u.Qp)(e, Y.portalNode)) {
                            let e = (0, u.XJ)(x);
                            null == e || e.focus()
                        } else {
                            var t;
                            null == (t = Y.afterOutsideRef.current) || t.focus()
                        }
                    }
                })]
            })
        }

        let eu = 0, el = "--floating-ui-scrollbar-width", ei = () => {
        }, ec = o.forwardRef(function (e, t) {
            let {lockScroll: n = !1, ...r} = e;
            return (0, u.OS)(() => {
                if (n) return 1 == ++eu && (ei = function () {
                    let e = (0, u.uo)(),
                        t = /iP(hone|ad|od)|iOS/.test(e) || "MacIntel" === e && navigator.maxTouchPoints > 1,
                        n = document.body.style,
                        r = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft ? "paddingLeft" : "paddingRight",
                        o = window.innerWidth - document.documentElement.clientWidth,
                        l = n.left ? parseFloat(n.left) : window.scrollX,
                        i = n.top ? parseFloat(n.top) : window.scrollY;
                    if (n.overflow = "hidden", n.setProperty(el, o + "px"), o && (n[r] = o + "px"), t) {
                        var c, s;
                        let e = (null == (c = window.visualViewport) ? void 0 : c.offsetLeft) || 0;
                        Object.assign(n, {
                            position: "fixed",
                            top: -(i - Math.floor((null == (s = window.visualViewport) ? void 0 : s.offsetTop) || 0)) + "px",
                            left: -(l - Math.floor(e)) + "px",
                            right: "0"
                        })
                    }
                    return () => {
                        Object.assign(n, {
                            overflow: "",
                            [r]: ""
                        }), n.removeProperty(el), t && (Object.assign(n, {
                            position: "",
                            top: "",
                            left: "",
                            right: ""
                        }), window.scrollTo(l, i))
                    }
                }()), () => {
                    0 == --eu && ei()
                }
            }, [n]), (0, l.jsx)("div", {
                ref: t, ...r,
                style: {position: "fixed", overflow: "auto", top: 0, right: 0, bottom: 0, left: 0, ...r.style}
            })
        });

        function es(e) {
            return (0, i.sb)(e.target) && "BUTTON" === e.target.tagName
        }

        function ea(e, t) {
            void 0 === t && (t = {});
            let {open: n, onOpenChange: r, dataRef: l, elements: {domReference: c}} = e, {
                enabled: s = !0,
                event: a = "click",
                toggle: f = !0,
                ignoreMouse: d = !1,
                keyboardHandlers: v = !0,
                stickIfOpen: m = !0
            } = t, p = o.useRef(), g = o.useRef(!1), E = o.useMemo(() => ({
                onPointerDown(e) {
                    p.current = e.pointerType
                }, onMouseDown(e) {
                    let t = p.current;
                    0 === e.button && "click" !== a && ((0, u.Go)(t, !0) && d || (n && f && (!l.current.openEvent || !m || "mousedown" === l.current.openEvent.type) ? r(!1, e.nativeEvent, "click") : (e.preventDefault(), r(!0, e.nativeEvent, "click"))))
                }, onClick(e) {
                    let t = p.current;
                    if ("mousedown" === a && p.current) {
                        p.current = void 0;
                        return
                    }
                    (0, u.Go)(t, !0) && d || (n && f && (!l.current.openEvent || !m || "click" === l.current.openEvent.type) ? r(!1, e.nativeEvent, "click") : r(!0, e.nativeEvent, "click"))
                }, onKeyDown(e) {
                    p.current = void 0, !(e.defaultPrevented || !v || es(e)) && (" " !== e.key || (0, u.$u)(c) || (e.preventDefault(), g.current = !0), (0, i.sb)(e.target) && "A" === e.target.tagName || "Enter" !== e.key || (n && f ? r(!1, e.nativeEvent, "click") : r(!0, e.nativeEvent, "click")))
                }, onKeyUp(e) {
                    !(e.defaultPrevented || !v || es(e) || (0, u.$u)(c)) && " " === e.key && g.current && (g.current = !1, n && f ? r(!1, e.nativeEvent, "click") : r(!0, e.nativeEvent, "click"))
                }
            }), [l, c, a, d, v, r, n, m, f]);
            return o.useMemo(() => s ? {reference: E} : {}, [s, E])
        }

        let ef = {pointerdown: "onPointerDown", mousedown: "onMouseDown", click: "onClick"},
            ed = {pointerdown: "onPointerDownCapture", mousedown: "onMouseDownCapture", click: "onClickCapture"},
            ev = e => {
                var t, n;
                return {
                    escapeKey: "boolean" == typeof e ? e : null != (t = null == e ? void 0 : e.escapeKey) && t,
                    outsidePress: "boolean" == typeof e ? e : null == (n = null == e ? void 0 : e.outsidePress) || n
                }
            };

        function em(e, t) {
            void 0 === t && (t = {});
            let {open: n, onOpenChange: r, elements: l, dataRef: c} = e, {
                    enabled: s = !0,
                    escapeKey: a = !0,
                    outsidePress: f = !0,
                    outsidePressEvent: d = "pointerdown",
                    referencePress: v = !1,
                    referencePressEvent: m = "pointerdown",
                    ancestorScroll: p = !1,
                    bubbles: g,
                    capture: E
                } = t, b = S(), h = (0, u.Jt)("function" == typeof f ? f : () => !1), y = "function" == typeof f ? h : f,
                R = o.useRef(!1), {escapeKey: w, outsidePress: x} = ev(g), {escapeKey: k, outsidePress: M} = ev(E),
                A = o.useRef(!1), T = o.useRef(-1), O = (0, u.Jt)(e => {
                    var t;
                    if (!n || !s || !a || "Escape" !== e.key || A.current) return;
                    let o = null == (t = c.current.floatingContext) ? void 0 : t.nodeId,
                        l = b ? (0, u.CM)(b.nodesRef.current, o) : [];
                    if (!w && (e.stopPropagation(), l.length > 0)) {
                        let e = !0;
                        if (l.forEach(t => {
                            var n;
                            if (null != (n = t.context) && n.open && !t.context.dataRef.current.__escapeKeyBubbles) {
                                e = !1;
                                return
                            }
                        }), !e) return
                    }
                    r(!1, (0, u.O_)(e) ? e.nativeEvent : e, "escape-key")
                }), q = (0, u.Jt)(e => {
                    var t;
                    let n = () => {
                        var t;
                        O(e), null == (t = (0, u.EW)(e)) || t.removeEventListener("keydown", n)
                    };
                    null == (t = (0, u.EW)(e)) || t.addEventListener("keydown", n)
                }), P = (0, u.Jt)(e => {
                    var t;
                    let n = c.current.insideReactTree;
                    c.current.insideReactTree = !1;
                    let o = R.current;
                    if (R.current = !1, "click" === d && o || n || "function" == typeof y && !y(e)) return;
                    let s = (0, u.EW)(e), a = "[" + L("inert") + "]", f = (0, u.YE)(l.floating).querySelectorAll(a),
                        v = (0, i.vq)(s) ? s : null;
                    for (; v && !(0, i.eu)(v);) {
                        let e = (0, i.$4)(v);
                        if ((0, i.eu)(e) || !(0, i.vq)(e)) break;
                        v = e
                    }
                    if (f.length && (0, i.vq)(s) && !(0, u.tZ)(s) && !(0, u.gR)(s, l.floating) && Array.from(f).every(e => !(0, u.gR)(v, e))) return;
                    if ((0, i.sb)(s) && D) {
                        let t = (0, i.eu)(s), n = (0, i.L9)(s), r = /auto|scroll/, o = t || r.test(n.overflowX),
                            u = t || r.test(n.overflowY), l = o && s.clientWidth > 0 && s.scrollWidth > s.clientWidth,
                            c = u && s.clientHeight > 0 && s.scrollHeight > s.clientHeight, a = "rtl" === n.direction,
                            f = c && (a ? e.offsetX <= s.offsetWidth - s.clientWidth : e.offsetX > s.clientWidth),
                            d = l && e.offsetY > s.clientHeight;
                        if (f || d) return
                    }
                    let m = null == (t = c.current.floatingContext) ? void 0 : t.nodeId,
                        p = b && (0, u.CM)(b.nodesRef.current, m).some(t => {
                            var n;
                            return (0, u.F2)(e, null == (n = t.context) ? void 0 : n.elements.floating)
                        });
                    if ((0, u.F2)(e, l.floating) || (0, u.F2)(e, l.domReference) || p) return;
                    let g = b ? (0, u.CM)(b.nodesRef.current, m) : [];
                    if (g.length > 0) {
                        let e = !0;
                        if (g.forEach(t => {
                            var n;
                            if (null != (n = t.context) && n.open && !t.context.dataRef.current.__outsidePressBubbles) {
                                e = !1;
                                return
                            }
                        }), !e) return
                    }
                    r(!1, e, "outside-press")
                }), W = (0, u.Jt)(e => {
                    var t;
                    let n = () => {
                        var t;
                        P(e), null == (t = (0, u.EW)(e)) || t.removeEventListener(d, n)
                    };
                    null == (t = (0, u.EW)(e)) || t.addEventListener(d, n)
                });
            o.useEffect(() => {
                if (!n || !s) return;
                c.current.__escapeKeyBubbles = w, c.current.__outsidePressBubbles = x;
                let e = -1;

                function t(e) {
                    r(!1, e, "ancestor-scroll")
                }

                function o() {
                    window.clearTimeout(e), A.current = !0
                }

                function f() {
                    e = window.setTimeout(() => {
                        A.current = !1
                    }, 5 * !!(0, i.Tc)())
                }

                let v = (0, u.YE)(l.floating);
                a && (v.addEventListener("keydown", k ? q : O, k), v.addEventListener("compositionstart", o), v.addEventListener("compositionend", f)), y && v.addEventListener(d, M ? W : P, M);
                let m = [];
                return p && ((0, i.vq)(l.domReference) && (m = (0, i.v9)(l.domReference)), (0, i.vq)(l.floating) && (m = m.concat((0, i.v9)(l.floating))), !(0, i.vq)(l.reference) && l.reference && l.reference.contextElement && (m = m.concat((0, i.v9)(l.reference.contextElement)))), (m = m.filter(e => {
                    var t;
                    return e !== (null == (t = v.defaultView) ? void 0 : t.visualViewport)
                })).forEach(e => {
                    e.addEventListener("scroll", t, {passive: !0})
                }), () => {
                    a && (v.removeEventListener("keydown", k ? q : O, k), v.removeEventListener("compositionstart", o), v.removeEventListener("compositionend", f)), y && v.removeEventListener(d, M ? W : P, M), m.forEach(e => {
                        e.removeEventListener("scroll", t)
                    }), window.clearTimeout(e)
                }
            }, [c, l, a, y, d, n, r, p, s, w, x, O, k, q, P, M, W]), o.useEffect(() => {
                c.current.insideReactTree = !1
            }, [c, y, d]);
            let j = o.useMemo(() => ({
                onKeyDown: O, ...v && {
                    [ef[m]]: e => {
                        r(!1, e.nativeEvent, "reference-press")
                    }, ..."click" !== m && {
                        onClick(e) {
                            r(!1, e.nativeEvent, "reference-press")
                        }
                    }
                }
            }), [O, r, v, m]), D = o.useMemo(() => ({
                onKeyDown: O, onMouseDown() {
                    R.current = !0
                }, onMouseUp() {
                    R.current = !0
                }, [ed[d]]: () => {
                    c.current.insideReactTree = !0
                }, onBlurCapture() {
                    b || (C(T), c.current.insideReactTree = !0, T.current = window.setTimeout(() => {
                        c.current.insideReactTree = !1
                    }))
                }
            }), [O, d, c, b]);
            return o.useMemo(() => s ? {reference: j, floating: D} : {}, [s, j, D])
        }

        function ep(e) {
            void 0 === e && (e = {});
            let {nodeId: t} = e, n = function (e) {
                    let {open: t = !1, onOpenChange: n, elements: r} = e, l = w(),
                        i = o.useRef({}), [c] = o.useState(() => (function () {
                            let e = new Map;
                            return {
                                emit(t, n) {
                                    var r;
                                    null == (r = e.get(t)) || r.forEach(e => e(n))
                                }, on(t, n) {
                                    e.has(t) || e.set(t, new Set), e.get(t).add(n)
                                }, off(t, n) {
                                    var r;
                                    null == (r = e.get(t)) || r.delete(n)
                                }
                            }
                        })()), s = null != M(), [a, f] = o.useState(r.reference), d = (0, u.Jt)((e, t, r) => {
                            i.current.openEvent = e ? t : void 0, c.emit("openchange", {
                                open: e,
                                event: t,
                                reason: r,
                                nested: s
                            }), null == n || n(e, t, r)
                        }), v = o.useMemo(() => ({setPositionReference: f}), []), m = o.useMemo(() => ({
                            reference: a || r.reference || null,
                            floating: r.floating || null,
                            domReference: r.reference
                        }), [a, r.reference, r.floating]);
                    return o.useMemo(() => ({
                        dataRef: i,
                        open: t,
                        onOpenChange: d,
                        elements: m,
                        events: c,
                        floatingId: l,
                        refs: v
                    }), [t, d, m, c, l, v])
                }({...e, elements: {reference: null, floating: null, ...e.elements}}), r = e.rootContext || n,
                l = r.elements, [c, s] = o.useState(null), [f, d] = o.useState(null),
                v = (null == l ? void 0 : l.domReference) || c, m = o.useRef(null), p = S();
            (0, u.OS)(() => {
                v && (m.current = v)
            }, [v]);
            let g = (0, a.we)({...e, elements: {...l, ...f && {reference: f}}}), E = o.useCallback(e => {
                    let t = (0, i.vq)(e) ? {
                        getBoundingClientRect: () => e.getBoundingClientRect(),
                        getClientRects: () => e.getClientRects(),
                        contextElement: e
                    } : e;
                    d(t), g.refs.setReference(t)
                }, [g.refs]), b = o.useCallback(e => {
                    ((0, i.vq)(e) || null === e) && (m.current = e, s(e)), ((0, i.vq)(g.refs.reference.current) || null === g.refs.reference.current || null !== e && !(0, i.vq)(e)) && g.refs.setReference(e)
                }, [g.refs]), h = o.useMemo(() => ({
                    ...g.refs,
                    setReference: b,
                    setPositionReference: E,
                    domReference: m
                }), [g.refs, b, E]), y = o.useMemo(() => ({...g.elements, domReference: v}), [g.elements, v]),
                R = o.useMemo(() => ({...g, ...r, refs: h, elements: y, nodeId: t}), [g, h, y, t, r]);
            return (0, u.OS)(() => {
                r.dataRef.current.floatingContext = R;
                let e = null == p ? void 0 : p.nodesRef.current.find(e => e.id === t);
                e && (e.context = R)
            }), o.useMemo(() => ({...g, context: R, refs: h, elements: y}), [g, h, y, R])
        }

        function eg() {
            return (0, u.cX)() && (0, u.nr)()
        }

        function eE(e, t) {
            void 0 === t && (t = {});
            let {open: n, onOpenChange: r, events: l, dataRef: c, elements: s} = e, {
                enabled: a = !0,
                visibleOnly: f = !0
            } = t, d = o.useRef(!1), v = o.useRef(-1), m = o.useRef(!0);
            o.useEffect(() => {
                if (!a) return;
                let e = (0, i.zk)(s.domReference);

                function t() {
                    !n && (0, i.sb)(s.domReference) && s.domReference === (0, u.RS)((0, u.YE)(s.domReference)) && (d.current = !0)
                }

                function r() {
                    m.current = !0
                }

                function o() {
                    m.current = !1
                }

                return e.addEventListener("blur", t), eg() && (e.addEventListener("keydown", r, !0), e.addEventListener("pointerdown", o, !0)), () => {
                    e.removeEventListener("blur", t), eg() && (e.removeEventListener("keydown", r, !0), e.removeEventListener("pointerdown", o, !0))
                }
            }, [s.domReference, n, a]), o.useEffect(() => {
                if (a) return l.on("openchange", e), () => {
                    l.off("openchange", e)
                };

                function e(e) {
                    let {reason: t} = e;
                    ("reference-press" === t || "escape-key" === t) && (d.current = !0)
                }
            }, [l, a]), o.useEffect(() => () => {
                C(v)
            }, []);
            let p = o.useMemo(() => ({
                onMouseLeave() {
                    d.current = !1
                }, onFocus(e) {
                    if (d.current) return;
                    let t = (0, u.EW)(e.nativeEvent);
                    if (f && (0, i.vq)(t)) {
                        if (eg() && !e.relatedTarget) {
                            if (!m.current && !(0, u.$u)(t)) return
                        } else if (!(0, u.em)(t)) return
                    }
                    r(!0, e.nativeEvent, "focus")
                }, onBlur(e) {
                    d.current = !1;
                    let t = e.relatedTarget, n = e.nativeEvent,
                        o = (0, i.vq)(t) && t.hasAttribute(L("focus-guard")) && "outside" === t.getAttribute("data-type");
                    v.current = window.setTimeout(() => {
                        var e;
                        let l = (0, u.RS)(s.domReference ? s.domReference.ownerDocument : document);
                        (t || l !== s.domReference) && ((0, u.gR)(null == (e = c.current.floatingContext) ? void 0 : e.refs.floating.current, l) || (0, u.gR)(s.domReference, l) || o || r(!1, n, "focus"))
                    })
                }
            }), [c, s.domReference, r, f]);
            return o.useMemo(() => a ? {reference: p} : {}, [a, p])
        }

        function eb(e, t, n) {
            let r = new Map, o = "item" === n, u = e;
            if (o && e) {
                let {[d]: t, [v]: n, ...r} = e;
                u = r
            }
            return {
                ..."floating" === n && {tabIndex: -1, "data-floating-ui-focusable": ""}, ...u, ...t.map(t => {
                    let r = t ? t[n] : null;
                    return "function" == typeof r ? e ? r(e) : null : r
                }).concat(e).reduce((e, t) => (t && Object.entries(t).forEach(t => {
                    let [n, u] = t;
                    if (!(o && [d, v].includes(n))) if (0 === n.indexOf("on")) {
                        if (r.has(n) || r.set(n, []), "function" == typeof u) {
                            var l;
                            null == (l = r.get(n)) || l.push(u), e[n] = function () {
                                for (var e, t = arguments.length, o = Array(t), u = 0; u < t; u++) o[u] = arguments[u];
                                return null == (e = r.get(n)) ? void 0 : e.map(e => e(...o)).find(e => void 0 !== e)
                            }
                        }
                    } else e[n] = u
                }), e), {})
            }
        }

        function eh(e) {
            void 0 === e && (e = []);
            let t = e.map(e => null == e ? void 0 : e.reference), n = e.map(e => null == e ? void 0 : e.floating),
                r = e.map(e => null == e ? void 0 : e.item), u = o.useCallback(t => eb(t, e, "reference"), t),
                l = o.useCallback(t => eb(t, e, "floating"), n), i = o.useCallback(t => eb(t, e, "item"), r);
            return o.useMemo(() => ({getReferenceProps: u, getFloatingProps: l, getItemProps: i}), [u, l, i])
        }

        function ey(e, t, n) {
            switch (e) {
                case"vertical":
                    return t;
                case"horizontal":
                    return n;
                default:
                    return t || n
            }
        }

        let eR = new Map([["select", "listbox"], ["combobox", "listbox"], ["label", !1]]);

        function ew(e, t) {
            var n, r;
            void 0 === t && (t = {});
            let {open: l, elements: i, floatingId: c} = e, {enabled: s = !0, role: a = "dialog"} = t, f = w(),
                d = (null == (n = i.domReference) ? void 0 : n.id) || f, v = o.useMemo(() => {
                    var e;
                    return (null == (e = (0, u.nd)(i.floating)) ? void 0 : e.id) || c
                }, [i.floating, c]), m = null != (r = eR.get(a)) ? r : a, p = null != M(),
                g = o.useMemo(() => "tooltip" === m || "label" === a ? {["aria-" + ("label" === a ? "labelledby" : "describedby")]: l ? v : void 0} : {
                    "aria-expanded": l ? "true" : "false",
                    "aria-haspopup": "alertdialog" === m ? "dialog" : m,
                    "aria-controls": l ? v : void 0, ..."listbox" === m && {role: "combobox"}, ..."menu" === m && {id: d}, ..."menu" === m && p && {role: "menuitem"}, ..."select" === a && {"aria-autocomplete": "none"}, ..."combobox" === a && {"aria-autocomplete": "list"}
                }, [m, v, p, l, d, a]), E = o.useMemo(() => {
                    let e = {id: v, ...m && {role: m}};
                    return "tooltip" === m || "label" === a ? e : {...e, ..."menu" === m && {"aria-labelledby": d}}
                }, [m, v, d, a]), b = o.useCallback(e => {
                    let {active: t, selected: n} = e, r = {role: "option", ...t && {id: v + "-fui-option"}};
                    switch (a) {
                        case"select":
                            return {...r, "aria-selected": t && n};
                        case"combobox":
                            return {...r, "aria-selected": n}
                    }
                    return {}
                }, [v, a]);
            return o.useMemo(() => s ? {reference: g, floating: E, item: b} : {}, [s, g, E, b])
        }

        let ex = e => e.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (e, t) => (t ? "-" : "") + e.toLowerCase());

        function ek(e, t) {
            return "function" == typeof e ? e(t) : e
        }

        function eM(e, t) {
            void 0 === t && (t = {});
            let {initial: n = {opacity: 0}, open: r, close: l, common: i, duration: c = 250} = t, a = e.placement,
                f = a.split("-")[0], d = o.useMemo(() => ({side: f, placement: a}), [f, a]), v = "number" == typeof c,
                m = (v ? c : c.open) || 0,
                p = (v ? c : c.close) || 0, [g, E] = o.useState(() => ({...ek(i, d), ...ek(n, d)})), {
                    isMounted: b,
                    status: h
                } = function (e, t) {
                    void 0 === t && (t = {});
                    let {open: n, elements: {floating: r}} = e, {duration: l = 250} = t,
                        i = ("number" == typeof l ? l : l.close) || 0, [c, a] = o.useState("unmounted"),
                        f = function (e, t) {
                            let [n, r] = o.useState(e);
                            return e && !n && r(!0), o.useEffect(() => {
                                if (!e && n) {
                                    let e = setTimeout(() => r(!1), t);
                                    return () => clearTimeout(e)
                                }
                            }, [e, n, t]), n
                        }(n, i);
                    return f || "close" !== c || a("unmounted"), (0, u.OS)(() => {
                        if (r) {
                            if (n) {
                                a("initial");
                                let e = requestAnimationFrame(() => {
                                    s.flushSync(() => {
                                        a("open")
                                    })
                                });
                                return () => {
                                    cancelAnimationFrame(e)
                                }
                            }
                            a("close")
                        }
                    }, [n, r]), {isMounted: f, status: c}
                }(e, {duration: c}), y = (0, u.SE)(n), R = (0, u.SE)(r), w = (0, u.SE)(l), x = (0, u.SE)(i);
            return (0, u.OS)(() => {
                let e = ek(y.current, d), t = ek(w.current, d), n = ek(x.current, d),
                    r = ek(R.current, d) || Object.keys(e).reduce((e, t) => (e[t] = "", e), {});
                if ("initial" === h && E(t => ({transitionProperty: t.transitionProperty, ...n, ...e})), "open" === h && E({
                    transitionProperty: Object.keys(r).map(ex).join(","),
                    transitionDuration: m + "ms", ...n, ...r
                }), "close" === h) {
                    let r = t || e;
                    E({transitionProperty: Object.keys(r).map(ex).join(","), transitionDuration: p + "ms", ...n, ...r})
                }
            }, [p, w, y, R, x, m, h, d]), {isMounted: b, styles: g}
        }

        function eS(e, t) {
            let [n, r] = e, o = !1, u = t.length;
            for (let e = 0, l = u - 1; e < u; l = e++) {
                let [u, i] = t[e] || [0, 0], [c, s] = t[l] || [0, 0];
                i >= r != s >= r && n <= (c - u) * (r - i) / (s - i) + u && (o = !o)
            }
            return o
        }

        function eL(e) {
            void 0 === e && (e = {});
            let {buffer: t = .5, blockPointerEvents: n = !1, requireIntent: r = !0} = e, o = {current: -1}, u = !1,
                l = null, c = null, s = performance.now(), a = e => {
                    let {x: n, y: a, placement: f, elements: d, onClose: v, nodeId: m, tree: p} = e;
                    return function (e) {
                        function g() {
                            C(o), v()
                        }

                        if (C(o), !d.domReference || !d.floating || null == f || null == n || null == a) return;
                        let {clientX: E, clientY: b} = e, h = [E, b],
                            y = "composedPath" in e ? e.composedPath()[0] : e.target, R = "mouseleave" === e.type,
                            w = I(d.floating, y), x = I(d.domReference, y), k = d.domReference.getBoundingClientRect(),
                            M = d.floating.getBoundingClientRect(), S = f.split("-")[0], L = n > M.right - M.width / 2,
                            A = a > M.bottom - M.height / 2,
                            T = h[0] >= k.x && h[0] <= k.x + k.width && h[1] >= k.y && h[1] <= k.y + k.height,
                            O = M.width > k.width, q = M.height > k.height, P = (O ? k : M).left, W = (O ? k : M).right,
                            j = (q ? k : M).top, D = (q ? k : M).bottom;
                        if (w && (u = !0, !R)) return;
                        if (x && (u = !1), x && !R) {
                            u = !0;
                            return
                        }
                        if (R && (0, i.vq)(e.relatedTarget) && I(d.floating, e.relatedTarget) || p && function (e, t) {
                            let n = e.filter(e => {
                                var n;
                                return e.parentId === t && (null == (n = e.context) ? void 0 : n.open)
                            }), r = n;
                            for (; r.length;) r = e.filter(e => {
                                var t;
                                return null == (t = r) ? void 0 : t.some(t => {
                                    var n;
                                    return e.parentId === t.id && (null == (n = e.context) ? void 0 : n.open)
                                })
                            }), n = n.concat(r);
                            return n
                        }(p.nodesRef.current, m).length) return;
                        if ("top" === S && a >= k.bottom - 1 || "bottom" === S && a <= k.top + 1 || "left" === S && n >= k.right - 1 || "right" === S && n <= k.left + 1) return g();
                        let F = [];
                        switch (S) {
                            case"top":
                                F = [[P, k.top + 1], [P, M.bottom - 1], [W, M.bottom - 1], [W, k.top + 1]];
                                break;
                            case"bottom":
                                F = [[P, M.top + 1], [P, k.bottom - 1], [W, k.bottom - 1], [W, M.top + 1]];
                                break;
                            case"left":
                                F = [[M.right - 1, D], [M.right - 1, j], [k.left + 1, j], [k.left + 1, D]];
                                break;
                            case"right":
                                F = [[k.right - 1, D], [k.right - 1, j], [M.left + 1, j], [M.left + 1, D]]
                        }
                        if (!eS([E, b], F)) {
                            if (u && !T) return g();
                            if (!R && r) {
                                let t = function (e, t) {
                                    let n = performance.now(), r = n - s;
                                    if (null === l || null === c || 0 === r) return l = e, c = t, s = n, null;
                                    let o = e - l, u = t - c, i = Math.sqrt(o * o + u * u);
                                    return l = e, c = t, s = n, i / r
                                }(e.clientX, e.clientY);
                                if (null !== t && t < .1) return g()
                            }
                            eS([E, b], function (e) {
                                let [n, r] = e;
                                switch (S) {
                                    case"top": {
                                        let e = [[M.left, L || O ? M.bottom - t : M.top], [M.right, L ? O ? M.bottom - t : M.top : M.bottom - t]];
                                        return [[O ? n + t / 2 : L ? n + 4 * t : n - 4 * t, r + t + 1], [O ? n - t / 2 : L ? n + 4 * t : n - 4 * t, r + t + 1], ...e]
                                    }
                                    case"bottom": {
                                        let e = [[M.left, L || O ? M.top + t : M.bottom], [M.right, L ? O ? M.top + t : M.bottom : M.top + t]];
                                        return [[O ? n + t / 2 : L ? n + 4 * t : n - 4 * t, r - t], [O ? n - t / 2 : L ? n + 4 * t : n - 4 * t, r - t], ...e]
                                    }
                                    case"left":
                                        return [[A || q ? M.right - t : M.left, M.top], [A ? q ? M.right - t : M.left : M.right - t, M.bottom], [n + t + 1, q ? r + t / 2 : A ? r + 4 * t : r - 4 * t], [n + t + 1, q ? r - t / 2 : A ? r + 4 * t : r - 4 * t]];
                                    case"right": {
                                        let e = [[A || q ? M.left + t : M.right, M.top], [A ? q ? M.left + t : M.right : M.left + t, M.bottom]];
                                        return [[n - t, q ? r + t / 2 : A ? r + 4 * t : r - 4 * t], [n - t, q ? r - t / 2 : A ? r + 4 * t : r - 4 * t], ...e]
                                    }
                                }
                            }([n, a])) ? !u && r && (o.current = window.setTimeout(g, 40)) : g()
                        }
                    }
                };
            return a.__options = {blockPointerEvents: n}, a
        }
    }
}]);