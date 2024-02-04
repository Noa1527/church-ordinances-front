import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '../environments/environement';
import { enableProdMode } from '@angular/core';
import { appConfig } from 'src/app/app.config';
import { AppComponent } from 'src/app/app.component';

if ( environment.production )
{
    enableProdMode();
}
bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
);