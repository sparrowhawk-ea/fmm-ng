import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FmmElementFactory, FmmFramework, FmmMapString, FmmMinimap, FmmPanel, FmmSnapshots } from '@eafmm/core';
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
}
export declare class FmmNgModule {
}
export declare type FmmNgNamelessControls = Record<string, AbstractControl>;
