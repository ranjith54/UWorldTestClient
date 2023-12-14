import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTrackingComponent } from './video-tracking.component';

describe('VideoTrackingComponent', () => {
  let component: VideoTrackingComponent;
  let fixture: ComponentFixture<VideoTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
