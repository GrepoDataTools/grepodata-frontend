import { NgModule } from "@angular/core";
import { SearchComponent } from "./search.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PlayerService } from "../../services/player.service";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';
import { AllianceService } from '../../services/alliance.service';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {PipesModule} from '../../pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [SearchComponent],
  exports: [SearchComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HttpClientModule,
    TranslateModule,
    PipesModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    RouterModule
  ],
  providers: [PlayerService, AllianceService]
})
export class SearchModule {}
