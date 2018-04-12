import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import { ConditionComponent } from './condition.component';

describe('Condition Component', () => {
  let component: ConditionComponent;
  let fixture: ComponentFixture<ConditionComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          HttpModule,
          MatDialogModule,
          MatButtonModule,
          MatIconModule
        ],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [ConditionComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(ConditionComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
