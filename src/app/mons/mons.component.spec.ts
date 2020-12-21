import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsComponent } from './mons.component';

describe('MonsComponent', () => {
  let component: MonsComponent;
  let fixture: ComponentFixture<MonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
