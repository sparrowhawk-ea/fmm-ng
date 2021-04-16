# Form Minimap Angular
Angular module with components for [Form Minimap](https://github.com/sparrowhawk-ea/fmmp-core).
Please consult that documentation for further information on the concepts mentioned below.
Please note that all boolean attributes are existenial (value ignored) rather than having a boolean value.

***
## FmmNgModule
Module containing all the components.

| Components
| ---
| [FmmNgMinimap](#fmmngminimap)
| [FmmNgPanel](#fmmngpanel)

***
## FmmNgMinimap
Component to create and manage a [FmmMinimap](https://github.com/sparrowhawk-ea/fmmp-core#fmmminimap).
The minimap is detached when this component is destroyed.

Attribute | Type | Required | Description
--- | --- | :---: | ---
[aggregateLabels](https://github.com/sparrowhawk-ea/fmmp-core#mcp-aggregatelabels) | [FmmMapString](https://github.com/sparrowhawk-ea/fmmp-core#fmmmapstring)
[anchor](https://github.com/sparrowhawk-ea/fmmp-core#mcp-anchor) | HTMLElement
[customWidgetIds](https://github.com/sparrowhawk-ea/fmmp-core#mm-compose-customwidgetids) | string[]
[debounceMsec](https://github.com/sparrowhawk-ea/fmmp-core#mcp-debouncemsec) | number
[dynamicLabels](https://github.com/sparrowhawk-ea/fmmp-core#mcp-dynamiclabele) | string[]
formGroup | FormGroup | | FormGroup that contains the form's controls.
[framework](https://github.com/sparrowhawk-ea/fmmp-core#mcp-framework) | [FmmFramework](https://github.com/sparrowhawk-ea/fmmp-core#fmmframework)
key | string | | Minimap is recreated when key changes.  Any previous minimap is detached.
namelessControls | FmmNgNamelessControls (= Record<string, AbstractControl>) | | Additional FormControls, dentified by their form element's ID or NAME attribute, which may not be discoverable by traversing up the DOM tree and looking up formArrayName, formControlName, or formGroupName attribute on DOM elements.
[page](https://github.com/sparrowhawk-ea/fmmp-core#mcp-page) | HTMLElement
panel | [FmmNgPanel](#fmmngpanel) | &check;
[title](https://github.com/sparrowhawk-ea/fmmp-core#mcp-title) | string | &check;
[usePanelDetail](https://github.com/sparrowhawk-ea/fmmp-core#mcp-usepaneldetail) | existential
[useWidthToScale](https://github.com/sparrowhawk-ea/fmmp-core#mcp-usewidthtoscale) | existential
[verbosity](https://github.com/sparrowhawk-ea/fmmp-core#mcp-verbosity) | number
[widgetFactories](https://github.com/sparrowhawk-ea/fmmp-core#mcp-widgetfactories) | [FmmWidgetFactory](https://github.com/sparrowhawk-ea/fmmp-core#fmmwidgetfactory)[]

Event | Parameter | Description
--- | --- | ---
update | [FmmMinimapSnapshot](https://github.com/sparrowhawk-ea/fmmp-core#fmmminimapsnapshot) | Dispatched when the minimap updates itself for whatever reason.

| Method
| ---
| [destructor](https://github.com/sparrowhawk-ea/fmmp-core#mm-destructor)
| [takeSnapshot](https://github.com/sparrowhawk-ea/fmmp-core#mm-takesnapshot)

***
## FmmNgPanel
Component to create and manage a [FmmPanel](https://github.com/sparrowhawk-ea/fmmp-core#fmmmpanel).

Attribute | Type | Required
--- | --- | :---:
[detailParent](https://github.com/sparrowhawk-ea/fmmp-core#pcp-detailparent) | HTMLDivElement | &check;
[vertical](https://github.com/sparrowhawk-ea/fmmp-core#pcp-vertical) | existential

| Method
| ---
| [destroyDetached](https://github.com/sparrowhawk-ea/fmmp-core#pm-destroydetached)
