import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResetComponent} from './reset.component';


const routes: Routes = [{ path: ':token', component: ResetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetRoutingModule { }
