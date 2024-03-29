import { Injectable } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

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
  icon?: string | IconProp;
  iconType?: 'material' | 'fontawesome' | 'unicode';
  action?: string;
  active?: string;
  badge?: BadgeItem[];
  separator?: Separator[];
  children?: ChildrenItems[];
}

const MENU_ITEMS: Array<Menu> = [
  { mobileOnly: true, state: '', name: 'Statistics', type: 'separator', iconType: 'material'},
  { mobileOnly: true, state: 'points', name: 'Daily Scoreboard', type: 'link', icon: 'insights', iconType: 'material' },
  { mobileOnly: true, state: 'compare', name: 'Compare', type: 'link', icon: 'compare_arrows', iconType: 'material' },
  { mobileOnly: true, state: 'ranking', name: 'Ranking', type: 'link', icon: 'list', iconType: 'material' },

  { mobileOnly: false, state: '', name: 'Indexer', type: 'separator', iconType: 'material' },
  { mobileOnly: false, state: 'profile/intel', name: 'My intel', type: 'link', icon: 'account_balance', iconType: 'material', active: '/intel' },
  { mobileOnly: false, state: 'profile/teams', name: 'My teams', type: 'link', icon: 'group', iconType: 'material', active: '/teams' },
  { mobileOnly: false, state: 'profile/ops', name: 'Team Ops', type: 'link', icon: 'airplay', iconType: 'material', active: '/ops' },
  { mobileOnly: false, state: 'profile/script', name: 'Userscript', type: 'link', icon: 'description' },

  { mobileOnly: false, state: '', name: 'Community', type: 'separator', icon: ''},
  { mobileOnly: false, state: 'discord', name: 'Discord Server', type: 'action', icon: 'discord', action: 'discord', iconType: 'material'},
  { mobileOnly: false, state: 'donate', name: 'Donate', type: 'action', icon: '🚀', action: 'donate', iconType: 'unicode'},
  { mobileOnly: false, state: '/profile/bug', name: 'Report an issue', type: 'link', icon: '🐞', iconType: 'unicode' },
  // { mobileOnly: false, state: '/profile/ideas', name: 'Idea board', type: 'link', icon: 'tips_and_updates'},
  { mobileOnly: false, state: '/profile/api', name: 'API documentation', type: 'link', icon: '📜', iconType: 'unicode'},

  { mobileOnly: false, state: '', name: 'Other', type: 'separator', icon: '' },
  { mobileOnly: false, state: '/profile/changelog', name: 'Changelog', type: 'link', icon: 'description'},
  {
    mobileOnly: false,
    state: 'profile/settings',
    name: 'My account',
    type: 'link',
    // type: 'sub',
    icon: 'settings',
    // children: [
    //     { state: 'password', name: 'Change password', type: 'link' },
    //     { state: 'delete', name: 'Delete account', type: 'link' },
    // ],
  },
  { mobileOnly: false, state: 'profile/faq', name: 'Help', type: 'link', icon: 'help_outline', iconType: 'material' },
  {
    mobileOnly: false,
    state: 'profile/logout',
    name: 'Sign Out',
    type: 'action',
    icon: 'power_settings_new',
    action: 'logout',
    iconType: 'material',
  },
];

@Injectable()
export class MenuItems {
  getMenuItem(): Menu[] {
    return MENU_ITEMS;
  }
}
