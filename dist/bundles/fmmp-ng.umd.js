(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@fmmp/core')) :
    typeof define === 'function' && define.amd ? define('@fmmp/ng', ['exports', '@angular/core', 'rxjs', '@fmmp/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.fmmp = global.fmmp || {}, global.fmmp.ng = {}), global.ng.core, global.rxjs, global['@fmmp/core']));
}(this, (function (exports, core, rxjs, core$1) { 'use strict';

    // =================================================================================================================================
    //						F M M N G M I N I M A P
    // =================================================================================================================================
    var FmmNgMinimap = /** @class */ (function () {
        // =============================================================================================================================
        function FmmNgMinimap(hostRef) {
            this.verbosity = 0;
            this.update = new core.EventEmitter();
            var form = hostRef.nativeElement;
            while (form && form.tagName !== 'FORM')
                form = form.parentElement;
            this.form = form;
        }
        // =============================================================================================================================
        FmmNgMinimap.prototype.ngOnChanges = function () {
            if (!this.minimap)
                return;
            if (this.key !== this.previousKey) {
                this.minimap.destructor();
                this.ngOnInit();
            }
            else {
                this.store.namelessControls = this.namelessControls;
                this.minimap.compose(this.customWidgetIds);
            }
        };
        // =============================================================================================================================
        FmmNgMinimap.prototype.ngOnDestroy = function () {
            if (!this.minimap)
                return;
            this.minimap.detach();
            this.store = undefined;
        };
        // =============================================================================================================================
        FmmNgMinimap.prototype.ngOnInit = function () {
            var _this = this;
            var p = {
                aggregateLabels: this.aggregateLabels,
                anchor: this.anchor,
                debounceMsec: this.debounceMsec,
                dynamicLabels: this.dynamicLabels,
                form: this.form,
                framework: this.framework,
                onUpdate: function (snapshot) { return _this.update.next(snapshot); },
                page: this.page,
                store: this.store = new Store(this.formGroup),
                title: this.title,
                usePanelDetail: this.usePanelDetail !== undefined,
                useWidthToScale: this.useWidthToScale !== undefined,
                verbosity: this.verbosity,
                widgetFactories: this.widgetFactories
            };
            var panel = this.panel ? G.PANELMAP.get(this.panel) : undefined;
            this.minimap = panel === null || panel === void 0 ? void 0 : panel.createMinimap(p);
            this.previousKey = this.key;
            this.ngOnChanges();
        };
        // =============================================================================================================================
        FmmNgMinimap.prototype.takeSnapshot = function () {
            var _a;
            return (_a = this.minimap) === null || _a === void 0 ? void 0 : _a.takeSnapshot();
        };
        return FmmNgMinimap;
    }());
    FmmNgMinimap.decorators = [
        { type: core.Component, args: [{ selector: 'fmm-ng-minimap', template: '' },] }
    ];
    FmmNgMinimap.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    FmmNgMinimap.propDecorators = {
        aggregateLabels: [{ type: core.Input }],
        anchor: [{ type: core.Input }],
        debounceMsec: [{ type: core.Input }],
        dynamicLabels: [{ type: core.Input }],
        formGroup: [{ type: core.Input }],
        framework: [{ type: core.Input }],
        page: [{ type: core.Input }],
        panel: [{ type: core.Input }],
        title: [{ type: core.Input }],
        usePanelDetail: [{ type: core.Input }],
        useWidthToScale: [{ type: core.Input }],
        verbosity: [{ type: core.Input }],
        widgetFactories: [{ type: core.Input }],
        customWidgetIds: [{ type: core.Input }],
        key: [{ type: core.Input }],
        namelessControls: [{ type: core.Input }],
        update: [{ type: core.Output }]
    };
    // =================================================================================================================================
    //						F M M N G P A N E L
    // =================================================================================================================================
    var FmmNgPanel = /** @class */ (function () {
        // =============================================================================================================================
        function FmmNgPanel(hostRef) {
            this.hostRef = hostRef;
            this.ef = new ElementFactory(hostRef);
        }
        // =============================================================================================================================
        FmmNgPanel.prototype.ngOnDestroy = function () {
            this.minimapPanel.destructor();
            G.PANELMAP.delete(this);
            this.minimapPanel = undefined;
        };
        // =============================================================================================================================
        FmmNgPanel.prototype.ngOnInit = function () {
            var host = this.hostRef.nativeElement;
            var vertical = this.vertical !== undefined;
            this.minimapPanel = core$1.Fmm.createPanel(this.ef, host, this.detailParent, vertical);
            G.PANELMAP.set(this, this.minimapPanel);
        };
        // =============================================================================================================================
        FmmNgPanel.prototype.destroyDetached = function () {
            var _a;
            return (_a = this.minimapPanel) === null || _a === void 0 ? void 0 : _a.destroyDetached();
        };
        return FmmNgPanel;
    }());
    FmmNgPanel.decorators = [
        { type: core.Component, args: [{ selector: 'fmm-ng-panel', template: '' },] }
    ];
    FmmNgPanel.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    FmmNgPanel.propDecorators = {
        detailParent: [{ type: core.Input }],
        vertical: [{ type: core.Input }]
    };
    // =================================================================================================================================
    //						F M M N G M O D U L E
    // =================================================================================================================================
    var FmmNgModule = /** @class */ (function () {
        function FmmNgModule() {
        }
        return FmmNgModule;
    }());
    FmmNgModule.decorators = [
        { type: core.NgModule, args: [{ declarations: [FmmNgMinimap, FmmNgPanel], exports: [FmmNgMinimap, FmmNgPanel] },] }
    ];
    // =================================================================================================================================
    // =================================================================================================================================
    // =================================================	P R I V A T E	============================================================
    // =================================================================================================================================
    // =================================================================================================================================
    // =================================================================================================================================
    //						E L E M E N T F A C T O R Y
    // =================================================================================================================================
    var ElementFactory = /** @class */ (function () {
        // =============================================================================================================================
        function ElementFactory(ref) {
            var ngContentAttribute; // set attribute on elements to use non-global CSS
            if (Element.prototype.getAttributeNames !== undefined) {
                for (var p = ref.nativeElement; p && !ngContentAttribute; p = p.parentElement) {
                    var names = p.getAttributeNames();
                    ngContentAttribute = names.find(function (a) { return a.startsWith('_ngcontent-'); });
                }
            }
            else {
                for (var p = ref.nativeElement; p && !ngContentAttribute; p = p.parentElement) {
                    var names = Array.prototype.map.call(p.attributes, function (a) { return a.name; });
                    ngContentAttribute = names.find(function (a) { return a.startsWith('_ngcontent-'); });
                }
            }
            if (!ngContentAttribute)
                throw new Error('FormMinimap: missing _ngcontent- attribute');
            this.ngContentAttribute = ngContentAttribute;
        }
        // =============================================================================================================================
        ElementFactory.prototype.createElement = function (tagName) {
            var e = document.createElement(tagName);
            e.setAttribute(this.ngContentAttribute, '');
            return e;
        };
        // =============================================================================================================================
        ElementFactory.prototype.createElementNS = function (namespaceURI, qualifiedName) {
            var e = document.createElementNS(namespaceURI, qualifiedName);
            e.setAttribute(this.ngContentAttribute, '');
            return e;
        };
        return ElementFactory;
    }());
    // =================================================================================================================================
    //						G
    // =================================================================================================================================
    var G = {
        PANELMAP: new WeakMap()
    };
    // =================================================================================================================================
    //						S T O R E I T E M
    // =================================================================================================================================
    var StoreItem = /** @class */ (function () {
        // =============================================================================================================================
        function StoreItem(e, listener, name, control) {
            this.name = name;
            this.control = control;
            this.se = e.tagName === 'SELECT' ? e : undefined;
            var subscription = new rxjs.Subscription();
            subscription.add(this.control.statusChanges.subscribe(listener));
            subscription.add(this.control.valueChanges.subscribe(listener));
            this.destructor = function () { return subscription.unsubscribe(); };
        }
        // =============================================================================================================================
        StoreItem.prototype.destructor = function () {
            // function body overwritten in constructor
        };
        // =============================================================================================================================
        StoreItem.prototype.getError = function (hasValue) {
            var errors = this.control.errors;
            var keys = errors ? Object.keys(errors) : [];
            if (hasValue && keys.length)
                keys = keys.filter(function (k) { return k !== 'required'; }); // IE11 SELECT bug
            return keys.length ? keys.join(',') : undefined;
        };
        // =============================================================================================================================
        StoreItem.prototype.getName = function () {
            return this.name;
        };
        // =============================================================================================================================
        StoreItem.prototype.getValue = function () {
            var value = this.control.value;
            if (!value)
                return undefined;
            if (!this.se)
                return value;
            if (!this.se.multiple)
                return [this.se.selectedIndex];
            var indexes = []; // FormControl for multiselect doesn't update when selected option is removed dynamically
            Array.from(this.se.options).forEach(function (o, i) { return o.selected && indexes.push(i); });
            return indexes;
        };
        // =============================================================================================================================
        StoreItem.prototype.isDisabled = function () {
            return this.control.disabled;
        };
        return StoreItem;
    }());
    // =================================================================================================================================
    //						S T O R E
    // =================================================================================================================================
    var Store = /** @class */ (function () {
        // =============================================================================================================================
        function Store(formGroup) {
            var _this = this;
            this.formGroup = formGroup;
            this.namelessControls = {};
            this.minimaps = new Set();
            this.listener = function () { return _this.minimaps.forEach(function (m) { return m.takeSnapshot(); }); };
        }
        // =============================================================================================================================
        Store.prototype.createStoreItem = function (e, _) {
            var name = e.getAttribute('name') || e.id;
            var control = name ? this.namelessControls[name] : undefined;
            if (control)
                return new StoreItem(e, this.listener, name, control);
            var inFormArray = false;
            var path;
            var fc = e;
            for (; fc && fc.tagName !== 'FORM'; fc = fc.parentElement) {
                path = fc.getAttribute('formcontrolname') || fc.dataset.formcontrolname;
                if (path)
                    break;
                inFormArray = fc.dataset.fmminformarray !== undefined;
                if (inFormArray)
                    break;
            }
            for (var p = fc === null || fc === void 0 ? void 0 : fc.parentElement; p && p.tagName !== 'FORM'; p = p.parentElement) {
                var pName = p.getAttribute('formarrayname');
                if (!pName) {
                    pName = p.getAttribute('formgroupname');
                    if (pName)
                        path = pName + '.' + path;
                }
                else if (!inFormArray) {
                    path = pName + '.' + path;
                }
                else {
                    inFormArray = false;
                    path = pName;
                }
            }
            var ac = this.formGroup.get(path);
            return ac ? new StoreItem(e, this.listener, path, ac) : undefined;
        };
        // =============================================================================================================================
        Store.prototype.notifyMinimap = function (minimap, on) {
            if (on)
                this.minimaps.add(minimap);
            else
                this.minimaps.delete(minimap);
        };
        return Store;
    }());

    /**
     * Generated bundle index. Do not edit.
     */

    exports.FmmNgMinimap = FmmNgMinimap;
    exports.FmmNgModule = FmmNgModule;
    exports.FmmNgPanel = FmmNgPanel;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fmmp-ng.umd.js.map
