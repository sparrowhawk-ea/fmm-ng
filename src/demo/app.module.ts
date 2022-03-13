import {
	Component,
	Directive,
	ElementRef,
	Injector,
	Input,
	NgModule,
	OnDestroy,
	OnInit,
	Pipe,
	PipeTransform,
	Provider,
	ViewChild,
	forwardRef,
	AfterViewInit
} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
	NgControl,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Ea } from '@eafmm/demo';
import { Fmm, FmmBootstrap4 } from '@eafmm/core';
import { FmmNgMaterial, FmmNgMinimap, FmmNgModule, FmmNgNamelessControls, FmmNgPanel } from '../public-api';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipList, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface NgControlsMap {
	[key: string]: AbstractControl;
}

// =================================================================================================================================
//						A P P C O M P O N E N T
// =================================================================================================================================
@Component({
	selector: 'app-root',
	template: ` <div #page>
		<div class="headbar">
			<div class="heading">
				<h1>Earthsea - Form Minimap Angular</h1>
				<div>Ursule K. LeGuin -- <select (change)='s.n = $event.target.selectedIndex'>
						<option *ngFor="let t of s.t" [value]="t">{{ t }}</option>
					</select>
				</div><br/>
				A minimap can be fixed in a panel or <input type='checkbox' (change)='destroyDetached(s.a = $event.target.checked)'/>
					popped up from an anchor.<br/>
				Detail view can shown in the panel or <input type='checkbox' (change)='destroyDetached(s.d = $event.target.checked)'/>
					floated per minimap.
			</div>
			<fmm-ng-panel #panel [detailParent]="detail" [minimapsCount]="s.t.length" class="fmm-panel"></fmm-ng-panel>
			<div #detail class="detail" [style.display]="s.d? 'none': 'block'"></div>
			<div class='anchors'>
				<div #anchor0 [class.active]="s.n === 0"></div>
				<div #anchor1 [class.active]="s.n === 1"></div>
			</div>
			<div style="clear: both;"></div>
		</div>
		<ng-container [ngSwitch]="s.n">
			<bootstrap4 *ngSwitchCase="0" [mkey]="'0'+s.a+s.d" [anchor]="s.a? anchor0: null" [page]="page" [panel]="panel" [title]="s.t[0]"></bootstrap4>
			<material *ngSwitchCase="1" [mkey]="'1'+s.a+s.d" [anchor]="s.a? anchor1: null" [page]="page" [panel]="panel" [title]="s.t[1]"></material>
			<div *ngSwitchDefault></div>
		</ng-container>
	</div>`,
	styles: [Fmm.CSS, Ea.css]
})
export class AppComponent {
	@ViewChild('panel', { static: true }) private readonly panel?: FmmNgPanel;
	public s = { a: false, d: false, n: 0, t: ['Bootstrap4', 'Material'] };

	// =============================================================================================================================
	public destroyDetached(_: boolean): void {
		window.setTimeout(() => this.panel?.destroyDetached(), 10);
	}
}

// =================================================================================================================================
//						B A S E C O M P O N E N T
// =================================================================================================================================
@Directive()
export abstract class BaseComponent extends Ea implements OnDestroy {
	@Input() public anchor?: HTMLElement;
	@Input() public mkey = '';
	@Input() public page?: HTMLElement;
	@Input() public panel?: FmmNgPanel;
	@Input() public title = '';
	@ViewChild('minimap', { static: true }) private readonly minimap?: FmmNgMinimap;

	public readonly aggregateLabels = Ea.aggregateLabels;
	public readonly adventures = Ea.adventures;
	public readonly controls = Ea.controls;
	public readonly formGroup: FormGroup;
	public readonly messages = Ea.messages;
	public readonly namelessControls: FmmNgNamelessControls;
	public readonly quotes = Ea.quotes;
	public realNames = new FormControl(''); // to demonstrate attaching without formControlName
	protected readonly subscription = new Subscription();

