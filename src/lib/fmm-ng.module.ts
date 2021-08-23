import { Component, ElementRef, EventEmitter, Input, NgModule, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
	Fmm,
	FmmElementFactory,
	FmmForm,
	FmmFormElementHTML,
	FmmFormHTML,
	FmmFramework,
	FmmMapString,
	FmmMinimap,
	FmmMinimapCreateParam,
	FmmPanel,
	FmmSnapshots,
	FmmStore,
	FmmStoreItem
} from '@eafmm/core';

// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
@Component({ selector: 'fmm-ng-minimap', template: '' })
export class FmmNgMinimap implements OnChanges, OnDestroy, OnInit, Partial<FmmMinimap> {
	@Input() public aggregateLabels?: FmmMapString;
	@Input() public anchor: HTMLDivElement;
	@Input() public customElementIds: string[];
	@Input() public debounceMsec: number;
	@Input() public dynamicLabels?: string[];
	@Input() public formGroup: FormGroup;
	@Input() public framework: FmmFramework;
	@Input() public key: string;
	@Input() public namelessControls: FmmNgNamelessControls;
	@Input() public page: HTMLDivElement;
	@Input() public panel: FmmNgPanel;
	@Input() public parent: HTMLDivElement;
	@Input() public title: string;
	@Input() public usePanelDetail: boolean;
	@Input() public useWidthToScale: boolean;
	@Input() public verbosity = 0;
	@Input() public zoomFactor: number;
	@Output() public readonly update = new EventEmitter<FmmSnapshots>();
	private readonly form: HTMLFormElement;

	private minimap: FmmMinimap;
	private previousKey: string;
	private store: Store;

	// =============================================================================================================================
	public constructor(hostRef: ElementRef) {
		let form = hostRef.nativeElement as Element;
		while (form && form.tagName !== 'FORM') form = form.parentElement;
		this.form = form as HTMLFormElement;
	}

	// =============================================================================================================================
	public destructor(): void {
		if (!this.minimap) return;
		this.minimap.destructor();
		this.minimap = undefined;
	}

	// =============================================================================================================================
	public ngOnChanges(): void {
		if (!this.minimap) return;
		if (this.key !== this.previousKey) {
			this.minimap.destructor();
			this.ngOnInit();
		} else {
			this.store.namelessControls = this.namelessControls;
			this.minimap.compose(this.customElementIds);	
		}
	}

	// =============================================================================================================================
	public ngOnDestroy(): void {
		if (!this.minimap) return;
		this.minimap.detach();
		this.store = undefined;
	}

	// =============================================================================================================================
	public ngOnInit(): void {
		const p: FmmMinimapCreateParam = {
			aggregateLabels: this.aggregateLabels,
			anchor: this.anchor,
			debounceMsec: this.debounceMsec,
			dynamicLabels: this.dynamicLabels,
			form: new FmmFormHTML(this.form, this.page),
			framework: this.framework,
			onUpdate: (snapshot: FmmSnapshots) => this.update.next(snapshot),
			store: this.store = new Store(this.formGroup),
			title: this.title,
			usePanelDetail: this.usePanelDetail !== undefined,
			useWidthToScale: this.useWidthToScale !== undefined,
			verbosity: this.verbosity,
			zoomFactor: this.zoomFactor
		};
		this.minimap = this.panel
			? G.PANELMAP.get(this.panel)?.createMinimap(p)
			: Fmm.createMinimap(p, this.parent, new ElementFactory(this.parent || this.anchor));
		this.previousKey = this.key;
		this.ngOnChanges();
	}

	// =============================================================================================================================
	public takeSnapshot(): boolean {
		return this.minimap?.takeSnapshot();
	}
}

// =================================================================================================================================
//						F M M N G P A N E L
// =================================================================================================================================
@Component({ selector: 'fmm-ng-panel', template: '' })
export class FmmNgPanel implements OnDestroy, OnInit, Partial<FmmPanel> {
	@Input() public readonly detailParent: HTMLDivElement;
	@Input() public readonly vertical: boolean;

	public readonly ef: FmmElementFactory;
	private minimapPanel: FmmPanel;

	// =============================================================================================================================
	public constructor(private readonly hostRef: ElementRef) {
		this.ef = new ElementFactory(hostRef.nativeElement as Element);
	}

	// =============================================================================================================================
	public ngOnDestroy(): void {
		this.minimapPanel.destructor();
		G.PANELMAP.delete(this);
		this.minimapPanel = undefined;
	}

	// =============================================================================================================================
	public ngOnInit(): void {
		const host = this.hostRef.nativeElement as HTMLDivElement;
		const vertical = this.vertical !== undefined;
		this.minimapPanel = Fmm.createPanel(host, this.detailParent, vertical, this.ef);
		G.PANELMAP.set(this, this.minimapPanel);
	}

	// =============================================================================================================================
	public destroyDetached(): void {
		return this.minimapPanel?.destroyDetached();
	}
}

// =================================================================================================================================
//						F M M N G M O D U L E
// =================================================================================================================================
@NgModule({ declarations: [FmmNgMinimap, FmmNgPanel], exports: [FmmNgMinimap, FmmNgPanel] })
export class FmmNgModule {}

// =================================================================================================================================
//						F M M N G N A M E L E S S C O N T R O L S
// =================================================================================================================================
export type FmmNgNamelessControls = Record<string, AbstractControl>;

// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================

// =================================================================================================================================
//						E L E M E N T F A C T O R Y
// =================================================================================================================================
class ElementFactory implements FmmElementFactory {
	private readonly ngContentAttribute: string;

