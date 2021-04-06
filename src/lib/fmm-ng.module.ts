import { Component, ElementRef, EventEmitter, Input, NgModule, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
	Fmm,
	FmmElementFactory,
	FmmFramework,
	FmmMapString,
	FmmMinimap,
	FmmMinimapCreateParam,
	FmmMinimapSnapshot,
	FmmPanel,
	FmmStore,
	FmmStoreItem,
	FmmWidgetFactory
} from '@fmmp/core';

// =================================================================================================================================
//						F M M N G M I N I M A P
// =================================================================================================================================
@Component({ selector: 'fmm-ng-minimap', template: '' })
export class FmmNgMinimap implements OnChanges, OnDestroy, OnInit, Partial<FmmMinimap> {
	@Input() private readonly aggregateLabels?: FmmMapString;
	@Input() private readonly anchor: HTMLElement;
	@Input() private readonly debounceMsec: number;
	@Input() private readonly dynamicLabels?: string[];
	@Input() private readonly formGroup: FormGroup;
	@Input() private readonly framework: FmmFramework;
	@Input() private readonly page: HTMLElement;
	@Input() private readonly panel: FmmNgPanel;
	@Input() private readonly title: string;
	@Input() private readonly usePanelDetail: boolean;
	@Input() private readonly useWidthToScale: boolean;
	@Input() private readonly verbosity = 0;
	@Input() private readonly widgetFactories?: FmmWidgetFactory[];
	@Input() private customWidgetIds: string[];
	@Input() private key: string;
	@Input() private namelessControls: FmmNgNamelessControls;
	@Output() private readonly update = new EventEmitter<FmmMinimapSnapshot>();
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
	public ngOnChanges(): void {
		if (!this.minimap) return;
		if (this.key !== this.previousKey) {
			this.minimap.destructor();
			this.ngOnInit();
		} else {
			this.store.namelessControls = this.namelessControls;
			this.minimap.compose(this.customWidgetIds);	
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
			form: this.form,
			framework: this.framework,
			onUpdate: (snapshot: FmmMinimapSnapshot) => this.update.next(snapshot),
			page: this.page,
			store: this.store = new Store(this.formGroup),
			title: this.title,
			usePanelDetail: this.usePanelDetail !== undefined,
			useWidthToScale: this.useWidthToScale !== undefined,
			verbosity: this.verbosity,
			widgetFactories: this.widgetFactories
		};
		const panel = this.panel ? G.PANELMAP.get(this.panel) : undefined;
		this.minimap = panel?.createMinimap(p);
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
	@Input() private readonly detailParent: HTMLElement;
	@Input() private readonly vertical: boolean;

	public readonly ef: FmmElementFactory;
	private minimapPanel: FmmPanel;

	// =============================================================================================================================
	public constructor(private readonly hostRef: ElementRef) {
		this.ef = new ElementFactory(hostRef);
	}

	// =============================================================================================================================
	public ngOnDestroy(): void {
		this.minimapPanel.destructor();
		G.PANELMAP.delete(this);
		this.minimapPanel = undefined;
	}

	// =============================================================================================================================
	public ngOnInit(): void {
		const host = this.hostRef.nativeElement as HTMLElement;
		const vertical = this.vertical !== undefined;
		this.minimapPanel = Fmm.createPanel(this.ef, host, this.detailParent, vertical);
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
	public constructor(ref: ElementRef) {
		let ngContentAttribute: string; // set attribute on elements to use non-global CSS
		if (Element.prototype.getAttributeNames !== undefined) {
			for (let p = ref.nativeElement as Element; p && !ngContentAttribute; p = p.parentElement) {
				const names = p.getAttributeNames();
				ngContentAttribute = names.find((a: string) => a.startsWith('_ngcontent-'));
			}
		} else {
			for (let p = ref.nativeElement as Element; p && !ngContentAttribute; p = p.parentElement) {
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
	public createStoreItem(e: HTMLElement, _: () => FmmStoreItem) {
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
	public notifyMinimap(minimap: FmmMinimap, on: boolean) {
		if (on) this.minimaps.add(minimap);
		else this.minimaps.delete(minimap);
	}
}