	// =============================================================================================================================
	protected constructor(fb: FormBuilder) {
		super();
		this.formGroup = fb.group({
			/* eslint-disable @typescript-eslint/unbound-method */
			adventure: ['', Validators.required],
			agree: [false, Validators.requiredTrue],
			danceDate: [{ value: '', disabled: true }],
			danceRange: [{ value: '', disabled: true }, Validators.min(7)],
			danceToggle: ['', Validators.requiredTrue],
			email: ['', Validators.email],
			quoteRadios: ['', Validators.required],
			realName: fb.group({
				name: ['', [Validators.required, Validators.minLength(6)]]
			}),
			realNames: this.realNames,
			useName: fb.group({
				name: ['', Validators.required] // duplicate formControlName in HTML tag
			})
			/* eslint-enable @typescript-eslint/unbound-method */
		});
		this.namelessControls = {
			// HTML elements without formControlName attribute to identify their FormControl
			realNamesId: this.realNames
		};
		this.subscription.add(
			this.f.danceToggle.statusChanges.subscribe((status: string) => {
				if (status === 'VALID') {
					this.f.danceDate.enable();
					this.f.danceRange.enable();
				} else {
					this.f.danceDate.disable();
					this.f.danceRange.disable();
				}
			})
		);
	}

	// =============================================================================================================================
	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	// =============================================================================================================================
	public get f(): NgControlsMap {
		return this.formGroup.controls;
	}

	// =============================================================================================================================
	public get realName(): NgControlsMap {
		return (this.f.realName as FormGroup).controls;
	}

	// =============================================================================================================================
	public get useName(): NgControlsMap {
		return (this.f.useName as FormGroup).controls;
	}

	// =============================================================================================================================
	public parseIntPrefix(s: string): number {
		return parseInt(s);
	}

	// =============================================================================================================================
	public submit(): void {
		super.submit();
		alert(JSON.stringify(this.formGroup.value, undefined, 2));
	}

	// =============================================================================================================================
	protected takeSnapshot(): void {
		if (this.minimap) this.minimap.takeSnapshot();
	}

	// =============================================================================================================================
	protected updateRealNamesSelected(namesRemoved: string[]): void {
		const value = this.f.realNames.value as string | string[]; // updateValueAndValidity() doesn't seem to do this
		this.f.realNames.setValue(typeof value === 'string' ? '' : value.filter((v: string) => !namesRemoved.includes(v)));
	}
}

