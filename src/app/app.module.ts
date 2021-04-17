import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Component, Inject, NgModule} from '@angular/core';

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
import {MAT_SNACK_BAR_DATA, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

import { FlexLayoutModule } from '@angular/flex-layout';

import { RecaptchaModule } from 'ng-recaptcha';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule, Routes } from '@angular/router';

import {
    AppComponent,
    WorldNamePipe,
    IndexNamePipe,
    DiffFilter,
    DiffFilterNonZero,
    NumberFilter,
    Datex,
    ValuesPipe,
    IndexDate,
} from './app.component';
import { HeaderComponent, ContactDialog } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { SearchComponent } from './search/search.component';
import {
    ScoreboardComponent,
    BBScoreboardDialog,
    OverviewDialog,
    PlayerOverviewDialog,
    AllianceOverviewDialog,
} from './scoreboard/scoreboard.component';
import { PlayerComponent, TownDialog } from './player/player.component';
import { AllianceComponent } from './alliance/alliance.component';
import { AdvertorialComponent } from './advertorial/advertorial.component';
import { RankingComponent } from './ranking/ranking.component';
import {
    BBDialog,
    HideNoLossPipe,
    BBLossPipe,
    UnitIconPipe,
} from './indexer/utils';
import { FooterComponent, DisclaimerDialog } from './footer/footer.component';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { IndexTownComponent } from './indexer/town/town.component';
import { IndexPlayerComponent } from './indexer/player/player.component';
import { IndexAllianceComponent } from './indexer/alliance/alliance.component';
import { IndexSearchComponent } from './indexer/search/search.component';
import { ActionComponent } from './indexer/action/action.component';
import { ConquestComponent } from './conquest/conquest.component';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { CompareComponent } from './compare/compare.component';
import { CompareSnackbar } from './compare/compare.service';
import { MessageComponent } from './message/message.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { AllianceChangeComponent } from './alliance-change/alliance-change.component';

import { Globals } from './globals';
import { PrivacyComponent } from './privacy/privacy.component';
import { IndexVersionComponent } from './index-version/index-version.component';
import { DiscordComponent } from './discord/discord.component';
import { FaqComponent } from './faq/faq.component';
import { DonatedComponent } from './donated/donated.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { ConquestDialog } from './conquest/conquest.service';
import { UnitModule } from './advertorial/unit/unit.module';
import { TableComponent } from './indexer/table/table.component';
import { AnalyticsComponent } from './indexer/analytics/analytics.component';
import { SiegeComponent } from './indexer/siege/siege.component';
import { ConquestReportDialog, SiegeListDialog } from './indexer/siege/siege.service';
import { IntelComponent } from './auth/profile/components/intel/intel.component';
import { IndexesComponent } from './auth/profile/components/indexes/indexes.component';
import { LinkedAccountsComponent } from './auth/profile/components/linked-accounts/linked-accounts.component';
import { SettingsComponent } from './auth/profile/components/settings/settings.component';
import { DeleteAccountComponent } from './auth/profile/components/delete-account/delete-account.component';
import { ChangePasswordComponent } from './auth/profile/components/change-password/change-password.component';
import { UserscriptComponent } from './auth/profile/components/userscript/userscript.component';
import { AlertComponent } from './layout/alert/alert.component';
import { PaperComponent } from './layout/paper/paper.component';
import { BadgeComponent } from './layout/badge/badge.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { SharedModule } from './shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import 'zone.js/dist/zone';
import {MailListDialog} from './alliance/alliance.service';
import {BasicDialog} from './shared/dialogs/basic/basic.component';
import {NewIndexDialog} from './shared/dialogs/new-index/new-index.component';
import {ImportIndexDialog} from './shared/dialogs/import-index/import-index.component';
import {IndexSettingsDialog} from './shared/dialogs/index-settings/index-settings.component';
import {IndexMembersDialog} from './shared/dialogs/index-members/index-members.component';
import {ShareIndexDialog} from './shared/dialogs/share-index/share-index.component';
import {IntelSourceDialog} from './shared/dialogs/intel-source/intel-source.component';
import { ShareComponent } from './indexer/settings/share/share.component';
import { LandingPageComponent } from './indexer/landing-page/landing-page.component';
import { OverviewComponent } from './indexer/overview/overview.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ConfirmDeleteComponent } from './auth/confirm-delete/confirm-delete.component';
import {SidenavService} from './layout/sidebar/sidenav-service';
import { InviteComponent } from './indexer/invite/invite.component';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { BugReportComponent } from './auth/profile/components/bug-report/bug-report.component';
import {MatSortModule} from '@angular/material/sort';
import {BasicSnackbar} from './shared/snackbar/basic-snackbar.component';
import { IndexerBreadcrumbsComponent } from './layout/indexer-breadcrumbs/indexer-breadcrumbs.component';
import { PlayerActivityComponent } from './layout/player-activity/player-activity.component';

const appRoutes: Routes = [
    { path: 'login', component: LandingPageComponent },
    { path: 'register', component: LandingPageComponent },
    { path: 'forgot', component: LandingPageComponent },
    { path: 'indexer', component: LandingPageComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'profile/:activetab', component: ProfileComponent },
    { path: 'profile/:activetab/:key', component: ProfileComponent },
    { path: 'intel/:activetab/:world/:id', component: ProfileComponent },
    { path: 'intel/:activetab/:key/:world/:id', component: ProfileComponent },
    { path: 'reset/:token', component: ResetPasswordComponent },
    { path: 'delete/:token', component: ConfirmDeleteComponent },
    { path: 'points/:world/:date', component: ScoreboardComponent },
    { path: 'points/:world', component: ScoreboardComponent },
    { path: 'm/:world', component: ScoreboardComponent },
    { path: 'points', component: ScoreboardComponent },
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
    { path: 'compare/:type/:world', component: CompareComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'indexer/player/:key/:world/:id', redirectTo: 'invite/:key/player/:world/:id' }, // Rerouted to V2 invite
    { path: 'indexer/alliance/:key/:world/:id', redirectTo: 'invite/:key/alliance/:world/:id' }, // Rerouted to V2 invite
    { path: 'indexer/town/:key/:world/:id', redirectTo: 'invite/:key/town/:world/:id' }, // Rerouted to V2 invite
    { path: 'indexer/:invite_link', component: InviteComponent }, // Rerouted to V2 invite
    { path: 'indexer/action/:token', redirectTo: 'indexer' },  // Deprecated
    { path: 'invite/:invite_link', component: InviteComponent }, // V2 invite route
    { path: 'invite/:invite_link/:type/:world/:id', component: InviteComponent }, // Invite route to catch V1 redirects
    { path: 'link/:uid', component: InviteComponent }, // V2 userscript authentication
    { path: 'userscript', component: UserscriptComponent },
    // { path: 'siege/:id/:key', component: SiegeComponent },
    // { path: 'siege/:uid', component: SiegeComponent },
    { path: 'player/:world/:id', component: PlayerComponent },
    { path: 'player', component: PlayerComponent },
    { path: 'alliance/:world/:id', component: AllianceComponent },
    { path: 'alliance', component: AllianceComponent },
    { path: 'conquest/:type/:world/:id', component: ConquestComponent },
    { path: 'changes/:type/:world/:id', component: AllianceChangeComponent },
    { path: 'conquest', component: ConquestComponent },
    { path: 'discord', component: DiscordComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'test', component: ContentComponent },
    { path: '', component: ContentComponent },
    { path: '**', component: ContentComponent },
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
        PlayerOverviewDialog,
        ConquestDialog,
        AllianceOverviewDialog,
        PlayerComponent,
        AllianceComponent,
        AdvertorialComponent,
        BasicDialog,
        TownDialog,
        DisclaimerDialog,
        ContactDialog,
        BBDialog,
        NewIndexDialog,
        ImportIndexDialog,
        IndexSettingsDialog,
        IndexMembersDialog,
        ShareIndexDialog,
        IntelSourceDialog,
        ConquestReportDialog,
        SiegeListDialog,
        MailListDialog,
        WorldNamePipe,
        IndexNamePipe,
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
        FooterComponent,
        IndexTownComponent,
        IndexPlayerComponent,
        IndexAllianceComponent,
        IndexSearchComponent,
        ActionComponent,
        ConquestComponent,
        CompareComponent,
        CompareSnackbar,
        BasicSnackbar,
        MessageComponent,
        ChangelogComponent,
        AllianceChangeComponent,
        PrivacyComponent,
        IndexVersionComponent,
        DiscordComponent,
        FaqComponent,
        DonatedComponent,
        ProfileComponent,
        TableComponent,
        AnalyticsComponent,
        IntelComponent,
        SiegeComponent,
        IndexesComponent,
        SettingsComponent,
        LinkedAccountsComponent,
        DeleteAccountComponent,
        ChangePasswordComponent,
        UserscriptComponent,
        AlertComponent,
        BadgeComponent,
        PaperComponent,
        SidebarComponent,
        ShareComponent,
        LandingPageComponent,
        OverviewComponent,
        ConfirmComponent,
        ResetPasswordComponent,
        ConfirmDeleteComponent,
        InviteComponent,
        LoginRegisterComponent,
        BugReportComponent,
        IndexerBreadcrumbsComponent,
        PlayerActivityComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        MatChipsModule,
        MatPaginatorModule,
        FlexLayoutModule,
        MatTabsModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatButtonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        MatCardModule,
        MatListModule,
        MatDatepickerModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatSortModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        RecaptchaModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        HttpClientJsonpModule,
        UnitModule,
        ShareButtonsModule,
        SharedModule,
        MatMenuModule,
        MatSidenavModule,
    ],
    providers: [GoogleAnalyticsEventsService, Globals, SidenavService],
    bootstrap: [AppComponent],
    entryComponents: [
        BasicDialog,
        TownDialog,
        DisclaimerDialog,
        ContactDialog,
        NewIndexDialog,
        ImportIndexDialog,
        IndexSettingsDialog,
        IndexMembersDialog,
        ShareIndexDialog,
        IntelSourceDialog,
        BBDialog,
        ConquestReportDialog,
        BBScoreboardDialog,
        OverviewDialog,
        ConquestDialog,
        SiegeListDialog,
        MailListDialog,
        PlayerOverviewDialog,
        AllianceOverviewDialog,
        CompareSnackbar,
        BasicSnackbar,
    ],
})
export class AppModule {}
