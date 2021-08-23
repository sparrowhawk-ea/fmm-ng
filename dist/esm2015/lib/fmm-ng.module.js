import { Component, ElementRef, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Fmm, FmmFormHTML } from '@eafmm/core';
// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
export class FmmNgMinimap {
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
        else {
            this.store.namelessControls = this.namelessControls;
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
        this.minimap = this.panel
            ? (_a = G.PANELMAP.get(this.panel)) === null || _a === void 0 ? void 0 : _a.createMinimap(p)
            : Fmm.createMinimap(p, this.parent, new ElementFactory(this.parent || this.anchor));
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
        this.ef = new ElementFactory(hostRef.nativeElement);
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
        let ngContentAttribute; // set attribute on elements to use non-global CSS
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
        const ac = this.formGroup.get(path);
        return ac ? new StoreItem(e, this.listener, path, ac) : undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm1tLW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZm1tLW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBZ0MsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUNOLEdBQUcsRUFJSCxXQUFXLEVBU1gsTUFBTSxhQUFhLENBQUM7QUFFckIsb0lBQW9JO0FBQ3BJLCtCQUErQjtBQUMvQixvSUFBb0k7QUFFcEksTUFBTSxPQUFPLFlBQVk7SUF5QnhCLGdJQUFnSTtJQUNoSSxZQUFtQixPQUFtQjtRQVZ0QixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRUosV0FBTSxHQUFHLElBQUksWUFBWSxFQUFnQixDQUFDO1FBU25FLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUF3QixDQUFDO1FBQzVDLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssTUFBTTtZQUFFLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBdUIsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZ0lBQWdJO0lBQ3pILFVBQVU7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsV0FBVztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFCLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFF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QUNOLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxLQUFLLENBQUM7YUFDYjtTQUNEO1FBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ25FLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsUUFBUSxDQUFDLENBQVUsRUFBRSxJQUFlLEVBQUUsUUFBaUI7UUFDN0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsT0FBTyxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsUUFBUSxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQzFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgsVUFBVSxDQUFDLENBQVUsRUFBRSxJQUFlO1FBQzVDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxnSUFBZ0k7SUFDekgscUJBQXFCLENBQUMsT0FBbUIsRUFBRSxFQUFXO1FBQzVELElBQUksRUFBRTtZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nTW9kdWxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuXHRGbW0sXG5cdEZtbUVsZW1lbnRGYWN0b3J5LFxuXHRGbW1Gb3JtLFxuXHRGbW1Gb3JtRWxlbWVudEhUTUwsXG5cdEZtbUZvcm1IVE1MLFxuXHRGbW1GcmFtZXdvcmssXG5cdEZtbU1hcFN0cmluZyxcblx0Rm1tTWluaW1hcCxcblx0Rm1tTWluaW1hcENyZWF0ZVBhcmFtLFxuXHRGbW1QYW5lbCxcblx0Rm1tU25hcHNob3RzLFxuXHRGbW1TdG9yZSxcblx0Rm1tU3RvcmVJdGVtXG59IGZyb20gJ0BlYWZtbS9jb3JlJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBNIEkgTiBJIE0gQSBQXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBDb21wb25lbnQoeyBzZWxlY3RvcjogJ2ZtbS1uZy1taW5pbWFwJywgdGVtcGxhdGU6ICcnIH0pXG5leHBvcnQgY2xhc3MgRm1tTmdNaW5pbWFwIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUGFydGlhbDxGbW1NaW5pbWFwPiB7XG5cdEBJbnB1dCgpIHB1YmxpYyBhZ2dyZWdhdGVMYWJlbHM/OiBGbW1NYXBTdHJpbmc7XG5cdEBJbnB1dCgpIHB1YmxpYyBhbmNob3I6IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgY3VzdG9tRWxlbWVudElkczogc3RyaW5nW107XG5cdEBJbnB1dCgpIHB1YmxpYyBkZWJvdW5jZU1zZWM6IG51bWJlcjtcblx0QElucHV0KCkgcHVibGljIGR5bmFtaWNMYWJlbHM/OiBzdHJpbmdbXTtcblx0QElucHV0KCkgcHVibGljIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXHRASW5wdXQoKSBwdWJsaWMgZnJhbWV3b3JrOiBGbW1GcmFtZXdvcms7XG5cdEBJbnB1dCgpIHB1YmxpYyBrZXk6IHN0cmluZztcblx0QElucHV0KCkgcHVibGljIG5hbWVsZXNzQ29udHJvbHM6IEZtbU5nTmFtZWxlc3NDb250cm9scztcblx0QElucHV0KCkgcHVibGljIHBhZ2U6IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgcGFuZWw6IEZtbU5nUGFuZWw7XG5cdEBJbnB1dCgpIHB1YmxpYyBwYXJlbnQ6IEhUTUxEaXZFbGVtZW50O1xuXHRASW5wdXQoKSBwdWJsaWMgdGl0bGU6IHN0cmluZztcblx0QElucHV0KCkgcHVibGljIHVzZVBhbmVsRGV0YWlsOiBib29sZWFuO1xuXHRASW5wdXQoKSBwdWJsaWMgdXNlV2lkdGhUb1NjYWxlOiBib29sZWFuO1xuXHRASW5wdXQoKSBwdWJsaWMgdmVyYm9zaXR5ID0gMDtcblx0QElucHV0KCkgcHVibGljIHpvb21GYWN0b3I6IG51bWJlcjtcblx0QE91dHB1dCgpIHB1YmxpYyByZWFkb25seSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPEZtbVNuYXBzaG90cz4oKTtcblx0cHJpdmF0ZSByZWFkb25seSBmb3JtOiBIVE1MRm9ybUVsZW1lbnQ7XG5cblx0cHJpdmF0ZSBtaW5pbWFwOiBGbW1NaW5pbWFwO1xuXHRwcml2YXRlIHByZXZpb3VzS2V5OiBzdHJpbmc7XG5cdHByaXZhdGUgc3RvcmU6IFN0b3JlO1xuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihob3N0UmVmOiBFbGVtZW50UmVmKSB7XG5cdFx0bGV0IGZvcm0gPSBob3N0UmVmLm5hdGl2ZUVsZW1lbnQgYXMgRWxlbWVudDtcblx0XHR3aGlsZSAoZm9ybSAmJiBmb3JtLnRhZ05hbWUgIT09ICdGT1JNJykgZm9ybSA9IGZvcm0ucGFyZW50RWxlbWVudDtcblx0XHR0aGlzLmZvcm0gPSBmb3JtIGFzIEhUTUxGb3JtRWxlbWVudDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBkZXN0cnVjdG9yKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5taW5pbWFwKSByZXR1cm47XG5cdFx0dGhpcy5taW5pbWFwLmRlc3RydWN0b3IoKTtcblx0XHR0aGlzLm1pbmltYXAgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG5cdFx0aWYgKCF0aGlzLm1pbmltYXApIHJldHVybjtcblx0XHRpZiAodGhpcy5rZXkgIT09IHRoaXMucHJldmlvdXNLZXkpIHtcblx0XHRcdHRoaXMubWluaW1hcC5kZXN0cnVjdG9yKCk7XG5cdFx0XHR0aGlzLm5nT25Jbml0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc3RvcmUubmFtZWxlc3NDb250cm9scyA9IHRoaXMubmFtZWxlc3NDb250cm9scztcblx0XHRcdHRoaXMubWluaW1hcC5jb21wb3NlKHRoaXMuY3VzdG9tRWxlbWVudElkcyk7XHRcblx0XHR9XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG5cdFx0aWYgKCF0aGlzLm1pbmltYXApIHJldHVybjtcblx0XHR0aGlzLm1pbmltYXAuZGV0YWNoKCk7XG5cdFx0dGhpcy5zdG9yZSA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcblx0XHRjb25zdCBwOiBGbW1NaW5pbWFwQ3JlYXRlUGFyYW0gPSB7XG5cdFx0XHRhZ2dyZWdhdGVMYWJlbHM6IHRoaXMuYWdncmVnYXRlTGFiZWxzLFxuXHRcdFx0YW5jaG9yOiB0aGlzLmFuY2hvcixcblx0XHRcdGRlYm91bmNlTXNlYzogdGhpcy5kZWJvdW5jZU1zZWMsXG5cdFx0XHRkeW5hbWljTGFiZWxzOiB0aGlzLmR5bmFtaWNMYWJlbHMsXG5cdFx0XHRmb3JtOiBuZXcgRm1tRm9ybUhUTUwodGhpcy5mb3JtLCB0aGlzLnBhZ2UpLFxuXHRcdFx0ZnJhbWV3b3JrOiB0aGlzLmZyYW1ld29yayxcblx0XHRcdG9uVXBkYXRlOiAoc25hcHNob3Q6IEZtbVNuYXBzaG90cykgPT4gdGhpcy51cGRhdGUubmV4dChzbmFwc2hvdCksXG5cdFx0XHRzdG9yZTogdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSh0aGlzLmZvcm1Hcm91cCksXG5cdFx0XHR0aXRsZTogdGhpcy50aXRsZSxcblx0XHRcdHVzZVBhbmVsRGV0YWlsOiB0aGlzLnVzZVBhbmVsRGV0YWlsICE9PSB1bmRlZmluZWQsXG5cdFx0XHR1c2VXaWR0aFRvU2NhbGU6IHRoaXMudXNlV2lkdGhUb1NjYWxlICE9PSB1bmRlZmluZWQsXG5cdFx0XHR2ZXJib3NpdHk6IHRoaXMudmVyYm9zaXR5LFxuXHRcdFx0em9vbUZhY3RvcjogdGhpcy56b29tRmFjdG9yXG5cdFx0fTtcblx0XHR0aGlzLm1pbmltYXAgPSB0aGlzLnBhbmVsXG5cdFx0XHQ/IEcuUEFORUxNQVAuZ2V0KHRoaXMucGFuZWwpPy5jcmVhdGVNaW5pbWFwKHApXG5cdFx0XHQ6IEZtbS5jcmVhdGVNaW5pbWFwKHAsIHRoaXMucGFyZW50LCBuZXcgRWxlbWVudEZhY3RvcnkodGhpcy5wYXJlbnQgfHwgdGhpcy5hbmNob3IpKTtcblx0XHR0aGlzLnByZXZpb3VzS2V5ID0gdGhpcy5rZXk7XG5cdFx0dGhpcy5uZ09uQ2hhbmdlcygpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIHRha2VTbmFwc2hvdCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5taW5pbWFwPy50YWtlU25hcHNob3QoKTtcblx0fVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0RiBNIE0gTiBHIFAgQSBOIEUgTFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AQ29tcG9uZW50KHsgc2VsZWN0b3I6ICdmbW0tbmctcGFuZWwnLCB0ZW1wbGF0ZTogJycgfSlcbmV4cG9ydCBjbGFzcyBGbW1OZ1BhbmVsIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQsIFBhcnRpYWw8Rm1tUGFuZWw+IHtcblx0QElucHV0KCkgcHVibGljIHJlYWRvbmx5IGRldGFpbFBhcmVudDogSFRNTERpdkVsZW1lbnQ7XG5cdEBJbnB1dCgpIHB1YmxpYyByZWFkb25seSB2ZXJ0aWNhbDogYm9vbGVhbjtcblxuXHRwdWJsaWMgcmVhZG9ubHkgZWY6IEZtbUVsZW1lbnRGYWN0b3J5O1xuXHRwcml2YXRlIG1pbmltYXBQYW5lbDogRm1tUGFuZWw7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaG9zdFJlZjogRWxlbWVudFJlZikge1xuXHRcdHRoaXMuZWYgPSBuZXcgRWxlbWVudEZhY3RvcnkoaG9zdFJlZi5uYXRpdmVFbGVtZW50IGFzIEVsZW1lbnQpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdHRoaXMubWluaW1hcFBhbmVsLmRlc3RydWN0b3IoKTtcblx0XHRHLlBBTkVMTUFQLmRlbGV0ZSh0aGlzKTtcblx0XHR0aGlzLm1pbmltYXBQYW5lbCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcblx0XHRjb25zdCBob3N0ID0gdGhpcy5ob3N0UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTERpdkVsZW1lbnQ7XG5cdFx0Y29uc3QgdmVydGljYWwgPSB0aGlzLnZlcnRpY2FsICE9PSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5taW5pbWFwUGFuZWwgPSBGbW0uY3JlYXRlUGFuZWwoaG9zdCwgdGhpcy5kZXRhaWxQYXJlbnQsIHZlcnRpY2FsLCB0aGlzLmVmKTtcblx0XHRHLlBBTkVMTUFQLnNldCh0aGlzLCB0aGlzLm1pbmltYXBQYW5lbCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZGVzdHJveURldGFjaGVkKCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLm1pbmltYXBQYW5lbD8uZGVzdHJveURldGFjaGVkKCk7XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1x0XHRcdFx0XHRcdEYgTSBNIE4gRyBNIE8gRCBVIEwgRVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5ATmdNb2R1bGUoeyBkZWNsYXJhdGlvbnM6IFtGbW1OZ01pbmltYXAsIEZtbU5nUGFuZWxdLCBleHBvcnRzOiBbRm1tTmdNaW5pbWFwLCBGbW1OZ1BhbmVsXSB9KVxuZXhwb3J0IGNsYXNzIEZtbU5nTW9kdWxlIHt9XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cdFx0XHRcdFx0XHRGIE0gTSBOIEcgTiBBIE0gRSBMIEUgUyBTIEMgTyBOIFQgUiBPIEwgU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgdHlwZSBGbW1OZ05hbWVsZXNzQ29udHJvbHMgPSBSZWNvcmQ8c3RyaW5nLCBBYnN0cmFjdENvbnRyb2w+O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVx0UCBSIEkgViBBIFQgRVx0PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0RSBMIEUgTSBFIE4gVCBGIEEgQyBUIE8gUiBZXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIEVsZW1lbnRGYWN0b3J5IGltcGxlbWVudHMgRm1tRWxlbWVudEZhY3Rvcnkge1xuXHRwcml2YXRlIHJlYWRvbmx5IG5nQ29udGVudEF0dHJpYnV0ZTogc3RyaW5nO1xuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihwOiBFbGVtZW50KSB7XG5cdFx0bGV0IG5nQ29udGVudEF0dHJpYnV0ZTogc3RyaW5nOyAvLyBzZXQgYXR0cmlidXRlIG9uIGVsZW1lbnRzIHRvIHVzZSBub24tZ2xvYmFsIENTU1xuXHRcdGlmIChFbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVOYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRmb3IgKDsgcCAmJiAhbmdDb250ZW50QXR0cmlidXRlOyBwID0gcC5wYXJlbnRFbGVtZW50KSB7XG5cdFx0XHRcdGNvbnN0IG5hbWVzID0gcC5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXHRcdFx0XHRuZ0NvbnRlbnRBdHRyaWJ1dGUgPSBuYW1lcy5maW5kKChhOiBzdHJpbmcpID0+IGEuc3RhcnRzV2l0aCgnX25nY29udGVudC0nKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoOyBwICYmICFuZ0NvbnRlbnRBdHRyaWJ1dGU7IHAgPSBwLnBhcmVudEVsZW1lbnQpIHtcblx0XHRcdFx0Y29uc3QgbmFtZXMgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwocC5hdHRyaWJ1dGVzLCAoYTogQXR0cikgPT4gYS5uYW1lKSBhcyBzdHJpbmdbXTtcblx0XHRcdFx0bmdDb250ZW50QXR0cmlidXRlID0gbmFtZXMuZmluZCgoYTogc3RyaW5nKSA9PiBhLnN0YXJ0c1dpdGgoJ19uZ2NvbnRlbnQtJykpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIW5nQ29udGVudEF0dHJpYnV0ZSkgdGhyb3cgbmV3IEVycm9yKCdGb3JtTWluaW1hcDogbWlzc2luZyBfbmdjb250ZW50LSBhdHRyaWJ1dGUnKTtcblx0XHR0aGlzLm5nQ29udGVudEF0dHJpYnV0ZSA9IG5nQ29udGVudEF0dHJpYnV0ZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjcmVhdGVFbGVtZW50KHRhZ05hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXHRcdGUuc2V0QXR0cmlidXRlKHRoaXMubmdDb250ZW50QXR0cmlidXRlLCAnJyk7XG5cdFx0cmV0dXJuIGU7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSTogc3RyaW5nLCBxdWFsaWZpZWROYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSk7XG5cdFx0ZS5zZXRBdHRyaWJ1dGUodGhpcy5uZ0NvbnRlbnRBdHRyaWJ1dGUsICcnKTtcblx0XHRyZXR1cm4gZTtcblx0fVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0R1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBHOiB7XG5cdFBBTkVMTUFQOiBXZWFrTWFwPEZtbU5nUGFuZWwsIEZtbVBhbmVsPjtcbn0gPSB7XG5cdFBBTkVMTUFQOiBuZXcgV2Vha01hcCgpXG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0UyBUIE8gUiBFIEkgVCBFIE1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgU3RvcmVJdGVtIGltcGxlbWVudHMgRm1tU3RvcmVJdGVtIHtcblx0cHJpdmF0ZSByZWFkb25seSBzZTogSFRNTFNlbGVjdEVsZW1lbnQ7XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGNvbnN0cnVjdG9yKFxuXHRcdGU6IEhUTUxFbGVtZW50LFxuXHRcdGxpc3RlbmVyOiBFdmVudExpc3RlbmVyLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgY29udHJvbDogQWJzdHJhY3RDb250cm9sXG5cdCkge1xuXHRcdHRoaXMuc2UgPSBlLnRhZ05hbWUgPT09ICdTRUxFQ1QnID8gKGUgYXMgSFRNTFNlbGVjdEVsZW1lbnQpIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblx0XHRzdWJzY3JpcHRpb24uYWRkKHRoaXMuY29udHJvbC5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZShsaXN0ZW5lcikpO1xuXHRcdHN1YnNjcmlwdGlvbi5hZGQodGhpcy5jb250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUobGlzdGVuZXIpKTtcblx0XHR0aGlzLmRlc3RydWN0b3IgPSAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBkZXN0cnVjdG9yKCk6IHZvaWQge1xuXHRcdC8vIGZ1bmN0aW9uIGJvZHkgb3ZlcndyaXR0ZW4gaW4gY29uc3RydWN0b3Jcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRFcnJvcihoYXNWYWx1ZTogYm9vbGVhbik6IHN0cmluZyB7XG5cdFx0Y29uc3QgZXJyb3JzID0gdGhpcy5jb250cm9sLmVycm9ycztcblx0XHRsZXQga2V5cyA9IGVycm9ycyA/IE9iamVjdC5rZXlzKGVycm9ycykgOiBbXTtcblx0XHRpZiAoaGFzVmFsdWUgJiYga2V5cy5sZW5ndGgpIGtleXMgPSBrZXlzLmZpbHRlcihrID0+IGsgIT09ICdyZXF1aXJlZCcpOyAvLyBJRTExIFNFTEVDVCBidWdcblx0XHRyZXR1cm4ga2V5cy5sZW5ndGggPyBrZXlzLmpvaW4oJywnKSA6IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMubmFtZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRWYWx1ZSgpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuY29udHJvbC52YWx1ZSBhcyB1bmtub3duO1xuXHRcdGlmICghdmFsdWUpIHJldHVybiB1bmRlZmluZWQ7XG5cdFx0aWYgKCF0aGlzLnNlKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKCF0aGlzLnNlLm11bHRpcGxlKSByZXR1cm4gW3RoaXMuc2Uuc2VsZWN0ZWRJbmRleF07XG5cdFx0Y29uc3QgaW5kZXhlczogbnVtYmVyW10gPSBbXTsgLy8gRm9ybUNvbnRyb2wgZm9yIG11bHRpc2VsZWN0IGRvZXNuJ3QgdXBkYXRlIHdoZW4gc2VsZWN0ZWQgb3B0aW9uIGlzIHJlbW92ZWQgZHluYW1pY2FsbHlcblx0XHRBcnJheS5mcm9tKHRoaXMuc2Uub3B0aW9ucykuZm9yRWFjaCgobywgaSkgPT4gby5zZWxlY3RlZCAmJiBpbmRleGVzLnB1c2goaSkpO1xuXHRcdHJldHVybiBpbmRleGVzO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGlzRGlzYWJsZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29udHJvbC5kaXNhYmxlZDtcblx0fVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXHRcdFx0XHRcdFx0UyBUIE8gUiBFXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFN0b3JlIGltcGxlbWVudHMgRm1tU3RvcmUge1xuXHRwdWJsaWMgbmFtZWxlc3NDb250cm9sczogRm1tTmdOYW1lbGVzc0NvbnRyb2xzID0ge307XG5cdHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgbWluaW1hcHM6IFNldDxGbW1NaW5pbWFwPiA9IG5ldyBTZXQoKTtcblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmb3JtR3JvdXA6IEZvcm1Hcm91cCkge1xuXHRcdHRoaXMubGlzdGVuZXIgPSAoKSA9PiB0aGlzLm1pbmltYXBzLmZvckVhY2gobSA9PiBtLnRha2VTbmFwc2hvdCgpKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBjcmVhdGVTdG9yZUl0ZW0oXzogRm1tRm9ybSwgZTogRm1tRm9ybUVsZW1lbnRIVE1MKSB7XG5cdFx0Y29uc3QgbmFtZSA9IGUuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgZS5pZDtcblx0XHRjb25zdCBjb250cm9sID0gbmFtZSA/IHRoaXMubmFtZWxlc3NDb250cm9sc1tuYW1lXSA6IHVuZGVmaW5lZDtcblx0XHRpZiAoY29udHJvbCkgcmV0dXJuIG5ldyBTdG9yZUl0ZW0oZSwgdGhpcy5saXN0ZW5lciwgbmFtZSwgY29udHJvbCk7XG5cdFx0bGV0IGluRm9ybUFycmF5ID0gZmFsc2U7XG5cdFx0bGV0IHBhdGg6IHN0cmluZztcblx0XHRsZXQgZmMgPSBlO1xuXHRcdGZvciAoOyBmYyAmJiBmYy50YWdOYW1lICE9PSAnRk9STSc7IGZjID0gZmMucGFyZW50RWxlbWVudCkge1xuXHRcdFx0cGF0aCA9IGZjLmdldEF0dHJpYnV0ZSgnZm9ybWNvbnRyb2xuYW1lJykgfHwgZmMuZGF0YXNldC5mb3JtY29udHJvbG5hbWU7XG5cdFx0XHRpZiAocGF0aCkgYnJlYWs7XG5cdFx0XHRpbkZvcm1BcnJheSA9IGZjLmRhdGFzZXQuZm1taW5mb3JtYXJyYXkgIT09IHVuZGVmaW5lZDtcblx0XHRcdGlmIChpbkZvcm1BcnJheSkgYnJlYWs7XG5cdFx0fVxuXHRcdGZvciAobGV0IHAgPSBmYz8ucGFyZW50RWxlbWVudDsgcCAmJiBwLnRhZ05hbWUgIT09ICdGT1JNJzsgcCA9IHAucGFyZW50RWxlbWVudCkge1xuXHRcdFx0bGV0IHBOYW1lID0gcC5nZXRBdHRyaWJ1dGUoJ2Zvcm1hcnJheW5hbWUnKTtcblx0XHRcdGlmICghcE5hbWUpIHtcblx0XHRcdFx0cE5hbWUgPSBwLmdldEF0dHJpYnV0ZSgnZm9ybWdyb3VwbmFtZScpO1xuXHRcdFx0XHRpZiAocE5hbWUpIHBhdGggPSBwTmFtZSArICcuJyArIHBhdGg7XG5cdFx0XHR9IGVsc2UgaWYgKCFpbkZvcm1BcnJheSkge1xuXHRcdFx0XHRwYXRoID0gcE5hbWUgKyAnLicgKyBwYXRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5Gb3JtQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0cGF0aCA9IHBOYW1lO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdCBhYyA9IHRoaXMuZm9ybUdyb3VwLmdldChwYXRoKTtcblx0XHRyZXR1cm4gYWMgPyBuZXcgU3RvcmVJdGVtKGUsIHRoaXMubGlzdGVuZXIsIHBhdGgsIGFjKSA6IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBnZXRFcnJvcihfOiBGbW1Gb3JtLCBpdGVtOiBTdG9yZUl0ZW0sIGhhc1ZhbHVlOiBib29sZWFuKSB7XG5cdFx0cmV0dXJuIGl0ZW0uZ2V0RXJyb3IoaGFzVmFsdWUpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0cHVibGljIGdldE5hbWUoXzogRm1tRm9ybSwgaXRlbTogU3RvcmVJdGVtKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gaXRlbS5nZXROYW1lKCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRwdWJsaWMgZ2V0VmFsdWUoXzogRm1tRm9ybSwgaXRlbTogU3RvcmVJdGVtKSB7XG5cdFx0cmV0dXJuIGl0ZW0uZ2V0VmFsdWUoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBpc0Rpc2FibGVkKF86IEZtbUZvcm0sIGl0ZW06IFN0b3JlSXRlbSkge1xuXHRcdHJldHVybiBpdGVtLmlzRGlzYWJsZWQoKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHB1YmxpYyBub3RpZnlNaW5pbWFwT25VcGRhdGUobWluaW1hcDogRm1tTWluaW1hcCwgb246IGJvb2xlYW4pIHtcblx0XHRpZiAob24pIHRoaXMubWluaW1hcHMuYWRkKG1pbmltYXApO1xuXHRcdGVsc2UgdGhpcy5taW5pbWFwcy5kZWxldGUobWluaW1hcCk7XG5cdH1cbn1cbiJdfQ==