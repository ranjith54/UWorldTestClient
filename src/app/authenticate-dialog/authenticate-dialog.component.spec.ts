import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateDialogComponent } from './authenticate-dialog.component';

describe('AuthenticateDialogComponent', () => {
  let component: AuthenticateDialogComponent;
  let fixture: ComponentFixture<AuthenticateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