// =================================================================================================================================
//						B O O T S T R A P 4 C O M P O N E N T
// =================================================================================================================================
@Component({
	selector: 'bootstrap4',
	template: ` <div class="card">
		<form class="card-body" [formGroup]="formGroup" (ngSubmit)="submit()">
			<fmm-ng-minimap
				#minimap
				[aggregateLabels]="aggregateLabels"
				[anchor]="anchor"
				[customElementIds]="customElementIds"
				[formGroup]="formGroup"
				[framework]="framework"
				[key]="mkey"
				[namelessControls]="namelessControls"
				[ordinal]="parseIntPrefix(mkey)"
				[page]="page"
				[panel]="mkey.endsWith('truetrue')? undefined: panel"
				[title]="title"
				(update)="onUpdate()"
				[usePanelDetail]="mkey.endsWith('false')? 'true': undefined"
				[verbosity]="1"
				[zoomFactor]="2.0"
			></fmm-ng-minimap>
			<div class="form-row">
				<div class="form-group col-md-6 col-sm-12" formGroupName="useName">
					<label for="useName">{{ controls.useName.label }}</label>
					<input
						id="useName"
						[placeholder]="controls.useName.placeholder"
						formControlName="name"
						class="form-control"
						[class.is-invalid]="submitted && useName.name.errors"
					/>
					<div *ngIf="submitted && useName.name.errors" class="invalid-feedback">
						{{ messages.useName.min }}
					</div>
				</div>
				<div class="form-group col-md-6 col-sm-12" formGroupName="realName">
					<label for="realName">{{ controls.realName.label }}</label>
					<input
						id="realName"
						type="password"
						[placeholder]="controls.realName.placeholder"
						formControlName="name"
						class="form-control"
						[class.is-invalid]="submitted && realName.name.errors"
					/>
					<div *ngIf="submitted && realName.name.errors" class="invalid-feedback">
						<div *ngIf="realName.name.errors.required">
							{{ messages.realName.required }}
						</div>
						<div *ngIf="realName.name.errors.minlength">
							{{ messages.realName.min }}
						</div>
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="col-md-9 col-sm-12 px-2">
					<label>{{ controls.quoteRadios.label }}</label>
					<div *ngFor="let q of quotes | keyvalue | randomize: 5; last as isLast">
						<div class="form-group form-check pl-5 my-2">
							<input
								class="form-check-input"
								type="radio"
								[placeholder]="controls.quoteRadios.placeholder"
								formControlName="quoteRadios"
								[id]="'quoteRadios-' + q.key"
								[value]="q.key"
								[class.is-invalid]="submitted && f.quoteRadios.errors"
							/>
							<label class="form-check-label" [for]="'quoteRadios-' + q.key">{{ q.value }}</label>
							<div *ngIf="isLast && submitted && f.quoteRadios.errors" class="invalid-feedback">
								{{ messages.quoteRadios.required }}
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-3 col-sm-12">
					<div class="form-group col-md-12 col-sm-12 mx-0 px-0">
						<label for="email">{{ controls.email.label }}</label>
						<input
							id="email"
							type="email"
							[placeholder]="controls.email.placeholder"
							formControlName="email"
							class="form-control"
							[class.is-invalid]="submitted && f.email.errors"
						/>
						<div *ngIf="submitted && f.email.errors" class="invalid-feedback">
							{{ messages.email.email }}
						</div>
					</div>
					<div class="form-group col-md-12 col-sm-12 mx-0 px-0">
						<label for="adventure">{{ controls.adventure.label }}</label>
						<select
							id="adventure"
							formControlName="adventure"
							class="form-control"
							[class.is-invalid]="submitted && f.adventure.errors"
						>
							<option *ngFor="let a of adventures | keyvalue" [value]="a.key">{{ a.value }}</option>
						</select>
						<div *ngIf="submitted && f.adventure.errors" class="invalid-feedback">
							{{ messages.adventure.required }}
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div class="form-row">
				<div class="form-group form-check col-md-3 col-sm-6 px-2 text-center my-auto">
					<input
						type="checkbox"
						formControlName="danceToggle"
						id="danceToggle"
						class="form-check-input"
						[class.is-invalid]="submitted && f.danceToggle.errors"
					/>
					<label for="danceToggle" class="form-check-label">{{ controls.danceToggle.label }}</label>
					<div *ngIf="submitted && f.danceToggle.errors" class="invalid-feedback">
						{{ messages.danceToggle.required }}
					</div>
				</div>
				<div class="form-group col-md-3 col-sm-6 mx-0 px-2">
					<label for="danceDate">{{ controls.danceDate.label }}</label>
					<input
						id="danceDate"
						type="date"
						[placeholder]="controls.danceDate.placeholder"
						formControlName="danceDate"
						class="form-control"
						[class.is-invalid]="submitted && f.danceDate.errors"
					/>
					<div *ngIf="submitted && f.danceDate.errors" class="invalid-feedback">
						{{ messages.danceDate.required }}
					</div>
				</div>
				<div class="form-group col-md-3 col-sm-6 mx-0 px-2">
					<label for="danceRange">{{ controls.danceRange.label }}</label>
					<input
						id="danceRange"
						type="number"
						[min]="controls.danceRange.min"
						[max]="controls.danceRange.max"
						[placeholder]="controls.danceRange.placeholder"
						formControlName="danceRange"
						class="form-control"
						[class.is-invalid]="submitted && f.danceRange.errors"
					/>
					<div *ngIf="submitted && f.danceRange.errors" class="invalid-feedback">
						{{ messages.danceRange.min }}
					</div>
				</div>
				<div class="form-group col-md-3 col-sm-6 mx-0 px-0">
					<label for="deed">{{ controls.deed.label }}</label>
					<textarea
						id="deed"
						[placeholder]="controls.deed.placeholder"
						formControlName="deed"
						class="form-control"
						[class.is-invalid]="submitted && f.deed.errors"
					></textarea>
					<div *ngIf="submitted && f.deed.errors" class="invalid-feedback">
						{{ messages.deed.required }}
					</div>
				</div>
			</div>
			<hr />
			<div class="form-row">
				<div class="form-group col-md-3 col-sm-6">
					<label>{{ controls.useNamesAll.label }}</label>
					<div style="height: 5em; overflow-x: hidden; overflow-y: scroll;">
						<div *ngFor="let n of names1000; index as i" class="form-group form-check m-0">
							<input
								class="form-check-input"
								type="checkbox"
								formControlName="useNamesAll"
								multi
								[value]="i"
								[id]="'useNamesAll-' + i"
							/>
							<label class="form-check-label" [for]="'useNamesAll-' + i">{{ n }}</label>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-sm-12 px-2">
					<div class="form-group">
						<label class="align-top">Use Names (Alphabetical)</label>
						<button type="button" class="btn btn-sm btn-outline-dark float-right" (click)="removeUncheckedUseNames()">
							--
						</button>
						<button type="button" class="btn btn-sm btn-outline-dark float-right mr-1" (click)="addRandomUseName()">
							+
						</button>
						<hr class="clearfix" />
					</div>
					<div style="height: 3.5em; overflow-x: hidden; overflow-y: scroll;" formArrayName="useNames">
						<div
							*ngFor="let useName of useNamesShown; index as i"
							class="form-group form-check-inline col-md-3 col-sm-6 m-0 p-0"
						>
							<input
								class="form-check-input"
								type="checkbox"
								[placeholder]="'e.g. ' + useName"
								[formControlName]="i"
								[attr.data-fmminformarray]="true"
								[id]="'useNames-' + useName"
							/>
							<label class="form-check-label" [for]="'useNames-' + useName">{{ useName }}</label>
						</div>
					</div>
				</div>
				<div class="form-group col-md-3 col-sm-6">
					<label for="realNamesId">{{ controls.realNames.label }}</label>
					<select multiple size="4" id="realNamesId" [formControl]="realNames" class="form-control">
						<option *ngFor="let r of realNamesShown" [value]="r">{{ r }}</option>
					</select>
				</div>
			</div>
			<hr />
			<div class="form-group form-check">
				<input
					type="checkbox"
					formControlName="agree"
					id="agree"
					class="form-check-input"
					[class.is-invalid]="submitted && f.agree.errors"
				/>
				<label for="agree" class="form-check-label">{{ controls.agree.label }}</label>
				<div *ngIf="submitted && f.agree.errors" class="invalid-feedback">
					{{ messages.agree.required }}
				</div>
			</div>
			<div class="text-center">
				<button class="btn btn-primary mr-1">Submit</button>
				<button class="btn btn-secondary mr-1" type="reset" (click)="formGroup.reset()">Reset</button>
			</div>
		</form>
	</div>`,
	styleUrls: ['../../node_modules/bootstrap/scss/bootstrap.scss']
})
export class Bootstrap4Component extends BaseComponent {
	public readonly customElementIds: string[] = [];
	public readonly framework = FmmBootstrap4;

