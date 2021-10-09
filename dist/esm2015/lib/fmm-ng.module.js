import { Component, ElementRef, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Fmm, FmmFormHTML } from '@eafmm/core';
// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
export class FmmNgMinimap {
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
export class FmmNgPanel {
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
export class FmmNgModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm1tLW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZm1tLW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBZ0MsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUNOLEdBQUcsRUFJSCxXQUFXLEVBU1gsTUFBTSxhQUFhLENBQUM7QUFFckIsb0lBQW9JO0FBQ3BJLCtCQUErQjtBQUMvQixvSUFBb0k7QUFFcEksTUFBTSxPQUFPLFlBQVk7SUF5QnhCLGdJQUFnSTtJQUNoSSxZQUFtQixPQUFtQjtRQWxCdEIsUUFBRyxHQUFHLEVBQUUsQ0FBQztRQUtULFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRUosV0FBTSxHQUFHLElBQUksWUFBWSxFQUFnQixDQUFDO1FBSTVELGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBS3hCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUF3QixDQUFDO1FBQzVDLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssTUFBTTtZQUFFLElBQUksR0FBRyxJQUFJLENBQUMsYUFBNEIsQ0FBQztRQUNqRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQXVCLENBQUM7SUFDckMsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxVQUFVO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU87UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLFNB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LE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsUUFBUSxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQzFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsVUFBVSxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQzVDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgscUJBQXFCLENBQUMsT0FBbUIsRUFBRSxFQUFXO1FBQzVELElBQUksRUFBRTtZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nTW9kdWxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuXHRGbW0sXG5cdEZtbUVsZW1lbnRGYWN0b3J5LFxuXHRGbW1Gb3JtLFxuXHRGbW1Gb3JtRWxlbWVudEhUTUwsXG5cdEZtbUZvcm1IVE1MLFxuXHRGbW1GcmFtZXdvcmssXG5cdEZtbU1hcFN0cmluZyxcblx0Rm1tTWluaW1hcCxcblx0Rm1tTWluaW1hcENyZWF0ZVBhcmFtLFxuXHRGbW1QYW5lbCxcblx0Rm1tU25hcHNob3RzLFxuXHRGbW1TdG9yZSxcblx0Rm1tU3RvcmVJdGVtXG59IGZyb20gJ0BlYWZtbS9jb3JlJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBNIEkgTiBJIE0gQSBQXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogJ2ZtbS1uZy1taW5pbWFwJywgdGVtcGxhdGU6ICcnIH0pXG5leHBvcnQgY2xhc3MgRm1tTmdNaW5pbWFwIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUGFydGlhbDxGbW1NaW5pbWFwPiB7XG5cdEBJbnB1dCgpIHB1YmxpYyBhZ2dyZWdhdGVMYWJlbHM/OiBGbW1NYXBTdHJpbmc7XG5cdEBJbnB1dCgpIHB1YmxpYyBhbmNob3I/OiBIVE1MRGl2RWxlbWVudDtcblx0QElucHV0KCkgcHVibGljIGN1c3RvbUVsZW1lbnRJZHM/OiBzdHJpbmdbXTtcblx0QElucHV0KCkgcHVibGljIGRlYm91bmNlTXNlYz86IG51bWJlcjtcblx0QElucHV0KCkgcHVibGljIGR5bmFtaWNMYWJlbHM/OiBzdHJpbmdbXTtcblx0QElucHV0KCkgcHVibGljIGZvcm1Hcm91cD86IEZvcm1Hcm91cDtcblx0QElucHV0KCkgcHVibGljIGZyYW1ld29yaz86IEZtbUZyYW1ld29yaztcblx0QElucHV0KCkgcHVibGljIGtleSA9ICcnO1xuXHRASW5wdXQoKSBwdWJsaWMgbmFtZWxlc3NDb250cm9scz86IEZtbU5nTmFtZWxlc3NDb250cm9scztcblx0QElucHV0KCkgcHVibGljIHBhZ2U/OiBIVE1MRGl2RWxlbWVudDtcblx0QElucHV0KCkgcHVibGljIHBhbmVsPzogRm1tTmdQYW5lbDtcblx0QElucHV0KCkgcHVibGljIHBhcmVudD86IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgdGl0bGUgPSAnJztcblx0QElucHV0KCkgcHVibGljIHVzZVBhbmVsRGV0YWlsID0gZmFsc2U7XG5cdEBJbnB1dCgpIHB1YmxpYyB1c2VXaWR0aFRvU2NhbGUgPSBmYWxzZTtcblx0QElucHV0KCkgcHVibGljIHZlcmJvc2l0eSA9IDA7XG5cdEBJbnB1dCgpIHB1YmxpYyB6b29tRmFjdG9yPzogbnVtYmVyO1xuXHRAT3V0cHV0KCkgcHVibGljIHJlYWRvbmx5IHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Rm1tU25hcHNob3RzPigpO1xuXHRwcml2YXRlIHJlYWRvbmx5IGZvcm06IEhUTUxGb3JtRWxlbWVudDtcblxuXHRwcml2YXRlIG1pbmltYXA/OiBGbW1NaW5pbWFwO1xuXHRwcml2YXRlIHByZXZpb3VzS2V5ID0gJyc7XG5cdHByaXZhdGUgc3RvcmU/OiBTdG9yZTtcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IoaG9zdFJlZjogRWxlbWVudFJlZikge1xuXHRcdGxldCBmb3JtID0gaG9zdFJlZi5uYXRpdmVFbGVtZW50IGFzIEVsZW1lbnQ7XG5cdFx0d2hpbGUgKGZvcm0gJiYgZm9ybS50YWdOYW1lICE9PSAnRk9STScpIGZvcm0gPSBmb3JtLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0dGhpcy5mb3JtID0gZm9ybSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZGVzdHJ1Y3RvcigpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMubWluaW1hcCkgcmV0dXJuO1xuXHRcdHRoaXMubWluaW1hcC5kZXN0cnVjdG9yKCk7XG5cdFx0dGhpcy5taW5pbWFwID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5taW5pbWFwKSByZXR1cm47XG5cdFx0aWYgKHRoaXMua2V5ICE9PSB0aGlzLnByZXZpb3VzS2V5KSB7XG5cdFx0XHR0aGlzLm1pbmltYXAuZGVzdHJ1Y3RvcigpO1xuXHRcdFx0dGhpcy5uZ09uSW5pdCgpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdG9yZSkge1xuXHRcdFx0dGhpcy5zdG9yZS5uYW1lbGVzc0NvbnRyb2xzID0gdGhpcy5uYW1lbGVzc0NvbnRyb2xzIHx8IHt9O1xuXHRcdFx0dGhpcy5taW5pbWFwLmNvbXBvc2UodGhpcy5jdXN0b21FbGVtZW50SWRzKTtcdFxuXHRcdH1cblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMubWluaW1hcCkgcmV0dXJuO1xuXHRcdHRoaXMubWluaW1hcC5kZXRhY2goKTtcblx0XHR0aGlzLnN0b3JlID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuXHRcdGNvbnN0IGVmUGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpcy5hbmNob3I7XG5cdFx0aWYgKCF0aGlzLmZvcm1Hcm91cCB8fCAhZWZQYXJlbnQpIHJldHVybjtcblx0XHRjb25zdCBwOiBGbW1NaW5pbWFwQ3JlYXRlUGFyYW0gPSB7XG5cdFx0XHRhZ2dyZWdhdGVMYWJlbHM6IHRoaXMuYWdncmVnYXRlTGFiZWxzLFxuXHRcdFx0YW5jaG9yOiB0aGlzLmFuY2hvcixcblx0XHRcdGRlYm91bmNlTXNlYzogdGhpcy5kZWJvdW5jZU1zZWMsXG5cdFx0XHRkeW5hbWljTGFiZWxzOiB0aGlzLmR5bmFtaWNMYWJlbHMsXG5cdFx0XHRmb3JtOiBuZXcgRm1tRm9ybUhUTUwodGhpcy5mb3JtLCB0aGlzLnBhZ2UpLFxuXHRcdFx0ZnJhbWV3b3JrOiB0aGlzLmZyYW1ld29yayxcblx0XHRcdG9uVXBkYXRlOiAoc25hcHNob3Q6IEZtbVNuYXBzaG90cykgPT4gdGhpcy51cGRhdGUubmV4dChzbmFwc2hvdCksXG5cdFx0XHRzdG9yZTogdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSh0aGlzLmZvcm1Hcm91cCksXG5cdFx0XHR0aXRsZTogdGhpcy50aXRsZSxcblx0XHRcdHVzZVBhbmVsRGV0YWlsOiB0aGlzLnVzZVBhbmVsRGV0YWlsICE9PSB1bmRlZmluZWQsXG5cdFx0XHR1c2VXaWR0aFRvU2NhbGU6IHRoaXMudXNlV2lkdGhUb1NjYWxlICE9PSB1bmRlZmluZWQsXG5cdFx0XHR2ZXJib3NpdHk6IHRoaXMudmVyYm9zaXR5LFxuXHRcdFx0em9vbUZhY3RvcjogdGhpcy56b29tRmFjdG9yXG5cdFx0fTtcblx0XHRpZiAoIXRoaXMuZm9ybUdyb3VwIHx8ICEodGhpcy5wYXJlbnQgfHwgdGhpcy5hbmNob3IpKSByZXR1cm47XG5cdFx0dGhpcy5taW5pbWFwID0gdGhpcy5wYW5lbFxuXHRcdFx0PyBHLlBBTkVMTUFQLmdldCh0aGlzLnBhbmVsKT8uY3JlYXRlTWluaW1hcChwKVxuXHRcdFx0OiBGbW0uY3JlYXRlTWluaW1hcChwLCB0aGlzLnBhcmVudCwgbmV3IEVsZW1lbnRGYWN0b3J5KGVmUGFyZW50KSk7XG5cdFx0dGhpcy5wcmV2aW91c0tleSA9IHRoaXMua2V5O1xuXHRcdHRoaXMubmdPbkNoYW5nZXMoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyB0YWtlU25hcHNob3QoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubWluaW1hcD8udGFrZVNuYXBzaG90KCkgfHwgZmFsc2U7XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBQIEEgTiBFIExcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiAnZm1tLW5nLXBhbmVsJywgdGVtcGxhdGU6ICcnIH0pXG5leHBvcnQgY2xhc3MgRm1tTmdQYW5lbCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0LCBQYXJ0aWFsPEZtbVBhbmVsPiB7XG5cdEBJbnB1dCgpIHB1YmxpYyByZWFkb25seSBkZXRhaWxQYXJlbnQ/OiBIVE1MRGl2RWxlbWVudDtcblx0QElucHV0KCkgcHVibGljIHJlYWRvbmx5IHZlcnRpY2FsID0gZmFsc2U7XG5cblx0cHVibGljIHJlYWRvbmx5IGVmOiBGbW1FbGVtZW50RmFjdG9yeTtcblx0cHJpdmF0ZSBtaW5pbWFwUGFuZWw/OiBGbW1QYW5lbDtcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBob3N0UmVmOiBFbGVtZW50UmVmKSB7XG5cdFx0dGhpcy5lZiA9IG5ldyBFbGVtZW50RmFjdG9yeShob3N0UmVmLm5hdGl2ZUVsZW1lbnQgYXMgRWxlbWVudCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubWluaW1hcFBhbmVsKSB0aGlzLm1pbmltYXBQYW5lbC5kZXN0cnVjdG9yKCk7XG5cdFx0Ry5QQU5FTE1BUC5kZWxldGUodGhpcyk7XG5cdFx0dGhpcy5taW5pbWFwUGFuZWwgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG5cdFx0Y29uc3QgaG9zdCA9IHRoaXMuaG9zdFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxEaXZFbGVtZW50O1xuXHRcdGNvbnN0IHZlcnRpY2FsID0gdGhpcy52ZXJ0aWNhbCAhPT0gdW5kZWZpbmVkO1xuXHRcdHRoaXMubWluaW1hcFBhbmVsID0gRm1tLmNyZWF0ZVBhbmVsKGhvc3QsIHRoaXMuZGV0YWlsUGFyZW50LCB2ZXJ0aWNhbCwgdGhpcy5lZik7XG5cdFx0Ry5QQU5FTE1BUC5zZXQodGhpcywgdGhpcy5taW5pbWFwUGFuZWwpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGRlc3Ryb3lEZXRhY2hlZCgpOiB2b2lkIHtcblx0XHRyZXR1cm4gdGhpcy5taW5pbWFwUGFuZWw/LmRlc3Ryb3lEZXRhY2hlZCgpO1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRGIE0gTSBOIEcgTSBPIEQgVSBMIEVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQE5nTW9kdWxlKHsgZGVjbGFyYXRpb25zOiBbRm1tTmdNaW5pbWFwLCBGbW1OZ1BhbmVsXSwgZXhwb3J0czogW0ZtbU5nTWluaW1hcCwgRm1tTmdQYW5lbF0gfSlcbmV4cG9ydCBjbGFzcyBGbW1OZ01vZHVsZSB7fVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0RiBNIE0gTiBHIE4gQSBNIEUgTCBFIFMgUyBDIE8gTiBUIFIgTyBMIFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHR5cGUgRm1tTmdOYW1lbGVzc0NvbnRyb2xzID0gUmVjb3JkPHN0cmluZywgQWJzdHJhY3RDb250cm9sPjtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cdFAgUiBJIFYgQSBUIEVcdD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEUgTCBFIE0gRSBOIFQgRiBBIEMgVCBPIFIgWVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBFbGVtZW50RmFjdG9yeSBpbXBsZW1lbnRzIEZtbUVsZW1lbnRGYWN0b3J5IHtcblx0cHJpdmF0ZSByZWFkb25seSBuZ0NvbnRlbnRBdHRyaWJ1dGU6IHN0cmluZztcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IocDogRWxlbWVudCkge1xuXHRcdGxldCBuZ0NvbnRlbnRBdHRyaWJ1dGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDsgLy8gc2V0IGF0dHJpYnV0ZSBvbiBlbGVtZW50cyB0byB1c2Ugbm9uLWdsb2JhbCBDU1Ncblx0XHRpZiAoRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTmFtZXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Zm9yICg7IHAgJiYgIW5nQ29udGVudEF0dHJpYnV0ZTsgcCA9IHAucGFyZW50RWxlbWVudCBhcyBFbGVtZW50KSB7XG5cdFx0XHRcdGNvbnN0IG5hbWVzID0gcC5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXHRcdFx0XHRuZ0NvbnRlbnRBdHRyaWJ1dGUgPSBuYW1lcy5maW5kKChhOiBzdHJpbmcpID0+IGEuc3RhcnRzV2l0aCgnX25nY29udGVudC0nKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoOyBwICYmICFuZ0NvbnRlbnRBdHRyaWJ1dGU7IHAgPSBwLnBhcmVudEVsZW1lbnQgYXMgRWxlbWVudCkge1xuXHRcdFx0XHRjb25zdCBuYW1lcyA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChwLmF0dHJpYnV0ZXMsIChhOiBBdHRyKSA9PiBhLm5hbWUpIGFzIHN0cmluZ1tdO1xuXHRcdFx0XHRuZ0NvbnRlbnRBdHRyaWJ1dGUgPSBuYW1lcy5maW5kKChhOiBzdHJpbmcpID0+IGEuc3RhcnRzV2l0aCgnX25nY29udGVudC0nKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghbmdDb250ZW50QXR0cmlidXRlKSB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm1NaW5pbWFwOiBtaXNzaW5nIF9uZ2NvbnRlbnQtIGF0dHJpYnV0ZScpO1xuXHRcdHRoaXMubmdDb250ZW50QXR0cmlidXRlID0gbmdDb250ZW50QXR0cmlidXRlO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNyZWF0ZUVsZW1lbnQodGFnTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cdFx0ZS5zZXRBdHRyaWJ1dGUodGhpcy5uZ0NvbnRlbnRBdHRyaWJ1dGUsICcnKTtcblx0XHRyZXR1cm4gZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJOiBzdHJpbmcsIHF1YWxpZmllZE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcblx0XHRlLnNldEF0dHJpYnV0ZSh0aGlzLm5nQ29udGVudEF0dHJpYnV0ZSwgJycpO1xuXHRcdHJldHVybiBlO1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRHXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IEc6IHtcblx0UEFORUxNQVA6IFdlYWtNYXA8Rm1tTmdQYW5lbCwgRm1tUGFuZWw+O1xufSA9IHtcblx0UEFORUxNQVA6IG5ldyBXZWFrTWFwKClcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRTIFQgTyBSIEUgSSBUIEUgTVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBTdG9yZUl0ZW0gaW1wbGVtZW50cyBGbW1TdG9yZUl0ZW0ge1xuXHRwcml2YXRlIHJlYWRvbmx5IHNlPzogSFRNTFNlbGVjdEVsZW1lbnQ7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKFxuXHRcdGU6IEhUTUxFbGVtZW50LFxuXHRcdGxpc3RlbmVyOiBFdmVudExpc3RlbmVyLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgY29udHJvbDogQWJzdHJhY3RDb250cm9sXG5cdCkge1xuXHRcdHRoaXMuc2UgPSBlLnRhZ05hbWUgPT09ICdTRUxFQ1QnID8gKGUgYXMgSFRNTFNlbGVjdEVsZW1lbnQpIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblx0XHRzdWJzY3JpcHRpb24uYWRkKHRoaXMuY29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZShsaXN0ZW5lcikpO1xuXHRcdHN1YnNjcmlwdGlvbi5hZGQodGhpcy5jb250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUobGlzdGVuZXIpKTtcblx0XHR0aGlzLmRlc3RydWN0b3IgPSAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBkZXN0cnVjdG9yKCk6IHZvaWQge1xuXHRcdC8vIGZ1bmN0aW9uIGJvZHkgb3ZlcndyaXR0ZW4gaW4gY29uc3RydWN0b3Jcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRFcnJvcihoYXNWYWx1ZTogYm9vbGVhbik6IHN0cmluZyB7XG5cdFx0Y29uc3QgZXJyb3JzID0gdGhpcy5jb250cm9sLmVycm9ycztcblx0XHRsZXQga2V5cyA9IGVycm9ycyA/IE9iamVjdC5rZXlzKGVycm9ycykgOiBbXTtcblx0XHRpZiAoaGFzVmFsdWUgJiYga2V5cy5sZW5ndGgpIGtleXMgPSBrZXlzLmZpbHRlcihrID0+IGsgIT09ICdyZXF1aXJlZCcpOyAvLyBJRTExIFNFTEVDVCBidWdcblx0XHRyZXR1cm4ga2V5cy5sZW5ndGggPyBrZXlzLmpvaW4oJywnKSA6ICcnO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5uYW1lO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldFZhbHVlKCkge1xuXHRcdGNvbnN0IHZhbHVlID0gdGhpcy5jb250cm9sLnZhbHVlIGFzIHVua25vd247XG5cdFx0aWYgKCF2YWx1ZSkgcmV0dXJuIHVuZGVmaW5lZDtcblx0XHRpZiAoIXRoaXMuc2UpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoIXRoaXMuc2UubXVsdGlwbGUpIHJldHVybiBbdGhpcy5zZS5zZWxlY3RlZEluZGV4XTtcblx0XHRjb25zdCBpbmRleGVzOiBudW1iZXJbXSA9IFtdOyAvLyBGb3JtQ29udHJvbCBmb3IgbXVsdGlzZWxlY3QgZG9lc24ndCB1cGRhdGUgd2hlbiBzZWxlY3RlZCBvcHRpb24gaXMgcmVtb3ZlZCBkeW5hbWljYWxseVxuXHRcdEFycmF5LmZyb20odGhpcy5zZS5vcHRpb25zKS5mb3JFYWNoKChvLCBpKSA9PiBvLnNlbGVjdGVkICYmIGluZGV4ZXMucHVzaChpKSk7XG5cdFx0cmV0dXJuIGluZGV4ZXM7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgaXNEaXNhYmxlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5jb250cm9sLmRpc2FibGVkO1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRTIFQgTyBSIEVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgU3RvcmUgaW1wbGVtZW50cyBGbW1TdG9yZSB7XG5cdHB1YmxpYyBuYW1lbGVzc0NvbnRyb2xzOiBGbW1OZ05hbWVsZXNzQ29udHJvbHMgPSB7fTtcblx0cHJpdmF0ZSByZWFkb25seSBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjtcblx0cHJpdmF0ZSByZWFkb25seSBtaW5pbWFwczogU2V0PEZtbU1pbmltYXA+ID0gbmV3IFNldCgpO1xuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZvcm1Hcm91cDogRm9ybUdyb3VwKSB7XG5cdFx0dGhpcy5saXN0ZW5lciA9ICgpID0+IHRoaXMubWluaW1hcHMuZm9yRWFjaChtID0+IG0udGFrZVNuYXBzaG90KCkpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNyZWF0ZVN0b3JlSXRlbShfOiBGbW1Gb3JtLCBlOiBGbW1Gb3JtRWxlbWVudEhUTUwpOiBGbW1TdG9yZUl0ZW0gfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IG5hbWUgPSBlLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IGUuaWQ7XG5cdFx0Y29uc3QgY29udHJvbCA9IG5hbWUgPyB0aGlzLm5hbWVsZXNzQ29udHJvbHNbbmFtZV0gOiB1bmRlZmluZWQ7XG5cdFx0aWYgKGNvbnRyb2wpIHJldHVybiBuZXcgU3RvcmVJdGVtKGUsIHRoaXMubGlzdGVuZXIsIG5hbWUsIGNvbnRyb2wpO1xuXHRcdGxldCBpbkZvcm1BcnJheSA9IGZhbHNlO1xuXHRcdGxldCBwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0bGV0IGZjID0gZTtcblx0XHRmb3IgKDsgZmMgJiYgZmMudGFnTmFtZSAhPT0gJ0ZPUk0nOyBmYyA9IGZjLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpIHtcblx0XHRcdHBhdGggPSBmYy5nZXRBdHRyaWJ1dGUoJ2Zvcm1jb250cm9sbmFtZScpIHx8IGZjLmRhdGFzZXQuZm9ybWNvbnRyb2xuYW1lO1xuXHRcdFx0aWYgKHBhdGgpIGJyZWFrO1xuXHRcdFx0aW5Gb3JtQXJyYXkgPSBmYy5kYXRhc2V0LmZtbWluZm9ybWFycmF5ICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRpZiAoaW5Gb3JtQXJyYXkpIGJyZWFrO1xuXHRcdH1cblx0XHRmb3IgKGxldCBwID0gZmM/LnBhcmVudEVsZW1lbnQ7IHAgJiYgcC50YWdOYW1lICE9PSAnRk9STSc7IHAgPSBwLnBhcmVudEVsZW1lbnQpIHtcblx0XHRcdGxldCBwTmFtZSA9IHAuZ2V0QXR0cmlidXRlKCdmb3JtYXJyYXluYW1lJyk7XG5cdFx0XHRpZiAoIXBOYW1lKSB7XG5cdFx0XHRcdHBOYW1lID0gcC5nZXRBdHRyaWJ1dGUoJ2Zvcm1ncm91cG5hbWUnKTtcblx0XHRcdFx0aWYgKHBOYW1lKSBwYXRoID0gcE5hbWUgKyAnLicgKyBwYXRoO1xuXHRcdFx0fSBlbHNlIGlmICghaW5Gb3JtQXJyYXkpIHtcblx0XHRcdFx0cGF0aCA9IHBOYW1lICsgJy4nICsgcGF0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGluRm9ybUFycmF5ID0gZmFsc2U7XG5cdFx0XHRcdHBhdGggPSBwTmFtZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29uc3QgYWMgPSBwYXRoPyB0aGlzLmZvcm1Hcm91cC5nZXQocGF0aCk6IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gcGF0aCAmJiBhYyA/IG5ldyBTdG9yZUl0ZW0oZSwgdGhpcy5saXN0ZW5lciwgcGF0aCwgYWMpIDogdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldEVycm9yKF86IEZtbUZvcm0sIGl0ZW06IFN0b3JlSXRlbSwgaGFzVmFsdWU6IGJvb2xlYW4pIHtcblx0XHRyZXR1cm4gaXRlbS5nZXRFcnJvcihoYXNWYWx1ZSk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZ2V0TmFtZShfOiBGbW1Gb3JtLCBpdGVtOiBTdG9yZUl0ZW0pOiBzdHJpbmcge1xuXHRcdHJldHVybiBpdGVtLmdldE5hbWUoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRWYWx1ZShfOiBGbW1Gb3JtLCBpdGVtOiBTdG9yZUl0ZW0pIHtcblx0XHRyZXR1cm4gaXRlbS5nZXRWYWx1ZSgpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGlzRGlzYWJsZWQoXzogRm1tRm9ybSwgaXRlbTogU3RvcmVJdGVtKSB7XG5cdFx0cmV0dXJuIGl0ZW0uaXNEaXNhYmxlZCgpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5vdGlmeU1pbmltYXBPblVwZGF0ZShtaW5pbWFwOiBGbW1NaW5pbWFwLCBvbjogYm9vbGVhbikge1xuXHRcdGlmIChvbikgdGhpcy5taW5pbWFwcy5hZGQobWluaW1hcCk7XG5cdFx0ZWxzZSB0aGlzLm1pbmltYXBzLmRlbGV0ZShtaW5pbWFwKTtcblx0fVxufVxuIl19