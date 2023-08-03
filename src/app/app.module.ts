import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { RecaptchaModule } from 'ng-recaptcha';

import { RouterModule, Routes } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AdvertorialComponent } from './advertorial/advertorial.component';
import { AllianceComponent } from './alliance/alliance.component';
import {
    AppComponent,
    Datex,
    DiffFilter,
    DiffFilterNonZero,
    IndexDate,
    IndexNamePipe,
    NumberFilter,
    ValuesPipe,
    WorldNamePipe,
} from './app.component';
import { DisclaimerDialog, FooterComponent } from './footer/footer.component';
import { ContactDialog, HeaderComponent } from './header/header.component';
import {
    BBDialog,
    BBLossPipe,
    HideNoLossPipe,
    UnitIconPipe,
} from './indexer/utils';
import { PlayerComponent, TownDialog } from './player/player.component';
import { RankingComponent } from './ranking/ranking.component';
import {
    AllianceOverviewDialog,
    BBScoreboardDialog,
    OverviewDialog,
    PlayerOverviewDialog,
    ScoreboardComponent,
} from './scoreboard/scoreboard.component';
import { SearchComponent } from './search/search.component';

import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { AllianceChangeComponent } from './alliance-change/alliance-change.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { CompareComponent } from './compare/compare.component';
import { CompareSnackbar } from './compare/compare.service';
import { ConquestComponent } from './conquest/conquest.component';
import { IndexAllianceComponent } from './indexer/alliance/alliance.component';
import { IndexPlayerComponent } from './indexer/player/player.component';
import { IndexSearchComponent } from './indexer/search/search.component';
import { IndexTownComponent } from './indexer/town/town.component';
import { MessageComponent } from './message/message.component';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';

import { PlatformModule } from '@angular/cdk/platform';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import 'zone.js';
import { UnitModule } from './advertorial/unit/unit.module';
import { MailListDialog } from './alliance/alliance.service';
import { ConfirmDeleteComponent } from './auth/confirm-delete/confirm-delete.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { ApiComponent } from './auth/profile/components/api/api.component';
import { BugReportComponent } from './auth/profile/components/bug-report/bug-report.component';
import { ChangePasswordComponent } from './auth/profile/components/change-password/change-password.component';
import { DeleteAccountComponent } from './auth/profile/components/delete-account/delete-account.component';
import { IdeasComponent } from './auth/profile/components/ideas/ideas.component';
import { IndexesComponent } from './auth/profile/components/indexes/indexes.component';
import { IntelComponent } from './auth/profile/components/intel/intel.component';
import { LinkedAccountsComponent } from './auth/profile/components/linked-accounts/linked-accounts.component';
import { SettingsComponent } from './auth/profile/components/settings/settings.component';
import { UserscriptComponent } from './auth/profile/components/userscript/userscript.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { BlogComponent } from './blog/blog.component';
import { ScriptVersionComponent } from './changelog/script-version/script-version.component';
import { ConquestDialog } from './conquest/conquest.service';
import { DiscordComponent } from './discord/discord.component';
import { ServerAlertComponent } from './discord/server-alert/server-alert.component';
import { FaqComponent } from './faq/faq.component';
import { Globals } from './globals';
import { HomepageComponent } from './homepage/homepage.component';
import { IndexerUpdateComponent } from './homepage/indexer-update/indexer-update.component';
import { IndexVersionComponent } from './index-version/index-version.component';
import { AnalyticsComponent } from './indexer/analytics/analytics.component';
import { EventListComponent } from './indexer/event-list/event-list.component';
import { InviteComponent } from './indexer/invite/invite.component';
import { LandingPageComponent } from './indexer/landing-page/landing-page.component';
import { CommandsComponent } from './indexer/ops/commands/commands.component';
import { OpsHelpDialog } from './indexer/ops/help/help.component';
import { OpsIntelDialog } from './indexer/ops/intel-dialog/intel-dialog.component';
import { OperationsComponent } from './indexer/ops/operations/operations.component';
import { OverviewComponent } from './indexer/overview/overview.component';
import { ShareComponent } from './indexer/settings/share/share.component';
import { SiegeComponent } from './indexer/siege/siege.component';
import { ConquestReportDialog, SiegeListDialog } from './indexer/siege/siege.service';
import { TableComponent } from './indexer/table/table.component';
import { AlertComponent } from './layout/alert/alert.component';
import { BadgeComponent } from './layout/badge/badge.component';
import { IndexerBreadcrumbsComponent } from './layout/indexer-breadcrumbs/indexer-breadcrumbs.component';
import { PaperComponent } from './layout/paper/paper.component';
import { PlayerActivityComponent } from './layout/player-activity/player-activity.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidenavService } from './layout/sidebar/sidenav-service';
import { PrivacyComponent } from './privacy/privacy.component';
import { BasicDialog } from './shared/dialogs/basic/basic.component';
import { DonateDialog } from './shared/dialogs/donate/donate.component';
import { IndexMembersDialog } from './shared/dialogs/index-members/index-members.component';
import { IndexSettingsDialog } from './shared/dialogs/index-settings/index-settings.component';
import { IntelSourceDialog } from './shared/dialogs/intel-source/intel-source.component';
import { NewIndexDialog } from './shared/dialogs/new-index/new-index.component';
import { ShareIndexDialog } from './shared/dialogs/share-index/share-index.component';
import { SharedModule } from './shared/shared.module';
import { BasicSnackbar } from './shared/snackbar/basic-snackbar.component';

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
    { path: 'operations/:team/:world', component: CommandsComponent },
    { path: 'operations/:team/:world/:serialized_view', component: CommandsComponent },
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
    { path: 'blog', component: BlogComponent },
    { path: 'test', component: HomepageComponent },
    { path: '', component: HomepageComponent },
    { path: '**', component: HomepageComponent },
];

export function jwtTokenGetter(): any {
    return localStorage.getItem('access_token');
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
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
        DonateDialog,
        OpsHelpDialog,
        OpsIntelDialog,
        TownDialog,
        DisclaimerDialog,
        ContactDialog,
        BBDialog,
        NewIndexDialog,
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
        HomepageComponent,
        IndexerUpdateComponent,
        EventListComponent,
        ScriptVersionComponent,
        IdeasComponent,
        ApiComponent,
        BlogComponent,
        OperationsComponent,
        CommandsComponent,
        ServerAlertComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        MatChipsModule,
        NgMultiSelectDropDownModule,
        MatPaginatorModule,
        FlexLayoutModule,
        MatTabsModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatButtonModule,
        PlatformModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        MatDialogModule,
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
    bootstrap: [AppComponent]
})
export class AppModule {}