	// =============================================================================================================================
	public constructor(fb: FormBuilder) {
		super(fb);
		// form array with controls added/removed to deliberately change their indices
		// eslint-disable-next-line @typescript-eslint/unbound-method
		this.formGroup.addControl('deed', fb.control('', Validators.required));
		this.formGroup.addControl('useNamesAll', fb.control([]));
		const useNames = fb.array([]);
		this.formGroup.addControl('useNames', useNames);
		this.subscription.add(useNames.valueChanges.subscribe(() => this.updateRealNamesShown()));
	}

	// =============================================================================================================================
	protected useNamesAdded(index: number, _: string): void {
		const formArray = this.f.useNames as FormArray;
		if (index < 0) {
			formArray.push(new FormControl(false));
		} else {
			formArray.insert(index, new FormControl(false));
		}
	}

	// =============================================================================================================================
	protected useNamesGetSelected(): boolean[] {
		return (this.f.useNames as FormArray).controls.map(c => c.value as boolean);
	}

	// =============================================================================================================================
	protected useNamesRemoved(indexesRemovedInReverse: number[]): void {
		const formArray = this.f.useNames as FormArray;
		indexesRemovedInReverse.forEach(i => formArray.removeAt(i));
	}
}

// =================================================================================================================================
//						M A T E R I A L C O M P O N E N T
// =================================================================================================================================
@Component({
	selector: 'material',
	template: ` <mat-card class="mat-app-background">
		<form [formGroup]="formGroup" (ngSubmit)="submit()">
			<fmm-ng-minimap
				#minimap
				[aggregateLabels]="aggregateLabels"
				[anchor]="anchor"
				[customElementIds]="customElementIds"
				[formGroup]="formGroup"
				[framework]="framework"
				[key]="mkey"
				[namelessControls]="namelessControls"
				[ordinal]="parseIntPrefix(mkey)"
				[page]="page"
				[panel]="panel"
				[title]="title"
				(update)="onUpdate()"
				[usePanelDetail]="mkey.endsWith('false')? 'true': undefined"
				[verbosity]="1"
				[zoomFactor]="3.0"
			>
			</fmm-ng-minimap>
			<mat-card-content>
				<mat-grid-list cols="4" rowHeight="6em">
					<!-- NEXT ROW -->
					<mat-grid-tile colspan="2">
						<mat-form-field appearance="standard" formGroupName="useName">
							<mat-label>{{ controls.useName.label }}</mat-label>
							<input matInput [placeholder]="controls.useName.placeholder" formControlName="name" />
							<mat-error *ngIf="useName.name.errors">{{ messages.useName.required }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<mat-grid-tile colspan="2">
						<mat-form-field appearance="standard" formGroupName="realName">
							<mat-label>{{ controls.realName.label }}</mat-label>
							<input matInput type="password" [placeholder]="controls.realName.placeholder" formControlName="name" />
							<mat-error *ngIf="realName.name.errors?.required">{{ messages.realName.required }}</mat-error>
							<mat-error *ngIf="realName.name.errors?.minlength">{{ messages.realName.min }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<!-- NEXT ROW -->
					<mat-grid-tile colspan="3" rowspan="2">
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.quoteRadios.label }}</mat-label>
							<input matInput hidden formControlName="quoteRadiosHidden" />
							<br />
							<mat-radio-group formControlName="quoteRadios">
								<mat-radio-button
									*ngFor="let quoteRadios of quotes | keyvalue | randomize: 5; last as isLast"
									[id]="'quoteRadios-' + quoteRadios.key"
									[value]="quoteRadios.key"
								>
									{{ quoteRadios.value }}
								</mat-radio-button>
							</mat-radio-group>
							<mat-error *ngIf="f.quoteRadiosHidden.errors">{{ messages.quoteRadios.required }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<mat-grid-tile>
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.email.label }}</mat-label>
							<input matInput type="email" [placeholder]="controls.email.placeholder" formControlName="email" />
							<mat-error *ngIf="f.email.errors">{{ messages.email.email }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<mat-grid-tile>
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.adventure.label }}</mat-label>
							<mat-select id="adventure" [placeholder]="controls.adventure.placeholder" formControlName="adventure">
								<mat-option *ngFor="let a of adventures | keyvalue" [value]="a.key">{{ a.value }} </mat-option>
							</mat-select>
							<mat-error *ngIf="f.adventure.errors">{{ messages.adventure.required }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<!-- NEXT ROW -->
					<mat-grid-tile>
						<mat-form-field appearance="standard" class="no-label">
							<input matInput hidden formControlName="danceToggleHidden" />
							<mat-slide-toggle id="danceToggle" formControlName="danceToggle">{{
								controls.danceToggle.label
							}}</mat-slide-toggle>
							<mat-error *ngIf="f.danceToggleHidden.errors">{{ messages.danceToggle.required }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<mat-grid-tile>
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.danceDate.label }}</mat-label>
							<input
								matInput
								[placeholder]="controls.danceDate.placeholder"
								formControlName="danceDate"
								[matDatepicker]="picker"
							/>
							<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker></mat-datepicker>
							<mat-error *ngIf="f.danceDate.errors">{{ messages.danceDate.required }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<mat-grid-tile>
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.danceRange.label }}</mat-label>
							<input matInput hidden formControlName="danceRangeHidden" />
							<mat-slider
								id="danceRange"
								formControlName="danceRange"
								[min]="controls.danceRange.min"
								[max]="controls.danceRange.max"
								step="1"
								tickInterval="auto"
								thumbLabel
							>
							</mat-slider>
							<mat-error *ngIf="f.danceRange.errors">{{ messages.danceRange.min }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<mat-grid-tile>
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.adventureAuto.label }}</mat-label>
							<input
								matInput
								[placeholder]="controls.adventureAuto.placeholder"
								formControlName="adventureAuto"
								[matAutocomplete]="auto"
							/>
							<mat-autocomplete #auto="matAutocomplete" [displayWith]="displayAdventure">
								<mat-option *ngFor="let a of matchingAdventures | async" [value]="a[0]">
									{{ adventures[a[0]] }}
								</mat-option>
							</mat-autocomplete>
							<mat-error *ngIf="f.adventureAuto.errors">{{ messages.adventureAuto.required }}</mat-error>
						</mat-form-field>
					</mat-grid-tile>
					<!-- NEXT ROW -->
					<mat-grid-tile rowspan="3" class="vertical-grid-tile">
						<mat-form-field appearance="standard" id="useNames">
							<mat-label>{{ controls.useNamesAll.label }}</mat-label>
							<input matInput hidden />
							<br />
						</mat-form-field>
						<div style="width: 90%; overflow-x: hidden; overflow-y: scroll;">
							<mat-form-field appearance="standard"
								*ngFor="let n of names1000 | slice: 1:100; index as i"
								appearance="none"
								class="no-label no-padding"
							>
								<input matInput hidden formControlName="useNamesAllHidden" />
								<mat-checkbox formControlName="useNamesAll">{{ n }}</mat-checkbox>
							</mat-form-field>
							<mat-checkbox hidden formControlName="useNamesAll"></mat-checkbox>
						</div>
					</mat-grid-tile>
					<mat-grid-tile colspan="2" rowspan="3" class="vertical-grid-tile">
						<mat-form-field appearance="standard" id="useNames">
							<mat-label>{{ controls.useNames.label }}</mat-label>
							<button mat-icon-button type="button" (click)="removeUncheckedUseNames()">
								<mat-icon>remove</mat-icon>
							</button>
							<button mat-icon-button type="button" (click)="addRandomUseName()">
								<mat-icon>add</mat-icon>
							</button>
							<input matInput hidden formControlName="useNamesHidden" style="clear: both;" />
						</mat-form-field>
						<div style="width: 90%; overflow-x: hidden; overflow-y: scroll;">
							<label for="useNamesChipList" hidden>{{ controls.useNames.label }}</label>
							<mat-chip-list
								#chipList
								formControlName="useNamesChipList"
								multiple="true"
								selectable="true"
								(change)="chipsChanged()"
							>
								<mat-chip
									*ngFor="let useName of useNamesShown; index as i"
									selectable="true"
									(click)="chipList.chips.toArray()[i].toggleSelected(true)"
									>{{ useName }}</mat-chip
								>
							</mat-chip-list>
						</div>
					</mat-grid-tile>
					<mat-grid-tile rowspan="3" class="vertical-grid-tile">
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.realNames.label }}</mat-label>
							<mat-select
								multiple
								id="realNamesId"
								[placeholder]="controls.realNames.placeholder"
								[formControl]="realNames"
							>
								<mat-option *ngFor="let r of realNamesShown" [value]="r">{{ r }}</mat-option>
							</mat-select>
						</mat-form-field>
						<mat-form-field appearance="standard">
							<mat-label>{{ controls.realNames2.label }}</mat-label>
							<input matInput hidden formControlName="realNamesListboxHidden" />
							<br />
							<div style="height: 6rem; overflow-y: scroll;">
								<mat-selection-list id="realNamesListboxId" formControlName="realNamesListbox">
									<mat-list-option *ngFor="let r of realNamesShown" [value]="r">{{ r }} </mat-list-option>
								</mat-selection-list>
							</div>
						</mat-form-field>
					</mat-grid-tile>
				</mat-grid-list>
				<mat-form-field appearance="standard" class="no-label">
					<input matInput hidden formControlName="agreeHidden" />
					<mat-checkbox formControlName="agree">{{ controls.agree.label }}</mat-checkbox>
					<mat-error *ngIf="f.agreeHidden.errors">{{ messages.agree.required }}</mat-error>
				</mat-form-field>
			</mat-card-content>
			<mat-card-actions>
				<button mat-raised-button color="primary">Submit</button>
				<button mat-raised-button type="reset" (click)="formGroup.reset()">Reset</button>
			</mat-card-actions>
		</form>
	</mat-card>`,
	styles: [
		`
			mat-card-actions {
				text-align: center;
			}
			mat-form-field {
				width: 90%;
			}
			mat-radio-button,
			mat-slider {
				width: 100%;
			}
			mat-radio-group {
				margin-top: 5px;
			}
			#realNamesListboxId .mat-list-item-content {
				height: 24px;
			}
			#useNames button {
				float: right;
				margin: 0 10px 5px 10px;
				min-width: 0;
				width: 1em;
				height: 1em;
				line-height: 1em;
			}
		`
	]
})
export class MaterialComponent extends BaseComponent implements AfterViewInit {
	@ViewChild('chipList', { static: true }) private readonly chipList?: MatChipList;
	@ViewChild('chipList', { read: ElementRef, static: true }) private readonly chipListRef?: ElementRef<HTMLDivElement>;

