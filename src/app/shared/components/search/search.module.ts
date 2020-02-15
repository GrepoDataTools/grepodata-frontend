import { NgModule } from "@angular/core";
import { SearchComponent } from "./search.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PlayerService } from "../../services/player.service";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';
import { AllianceService } from '../../services/alliance.service';

@NgModule({
  declarations: [SearchComponent],
  exports: [SearchComponent],
  imports: [CommonModule, FontAwesomeModule, HttpClientModule, TranslateModule],
  providers: [PlayerService, AllianceService]
})
export class SearchModule {}
