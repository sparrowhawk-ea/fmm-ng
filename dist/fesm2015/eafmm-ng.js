import { EventEmitter, Component, ElementRef, Input, Output, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';
import { FmmFormHTML, Fmm } from '@eafmm/core';

// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
class FmmNgMinimap {
    // =============================================================================================================================
    constructor(hostRef) {
        this.key = '';
        this.title = '';
        this.usePanelDetail = false;
        this.useWidthToScale = false;
        this.verbosity = 0;
        this.update = new EventEmitter();
        this.previousKey = '';
        let form = hostRef.nativeElement;
        while (form && form.tagName !== 'FORM')
            form = form.parentElement;
        this.form = form;
    }
    // =============================================================================================================================
    destructor() {
        if (!this.minimap)
            return;
        this.minimap.destructor();
        this.minimap = undefined;
    }
    // =============================================================================================================================
    ngOnChanges() {
        if (!this.minimap)
            return;
        if (this.key !== this.previousKey) {
            this.minimap.destructor();
            this.ngOnInit();
        }
        else if (this.store) {
            this.store.namelessControls = this.namelessControls || {};
            this.minimap.compose(this.customElementIds);
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
        var _a;
        const efParent = this.parent || this.anchor;
        if (!this.formGroup || !efParent)
            return;
        const p = {
            aggregateLabels: this.aggregateLabels,
            anchor: this.anchor,
            debounceMsec: this.debounceMsec,
            dynamicLabels: this.dynamicLabels,
            form: new FmmFormHTML(this.form, this.page),
            framework: this.framework,
            onUpdate: (snapshot) => this.update.next(snapshot),
            store: this.store = new Store(this.formGroup),
            title: this.title,
            usePanelDetail: this.usePanelDetail !== undefined,
            useWidthToScale: this.useWidthToScale !== undefined,
            verbosity: this.verbosity,
            zoomFactor: this.zoomFactor
        };
        if (!this.formGroup || !(this.parent || this.anchor))
            return;
        this.minimap = this.panel
            ? (_a = G.PANELMAP.get(this.panel)) === null || _a === void 0 ? void 0 : _a.createMinimap(p)
            : Fmm.createMinimap(p, this.parent, new ElementFactory(efParent));
        this.previousKey = this.key;
        this.ngOnChanges();
    }
    // =============================================================================================================================
    takeSnapshot() {
        var _a;
        return ((_a = this.minimap) === null || _a === void 0 ? void 0 : _a.takeSnapshot()) || false;
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
    customElementIds: [{ type: Input }],
    debounceMsec: [{ type: Input }],
    dynamicLabels: [{ type: Input }],
    formGroup: [{ type: Input }],
    framework: [{ type: Input }],
    key: [{ type: Input }],
    namelessControls: [{ type: Input }],
    page: [{ type: Input }],
    panel: [{ type: Input }],
    parent: [{ type: Input }],
    title: [{ type: Input }],
    usePanelDetail: [{ type: Input }],
    useWidthToScale: [{ type: Input }],
    verbosity: [{ type: Input }],
    zoomFactor: [{ type: Input }],
    update: [{ type: Output }]
};
// =================================================================================================================================
//						F M M N G P A N E L
// =================================================================================================================================
class FmmNgPanel {
    // =============================================================================================================================
    constructor(hostRef) {
        this.hostRef = hostRef;
        this.vertical = false;
        this.ef = new ElementFactory(hostRef.nativeElement);
    }
    // =============================================================================================================================
    ngOnDestroy() {
        if (this.minimapPanel)
            this.minimapPanel.destructor();
        G.PANELMAP.delete(this);
        this.minimapPanel = undefined;
    }
    // =============================================================================================================================
    ngOnInit() {
        const host = this.hostRef.nativeElement;
        const vertical = this.vertical !== undefined;
        this.minimapPanel = Fmm.createPanel(host, this.detailParent, vertical, this.ef);
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
    constructor(p) {
        let ngContentAttribute = undefined; // set attribute on elements to use non-global CSS
        if (Element.prototype.getAttributeNames !== undefined) {
            for (; p && !ngContentAttribute; p = p.parentElement) {
                const names = p.getAttributeNames();
                ngContentAttribute = names.find((a) => a.startsWith('_ngcontent-'));
            }
        }
        else {
            for (; p && !ngContentAttribute; p = p.parentElement) {
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
        return keys.length ? keys.join(',') : '';
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
    createStoreItem(_, e) {
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
        const ac = path ? this.formGroup.get(path) : undefined;
        return path && ac ? new StoreItem(e, this.listener, path, ac) : undefined;
    }
    // =============================================================================================================================
    getError(_, item, hasValue) {
        return item.getError(hasValue);
    }
    // =============================================================================================================================
    getName(_, item) {
        return item.getName();
    }
    // =============================================================================================================================
    getValue(_, item) {
        return item.getValue();
    }
    // =============================================================================================================================
    isDisabled(_, item) {
        return item.isDisabled();
    }
    // =============================================================================================================================
    notifyMinimapOnUpdate(minimap, on) {
        if (on)
            this.minimaps.add(minimap);
        else
            this.minimaps.delete(minimap);
    }
}

// =================================================================================================================================
//						F M M N G M A T E R I A L
// =================================================================================================================================
const FmmNgMaterial = {
    createFrameworkItem(_, e) {
        const eTag = e.tagName;
        if (eTag === 'INPUT' && e.classList.contains('mat-autocomplete-trigger'))
            return new FrameworkItemAutoComplete(e);
        return eTag === 'MAT-SELECT' ? new FrameworkItemSelect(e) : new FrameworkItem(e);
    }
};
// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================
// =================================================================================================================================
//						F R A M E W O R K I T E M
// =================================================================================================================================
class FrameworkItem {
    // =============================================================================================================================
    constructor(e) {
        let field = e.parentElement;
        while (field && field.tagName !== 'MAT-FORM-FIELD')
            field = field.parentElement;
        let tag = e;
        while (tag && !tag.tagName.startsWith('MAT-'))
            tag = tag.parentElement;
        if (!field) {
            this.envelope = this.forValidation = tag || e;
        }
        else {
            this.forValidation = field;
            this.envelope = !tag || field.querySelectorAll(tag.tagName).length < 2 ? field : tag || e;
            const labels = field.querySelectorAll('LABEL');
            if (labels.length === 1)
                this.label = labels[0];
        }
    }
    // =============================================================================================================================
    destructor() {
        /**/
    }
    // =============================================================================================================================
    getEnvelope(_, _e, _l) {
        return this.envelope;
    }
    // =============================================================================================================================
    getError(_, _e, _n, _v) {
        var _a;
        return ((_a = this.forValidation.querySelector('MAT-ERROR')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    }
    // =============================================================================================================================
    getLabel(_, _e) {
        return this.label;
    }
    // =============================================================================================================================
    getValue(_, _e, _n, _l) {
        return '';
    }
}
// =================================================================================================================================
//						F R A M E W O R K I T E M A U T O C O M P L E T E
// =================================================================================================================================
class FrameworkItemAutoComplete extends FrameworkItem {
    // =============================================================================================================================
    getValue(_, e, _n, _l) {
        return e.value;
    }
}
// =================================================================================================================================
//						F R A M E W O R K I T E M S E L E C T
// =================================================================================================================================
class FrameworkItemSelect extends FrameworkItem {
    // =============================================================================================================================
    getValue(_, e, _n, _l) {
        var _a;
        return ((_a = e.querySelector('.mat-select-value-text')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { FmmNgMaterial, FmmNgMinimap, FmmNgModule, FmmNgPanel };
//# sourceMappingURL=eafmm-ng.js.map