	public readonly framework = FmmNgMaterial;
	public readonly matchingAdventures: Observable<string[][]>;
	public customElementIds: string[] = [];
	private chipListAsBooleanArray: boolean[] = [];

	// =============================================================================================================================
	public constructor(fb: FormBuilder) {
		super(fb);
		/* eslint-disable @typescript-eslint/unbound-method */
		const adventureAuto = fb.control('', Validators.required);
		this.formGroup.addControl('adventureAuto', adventureAuto);
		this.formGroup.addControl('realNamesListbox', fb.control(''));
		this.formGroup.addControl('useNamesAll', fb.control(''));
		this.formGroup.addControl('useNamesAllHidden', fb.control(''));
		this.formGroup.addControl('useNamesHidden', fb.control(''));
		const chipListControl = fb.control('');
		this.formGroup.addControl('useNamesChipList', chipListControl);
		/* eslint-enable @typescript-eslint/unbound-method */
		this.addShadowFormItem(fb, 'agree');
		this.addShadowFormItem(fb, 'danceRange');
		this.addShadowFormItem(fb, 'danceToggle');
		this.addShadowFormItem(fb, 'realNamesListbox');
		this.addShadowFormItem(fb, 'quoteRadios');
		const adventures = Object.entries(Ea.adventures).map(([k, v]) => [k, v.toLowerCase()]);
		this.matchingAdventures = adventureAuto.valueChanges.pipe(
			startWith<string, string[]>(''),
			map((val: string) => val?.toLowerCase()),
			map((val: string) => (val ? adventures.filter(([_k, v]) => v.startsWith(val)) : []))
		);
		this.subscription.add(chipListControl.valueChanges.subscribe(() => this.updateRealNamesShown()));
	}

