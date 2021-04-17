# Form Minimap Angular
Angular module with components for [Form Minimap](https://github.com/sparrowhawk-ea/fmm-core).
Please consult that documentation for further information on the concepts mentioned below.
Please note that all boolean attributes are existenial (value ignored) rather than having a boolean value.

***
# Getting Started
## Installation
```bash
npm install --save @fmm/ng
```

## Adding Form Minimap
Before
```ts
    import { Component, NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';

    @Component({
        selector: 'app-root',
        template: ` <div>
            <form>
                <input id="Input1"/><br/>
                <input id="Input2"/><br/>
                <input id="Input3"/><br/>
                <input id="Input4"/>
            </form>
        </div>`
    })
    export class AppComponent { }

    @NgModule({
        declarations: [AppComponent],
        imports: [BrowserModule],
        providers: [],
        bootstrap: [AppComponent]
    })
    export class AppModule { }
```
After
```ts
    import { Component, NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { FmmNgMinimap, FmmNgPanel } from '@fmm/ng'

    @Component({
        selector: 'app-root',
        template: ` <div>
            <div #anchor style='width:20px; height:20px; margin-left:200px'></div>
            <FmmNgPanel #panel/>
            <form>
                <FmmNgMinimap [anchor]='anchor' [panel]='panel' title='Title'/>
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
        imports: [BrowserModule, FmmNgMinimap, FmmNgPanel],
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
Component to create and manage a [FmmMinimap](https://github.com/sparrowhawk-ea/fmm-core#fmmminimap).
The minimap is detached when this component is destroyed.

Attribute | Type | Required | Description
--- | --- | :---: | ---
[aggregateLabels](https://github.com/sparrowhawk-ea/fmm-core#mcp-aggregatelabels) | [FmmMapString](https://github.com/sparrowhawk-ea/fmm-core#fmmmapstring)
[anchor](https://github.com/sparrowhawk-ea/fmm-core#mcp-anchor) | HTMLElement
[customWidgetIds](https://github.com/sparrowhawk-ea/fmm-core#mm-compose-customwidgetids) | string[]
[debounceMsec](https://github.com/sparrowhawk-ea/fmm-core#mcp-debouncemsec) | number
[dynamicLabels](https://github.com/sparrowhawk-ea/fmm-core#mcp-dynamiclabele) | string[]
formGroup | FormGroup | | FormGroup that contains the form's controls.
[framework](https://github.com/sparrowhawk-ea/fmm-core#mcp-framework) | [FmmFramework](https://github.com/sparrowhawk-ea/fmm-core#fmmframework)
key | string | | Minimap is recreated when key changes.  Any previous minimap is detached.
namelessControls | FmmNgNamelessControls (= Record<string, AbstractControl>) | | Additional FormControls, dentified by their form element's ID or NAME attribute, which may not be discoverable by traversing up the DOM tree and looking up formArrayName, formControlName, or formGroupName attribute on DOM elements.
[page](https://github.com/sparrowhawk-ea/fmm-core#mcp-page) | HTMLElement
panel | [FmmNgPanel](#fmmngpanel) | &check;
[title](https://github.com/sparrowhawk-ea/fmm-core#mcp-title) | string | &check;
[usePanelDetail](https://github.com/sparrowhawk-ea/fmm-core#mcp-usepaneldetail) | existential
[useWidthToScale](https://github.com/sparrowhawk-ea/fmm-core#mcp-usewidthtoscale) | existential
[verbosity](https://github.com/sparrowhawk-ea/fmm-core#mcp-verbosity) | number
[widgetFactories](https://github.com/sparrowhawk-ea/fmm-core#mcp-widgetfactories) | [FmmWidgetFactory](https://github.com/sparrowhawk-ea/fmm-core#fmmwidgetfactory)[]

Event | Parameter | Description
--- | --- | ---
update | [FmmMinimapSnapshot](https://github.com/sparrowhawk-ea/fmm-core#fmmminimapsnapshot) | Dispatched when the minimap updates itself for whatever reason.

| Method
| ---
| [destructor](https://github.com/sparrowhawk-ea/fmm-core#mm-destructor)
| [takeSnapshot](https://github.com/sparrowhawk-ea/fmm-core#mm-takesnapshot)

***
## FmmNgPanel
Component to create and manage a [FmmPanel](https://github.com/sparrowhawk-ea/fmm-core#fmmpanel).

Attribute | Type | Required
--- | --- | :---:
[detailParent](https://github.com/sparrowhawk-ea/fmm-core#pcp-detailparent) | HTMLDivElement
[vertical](https://github.com/sparrowhawk-ea/fmm-core#pcp-vertical) | existential

| Method
| ---
| [destroyDetached](https://github.com/sparrowhawk-ea/fmm-core#pm-destroydetached)
