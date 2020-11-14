import { Injectable } from '@angular/core';

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
    icon?: string;
    action?: string;
    badge?: BadgeItem[];
    separator?: Separator[];
    children?: ChildrenItems[];
}

const MENU_ITEMS: Array<Menu> = [
    { state: '', name: 'Indexer', type: 'separator' },
    { state: 'profile/overview', name: 'Overview', type: 'link', icon: 'list_alt' },
    { state: 'profile/intel', name: 'Intel', type: 'link', icon: 'info_outline' },
    { state: 'profile/linked', name: 'Linked accounts', type: 'link', icon: 'link' },
    { state: 'profile/indexes', name: 'My alliances', type: 'link', icon: 'format_italic' },
    { state: 'profile/script', name: 'Userscript', type: 'link', icon: 'description' },
    { state: '', name: 'Account', type: 'separator' },
    { state: 'profile/discord', name: 'Link with Discord', type: 'link', icon: '' },
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
    { state: '', name: 'How to use', type: 'separator', icon: 'person' },
    { state: 'profile/faq', name: 'Help', type: 'link', icon: 'av_timer' },
    { state: 'profile/logout', name: 'Log Out', type: 'link', icon: 'power_settings_new', action: 'logout' },
];

@Injectable()
export class MenuItems {
    getMenuItem(): Menu[] {
        return MENU_ITEMS;
    }
}