	// =============================================================================================================================
	public chipsChanged(): void {
		const chips = this.chipList?.selected;
		const selected = Array.isArray(chips) ? chips.map(c => c.value as string) : [chips?.value as string];
		this.chipListAsBooleanArray = super.mapUseNamesToBooleanArray(selected);
	}

	// =============================================================================================================================
	public displayAdventure = (k: string): string => (k ? Ea.adventures[k] : ''); // => to use 'this'

	// =============================================================================================================================
	public ngAfterViewInit(): void {
		this.customElementIds = [
			'adventure',
			'danceRange',
			'danceToggle',
			'realNamesListboxId',
			'realNamesId'
		];
		if (this.chipListRef) this.customElementIds.push(this.chipListRef.nativeElement.id); // MAT-CHIP-LIST overwrites our id
	}

	// =============================================================================================================================
	protected useNamesAdded(_: number, _n: string): void {
		window.setTimeout(() => this.chipsChanged()); // to update chipListAsBooleanArray
	}

	// =============================================================================================================================
	protected useNamesGetSelected(): boolean[] {
		return this.chipListAsBooleanArray;
	}

	// =============================================================================================================================
	protected useNamesRemoved(indexesRemovedInReverse: number[]): void {
		const chips = this.chipList?.chips.toArray();
		if (chips) indexesRemovedInReverse.forEach(i => chips[i].remove());
		window.setTimeout(() => this.chipsChanged()); // to update chipListAsBooleanArray
	}

