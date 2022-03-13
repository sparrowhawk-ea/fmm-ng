import * as i0 from '@angular/core';
import { EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';
import { FmmFormHTML, Fmm } from '@eafmm/core';

// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
class FmmNgMinimap {
    // =============================================================================================================================
    constructor(hostRef) {
        this.title = '';
        this.verbosity = 0;
        this.update = new EventEmitter();
        let form = hostRef.nativeElement;
        while (form && form.tagName !== 'FORM')
            form = form.parentElement;
        if (!form)
            throw new Error('FmmNgMinimap not created: component must be used within FORM tag');
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
        if (this.minimap)
            this.minimap.detach();
        this.store = undefined;
    }
    // =============================================================================================================================
    ngOnInit() {
        if (!this.formGroup)
            throw new Error('FmmNgMinimap not created: formGroup required');
        if (!this.store)
            this.store = new Store(this.formGroup);
        const p = {
            aggregateLabels: this.aggregateLabels,
            anchor: this.anchor,
            debounceMsec: this.debounceMsec,
            dynamicLabels: this.dynamicLabels,
            form: new FmmFormHTML(this.form, this.page),
            framework: this.framework,
            onUpdate: (snapshot) => this.update.next(snapshot),
            ordinal: this.ordinal,
            store: this.store,
            title: this.title,
            usePanelDetail: this.usePanelDetail !== undefined,
            useWidthToScale: this.useWidthToScale !== undefined,
            verbosity: this.verbosity,
            zoomFactor: this.zoomFactor
        };
        if (this.panel) {
            this.minimap = G.PANELMAP.get(this.panel)?.createMinimap(p);
        }
        else if (p.anchor) {
            this.minimap = Fmm.createMinimap(p, new ElementFactory(p.anchor));
        }
        if (!this.minimap)
            throw new Error('FmmNgMinimap not created: panel, parent, or anchor required');
        this.previousKey = this.key;
        this.ngOnChanges();
    }
    // =============================================================================================================================
    takeSnapshot() {
        return this.minimap?.takeSnapshot() || false;
    }
}
FmmNgMinimap.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgMinimap, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
FmmNgMinimap.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: FmmNgMinimap, selector: "fmm-ng-minimap", inputs: { aggregateLabels: "aggregateLabels", anchor: "anchor", customElementIds: "customElementIds", debounceMsec: "debounceMsec", dynamicLabels: "dynamicLabels", formGroup: "formGroup", framework: "framework", key: "key", namelessControls: "namelessControls", ordinal: "ordinal", page: "page", panel: "panel", title: "title", usePanelDetail: "usePanelDetail", useWidthToScale: "useWidthToScale", verbosity: "verbosity", zoomFactor: "zoomFactor" }, outputs: { update: "update" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgMinimap, decorators: [{
            type: Component,
            args: [{ selector: 'fmm-ng-minimap', template: '' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { aggregateLabels: [{
                type: Input
            }], anchor: [{
                type: Input
            }], customElementIds: [{
                type: Input
            }], debounceMsec: [{
                type: Input
            }], dynamicLabels: [{
                type: Input
            }], formGroup: [{
                type: Input
            }], framework: [{
                type: Input
            }], key: [{
                type: Input
            }], namelessControls: [{
                type: Input
            }], ordinal: [{
                type: Input
            }], page: [{
                type: Input
            }], panel: [{
                type: Input
            }], title: [{
                type: Input
            }], usePanelDetail: [{
                type: Input
            }], useWidthToScale: [{
                type: Input
            }], verbosity: [{
                type: Input
            }], zoomFactor: [{
                type: Input
            }], update: [{
                type: Output
            }] } });
// =================================================================================================================================
//						F M M N G P A N E L
// =================================================================================================================================
class FmmNgPanel {
    // =============================================================================================================================
    constructor(hostRef) {
        this.hostRef = hostRef;
        this.minimapsCount = 1;
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
        this.minimapPanel = Fmm.createPanel(host, this.minimapsCount, this.detailParent, vertical, this.ef);
        G.PANELMAP.set(this, this.minimapPanel);
    }
    // =============================================================================================================================
    destroyDetached() {
        return this.minimapPanel?.destroyDetached();
    }
}
FmmNgPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgPanel, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
FmmNgPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: FmmNgPanel, selector: "fmm-ng-panel", inputs: { detailParent: "detailParent", minimapsCount: "minimapsCount", vertical: "vertical" }, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgPanel, decorators: [{
            type: Component,
            args: [{ selector: 'fmm-ng-panel', template: '' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { detailParent: [{
                type: Input
            }], minimapsCount: [{
                type: Input
            }], vertical: [{
                type: Input
            }] } });
// =================================================================================================================================
//						F M M N G M O D U L E
// =================================================================================================================================
class FmmNgModule {
}
FmmNgModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FmmNgModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgModule, declarations: [FmmNgMinimap, FmmNgPanel], exports: [FmmNgMinimap, FmmNgPanel] });
FmmNgModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: FmmNgModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [FmmNgMinimap, FmmNgPanel], exports: [FmmNgMinimap, FmmNgPanel] }]
        }] });
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
        this.listener = () => this.minimaps.forEach(m => m.takeSnapshot());
        this.minimaps = new Set();
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
        for (let p = fc?.parentElement; path && p && p.tagName !== 'FORM'; p = p.parentElement) {
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
        return this.forValidation.querySelector('MAT-ERROR')?.textContent || '';
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
        return e.querySelector('.mat-select-value-text')?.textContent || '';
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { FmmNgMaterial, FmmNgMinimap, FmmNgModule, FmmNgPanel };
//# sourceMappingURL=eafmm-ng.mjs.map
