import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';

import { FlexLayoutModule } from '@angular/flex-layout';

import { RecaptchaModule } from 'ng-recaptcha';

// import { NgxTypeaheadModule } from 'ngx-typeahead';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule, Routes } from '@angular/router';

import {AppComponent, DiffFilter, DiffFilterNonZero, NumberFilter, Datex, ValuesPipe, IndexDate} from './app.component';
import { HeaderComponent, ContactDialog } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { SearchComponent } from './search/search.component';
import { ScoreboardComponent, BBScoreboardDialog, OverviewDialog, PlayerOverviewDialog, AllianceOverviewDialog } from './scoreboard/scoreboard.component';
import {PlayerComponent, TownDialog} from './player/player.component';
import { AllianceComponent } from './alliance/alliance.component';
import { AdvertorialComponent } from './advertorial/advertorial.component';
import { RankingComponent } from './ranking/ranking.component';
import {
	ChangekeyDialog, IndexDisclaimerDialog, IndexerComponent, NewIndexDialog, ResetOwnersDialog, InstallDialog,
	ForgotKeysDialog, BBDialog, HideNoLossPipe, EditOwnersDialog, BBLossPipe, UnitIconPipe, CleanIntelDialog
} from './indexer/indexer.component';
import { FooterComponent, DisclaimerDialog } from './footer/footer.component';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { IndexTownComponent } from './indexer/town/town.component';
import { IndexPlayerComponent } from './indexer/player/player.component';
import { IndexAllianceComponent } from './indexer/alliance/alliance.component';
import { IndexSearchComponent } from './indexer/search/search.component';
import { ActionComponent } from './indexer/action/action.component';
import { ConquestComponent } from './conquest/conquest.component';
import {GoogleAnalyticsEventsService} from "./services/google-analytics-events.service";
import { CompareComponent } from './compare/compare.component';
import {CompareSnackbar} from "./compare/compare.service";
import { MessageComponent } from './message/message.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { AllianceChangeComponent } from './alliance-change/alliance-change.component';

import { Globals } from './globals';
import { PrivacyComponent } from './privacy/privacy.component';
import { IndexVersionComponent } from './index-version/index-version.component';
import { DiscordComponent } from './discord/discord.component';
import { FaqComponent } from './faq/faq.component';
import { DonatedComponent } from './donated/donated.component'
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import {ConquestDialog} from "./conquest/conquest.service";
import {UnitModule} from "./advertorial/unit/unit.module";
import { TableComponent } from './indexer/table/table.component';
import { AnalyticsComponent } from './indexer/analytics/analytics.component';

const appRoutes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'forgot', component: ForgotComponent },
  { path: 'points/:world/:date', component: ScoreboardComponent },
  { path: 'points/:world', component: ScoreboardComponent },
  { path: 'm/:world', component: ScoreboardComponent },
  { path: 'points', component: ScoreboardComponent },
  // { path: 'world/:world', component: WorldComponent },
  { path: 'ranking/:type/:world/:sort/:offset/:highlight', component: RankingComponent },
  { path: 'ranking/:type/:world/:sort/:offset', component: RankingComponent },
  { path: 'ranking/:type/:world/:sort', component: RankingComponent },
  { path: 'ranking/:type/:world', component: RankingComponent },
  { path: 'ranking/:world', component: RankingComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'message', component: MessageComponent },
  { path: 'donated', component: DonatedComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'changelog', component: ChangelogComponent },
  { path: 'compare/:type/:world', component: CompareComponent },
  { path: 'analytics',  component: AnalyticsComponent },
  { path: 'indexer/player/:key/:world/:id',  component: IndexPlayerComponent },
  { path: 'indexer/alliance/:key/:world/:id',  component: IndexAllianceComponent },
  { path: 'indexer/town/:key/:world/:id',  component: IndexTownComponent },
  { path: 'indexer/action/:token',  component: ActionComponent },
  { path: 'indexer/:key',  component: IndexerComponent },
  { path: 'indexer',  component: IndexerComponent },
  { path: 'player/:world/:id',  component: PlayerComponent },
  { path: 'player',  component: PlayerComponent },
  { path: 'alliance/:world/:id', component: AllianceComponent },
  { path: 'alliance', component: AllianceComponent },
  { path: 'conquest/:type/:world/:id', component: ConquestComponent },
  { path: 'changes/:type/:world/:id', component: AllianceChangeComponent },
  { path: 'conquest', component: ConquestComponent },
  { path: 'discord', component: DiscordComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'test', component: ContentComponent },
  { path: '', component: ContentComponent },
  { path: '**', component: ContentComponent }
];

export function jwtTokenGetter(): any {
	return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    SearchComponent,
    ScoreboardComponent,
    BBScoreboardDialog,
    OverviewDialog,
		ConquestDialog,
    PlayerOverviewDialog,
    AllianceOverviewDialog,
    PlayerComponent,
    AllianceComponent,
    AdvertorialComponent,
    TownDialog,
    DisclaimerDialog,
    ContactDialog,
    ChangekeyDialog,
		CleanIntelDialog,
    ResetOwnersDialog,
    ForgotKeysDialog,
    EditOwnersDialog,
    IndexDisclaimerDialog,
    InstallDialog,
    BBDialog,
    NewIndexDialog,
    DiffFilterNonZero,
    DiffFilter,
    NumberFilter,
    Datex,
    IndexDate,
    ValuesPipe,
    HideNoLossPipe,
    BBLossPipe,
    UnitIconPipe,
    RankingComponent,
    IndexerComponent,
    FooterComponent,
    IndexTownComponent,
    IndexPlayerComponent,
    IndexAllianceComponent,
    IndexSearchComponent,
    ActionComponent,
    ConquestComponent,
    CompareComponent,
    CompareSnackbar,
    MessageComponent,
    ChangelogComponent,
    AllianceChangeComponent,
    PrivacyComponent,
    IndexVersionComponent,
    DiscordComponent,
    FaqComponent,
    DonatedComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ForgotComponent,
    TableComponent,
    AnalyticsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatTabsModule,
		MatPaginatorModule,
    MatChipsModule,
    RecaptchaModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
    ),
    HttpClientModule,
    HttpClientJsonpModule,
		ShareButtonsModule.forRoot(),
		UnitModule.forRoot()
  ],
  providers: [
    GoogleAnalyticsEventsService,
    Globals
  ],
  bootstrap: [AppComponent],
  entryComponents: [TownDialog, DisclaimerDialog, ContactDialog, ChangekeyDialog, CleanIntelDialog, IndexDisclaimerDialog, NewIndexDialog, ResetOwnersDialog, ForgotKeysDialog, EditOwnersDialog, InstallDialog, BBDialog, BBScoreboardDialog, OverviewDialog, ConquestDialog, PlayerOverviewDialog, AllianceOverviewDialog, CompareSnackbar]
})
export class AppModule {

}
