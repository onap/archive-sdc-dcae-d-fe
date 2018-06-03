import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';

describe('DiagramComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LoaderComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
