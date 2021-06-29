import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../libs/login/login.component';
import { AuthGuard, LoginGuard } from '../libs/login';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
		path: '',
		children: [
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [LoginGuard],
			},
			{
				path: '',
                component: MainComponent,
				// loadChildren: () =>
				// 	import('./main/main.module').then((m) => m.MainModule),
				// canLoad: [AuthGuard],
				canActivate: [AuthGuard],
			},
			{ path: '**', redirectTo: '' },
		],
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
