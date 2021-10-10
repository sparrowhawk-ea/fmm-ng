import { Component, ElementRef, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Fmm, FmmFormHTML } from '@eafmm/core';
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
        var _a;
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
            this.minimap = (_a = G.PANELMAP.get(this.panel)) === null || _a === void 0 ? void 0 : _a.createMinimap(p);
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
    ordinal: [{ type: Input }],
    page: [{ type: Input }],
    panel: [{ type: Input }],
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
    minimapsCount: [{ type: Input }],
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
        for (let p = fc === null || fc === void 0 ? void 0 : fc.parentElement; path && p && p.tagName !== 'FORM'; p = p.parentElement) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm1tLW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZm1tLW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBZ0MsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUNOLEdBQUcsRUFJSCxXQUFXLEVBU1gsTUFBTSxhQUFhLENBQUM7QUFFckIsb0lBQW9JO0FBQ3BJLCtCQUErQjtBQUMvQixvSUFBb0k7QUFFcEksTUFBTSxPQUFPLFlBQVk7SUF5QnhCLGdJQUFnSTtJQUNoSSxZQUFtQixPQUFtQjtRQWJ0QixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBR1gsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUVKLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBZ0IsQ0FBQztRQVNuRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsYUFBd0IsQ0FBQztRQUM1QyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLE1BQU07WUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQTRCLENBQUM7UUFDakYsSUFBSSxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUF1QixDQUFDO0lBQ3JDLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsVUFBVTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELGdJQUFnSTtJQUN6SCxXQUFXO1FB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SUFFRCxnSUFBZ0k7SUFDekgsT0FBTyxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsUUFBUSxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQzFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsVUFBVSxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQzVDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgscUJBQXFCLENBQUMsT0FBbUIsRUFBRSxFQUFXO1FBQzVELElBQUksRUFBRTtZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nTW9kdWxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuXHRGbW0sXG5cdEZtbUVsZW1lbnRGYWN0b3J5LFxuXHRGbW1Gb3JtLFxuXHRGbW1Gb3JtRWxlbWVudEhUTUwsXG5cdEZtbUZvcm1IVE1MLFxuXHRGbW1GcmFtZXdvcmssXG5cdEZtbU1hcFN0cmluZyxcblx0Rm1tTWluaW1hcCxcblx0Rm1tTWluaW1hcENyZWF0ZVBhcmFtLFxuXHRGbW1QYW5lbCxcblx0Rm1tU25hcHNob3RzLFxuXHRGbW1TdG9yZSxcblx0Rm1tU3RvcmVJdGVtXG59IGZyb20gJ0BlYWZtbS9jb3JlJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBNIEkgTiBJIE0gQSBQXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogJ2ZtbS1uZy1taW5pbWFwJywgdGVtcGxhdGU6ICcnIH0pXG5leHBvcnQgY2xhc3MgRm1tTmdNaW5pbWFwIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUGFydGlhbDxGbW1NaW5pbWFwPiB7XG5cdEBJbnB1dCgpIHB1YmxpYyBhZ2dyZWdhdGVMYWJlbHM/OiBGbW1NYXBTdHJpbmc7XG5cdEBJbnB1dCgpIHB1YmxpYyBhbmNob3I/OiBIVE1MRGl2RWxlbWVudDtcblx0QElucHV0KCkgcHVibGljIGN1c3RvbUVsZW1lbnRJZHM/OiBzdHJpbmdbXTtcblx0QElucHV0KCkgcHVibGljIGRlYm91bmNlTXNlYz86IG51bWJlcjtcblx0QElucHV0KCkgcHVibGljIGR5bmFtaWNMYWJlbHM/OiBzdHJpbmdbXTtcblx0QElucHV0KCkgcHVibGljIGZvcm1Hcm91cD86IEZvcm1Hcm91cDtcblx0QElucHV0KCkgcHVibGljIGZyYW1ld29yaz86IEZtbUZyYW1ld29yaztcblx0QElucHV0KCkgcHVibGljIGtleT86IHN0cmluZztcblx0QElucHV0KCkgcHVibGljIG5hbWVsZXNzQ29udHJvbHM/OiBGbW1OZ05hbWVsZXNzQ29udHJvbHM7XG5cdEBJbnB1dCgpIHB1YmxpYyBvcmRpbmFsPzogbnVtYmVyO1xuXHRASW5wdXQoKSBwdWJsaWMgcGFnZT86IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgcGFuZWw/OiBGbW1OZ1BhbmVsO1xuXHRASW5wdXQoKSBwdWJsaWMgdGl0bGUgPSAnJztcblx0QElucHV0KCkgcHVibGljIHVzZVBhbmVsRGV0YWlsPzogYm9vbGVhbjtcblx0QElucHV0KCkgcHVibGljIHVzZVdpZHRoVG9TY2FsZT86IGJvb2xlYW47XG5cdEBJbnB1dCgpIHB1YmxpYyB2ZXJib3NpdHkgPSAwO1xuXHRASW5wdXQoKSBwdWJsaWMgem9vbUZhY3Rvcj86IG51bWJlcjtcblx0QE91dHB1dCgpIHB1YmxpYyByZWFkb25seSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPEZtbVNuYXBzaG90cz4oKTtcblx0cHJpdmF0ZSByZWFkb25seSBmb3JtOiBIVE1MRm9ybUVsZW1lbnQ7XG5cblx0cHJpdmF0ZSBtaW5pbWFwPzogRm1tTWluaW1hcDtcblx0cHJpdmF0ZSBwcmV2aW91c0tleT86IHN0cmluZztcblx0cHJpdmF0ZSBzdG9yZT86IFN0b3JlO1xuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihob3N0UmVmOiBFbGVtZW50UmVmKSB7XG5cdFx0bGV0IGZvcm0gPSBob3N0UmVmLm5hdGl2ZUVsZW1lbnQgYXMgRWxlbWVudDtcblx0XHR3aGlsZSAoZm9ybSAmJiBmb3JtLnRhZ05hbWUgIT09ICdGT1JNJykgZm9ybSA9IGZvcm0ucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblx0XHRpZiAoIWZvcm0pIHRocm93IG5ldyBFcnJvcignRm1tTmdNaW5pbWFwIG5vdCBjcmVhdGVkOiBjb21wb25lbnQgbXVzdCBiZSB1c2VkIHdpdGhpbiBGT1JNIHRhZycpO1xuXHRcdHRoaXMuZm9ybSA9IGZvcm0gYXMgSFRNTEZvcm1FbGVtZW50O1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGRlc3RydWN0b3IoKTogdm9pZCB7XG5cdFx0aWYgKCF0aGlzLm1pbmltYXApIHJldHVybjtcblx0XHR0aGlzLm1pbmltYXAuZGVzdHJ1Y3RvcigpO1xuXHRcdHRoaXMubWluaW1hcCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMubWluaW1hcCkgcmV0dXJuO1xuXHRcdGlmICh0aGlzLmtleSAhPT0gdGhpcy5wcmV2aW91c0tleSkge1xuXHRcdFx0dGhpcy5taW5pbWFwLmRlc3RydWN0b3IoKTtcblx0XHRcdHRoaXMubmdPbkluaXQoKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RvcmUpIHtcblx0XHRcdHRoaXMuc3RvcmUubmFtZWxlc3NDb250cm9scyA9IHRoaXMubmFtZWxlc3NDb250cm9scyB8fCB7fTtcblx0XHRcdHRoaXMubWluaW1hcC5jb21wb3NlKHRoaXMuY3VzdG9tRWxlbWVudElkcyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLm1pbmltYXApIHRoaXMubWluaW1hcC5kZXRhY2goKTtcblx0XHR0aGlzLnN0b3JlID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5mb3JtR3JvdXApIHRocm93IG5ldyBFcnJvcignRm1tTmdNaW5pbWFwIG5vdCBjcmVhdGVkOiBmb3JtR3JvdXAgcmVxdWlyZWQnKTtcblx0XHRpZiAoIXRoaXMuc3RvcmUpIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUodGhpcy5mb3JtR3JvdXApO1xuXHRcdGNvbnN0IHA6IEZtbU1pbmltYXBDcmVhdGVQYXJhbSA9IHtcblx0XHRcdGFnZ3JlZ2F0ZUxhYmVsczogdGhpcy5hZ2dyZWdhdGVMYWJlbHMsXG5cdFx0XHRhbmNob3I6IHRoaXMuYW5jaG9yLFxuXHRcdFx0ZGVib3VuY2VNc2VjOiB0aGlzLmRlYm91bmNlTXNlYyxcblx0XHRcdGR5bmFtaWNMYWJlbHM6IHRoaXMuZHluYW1pY0xhYmVscyxcblx0XHRcdGZvcm06IG5ldyBGbW1Gb3JtSFRNTCh0aGlzLmZvcm0sIHRoaXMucGFnZSksXG5cdFx0XHRmcmFtZXdvcms6IHRoaXMuZnJhbWV3b3JrLFxuXHRcdFx0b25VcGRhdGU6IChzbmFwc2hvdDogRm1tU25hcHNob3RzKSA9PiB0aGlzLnVwZGF0ZS5uZXh0KHNuYXBzaG90KSxcblx0XHRcdG9yZGluYWw6IHRoaXMub3JkaW5hbCxcblx0XHRcdHN0b3JlOiB0aGlzLnN0b3JlLFxuXHRcdFx0dGl0bGU6IHRoaXMudGl0bGUsXG5cdFx0XHR1c2VQYW5lbERldGFpbDogdGhpcy51c2VQYW5lbERldGFpbCAhPT0gdW5kZWZpbmVkLFxuXHRcdFx0dXNlV2lkdGhUb1NjYWxlOiB0aGlzLnVzZVdpZHRoVG9TY2FsZSAhPT0gdW5kZWZpbmVkLFxuXHRcdFx0dmVyYm9zaXR5OiB0aGlzLnZlcmJvc2l0eSxcblx0XHRcdHpvb21GYWN0b3I6IHRoaXMuem9vbUZhY3RvclxuXHRcdH07XG5cdFx0aWYgKHRoaXMucGFuZWwpIHtcblx0XHRcdHRoaXMubWluaW1hcCA9IEcuUEFORUxNQVAuZ2V0KHRoaXMucGFuZWwpPy5jcmVhdGVNaW5pbWFwKHApO1xuXHRcdH0gZWxzZSBpZiAocC5hbmNob3IpIHtcblx0XHRcdHRoaXMubWluaW1hcCA9IEZtbS5jcmVhdGVNaW5pbWFwKHAsIG5ldyBFbGVtZW50RmFjdG9yeShwLmFuY2hvciBhcyBFbGVtZW50KSk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5taW5pbWFwKSB0aHJvdyBuZXcgRXJyb3IoJ0ZtbU5nTWluaW1hcCBub3QgY3JlYXRlZDogcGFuZWwsIHBhcmVudCwgb3IgYW5jaG9yIHJlcXVpcmVkJyk7XG5cdFx0dGhpcy5wcmV2aW91c0tleSA9IHRoaXMua2V5O1xuXHRcdHRoaXMubmdPbkNoYW5nZXMoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyB0YWtlU25hcHNob3QoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubWluaW1hcD8udGFrZVNuYXBzaG90KCkgfHwgZmFsc2U7XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBQIEEgTiBFIExcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQENvbXBvbmVudCh7IHNlbGVjdG9yOiAnZm1tLW5nLXBhbmVsJywgdGVtcGxhdGU6ICcnIH0pXG5leHBvcnQgY2xhc3MgRm1tTmdQYW5lbCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0LCBQYXJ0aWFsPEZtbVBhbmVsPiB7XG5cdEBJbnB1dCgpIHB1YmxpYyByZWFkb25seSBkZXRhaWxQYXJlbnQ/OiBIVE1MRGl2RWxlbWVudDtcblx0QElucHV0KCkgcHVibGljIHJlYWRvbmx5IG1pbmltYXBzQ291bnQgPSAxO1xuXHRASW5wdXQoKSBwdWJsaWMgcmVhZG9ubHkgdmVydGljYWw/OiBib29sZWFuO1xuXG5cdHB1YmxpYyByZWFkb25seSBlZjogRm1tRWxlbWVudEZhY3Rvcnk7XG5cdHByaXZhdGUgbWluaW1hcFBhbmVsPzogRm1tUGFuZWw7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaG9zdFJlZjogRWxlbWVudFJlZikge1xuXHRcdHRoaXMuZWYgPSBuZXcgRWxlbWVudEZhY3RvcnkoaG9zdFJlZi5uYXRpdmVFbGVtZW50IGFzIEVsZW1lbnQpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLm1pbmltYXBQYW5lbCkgdGhpcy5taW5pbWFwUGFuZWwuZGVzdHJ1Y3RvcigpO1xuXHRcdEcuUEFORUxNQVAuZGVsZXRlKHRoaXMpO1xuXHRcdHRoaXMubWluaW1hcFBhbmVsID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuXHRcdGNvbnN0IGhvc3QgPSB0aGlzLmhvc3RSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRGl2RWxlbWVudDtcblx0XHRjb25zdCB2ZXJ0aWNhbCA9IHRoaXMudmVydGljYWwgIT09IHVuZGVmaW5lZDtcblx0XHR0aGlzLm1pbmltYXBQYW5lbCA9IEZtbS5jcmVhdGVQYW5lbChob3N0LCB0aGlzLm1pbmltYXBzQ291bnQsIHRoaXMuZGV0YWlsUGFyZW50LCB2ZXJ0aWNhbCwgdGhpcy5lZik7XG5cdFx0Ry5QQU5FTE1BUC5zZXQodGhpcywgdGhpcy5taW5pbWFwUGFuZWwpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGRlc3Ryb3lEZXRhY2hlZCgpOiB2b2lkIHtcblx0XHRyZXR1cm4gdGhpcy5taW5pbWFwUGFuZWw/LmRlc3Ryb3lEZXRhY2hlZCgpO1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRGIE0gTSBOIEcgTSBPIEQgVSBMIEVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQE5nTW9kdWxlKHsgZGVjbGFyYXRpb25zOiBbRm1tTmdNaW5pbWFwLCBGbW1OZ1BhbmVsXSwgZXhwb3J0czogW0ZtbU5nTWluaW1hcCwgRm1tTmdQYW5lbF0gfSlcbmV4cG9ydCBjbGFzcyBGbW1OZ01vZHVsZSB7IH1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBOIEEgTSBFIEwgRSBTIFMgQyBPIE4gVCBSIE8gTCBTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCB0eXBlIEZtbU5nTmFtZWxlc3NDb250cm9scyA9IFJlY29yZDxzdHJpbmcsIEFic3RyYWN0Q29udHJvbD47XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHRQIFIgSSBWIEEgVCBFXHQ9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRFIEwgRSBNIEUgTiBUIEYgQSBDIFQgTyBSIFlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgRWxlbWVudEZhY3RvcnkgaW1wbGVtZW50cyBGbW1FbGVtZW50RmFjdG9yeSB7XG5cdHByaXZhdGUgcmVhZG9ubHkgbmdDb250ZW50QXR0cmlidXRlOiBzdHJpbmc7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKHA6IEVsZW1lbnQpIHtcblx0XHRsZXQgbmdDb250ZW50QXR0cmlidXRlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7IC8vIHNldCBhdHRyaWJ1dGUgb24gZWxlbWVudHMgdG8gdXNlIG5vbi1nbG9iYWwgQ1NTXG5cdFx0aWYgKEVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZU5hbWVzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGZvciAoOyBwICYmICFuZ0NvbnRlbnRBdHRyaWJ1dGU7IHAgPSBwLnBhcmVudEVsZW1lbnQgYXMgRWxlbWVudCkge1xuXHRcdFx0XHRjb25zdCBuYW1lcyA9IHAuZ2V0QXR0cmlidXRlTmFtZXMoKTtcblx0XHRcdFx0bmdDb250ZW50QXR0cmlidXRlID0gbmFtZXMuZmluZCgoYTogc3RyaW5nKSA9PiBhLnN0YXJ0c1dpdGgoJ19uZ2NvbnRlbnQtJykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKDsgcCAmJiAhbmdDb250ZW50QXR0cmlidXRlOyBwID0gcC5wYXJlbnRFbGVtZW50IGFzIEVsZW1lbnQpIHtcblx0XHRcdFx0Y29uc3QgbmFtZXMgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwocC5hdHRyaWJ1dGVzLCAoYTogQXR0cikgPT4gYS5uYW1lKSBhcyBzdHJpbmdbXTtcblx0XHRcdFx0bmdDb250ZW50QXR0cmlidXRlID0gbmFtZXMuZmluZCgoYTogc3RyaW5nKSA9PiBhLnN0YXJ0c1dpdGgoJ19uZ2NvbnRlbnQtJykpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIW5nQ29udGVudEF0dHJpYnV0ZSkgdGhyb3cgbmV3IEVycm9yKCdGb3JtTWluaW1hcDogbWlzc2luZyBfbmdjb250ZW50LSBhdHRyaWJ1dGUnKTtcblx0XHR0aGlzLm5nQ29udGVudEF0dHJpYnV0ZSA9IG5nQ29udGVudEF0dHJpYnV0ZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjcmVhdGVFbGVtZW50KHRhZ05hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXHRcdGUuc2V0QXR0cmlidXRlKHRoaXMubmdDb250ZW50QXR0cmlidXRlLCAnJyk7XG5cdFx0cmV0dXJuIGU7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSTogc3RyaW5nLCBxdWFsaWZpZWROYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSk7XG5cdFx0ZS5zZXRBdHRyaWJ1dGUodGhpcy5uZ0NvbnRlbnRBdHRyaWJ1dGUsICcnKTtcblx0XHRyZXR1cm4gZTtcblx0fVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0R1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBHOiB7XG5cdFBBTkVMTUFQOiBXZWFrTWFwPEZtbU5nUGFuZWwsIEZtbVBhbmVsPjtcbn0gPSB7XG5cdFBBTkVMTUFQOiBuZXcgV2Vha01hcCgpXG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0UyBUIE8gUiBFIEkgVCBFIE1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgU3RvcmVJdGVtIGltcGxlbWVudHMgRm1tU3RvcmVJdGVtIHtcblx0cHJpdmF0ZSByZWFkb25seSBzZT86IEhUTUxTZWxlY3RFbGVtZW50O1xuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRlOiBIVE1MRWxlbWVudCxcblx0XHRsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcixcblx0XHRwcml2YXRlIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcblx0XHRwcml2YXRlIHJlYWRvbmx5IGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbFxuXHQpIHtcblx0XHR0aGlzLnNlID0gZS50YWdOYW1lID09PSAnU0VMRUNUJyA/IChlIGFzIEhUTUxTZWxlY3RFbGVtZW50KSA6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cdFx0c3Vic2NyaXB0aW9uLmFkZCh0aGlzLmNvbnRyb2wuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUobGlzdGVuZXIpKTtcblx0XHRzdWJzY3JpcHRpb24uYWRkKHRoaXMuY29udHJvbC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKGxpc3RlbmVyKSk7XG5cdFx0dGhpcy5kZXN0cnVjdG9yID0gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZGVzdHJ1Y3RvcigpOiB2b2lkIHtcblx0XHQvLyBmdW5jdGlvbiBib2R5IG92ZXJ3cml0dGVuIGluIGNvbnN0cnVjdG9yXG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZ2V0RXJyb3IoaGFzVmFsdWU6IGJvb2xlYW4pOiBzdHJpbmcge1xuXHRcdGNvbnN0IGVycm9ycyA9IHRoaXMuY29udHJvbC5lcnJvcnM7XG5cdFx0bGV0IGtleXMgPSBlcnJvcnMgPyBPYmplY3Qua2V5cyhlcnJvcnMpIDogW107XG5cdFx0aWYgKGhhc1ZhbHVlICYmIGtleXMubGVuZ3RoKSBrZXlzID0ga2V5cy5maWx0ZXIoayA9PiBrICE9PSAncmVxdWlyZWQnKTsgLy8gSUUxMSBTRUxFQ1QgYnVnXG5cdFx0cmV0dXJuIGtleXMubGVuZ3RoID8ga2V5cy5qb2luKCcsJykgOiAnJztcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMubmFtZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRWYWx1ZSgpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuY29udHJvbC52YWx1ZSBhcyB1bmtub3duO1xuXHRcdGlmICghdmFsdWUpIHJldHVybiB1bmRlZmluZWQ7XG5cdFx0aWYgKCF0aGlzLnNlKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKCF0aGlzLnNlLm11bHRpcGxlKSByZXR1cm4gW3RoaXMuc2Uuc2VsZWN0ZWRJbmRleF07XG5cdFx0Y29uc3QgaW5kZXhlczogbnVtYmVyW10gPSBbXTsgLy8gRm9ybUNvbnRyb2wgZm9yIG11bHRpc2VsZWN0IGRvZXNuJ3QgdXBkYXRlIHdoZW4gc2VsZWN0ZWQgb3B0aW9uIGlzIHJlbW92ZWQgZHluYW1pY2FsbHlcblx0XHRBcnJheS5mcm9tKHRoaXMuc2Uub3B0aW9ucykuZm9yRWFjaCgobywgaSkgPT4gby5zZWxlY3RlZCAmJiBpbmRleGVzLnB1c2goaSkpO1xuXHRcdHJldHVybiBpbmRleGVzO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGlzRGlzYWJsZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29udHJvbC5kaXNhYmxlZDtcblx0fVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0UyBUIE8gUiBFXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFN0b3JlIGltcGxlbWVudHMgRm1tU3RvcmUge1xuXHRwdWJsaWMgbmFtZWxlc3NDb250cm9sczogRm1tTmdOYW1lbGVzc0NvbnRyb2xzID0ge307XG5cdHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgbWluaW1hcHM6IFNldDxGbW1NaW5pbWFwPiA9IG5ldyBTZXQoKTtcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmb3JtR3JvdXA6IEZvcm1Hcm91cCkge1xuXHRcdHRoaXMubGlzdGVuZXIgPSAoKSA9PiB0aGlzLm1pbmltYXBzLmZvckVhY2gobSA9PiBtLnRha2VTbmFwc2hvdCgpKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjcmVhdGVTdG9yZUl0ZW0oXzogRm1tRm9ybSwgZTogRm1tRm9ybUVsZW1lbnRIVE1MKTogRm1tU3RvcmVJdGVtIHwgdW5kZWZpbmVkIHtcblx0XHRjb25zdCBuYW1lID0gZS5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCBlLmlkO1xuXHRcdGNvbnN0IGNvbnRyb2wgPSBuYW1lID8gdGhpcy5uYW1lbGVzc0NvbnRyb2xzW25hbWVdIDogdW5kZWZpbmVkO1xuXHRcdGlmIChjb250cm9sKSByZXR1cm4gbmV3IFN0b3JlSXRlbShlLCB0aGlzLmxpc3RlbmVyLCBuYW1lLCBjb250cm9sKTtcblx0XHRsZXQgaW5Gb3JtQXJyYXkgPSBmYWxzZTtcblx0XHRsZXQgcGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRcdGxldCBmYyA9IGU7XG5cdFx0Zm9yICg7IGZjICYmIGZjLnRhZ05hbWUgIT09ICdGT1JNJzsgZmMgPSBmYy5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50KSB7XG5cdFx0XHRwYXRoID0gZmMuZ2V0QXR0cmlidXRlKCdmb3JtY29udHJvbG5hbWUnKSB8fCBmYy5kYXRhc2V0LmZvcm1jb250cm9sbmFtZTtcblx0XHRcdGlmIChwYXRoKSBicmVhaztcblx0XHRcdGluRm9ybUFycmF5ID0gZmMuZGF0YXNldC5mbW1pbmZvcm1hcnJheSAhPT0gdW5kZWZpbmVkO1xuXHRcdFx0aWYgKGluRm9ybUFycmF5KSBicmVhaztcblx0XHR9XG5cdFx0Zm9yIChsZXQgcCA9IGZjPy5wYXJlbnRFbGVtZW50OyBwYXRoICYmIHAgJiYgcC50YWdOYW1lICE9PSAnRk9STSc7IHAgPSBwLnBhcmVudEVsZW1lbnQpIHtcblx0XHRcdGxldCBwTmFtZSA9IHAuZ2V0QXR0cmlidXRlKCdmb3JtYXJyYXluYW1lJyk7XG5cdFx0XHRpZiAoIXBOYW1lKSB7XG5cdFx0XHRcdHBOYW1lID0gcC5nZXRBdHRyaWJ1dGUoJ2Zvcm1ncm91cG5hbWUnKTtcblx0XHRcdFx0aWYgKHBOYW1lKSBwYXRoID0gcE5hbWUgKyAnLicgKyBwYXRoO1xuXHRcdFx0fSBlbHNlIGlmICghaW5Gb3JtQXJyYXkpIHtcblx0XHRcdFx0cGF0aCA9IHBOYW1lICsgJy4nICsgcGF0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGluRm9ybUFycmF5ID0gZmFsc2U7XG5cdFx0XHRcdHBhdGggPSBwTmFtZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29uc3QgYWMgPSBwYXRoID8gdGhpcy5mb3JtR3JvdXAuZ2V0KHBhdGgpIDogdW5kZWZpbmVkO1xuXHRcdHJldHVybiBwYXRoICYmIGFjID8gbmV3IFN0b3JlSXRlbShlLCB0aGlzLmxpc3RlbmVyLCBwYXRoLCBhYykgOiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZ2V0RXJyb3IoXzogRm1tRm9ybSwgaXRlbTogU3RvcmVJdGVtLCBoYXNWYWx1ZTogYm9vbGVhbikge1xuXHRcdHJldHVybiBpdGVtLmdldEVycm9yKGhhc1ZhbHVlKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXROYW1lKF86IEZtbUZvcm0sIGl0ZW06IFN0b3JlSXRlbSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGl0ZW0uZ2V0TmFtZSgpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldFZhbHVlKF86IEZtbUZvcm0sIGl0ZW06IFN0b3JlSXRlbSkge1xuXHRcdHJldHVybiBpdGVtLmdldFZhbHVlKCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgaXNEaXNhYmxlZChfOiBGbW1Gb3JtLCBpdGVtOiBTdG9yZUl0ZW0pIHtcblx0XHRyZXR1cm4gaXRlbS5pc0Rpc2FibGVkKCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbm90aWZ5TWluaW1hcE9uVXBkYXRlKG1pbmltYXA6IEZtbU1pbmltYXAsIG9uOiBib29sZWFuKSB7XG5cdFx0aWYgKG9uKSB0aGlzLm1pbmltYXBzLmFkZChtaW5pbWFwKTtcblx0XHRlbHNlIHRoaXMubWluaW1hcHMuZGVsZXRlKG1pbmltYXApO1xuXHR9XG59XG4iXX0=