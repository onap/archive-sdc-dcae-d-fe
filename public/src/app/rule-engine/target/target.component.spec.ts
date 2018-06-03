import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// component
import { TargetComponent } from './target.component';

describe('TargetComponent', () => {
  let component: TargetComponent;
  let fixture: ComponentFixture<TargetComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          BrowserAnimationsModule,
          MatButtonModule,
          MatIconModule
        ],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [TargetComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(TargetComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should open target tree when click on button', () => {
    const openTargetElement = fixture.debugElement
      .query(By.css('span[data-tests-id=openTargetTree]'))
      .nativeElement.click();
    fixture.detectChanges();
    const treeContainer = fixture.debugElement.query(
      By.css('.filter-container')
    );
    expect(treeContainer).not.toBeNull();
  });

  it('should toggle target tree when clicking 2 times on button', () => {
    fixture.debugElement
      .query(By.css('span[data-tests-id=openTargetTree]'))
      .nativeElement.click();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('span[data-tests-id=openTargetTree]'))
      .nativeElement.click();
    fixture.detectChanges();
    const treeContainer = fixture.debugElement.query(
      By.css('.filter-container')
    );
    expect(treeContainer).toBeNull();
  });

  // it('check when input change', () => {   tree.setData({nodes: _nodes, options:
  // null, events: null});   component.filterFn('liav', tree); });
});
