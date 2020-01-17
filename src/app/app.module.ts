// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Angular CDK imports
import { DragDropModule } from '@angular/cdk/drag-drop';

// Misc imports
import { NgxElectronModule } from 'ngx-electron';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'hammerjs';

// App imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonComponent } from './components/button/button.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DropUploaderDirective } from './directives/drop-uploader.directive';
import { InputComponent } from './components/input/input.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { SelectComponent } from './components/select/select.component';
import { RadioComponent } from './components/radio/radio.component';
import { RippleDirective } from './directives/ripple.directive';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DropUploaderDirective,
    RippleDirective,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    RadioComponent,
    SlideToggleComponent,
    HeaderComponent,
    DocumentListComponent,
    MainPageComponent,
    StartPageComponent,
    SettingsPageComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    NgxElectronModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
