import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

// import '@angular/animations';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);