	// =============================================================================================================================
	// Add hidden control to show mat-error for the given control when it is inside mat-form-field
	private addShadowFormItem(fb: FormBuilder, name: string) {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const hidden = fb.control('', Validators.required);
		this.formGroup.addControl(name + 'Hidden', hidden);
		const nameControl = this.formGroup.get(name);
		if (nameControl) this.subscription.add(
			nameControl.statusChanges.subscribe((status: string) => hidden.setValue(status === 'VALID' ? 'Y' : ''))
		);
	}
}

// =================================================================================================================================
//						M U L T I C H E C K B O X C O N T R O L V A L U E A C C E S S O R
// =================================================================================================================================
// Adapted from https://github.com/angular/angular/blob/master/packages/forms/src/directives/radio_control_value_accessor.ts
export const MULTI_CHECKBOX_CONTROL_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => MultiCheckboxControlValueAccessor),
	multi: true
};
@Directive({
	selector:
		'input[type=checkbox][multi][formControlName],input[type=checkbox][multi][formControl],input[type=checkbox][multi][ngModel]',
	host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
	providers: [MULTI_CHECKBOX_CONTROL_VALUE_ACCESSOR]
})
export class MultiCheckboxControlValueAccessor implements ControlValueAccessor, OnDestroy, OnInit {
	@Input() private value = '';
	private control?: NgControl;

