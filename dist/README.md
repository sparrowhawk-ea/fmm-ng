# Form Minimap Angular
Angular module with components for [Form Minimap](https://www.npmjs.com/package/@eafmm/core).
Please consult that documentation for further information on the concepts mentioned below.
Please note that all boolean attributes are existential (value ignored) rather than having a boolean value.

[Demo Appplication](https://sparrowhawk-ea.github.io/fmm-ng/demo/)

***
# Getting Started
## Installation
```bash
npm install --save @fmm/ng
```

## Adding Form Minimap
The code sample below shows the lines added to a simple form to add a minimap (M) or a minimap with panel (P)
```ts
            import { Component, NgModule } from '@angular/core';
            import { BrowserModule } from '@angular/platform-browser';
M P         import { FmmNgModule } from '@eafmm/ng'

            @Component({
                selector: 'app-root',
                template: ` <div>
M P                 <div #anchor style='width:20px; height:20px; margin-left:200px'></div>
  P                 <fmm-ng-panel #panel></fmm-ng-panel>
                    <form>
M                       <fmm-ng-minimap [anchor]='anchor' title='Title'></fmm-ng-minimap>
  P                     <fmm-ng-minimap [anchor]='anchor' [panel]='panel' title='Title'></fmm-ng-minimap>
                        <input id="Input1"/><br/>
                        <input id="Input2"/><br/>
                        <input id="Input3"/><br/>
                        <input id="Input4"/>
                    </form>
                </div>`,
                styles: []
            })
            export class AppComponent { }

            @NgModule({
                declarations: [AppComponent],
                imports: [BrowserModule
M P                     , FmmNgModule
                ],
                providers: [],
                bootstrap: [AppComponent]
            })
            export class AppModule { }
```

***
# API
## FmmNgModule
Module containing all the components.

| Components
| ---
| [FmmNgMinimap](#fmmngminimap)
| [FmmNgPanel](#fmmngpanel)

***
## FmmNgMinimap
Component to create and manage a [FmmMinimap](https://www.npmjs.com/package/@eafmm/core#fmmminimap).
The minimap is detached when this component is destroyed.
For minimaps in a panel, use the panel property; otherwise use an anchor for a popup minimap.

Attribute | Type | Required | Description
--- | --- | :---: | ---
[aggregateLabels](https://www.npmjs.com/package/@eafmm/core#mcp-aggregatelabels) | [FmmMapString](https://www.npmjs.com/package/@eafmm/core#fmmmapstring)
[anchor](https://www.npmjs.com/package/@eafmm/core#mcp-anchor) | HTMLElement
[customElementIds](https://www.npmjs.com/package/@eafmm/core#mm-compose-customelementids) | string[]
[debounceMsec](https://www.npmjs.com/package/@eafmm/core#mcp-debouncemsec) | number
[dynamicLabels](https://www.npmjs.com/package/@eafmm/core#mcp-dynamiclabele) | string[]
formGroup | FormGroup | | FormGroup that contains the form's controls.
[framework](https://www.npmjs.com/package/@eafmm/core#mcp-framework) | [FmmFramework](https://www.npmjs.com/package/@eafmm/core#fmmframework)
key | string | | Minimap is recreated when key changes.  Any previous minimap is detached.
namelessControls | FmmNgNamelessControls (= Record<string, AbstractControl>) | | Additional FormControls, dentified by their form element's ID or NAME attribute, which may not be discoverable by traversing up the DOM tree and looking up formArrayName, formControlName, or formGroupName attribute on DOM elements.
[ordinal](https://www.npmjs.com/package/@eafmm/core#pcm-ordinal) | number
[page](https://www.npmjs.com/package/@eafmm/core#fmmform-page) | HTMLElement
panel | [FmmNgPanel](#fmmngpanel) | &check;
[title](https://www.npmjs.com/package/@eafmm/core#mcp-title) | string | &check;
[usePanelDetail](https://www.npmjs.com/package/@eafmm/core#mcp-usepaneldetail) | existential
[useWidthToScale](https://www.npmjs.com/package/@eafmm/core#mcp-usewidthtoscale) | existential
[verbosity](https://www.npmjs.com/package/@eafmm/core#mcp-verbosity) | number
[zoomFactor](https://www.npmjs.com/package/@eafmm/core#mcp-zoomfactor) | number

Event | Parameter | Description
--- | --- | ---
update | [FmmMinimapSnapshot](https://www.npmjs.com/package/@eafmm/core#fmmminimapsnapshot) | Dispatched when the minimap updates itself for whatever reason.

| Method
| ---
| [destructor](https://www.npmjs.com/package/@eafmm/core#mm-destructor)
| [takeSnapshot](https://www.npmjs.com/package/@eafmm/core#mm-takesnapshot)

***
## FmmNgPanel
Component to create and manage a [FmmPanel](https://www.npmjs.com/package/@eafmm/core#fmmpanel).

Attribute | Type | Required
--- | --- | :---:
[detailParent](https://www.npmjs.com/package/@eafmm/core#pcp-detailparent) | HTMLDivElement
[minimapsCount](https://www.npmjs.com/package/@eafmm/core#pcp-minimapscount) | number
[vertical](https://www.npmjs.com/package/@eafmm/core#pcp-vertical) | existential

| Method
| ---
| [destroyDetached](https://www.npmjs.com/package/@eafmm/core#pm-destroydetached)
