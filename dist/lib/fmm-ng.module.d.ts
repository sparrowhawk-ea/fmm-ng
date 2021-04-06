import { ElementRef, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FmmElementFactory, FmmMinimap, FmmPanel } from '@fmmp/core';
export declare class FmmNgMinimap implements OnChanges, OnDestroy, OnInit, Partial<FmmMinimap> {
    private readonly aggregateLabels?;
    private readonly anchor;
    private readonly debounceMsec;
    private readonly dynamicLabels?;
    private readonly formGroup;
    private readonly framework;
    private readonly page;
    private readonly panel;
    private readonly title;
    private readonly usePanelDetail;
    private readonly useWidthToScale;
    private readonly verbosity;
    private readonly widgetFactories?;
    private customWidgetIds;
    private key;
    private namelessControls;
    private readonly update;
    private readonly form;
    private minimap;
    private previousKey;
    private store;
    constructor(hostRef: ElementRef);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    takeSnapshot(): boolean;
}
export declare class FmmNgPanel implements OnDestroy, OnInit, Partial<FmmPanel> {
    private readonly hostRef;
    private readonly detailParent;
    private readonly vertical;
    readonly ef: FmmElementFactory;
    private minimapPanel;
    constructor(hostRef: ElementRef);
    ngOnDestroy(): void;
    ngOnInit(): void;
    destroyDetached(): void;
}
export declare class FmmNgModule {
}
export declare type FmmNgNamelessControls = Record<string, AbstractControl>;
