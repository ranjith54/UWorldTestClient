import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { WebcamModule } from 'ngx-webcam';
import { CamDialogComponent } from './cam-dialog/cam-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { TestInterfaceComponent } from './test-interface/test-interface.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { WebcamComponent } from './webcam/webcam.component';
import { CommonServiceService } from './common-service.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticateDialogComponent } from './authenticate-dialog/authenticate-dialog.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { VideoTrackingComponent } from './video-tracking/video-tracking.component';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    RegisterComponent,
    CamDialogComponent,
    HomeComponent,
    TestInterfaceComponent,
    InstructionsComponent,
    WebcamComponent,
    AuthenticateDialogComponent,
    VideoTrackingComponent,
    WarningDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    WebcamModule,
    MatDialogModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [CommonServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
