import { NgModule } from "@angular/core";
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeRoutingModule } from './home-routing.module';
import { PipesModule } from "../shared/pipes/pipes.module";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { SearchModule } from "../shared/components/search/search.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ConquestService } from "../shared/services/conquest.service";
import { GoogleAnalyticsEventsService } from "../shared/services/google-analytics-events.service";
import { PlayerService } from "../shared/services/player.service";
import { AllianceService } from "../shared/services/alliance.service";

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HomeRoutingModule,
    PipesModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    SearchModule,
    FormsModule,
    NgxChartsModule
  ],
  providers: [ConquestService, GoogleAnalyticsEventsService, PlayerService, AllianceService]
})

export class HomeModule {}

