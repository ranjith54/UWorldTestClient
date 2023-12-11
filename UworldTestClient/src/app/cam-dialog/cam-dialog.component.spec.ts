import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamDialogComponent } from './cam-dialog.component';

describe('CamDialogComponent', () => {
  let component: CamDialogComponent;
  let fixture: ComponentFixture<CamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
