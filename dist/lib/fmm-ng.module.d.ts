import { ElementRef, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FmmElementFactory, FmmMinimap, FmmPanel } from '@fmmp/core';
export declare class FmmNgMinimap implements OnChanges, OnDestroy, OnInit, Partial<FmmMinimap> {
    private aggregateLabels?;
    private anchor;
    private customWidgetIds;
    private debounceMsec;
    private dynamicLabels?;
    private formGroup;
    private framework;
    private key;
    private namelessControls;
    private page;
    private panel;
    private title;
    private usePanelDetail;
    private useWidthToScale;
    private verbosity;
    private widgetFactories?;
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
