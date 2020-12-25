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
    state: string;
    name: string;
    type: string;
    icon?: string | IconProp;
    iconType?: 'material' | 'fontawesome';
    action?: string;
    active?: string;
    badge?: BadgeItem[];
    separator?: Separator[];
    children?: ChildrenItems[];
}

const MENU_ITEMS: Array<Menu> = [
    { state: '', name: 'Indexer', type: 'separator', iconType: 'material' },
    // { state: 'profile/overview', name: 'Index overview', type: 'link', icon: 'list_alt', iconType: 'material' },
    { state: 'profile/intel', name: 'My intel', type: 'link', icon: 'remove_red_eye', iconType: 'material', active: '/intel' },
    { state: 'profile/indexes', name: 'My indexes', type: 'link', icon: 'account_balance', iconType: 'material', active: '/overview' },
    { state: 'profile/script', name: 'Userscript', type: 'link', icon: 'description' },
    { state: '', name: 'Account', type: 'separator', iconType: 'material' },
    { state: 'profile/linked', name: 'Linked accounts', type: 'link', icon: 'link', iconType: 'material' },
    { state: 'profile/discord', name: 'Link with Discord', type: 'link', icon: faDiscord, iconType: 'fontawesome' },
    {
        state: 'profile/settings',
        name: 'Settings',
        type: 'sub',
        icon: 'settings',
        children: [
            { state: 'password', name: 'Change password', type: 'link' },
            { state: 'delete', name: 'Delete account', type: 'link' },
        ],
    },
    { state: '', name: 'Other', type: 'separator', icon: 'person', iconType: 'material' },
    { state: 'profile/faq', name: 'Help', type: 'link', icon: 'av_timer', iconType: 'material' },
    {
        state: 'profile/logout',
        name: 'Log Out',
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