	// =============================================================================================================================
	public constructor(p: Element) {
		let ngContentAttribute: string; // set attribute on elements to use non-global CSS
		if (Element.prototype.getAttributeNames !== undefined) {
			for (; p && !ngContentAttribute; p = p.parentElement) {
				const names = p.getAttributeNames();
				ngContentAttribute = names.find((a: string) => a.startsWith('_ngcontent-'));
			}
		} else {
			for (; p && !ngContentAttribute; p = p.parentElement) {
				const names = Array.prototype.map.call(p.attributes, (a: Attr) => a.name) as string[];
				ngContentAttribute = names.find((a: string) => a.startsWith('_ngcontent-'));
			}
		}
		if (!ngContentAttribute) throw new Error('FormMinimap: missing _ngcontent- attribute');
		this.ngContentAttribute = ngContentAttribute;
	}

	// =============================================================================================================================
	public createElement(tagName: string) {
		const e = document.createElement(tagName);
		e.setAttribute(this.ngContentAttribute, '');
		return e;
	}

	// =============================================================================================================================
	public createElementNS(namespaceURI: string, qualifiedName: string) {
		const e = document.createElementNS(namespaceURI, qualifiedName);
		e.setAttribute(this.ngContentAttribute, '');
		return e;
	}
}

// =================================================================================================================================
//						G
// =================================================================================================================================
const G: {
	PANELMAP: WeakMap<FmmNgPanel, FmmPanel>;
} = {
	PANELMAP: new WeakMap()
};

// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
class StoreItem implements FmmStoreItem {
	private readonly se: HTMLSelectElement;

	// =============================================================================================================================
	public constructor(
		e: HTMLElement,
		listener: EventListener,
		private readonly name: string,
		private readonly control: AbstractControl
	) {
		this.se = e.tagName === 'SELECT' ? (e as HTMLSelectElement) : undefined;
		const subscription = new Subscription();
		subscription.add(this.control.statusChanges.subscribe(listener));
		subscription.add(this.control.valueChanges.subscribe(listener));
		this.destructor = () => subscription.unsubscribe();
	}

	// =============================================================================================================================
	public destructor(): void {
		// function body overwritten in constructor
	}

	// =============================================================================================================================
	public getError(hasValue: boolean): string {
		const errors = this.control.errors;
		let keys = errors ? Object.keys(errors) : [];
		if (hasValue && keys.length) keys = keys.filter(k => k !== 'required'); // IE11 SELECT bug
		return keys.length ? keys.join(',') : undefined;
	}

	// =============================================================================================================================
	public getName(): string {
		return this.name;
	}

	// =============================================================================================================================
	public getValue() {
		const value = this.control.value as unknown;
		if (!value) return undefined;
		if (!this.se) return value;
		if (!this.se.multiple) return [this.se.selectedIndex];
		const indexes: number[] = []; // FormControl for multiselect doesn't update when selected option is removed dynamically
		Array.from(this.se.options).forEach((o, i) => o.selected && indexes.push(i));
		return indexes;
	}

	// =============================================================================================================================
	public isDisabled() {
		return this.control.disabled;
	}
}

// =================================================================================================================================
//						S T O R E
// =================================================================================================================================
class Store implements FmmStore {
	public namelessControls: FmmNgNamelessControls = {};
	private readonly listener: EventListener;
	private readonly minimaps: Set<FmmMinimap> = new Set();

	// =============================================================================================================================
	public constructor(private readonly formGroup: FormGroup) {
		this.listener = () => this.minimaps.forEach(m => m.takeSnapshot());
	}

	// =============================================================================================================================
	public createStoreItem(_: FmmForm, e: FmmFormElementHTML) {
		const name = e.getAttribute('name') || e.id;
		const control = name ? this.namelessControls[name] : undefined;
		if (control) return new StoreItem(e, this.listener, name, control);
		let inFormArray = false;
		let path: string;
		let fc = e;
		for (; fc && fc.tagName !== 'FORM'; fc = fc.parentElement) {
			path = fc.getAttribute('formcontrolname') || fc.dataset.formcontrolname;
			if (path) break;
			inFormArray = fc.dataset.fmminformarray !== undefined;
			if (inFormArray) break;
		}
		for (let p = fc?.parentElement; p && p.tagName !== 'FORM'; p = p.parentElement) {
			let pName = p.getAttribute('formarrayname');
			if (!pName) {
				pName = p.getAttribute('formgroupname');
				if (pName) path = pName + '.' + path;
			} else if (!inFormArray) {
				path = pName + '.' + path;
			} else {
				inFormArray = false;
				path = pName;
			}
		}
		const ac = this.formGroup.get(path);
		return ac ? new StoreItem(e, this.listener, path, ac) : undefined;
	}

	// =============================================================================================================================
	public getError(_: FmmForm, item: StoreItem, hasValue: boolean) {
		return item.getError(hasValue);
	}

	// =============================================================================================================================
	public getName(_: FmmForm, item: StoreItem): string {
		return item.getName();
	}

	// =============================================================================================================================
	public getValue(_: FmmForm, item: StoreItem) {
		return item.getValue();
	}

	// =============================================================================================================================
	public isDisabled(_: FmmForm, item: StoreItem) {
		return item.isDisabled();
	}

	// =============================================================================================================================
	public notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean) {
		if (on) this.minimaps.add(minimap);
		else this.minimaps.delete(minimap);
	}
}
