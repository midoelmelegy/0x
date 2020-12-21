import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonStoreComponent } from './mon-store.component';

describe('MonStoreComponent', () => {
  let component: MonStoreComponent;
  let fixture: ComponentFixture<MonStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
