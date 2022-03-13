import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FmmElementFactory, FmmFramework, FmmMapString, FmmMinimap, FmmPanel, FmmSnapshots } from '@eafmm/core';
import * as i0 from "@angular/core";
export declare class FmmNgMinimap implements OnChanges, OnDestroy, OnInit, Partial<FmmMinimap> {
    aggregateLabels?: FmmMapString;
    anchor?: HTMLDivElement;
    customElementIds?: string[];
    debounceMsec?: number;
    dynamicLabels?: string[];
    formGroup?: FormGroup;
    framework?: FmmFramework;
    key?: string;
    namelessControls?: FmmNgNamelessControls;
    ordinal?: number;
    page?: HTMLDivElement;
    panel?: FmmNgPanel;
    title: string;
    usePanelDetail?: boolean;
    useWidthToScale?: boolean;
    verbosity: number;
    zoomFactor?: number;
    readonly update: EventEmitter<FmmSnapshots>;
    private readonly form;
    private minimap?;
    private previousKey?;
    private store?;
    constructor(hostRef: ElementRef);
    destructor(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    takeSnapshot(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<FmmNgMinimap, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FmmNgMinimap, "fmm-ng-minimap", never, { "aggregateLabels": "aggregateLabels"; "anchor": "anchor"; "customElementIds": "customElementIds"; "debounceMsec": "debounceMsec"; "dynamicLabels": "dynamicLabels"; "formGroup": "formGroup"; "framework": "framework"; "key": "key"; "namelessControls": "namelessControls"; "ordinal": "ordinal"; "page": "page"; "panel": "panel"; "title": "title"; "usePanelDetail": "usePanelDetail"; "useWidthToScale": "useWidthToScale"; "verbosity": "verbosity"; "zoomFactor": "zoomFactor"; }, { "update": "update"; }, never, never>;
}
export declare class FmmNgPanel implements OnDestroy, OnInit, Partial<FmmPanel> {
    private readonly hostRef;
    readonly detailParent?: HTMLDivElement;
    readonly minimapsCount = 1;
    readonly vertical?: boolean;
    readonly ef: FmmElementFactory;
    private minimapPanel?;
    constructor(hostRef: ElementRef);
    ngOnDestroy(): void;
    ngOnInit(): void;
    destroyDetached(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FmmNgPanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FmmNgPanel, "fmm-ng-panel", never, { "detailParent": "detailParent"; "minimapsCount": "minimapsCount"; "vertical": "vertical"; }, {}, never, never>;
}
export declare class FmmNgModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<FmmNgModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<FmmNgModule, [typeof FmmNgMinimap, typeof FmmNgPanel], never, [typeof FmmNgMinimap, typeof FmmNgPanel]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<FmmNgModule>;
}
export declare type FmmNgNamelessControls = Record<string, AbstractControl>;
