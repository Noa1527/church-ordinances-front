import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '../environments/environement';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { appConfig } from 'src/app/app.config';
import { AppComponent } from 'src/app/app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

if ( environment.production )
{
    enableProdMode();
}
bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
);