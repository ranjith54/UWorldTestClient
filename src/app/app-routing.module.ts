import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TestInterfaceComponent } from './test-interface/test-interface.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { WebcamComponent } from './webcam/webcam.component';
import { WebsiteComponent } from './website/website.component';
import { ProfilesComponent } from './profiles/profiles.component';

const routes: Routes = [
  {path: '', component:WebsiteComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'test-interface/:assignmentId', component: TestInterfaceComponent},
  {path: 'instructions/:assignmentId', component: InstructionsComponent},
  {path: 'face-api', component: WebcamComponent},
  {path: 'profiles', component: ProfilesComponent},
  { path: '**', redirectTo:'' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
