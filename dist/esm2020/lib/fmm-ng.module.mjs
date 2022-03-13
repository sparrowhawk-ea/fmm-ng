import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Fmm, FmmFormHTML } from '@eafmm/core';
import * as i0 from "@angular/core";
// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
export class FmmNgMinimap {
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
export class FmmNgPanel {
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
export class FmmNgModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm1tLW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZm1tLW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFnQyxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0gsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQ04sR0FBRyxFQUlILFdBQVcsRUFTWCxNQUFNLGFBQWEsQ0FBQzs7QUFFckIsb0lBQW9JO0FBQ3BJLCtCQUErQjtBQUMvQixvSUFBb0k7QUFFcEksTUFBTSxPQUFPLFlBQVk7SUF5QnhCLGdJQUFnSTtJQUNoSSxZQUFtQixPQUFtQjtRQWJ0QixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUVKLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBZ0IsQ0FBQztRQVNuRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsYUFBd0IsQ0FBQztRQUM1QyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLE1BQU07WUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQTRCLENBQUM7UUFDakYsSUFBSSxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUF1QixDQUFDO0lBQ3JDLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsVUFBVTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxXQUFXO1FBQ2pCLElBQUks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QUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDM0UsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxRQUFRLENBQUMsQ0FBVSxFQUFFLElBQWUsRUFBRSxRQUFpQjtRQUM3RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxPQUFPLENBQUMsQ0FBVSxFQUFFLElBQWU7UUFDekMsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxRQUFRLENBQUMsQ0FBVSxFQUFFLElBQWU7UUFDMUMsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxVQUFVLENBQUMsQ0FBVSxFQUFFLElBQWU7UUFDNUMsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxxQkFBcUIsQ0FBQyxPQUFtQixFQUFFLEVBQVc7UUFDNUQsSUFBSSxFQUFFO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdNb2R1bGUsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG5cdEZtbSxcblx0Rm1tRWxlbWVudEZhY3RvcnksXG5cdEZtbUZvcm0sXG5cdEZtbUZvcm1FbGVtZW50SFRNTCxcblx0Rm1tRm9ybUhUTUwsXG5cdEZtbUZyYW1ld29yayxcblx0Rm1tTWFwU3RyaW5nLFxuXHRGbW1NaW5pbWFwLFxuXHRGbW1NaW5pbWFwQ3JlYXRlUGFyYW0sXG5cdEZtbVBhbmVsLFxuXHRGbW1TbmFwc2hvdHMsXG5cdEZtbVN0b3JlLFxuXHRGbW1TdG9yZUl0ZW1cbn0gZnJvbSAnQGVhZm1tL2NvcmUnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0RiBNIE0gTiBHIE0gSSBOIEkgTSBBIFBcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiAnZm1tLW5nLW1pbmltYXAnLCB0ZW1wbGF0ZTogJycgfSlcbmV4cG9ydCBjbGFzcyBGbW1OZ01pbmltYXAgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBQYXJ0aWFsPEZtbU1pbmltYXA+IHtcblx0QElucHV0KCkgcHVibGljIGFnZ3JlZ2F0ZUxhYmVscz86IEZtbU1hcFN0cmluZztcblx0QElucHV0KCkgcHVibGljIGFuY2hvcj86IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgY3VzdG9tRWxlbWVudElkcz86IHN0cmluZ1tdO1xuXHRASW5wdXQoKSBwdWJsaWMgZGVib3VuY2VNc2VjPzogbnVtYmVyO1xuXHRASW5wdXQoKSBwdWJsaWMgZHluYW1pY0xhYmVscz86IHN0cmluZ1tdO1xuXHRASW5wdXQoKSBwdWJsaWMgZm9ybUdyb3VwPzogRm9ybUdyb3VwO1xuXHRASW5wdXQoKSBwdWJsaWMgZnJhbWV3b3JrPzogRm1tRnJhbWV3b3JrO1xuXHRASW5wdXQoKSBwdWJsaWMga2V5Pzogc3RyaW5nO1xuXHRASW5wdXQoKSBwdWJsaWMgbmFtZWxlc3NDb250cm9scz86IEZtbU5nTmFtZWxlc3NDb250cm9scztcblx0QElucHV0KCkgcHVibGljIG9yZGluYWw/OiBudW1iZXI7XG5cdEBJbnB1dCgpIHB1YmxpYyBwYWdlPzogSFRNTERpdkVsZW1lbnQ7XG5cdEBJbnB1dCgpIHB1YmxpYyBwYW5lbD86IEZtbU5nUGFuZWw7XG5cdEBJbnB1dCgpIHB1YmxpYyB0aXRsZSA9ICcnO1xuXHRASW5wdXQoKSBwdWJsaWMgdXNlUGFuZWxEZXRhaWw/OiBib29sZWFuO1xuXHRASW5wdXQoKSBwdWJsaWMgdXNlV2lkdGhUb1NjYWxlPzogYm9vbGVhbjtcblx0QElucHV0KCkgcHVibGljIHZlcmJvc2l0eSA9IDA7XG5cdEBJbnB1dCgpIHB1YmxpYyB6b29tRmFjdG9yPzogbnVtYmVyO1xuXHRAT3V0cHV0KCkgcHVibGljIHJlYWRvbmx5IHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Rm1tU25hcHNob3RzPigpO1xuXHRwcml2YXRlIHJlYWRvbmx5IGZvcm06IEhUTUxGb3JtRWxlbWVudDtcblxuXHRwcml2YXRlIG1pbmltYXA/OiBGbW1NaW5pbWFwO1xuXHRwcml2YXRlIHByZXZpb3VzS2V5Pzogc3RyaW5nO1xuXHRwcml2YXRlIHN0b3JlPzogU3RvcmU7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKGhvc3RSZWY6IEVsZW1lbnRSZWYpIHtcblx0XHRsZXQgZm9ybSA9IGhvc3RSZWYubmF0aXZlRWxlbWVudCBhcyBFbGVtZW50O1xuXHRcdHdoaWxlIChmb3JtICYmIGZvcm0udGFnTmFtZSAhPT0gJ0ZPUk0nKSBmb3JtID0gZm9ybS5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXHRcdGlmICghZm9ybSkgdGhyb3cgbmV3IEVycm9yKCdGbW1OZ01pbmltYXAgbm90IGNyZWF0ZWQ6IGNvbXBvbmVudCBtdXN0IGJlIHVzZWQgd2l0aGluIEZPUk0gdGFnJyk7XG5cdFx0dGhpcy5mb3JtID0gZm9ybSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZGVzdHJ1Y3RvcigpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMubWluaW1hcCkgcmV0dXJuO1xuXHRcdHRoaXMubWluaW1hcC5kZXN0cnVjdG9yKCk7XG5cdFx0dGhpcy5taW5pbWFwID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5taW5pbWFwKSByZXR1cm47XG5cdFx0aWYgKHRoaXMua2V5ICE9PSB0aGlzLnByZXZpb3VzS2V5KSB7XG5cdFx0XHR0aGlzLm1pbmltYXAuZGVzdHJ1Y3RvcigpO1xuXHRcdFx0dGhpcy5uZ09uSW5pdCgpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdG9yZSkge1xuXHRcdFx0dGhpcy5zdG9yZS5uYW1lbGVzc0NvbnRyb2xzID0gdGhpcy5uYW1lbGVzc0NvbnRyb2xzIHx8IHt9O1xuXHRcdFx0dGhpcy5taW5pbWFwLmNvbXBvc2UodGhpcy5jdXN0b21FbGVtZW50SWRzKTtcblx0XHR9XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubWluaW1hcCkgdGhpcy5taW5pbWFwLmRldGFjaCgpO1xuXHRcdHRoaXMuc3RvcmUgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG5cdFx0aWYgKCF0aGlzLmZvcm1Hcm91cCkgdGhyb3cgbmV3IEVycm9yKCdGbW1OZ01pbmltYXAgbm90IGNyZWF0ZWQ6IGZvcm1Hcm91cCByZXF1aXJlZCcpO1xuXHRcdGlmICghdGhpcy5zdG9yZSkgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSh0aGlzLmZvcm1Hcm91cCk7XG5cdFx0Y29uc3QgcDogRm1tTWluaW1hcENyZWF0ZVBhcmFtID0ge1xuXHRcdFx0YWdncmVnYXRlTGFiZWxzOiB0aGlzLmFnZ3JlZ2F0ZUxhYmVscyxcblx0XHRcdGFuY2hvcjogdGhpcy5hbmNob3IsXG5cdFx0XHRkZWJvdW5jZU1zZWM6IHRoaXMuZGVib3VuY2VNc2VjLFxuXHRcdFx0ZHluYW1pY0xhYmVsczogdGhpcy5keW5hbWljTGFiZWxzLFxuXHRcdFx0Zm9ybTogbmV3IEZtbUZvcm1IVE1MKHRoaXMuZm9ybSwgdGhpcy5wYWdlKSxcblx0XHRcdGZyYW1ld29yazogdGhpcy5mcmFtZXdvcmssXG5cdFx0XHRvblVwZGF0ZTogKHNuYXBzaG90OiBGbW1TbmFwc2hvdHMpID0+IHRoaXMudXBkYXRlLm5leHQoc25hcHNob3QpLFxuXHRcdFx0b3JkaW5hbDogdGhpcy5vcmRpbmFsLFxuXHRcdFx0c3RvcmU6IHRoaXMuc3RvcmUsXG5cdFx0XHR0aXRsZTogdGhpcy50aXRsZSxcblx0XHRcdHVzZVBhbmVsRGV0YWlsOiB0aGlzLnVzZVBhbmVsRGV0YWlsICE9PSB1bmRlZmluZWQsXG5cdFx0XHR1c2VXaWR0aFRvU2NhbGU6IHRoaXMudXNlV2lkdGhUb1NjYWxlICE9PSB1bmRlZmluZWQsXG5cdFx0XHR2ZXJib3NpdHk6IHRoaXMudmVyYm9zaXR5LFxuXHRcdFx0em9vbUZhY3RvcjogdGhpcy56b29tRmFjdG9yXG5cdFx0fTtcblx0XHRpZiAodGhpcy5wYW5lbCkge1xuXHRcdFx0dGhpcy5taW5pbWFwID0gRy5QQU5FTE1BUC5nZXQodGhpcy5wYW5lbCk/LmNyZWF0ZU1pbmltYXAocCk7XG5cdFx0fSBlbHNlIGlmIChwLmFuY2hvcikge1xuXHRcdFx0dGhpcy5taW5pbWFwID0gRm1tLmNyZWF0ZU1pbmltYXAocCwgbmV3IEVsZW1lbnRGYWN0b3J5KHAuYW5jaG9yIGFzIEVsZW1lbnQpKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzLm1pbmltYXApIHRocm93IG5ldyBFcnJvcignRm1tTmdNaW5pbWFwIG5vdCBjcmVhdGVkOiBwYW5lbCwgcGFyZW50LCBvciBhbmNob3IgcmVxdWlyZWQnKTtcblx0XHR0aGlzLnByZXZpb3VzS2V5ID0gdGhpcy5rZXk7XG5cdFx0dGhpcy5uZ09uQ2hhbmdlcygpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIHRha2VTbmFwc2hvdCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5taW5pbWFwPy50YWtlU25hcHNob3QoKSB8fCBmYWxzZTtcblx0fVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0RiBNIE0gTiBHIFAgQSBOIEUgTFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6ICdmbW0tbmctcGFuZWwnLCB0ZW1wbGF0ZTogJycgfSlcbmV4cG9ydCBjbGFzcyBGbW1OZ1BhbmVsIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQsIFBhcnRpYWw8Rm1tUGFuZWw+IHtcblx0QElucHV0KCkgcHVibGljIHJlYWRvbmx5IGRldGFpbFBhcmVudD86IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgcmVhZG9ubHkgbWluaW1hcHNDb3VudCA9IDE7XG5cdEBJbnB1dCgpIHB1YmxpYyByZWFkb25seSB2ZXJ0aWNhbD86IGJvb2xlYW47XG5cblx0cHVibGljIHJlYWRvbmx5IGVmOiBGbW1FbGVtZW50RmFjdG9yeTtcblx0cHJpdmF0ZSBtaW5pbWFwUGFuZWw/OiBGbW1QYW5lbDtcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBob3N0UmVmOiBFbGVtZW50UmVmKSB7XG5cdFx0dGhpcy5lZiA9IG5ldyBFbGVtZW50RmFjdG9yeShob3N0UmVmLm5hdGl2ZUVsZW1lbnQgYXMgRWxlbWVudCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubWluaW1hcFBhbmVsKSB0aGlzLm1pbmltYXBQYW5lbC5kZXN0cnVjdG9yKCk7XG5cdFx0Ry5QQU5FTE1BUC5kZWxldGUodGhpcyk7XG5cdFx0dGhpcy5taW5pbWFwUGFuZWwgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG5cdFx0Y29uc3QgaG9zdCA9IHRoaXMuaG9zdFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxEaXZFbGVtZW50O1xuXHRcdGNvbnN0IHZlcnRpY2FsID0gdGhpcy52ZXJ0aWNhbCAhPT0gdW5kZWZpbmVkO1xuXHRcdHRoaXMubWluaW1hcFBhbmVsID0gRm1tLmNyZWF0ZVBhbmVsKGhvc3QsIHRoaXMubWluaW1hcHNDb3VudCwgdGhpcy5kZXRhaWxQYXJlbnQsIHZlcnRpY2FsLCB0aGlzLmVmKTtcblx0XHRHLlBBTkVMTUFQLnNldCh0aGlzLCB0aGlzLm1pbmltYXBQYW5lbCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZGVzdHJveURldGFjaGVkKCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLm1pbmltYXBQYW5lbD8uZGVzdHJveURldGFjaGVkKCk7XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBNIE8gRCBVIEwgRVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5ATmdNb2R1bGUoeyBkZWNsYXJhdGlvbnM6IFtGbW1OZ01pbmltYXAsIEZtbU5nUGFuZWxdLCBleHBvcnRzOiBbRm1tTmdNaW5pbWFwLCBGbW1OZ1BhbmVsXSB9KVxuZXhwb3J0IGNsYXNzIEZtbU5nTW9kdWxlIHsgfVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0RiBNIE0gTiBHIE4gQSBNIEUgTCBFIFMgUyBDIE8gTiBUIFIgTyBMIFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHR5cGUgRm1tTmdOYW1lbGVzc0NvbnRyb2xzID0gUmVjb3JkPHN0cmluZywgQWJzdHJhY3RDb250cm9sPjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFAgUiBJIFYgQSBUIEVcdD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEUgTCBFIE0gRSBOIFQgRiBBIEMgVCBPIFIgWVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBFbGVtZW50RmFjdG9yeSBpbXBsZW1lbnRzIEZtbUVsZW1lbnRGYWN0b3J5IHtcblx0cHJpdmF0ZSByZWFkb25seSBuZ0NvbnRlbnRBdHRyaWJ1dGU6IHN0cmluZztcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IocDogRWxlbWVudCkge1xuXHRcdGxldCBuZ0NvbnRlbnRBdHRyaWJ1dGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDsgLy8gc2V0IGF0dHJpYnV0ZSBvbiBlbGVtZW50cyB0byB1c2Ugbm9uLWdsb2JhbCBDU1Ncblx0XHRpZiAoRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTmFtZXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Zm9yICg7IHAgJiYgIW5nQ29udGVudEF0dHJpYnV0ZTsgcCA9IHAucGFyZW50RWxlbWVudCBhcyBFbGVtZW50KSB7XG5cdFx0XHRcdGNvbnN0IG5hbWVzID0gcC5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXHRcdFx0XHRuZ0NvbnRlbnRBdHRyaWJ1dGUgPSBuYW1lcy5maW5kKChhOiBzdHJpbmcpID0+IGEuc3RhcnRzV2l0aCgnX25nY29udGVudC0nKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoOyBwICYmICFuZ0NvbnRlbnRBdHRyaWJ1dGU7IHAgPSBwLnBhcmVudEVsZW1lbnQgYXMgRWxlbWVudCkge1xuXHRcdFx0XHRjb25zdCBuYW1lcyA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChwLmF0dHJpYnV0ZXMsIChhOiBBdHRyKSA9PiBhLm5hbWUpIGFzIHN0cmluZ1tdO1xuXHRcdFx0XHRuZ0NvbnRlbnRBdHRyaWJ1dGUgPSBuYW1lcy5maW5kKChhOiBzdHJpbmcpID0+IGEuc3RhcnRzV2l0aCgnX25nY29udGVudC0nKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghbmdDb250ZW50QXR0cmlidXRlKSB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm1NaW5pbWFwOiBtaXNzaW5nIF9uZ2NvbnRlbnQtIGF0dHJpYnV0ZScpO1xuXHRcdHRoaXMubmdDb250ZW50QXR0cmlidXRlID0gbmdDb250ZW50QXR0cmlidXRlO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNyZWF0ZUVsZW1lbnQodGFnTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cdFx0ZS5zZXRBdHRyaWJ1dGUodGhpcy5uZ0NvbnRlbnRBdHRyaWJ1dGUsICcnKTtcblx0XHRyZXR1cm4gZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJOiBzdHJpbmcsIHF1YWxpZmllZE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcblx0XHRlLnNldEF0dHJpYnV0ZSh0aGlzLm5nQ29udGVudEF0dHJpYnV0ZSwgJycpO1xuXHRcdHJldHVybiBlO1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRHXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IEc6IHtcblx0UEFORUxNQVA6IFdlYWtNYXA8Rm1tTmdQYW5lbCwgRm1tUGFuZWw+O1xufSA9IHtcblx0UEFORUxNQVA6IG5ldyBXZWFrTWFwKClcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRTIFQgTyBSIEUgSSBUIEUgTVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBTdG9yZUl0ZW0gaW1wbGVtZW50cyBGbW1TdG9yZUl0ZW0ge1xuXHRwcml2YXRlIHJlYWRvbmx5IHNlPzogSFRNTFNlbGVjdEVsZW1lbnQ7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKFxuXHRcdGU6IEhUTUxFbGVtZW50LFxuXHRcdGxpc3RlbmVyOiAoKSA9PiB2b2lkLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgY29udHJvbDogQWJzdHJhY3RDb250cm9sXG5cdCkge1xuXHRcdHRoaXMuc2UgPSBlLnRhZ05hbWUgPT09ICdTRUxFQ1QnID8gKGUgYXMgSFRNTFNlbGVjdEVsZW1lbnQpIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblx0XHRzdWJzY3JpcHRpb24uYWRkKHRoaXMuY29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZShsaXN0ZW5lcikpO1xuXHRcdHN1YnNjcmlwdGlvbi5hZGQodGhpcy5jb250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUobGlzdGVuZXIpKTtcblx0XHR0aGlzLmRlc3RydWN0b3IgPSAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBkZXN0cnVjdG9yKCk6IHZvaWQge1xuXHRcdC8vIGZ1bmN0aW9uIGJvZHkgb3ZlcndyaXR0ZW4gaW4gY29uc3RydWN0b3Jcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRFcnJvcihoYXNWYWx1ZTogYm9vbGVhbik6IHN0cmluZyB7XG5cdFx0Y29uc3QgZXJyb3JzID0gdGhpcy5jb250cm9sLmVycm9ycztcblx0XHRsZXQga2V5cyA9IGVycm9ycyA/IE9iamVjdC5rZXlzKGVycm9ycykgOiBbXTtcblx0XHRpZiAoaGFzVmFsdWUgJiYga2V5cy5sZW5ndGgpIGtleXMgPSBrZXlzLmZpbHRlcihrID0+IGsgIT09ICdyZXF1aXJlZCcpOyAvLyBJRTExIFNFTEVDVCBidWdcblx0XHRyZXR1cm4ga2V5cy5sZW5ndGggPyBrZXlzLmpvaW4oJywnKSA6ICcnO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5uYW1lO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldFZhbHVlKCkge1xuXHRcdGNvbnN0IHZhbHVlID0gdGhpcy5jb250cm9sLnZhbHVlIGFzIHVua25vd247XG5cdFx0aWYgKCF2YWx1ZSkgcmV0dXJuIHVuZGVmaW5lZDtcblx0XHRpZiAoIXRoaXMuc2UpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoIXRoaXMuc2UubXVsdGlwbGUpIHJldHVybiBbdGhpcy5zZS5zZWxlY3RlZEluZGV4XTtcblx0XHRjb25zdCBpbmRleGVzOiBudW1iZXJbXSA9IFtdOyAvLyBGb3JtQ29udHJvbCBmb3IgbXVsdGlzZWxlY3QgZG9lc24ndCB1cGRhdGUgd2hlbiBzZWxlY3RlZCBvcHRpb24gaXMgcmVtb3ZlZCBkeW5hbWljYWxseVxuXHRcdEFycmF5LmZyb20odGhpcy5zZS5vcHRpb25zKS5mb3JFYWNoKChvLCBpKSA9PiBvLnNlbGVjdGVkICYmIGluZGV4ZXMucHVzaChpKSk7XG5cdFx0cmV0dXJuIGluZGV4ZXM7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgaXNEaXNhYmxlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5jb250cm9sLmRpc2FibGVkO1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRTIFQgTyBSIEVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgU3RvcmUgaW1wbGVtZW50cyBGbW1TdG9yZSB7XG5cdHB1YmxpYyBuYW1lbGVzc0NvbnRyb2xzOiBGbW1OZ05hbWVsZXNzQ29udHJvbHMgPSB7fTtcblx0cHJpdmF0ZSByZWFkb25seSBsaXN0ZW5lciA9ICgpID0+IHRoaXMubWluaW1hcHMuZm9yRWFjaChtID0+IG0udGFrZVNuYXBzaG90KCkpO1xuXHRwcml2YXRlIHJlYWRvbmx5IG1pbmltYXBzOiBTZXQ8Rm1tTWluaW1hcD4gPSBuZXcgU2V0KCk7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZm9ybUdyb3VwOiBGb3JtR3JvdXApIHt9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNyZWF0ZVN0b3JlSXRlbShfOiBGbW1Gb3JtLCBlOiBGbW1Gb3JtRWxlbWVudEhUTUwpOiBGbW1TdG9yZUl0ZW0gfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IG5hbWUgPSBlLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IGUuaWQ7XG5cdFx0Y29uc3QgY29udHJvbCA9IG5hbWUgPyB0aGlzLm5hbWVsZXNzQ29udHJvbHNbbmFtZV0gOiB1bmRlZmluZWQ7XG5cdFx0aWYgKGNvbnRyb2wpIHJldHVybiBuZXcgU3RvcmVJdGVtKGUsIHRoaXMubGlzdGVuZXIsIG5hbWUsIGNvbnRyb2wpO1xuXHRcdGxldCBpbkZvcm1BcnJheSA9IGZhbHNlO1xuXHRcdGxldCBwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0bGV0IGZjID0gZTtcblx0XHRmb3IgKDsgZmMgJiYgZmMudGFnTmFtZSAhPT0gJ0ZPUk0nOyBmYyA9IGZjLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpIHtcblx0XHRcdHBhdGggPSBmYy5nZXRBdHRyaWJ1dGUoJ2Zvcm1jb250cm9sbmFtZScpIHx8IGZjLmRhdGFzZXQuZm9ybWNvbnRyb2xuYW1lO1xuXHRcdFx0aWYgKHBhdGgpIGJyZWFrO1xuXHRcdFx0aW5Gb3JtQXJyYXkgPSBmYy5kYXRhc2V0LmZtbWluZm9ybWFycmF5ICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRpZiAoaW5Gb3JtQXJyYXkpIGJyZWFrO1xuXHRcdH1cblx0XHRmb3IgKGxldCBwID0gZmM/LnBhcmVudEVsZW1lbnQ7IHBhdGggJiYgcCAmJiBwLnRhZ05hbWUgIT09ICdGT1JNJzsgcCA9IHAucGFyZW50RWxlbWVudCkge1xuXHRcdFx0bGV0IHBOYW1lID0gcC5nZXRBdHRyaWJ1dGUoJ2Zvcm1hcnJheW5hbWUnKTtcblx0XHRcdGlmICghcE5hbWUpIHtcblx0XHRcdFx0cE5hbWUgPSBwLmdldEF0dHJpYnV0ZSgnZm9ybWdyb3VwbmFtZScpO1xuXHRcdFx0XHRpZiAocE5hbWUpIHBhdGggPSBwTmFtZSArICcuJyArIHBhdGg7XG5cdFx0XHR9IGVsc2UgaWYgKCFpbkZvcm1BcnJheSkge1xuXHRcdFx0XHRwYXRoID0gcE5hbWUgKyAnLicgKyBwYXRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5Gb3JtQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0cGF0aCA9IHBOYW1lO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdCBhYyA9IHBhdGggPyB0aGlzLmZvcm1Hcm91cC5nZXQocGF0aCkgOiB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHBhdGggJiYgYWMgPyBuZXcgU3RvcmVJdGVtKGUsIHRoaXMubGlzdGVuZXIsIHBhdGgsIGFjKSA6IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRFcnJvcihfOiBGbW1Gb3JtLCBpdGVtOiBTdG9yZUl0ZW0sIGhhc1ZhbHVlOiBib29sZWFuKSB7XG5cdFx0cmV0dXJuIGl0ZW0uZ2V0RXJyb3IoaGFzVmFsdWUpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldE5hbWUoXzogRm1tRm9ybSwgaXRlbTogU3RvcmVJdGVtKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gaXRlbS5nZXROYW1lKCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZ2V0VmFsdWUoXzogRm1tRm9ybSwgaXRlbTogU3RvcmVJdGVtKSB7XG5cdFx0cmV0dXJuIGl0ZW0uZ2V0VmFsdWUoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBpc0Rpc2FibGVkKF86IEZtbUZvcm0sIGl0ZW06IFN0b3JlSXRlbSkge1xuXHRcdHJldHVybiBpdGVtLmlzRGlzYWJsZWQoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBub3RpZnlNaW5pbWFwT25VcGRhdGUobWluaW1hcDogRm1tTWluaW1hcCwgb246IGJvb2xlYW4pIHtcblx0XHRpZiAob24pIHRoaXMubWluaW1hcHMuYWRkKG1pbmltYXApO1xuXHRcdGVsc2UgdGhpcy5taW5pbWFwcy5kZWxldGUobWluaW1hcCk7XG5cdH1cbn1cbiJdfQ==