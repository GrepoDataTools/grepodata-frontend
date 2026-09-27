import { Injectable } from '@angular/core';
import { IconVariant } from '../icon/icon.directive';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface Separator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  mobileOnly: boolean;
  state: string;
  name: string;
  type: string;
  icon?: string;
  iconVariant?: IconVariant;
  external?: boolean;
  action?: string;
  active?: string;
  badge?: BadgeItem[];
  separator?: Separator[];
  children?: ChildrenItems[];
}

const MENU_ITEMS: Array<Menu> = [
  { mobileOnly: true, state: '', name: 'Statistics', type: 'separator' },
  { mobileOnly: true, state: 'points', name: 'Daily scoreboard', type: 'link', icon: 'chart-bar' },
  { mobileOnly: true, state: 'compare', name: 'Compare', type: 'link', icon: 'arrows-right-left' },
  { mobileOnly: true, state: 'ranking', name: 'Ranking', type: 'link', icon: 'trophy' },

  { mobileOnly: false, state: '', name: 'Indexer', type: 'separator' },
  { mobileOnly: false, state: 'profile/intel', name: 'My intel', type: 'link', icon: 'building-library', active: '/intel' },
  { mobileOnly: false, state: 'profile/teams', name: 'My teams', type: 'link', icon: 'user-group', active: '/teams' },
  { mobileOnly: false, state: 'profile/ops', name: 'Team Ops', type: 'link', icon: 'computer-desktop', active: '/ops' },
  { mobileOnly: false, state: 'profile/script', name: 'Userscript', type: 'link', icon: 'document-text' },

  { mobileOnly: false, state: '', name: 'Community', type: 'separator' },
  { mobileOnly: false, state: 'discord', name: 'Discord server', type: 'action', icon: 'discord', iconVariant: 'game', action: 'discord', external: true },
  { mobileOnly: false, state: 'donate', name: 'Donate', type: 'action', icon: 'heart', action: 'donate' },
  { mobileOnly: false, state: '/profile/bug', name: 'Report an issue', type: 'link', icon: 'bug-ant' },
  // { mobileOnly: false, state: '/profile/ideas', name: 'Idea board', type: 'link', icon: 'tips_and_updates'},
  { mobileOnly: false, state: '/profile/api', name: 'API documentation', type: 'link', icon: 'code-bracket' },

  { mobileOnly: false, state: '', name: 'Other', type: 'separator' },
  { mobileOnly: false, state: '/profile/changelog', name: 'Changelog', type: 'link', icon: 'newspaper' },
  {
    mobileOnly: false,
    state: 'profile/settings',
    name: 'My account',
    type: 'link',
    // type: 'sub',
    icon: 'cog-6-tooth',
    // children: [
    //     { state: 'password', name: 'Change password', type: 'link' },
    //     { state: 'delete', name: 'Delete account', type: 'link' },
    // ],
  },
  { mobileOnly: false, state: 'profile/faq', name: 'Help', type: 'link', icon: 'question-mark-circle' },
  {
    mobileOnly: false,
    state: 'profile/logout',
    name: 'Sign out',
    type: 'action',
    icon: 'power',
    action: 'logout',
  },
];

@Injectable()
export class MenuItems {
  getMenuItem(): Menu[] {
    return MENU_ITEMS;
  }
}
