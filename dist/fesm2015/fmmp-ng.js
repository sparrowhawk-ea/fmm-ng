import { EventEmitter, Component, ElementRef, Input, Output, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';
import { Fmm } from '@fmmp/core';

// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
class FmmNgMinimap {
    // =============================================================================================================================
    constructor(hostRef) {
        this.verbosity = 0;
        this.update = new EventEmitter();
        let form = hostRef.nativeElement;
        while (form && form.tagName !== 'FORM')
            form = form.parentElement;
        this.form = form;
    }
    // =============================================================================================================================
    ngOnChanges() {
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
    }
    // =============================================================================================================================
    ngOnDestroy() {
        if (!this.minimap)
            return;
        this.minimap.detach();
        this.store = undefined;
    }
    // =============================================================================================================================
    ngOnInit() {
        const p = {
            aggregateLabels: this.aggregateLabels,
            anchor: this.anchor,
            debounceMsec: this.debounceMsec,
            dynamicLabels: this.dynamicLabels,
            form: this.form,
            framework: this.framework,
            onUpdate: (snapshot) => this.update.next(snapshot),
            page: this.page,
            store: this.store = new Store(this.formGroup),
            title: this.title,
            usePanelDetail: this.usePanelDetail !== undefined,
            useWidthToScale: this.useWidthToScale !== undefined,
            verbosity: this.verbosity,
            widgetFactories: this.widgetFactories
        };
        const panel = this.panel ? G.PANELMAP.get(this.panel) : undefined;
        this.minimap = panel === null || panel === void 0 ? void 0 : panel.createMinimap(p);
        this.previousKey = this.key;
        this.ngOnChanges();
    }
    // =============================================================================================================================
    takeSnapshot() {
        var _a;
        return (_a = this.minimap) === null || _a === void 0 ? void 0 : _a.takeSnapshot();
    }
}
FmmNgMinimap.decorators = [
    { type: Component, args: [{ selector: 'fmm-ng-minimap', template: '' },] }
];
FmmNgMinimap.ctorParameters = () => [
    { type: ElementRef }
];
FmmNgMinimap.propDecorators = {
    aggregateLabels: [{ type: Input }],
    anchor: [{ type: Input }],
    customWidgetIds: [{ type: Input }],
    debounceMsec: [{ type: Input }],
    dynamicLabels: [{ type: Input }],
    formGroup: [{ type: Input }],
    framework: [{ type: Input }],
    key: [{ type: Input }],
    namelessControls: [{ type: Input }],
    page: [{ type: Input }],
    panel: [{ type: Input }],
    title: [{ type: Input }],
    usePanelDetail: [{ type: Input }],
    useWidthToScale: [{ type: Input }],
    verbosity: [{ type: Input }],
    widgetFactories: [{ type: Input }],
    update: [{ type: Output }]
};
// =================================================================================================================================
//						F M M N G P A N E L
// =================================================================================================================================
class FmmNgPanel {
    // =============================================================================================================================
    constructor(hostRef) {
        this.hostRef = hostRef;
        this.ef = new ElementFactory(hostRef);
    }
    // =============================================================================================================================
    ngOnDestroy() {
        this.minimapPanel.destructor();
        G.PANELMAP.delete(this);
        this.minimapPanel = undefined;
    }
    // =============================================================================================================================
    ngOnInit() {
        const host = this.hostRef.nativeElement;
        const vertical = this.vertical !== undefined;
        this.minimapPanel = Fmm.createPanel(this.ef, host, this.detailParent, vertical);
        G.PANELMAP.set(this, this.minimapPanel);
    }
    // =============================================================================================================================
    destroyDetached() {
        var _a;
        return (_a = this.minimapPanel) === null || _a === void 0 ? void 0 : _a.destroyDetached();
    }
}
FmmNgPanel.decorators = [
    { type: Component, args: [{ selector: 'fmm-ng-panel', template: '' },] }
];
FmmNgPanel.ctorParameters = () => [
    { type: ElementRef }
];
FmmNgPanel.propDecorators = {
    detailParent: [{ type: Input }],
    vertical: [{ type: Input }]
};
// =================================================================================================================================
//						F M M N G M O D U L E
// =================================================================================================================================
class FmmNgModule {
}
FmmNgModule.decorators = [
    { type: NgModule, args: [{ declarations: [FmmNgMinimap, FmmNgPanel], exports: [FmmNgMinimap, FmmNgPanel] },] }
];
// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================
// =================================================================================================================================
//						E L E M E N T F A C T O R Y
// =================================================================================================================================
class ElementFactory {
    // =============================================================================================================================
    constructor(ref) {
        let ngContentAttribute; // set attribute on elements to use non-global CSS
        if (Element.prototype.getAttributeNames !== undefined) {
            for (let p = ref.nativeElement; p && !ngContentAttribute; p = p.parentElement) {
                const names = p.getAttributeNames();
                ngContentAttribute = names.find((a) => a.startsWith('_ngcontent-'));
            }
        }
        else {
            for (let p = ref.nativeElement; p && !ngContentAttribute; p = p.parentElement) {
                const names = Array.prototype.map.call(p.attributes, (a) => a.name);
                ngContentAttribute = names.find((a) => a.startsWith('_ngcontent-'));
            }
        }
        if (!ngContentAttribute)
            throw new Error('FormMinimap: missing _ngcontent- attribute');
        this.ngContentAttribute = ngContentAttribute;
    }
    // =============================================================================================================================
    createElement(tagName) {
        const e = document.createElement(tagName);
        e.setAttribute(this.ngContentAttribute, '');
        return e;
    }
    // =============================================================================================================================
    createElementNS(namespaceURI, qualifiedName) {
        const e = document.createElementNS(namespaceURI, qualifiedName);
        e.setAttribute(this.ngContentAttribute, '');
        return e;
    }
}
// =================================================================================================================================
//						G
// =================================================================================================================================
const G = {
    PANELMAP: new WeakMap()
};
// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
class StoreItem {
    // =============================================================================================================================
    constructor(e, listener, name, control) {
        this.name = name;
        this.control = control;
        this.se = e.tagName === 'SELECT' ? e : undefined;
        const subscription = new Subscription();
        subscription.add(this.control.statusChanges.subscribe(listener));
        subscription.add(this.control.valueChanges.subscribe(listener));
        this.destructor = () => subscription.unsubscribe();
    }
    // =============================================================================================================================
    destructor() {
        // function body overwritten in constructor
    }
    // =============================================================================================================================
    getError(hasValue) {
        const errors = this.control.errors;
        let keys = errors ? Object.keys(errors) : [];
        if (hasValue && keys.length)
            keys = keys.filter(k => k !== 'required'); // IE11 SELECT bug
        return keys.length ? keys.join(',') : undefined;
    }
    // =============================================================================================================================
    getName() {
        return this.name;
    }
    // =============================================================================================================================
    getValue() {
        const value = this.control.value;
        if (!value)
            return undefined;
        if (!this.se)
            return value;
        if (!this.se.multiple)
            return [this.se.selectedIndex];
        const indexes = []; // FormControl for multiselect doesn't update when selected option is removed dynamically
        Array.from(this.se.options).forEach((o, i) => o.selected && indexes.push(i));
        return indexes;
    }
    // =============================================================================================================================
    isDisabled() {
        return this.control.disabled;
    }
}
// =================================================================================================================================
//						S T O R E
// =================================================================================================================================
class Store {
    // =============================================================================================================================
    constructor(formGroup) {
        this.formGroup = formGroup;
        this.namelessControls = {};
        this.minimaps = new Set();
        this.listener = () => this.minimaps.forEach(m => m.takeSnapshot());
    }
    // =============================================================================================================================
    createStoreItem(e, _) {
        const name = e.getAttribute('name') || e.id;
        const control = name ? this.namelessControls[name] : undefined;
        if (control)
            return new StoreItem(e, this.listener, name, control);
        let inFormArray = false;
        let path;
        let fc = e;
        for (; fc && fc.tagName !== 'FORM'; fc = fc.parentElement) {
            path = fc.getAttribute('formcontrolname') || fc.dataset.formcontrolname;
            if (path)
                break;
            inFormArray = fc.dataset.fmminformarray !== undefined;
            if (inFormArray)
                break;
        }
        for (let p = fc === null || fc === void 0 ? void 0 : fc.parentElement; p && p.tagName !== 'FORM'; p = p.parentElement) {
            let pName = p.getAttribute('formarrayname');
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
        const ac = this.formGroup.get(path);
        return ac ? new StoreItem(e, this.listener, path, ac) : undefined;
    }
    // =============================================================================================================================
    notifyMinimap(minimap, on) {
        if (on)
            this.minimaps.add(minimap);
        else
            this.minimaps.delete(minimap);
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { FmmNgMinimap, FmmNgModule, FmmNgPanel };
//# sourceMappingURL=fmmp-ng.js.map
