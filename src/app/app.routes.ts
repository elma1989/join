import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => 
            import('./main-content/main-content.component').then(m => m.MainContentComponent)
    },
];