	// =============================================================================================================================
	public constructor(private readonly eRef: ElementRef<HTMLInputElement>, private readonly injector: Injector) { }

	// =============================================================================================================================
	public ngOnDestroy(): void {
		this.removeValue();
	}

	// =============================================================================================================================
	public ngOnInit(): void {
		if (this.value?.length === 0) throw new Error('checkbox must have value');
		this.control = this.injector.get(NgControl);
	}

	// =============================================================================================================================
	public onChange(): void {
		if (!this.eRef.nativeElement.checked) return this.removeValue();
		const values: string[] = (this.control?.value as string[]) || [];
		values.push(this.value);
		return this.changeCallback(values);
	}

	// =============================================================================================================================
	public onTouched(): void {
		/* may get redefined by registerOnTouch() */
	}

	// =============================================================================================================================
	public registerOnChange(fn: (_: string[]) => void): void {
		this.changeCallback = fn;
	}

	// =============================================================================================================================
	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	// =============================================================================================================================
	public setDisabledState(isDisabled: boolean): void {
		this.eRef.nativeElement.disabled = isDisabled;
	}

	// =============================================================================================================================
	public writeValue(values: string[]): void {
		this.eRef.nativeElement.checked = !!values?.includes(this.value);
	}

	// =============================================================================================================================
	private changeCallback(_: string[]): void {
		/* will get redefined by registerOnChange() */
	}

	// =============================================================================================================================
	private removeValue(): void {
		const values = this.control?.value as string[];
		const index = values ? values.findIndex(v => v === this.value) : -1;
		if (index < 0) return;
		values.splice(index, 1);
		this.changeCallback(values);
	}
}

// =================================================================================================================================
//						R A N D O M I Z E P I P E
// =================================================================================================================================
@Pipe({ name: 'randomize' })
export class RandomizePipe implements PipeTransform {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	public transform = Ea.randomize;
}

// =================================================================================================================================
//						A P P M O D U L E
// =================================================================================================================================
@NgModule({
	declarations: [AppComponent, Bootstrap4Component, MaterialComponent, MultiCheckboxControlValueAccessor, RandomizePipe],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		FmmNgModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDividerModule,
		MatFormFieldModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
