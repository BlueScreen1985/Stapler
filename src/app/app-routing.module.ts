import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';


const routes: Routes = [
  { path: 'main', component: MainPageComponent },
  { path: 'start', component: StartPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '', redirectTo: '/start', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
