export class Command {
  es_id: number;
  cmd_id: number;
  started_at: number;
  arrival_at: number;
  updated_at: number;
  eta: string;
  type: string;
  subtype: string;
  attacking_strategy: string;
  arrival_human: string;
  cancel_human: string;
  upload_uid: any;
  upload_n: string;
  src_twn_n: string;
  src_twn_id: string;
  src_ply_n: string;
  src_ply_id: string;
  src_all_n: string;
  src_all_id: string;
  return: boolean;
  trg_twn_n: string;
  trg_twn_id: string;
  trg_ply_n: string;
  trg_ply_id: string;
  trg_all_n: string;
  trg_all_id: string;
  units: any;
  comments: Comment[];
  show_comments: boolean;
  cancelable: boolean;
  hidden: boolean;
  is_planned: boolean;
  delete_status: string;
}

export class Comment {
  user: string
  time: string
  text: string
}

export class CommandView {
  version: string
  uuid: string
  is_default: boolean
  active: boolean
  tab_name: string
  name_changed: boolean
  is_filtered: boolean
  show_returns: boolean
  show_total_units: boolean
  showCancelTime: boolean
  showDeletedCommands: boolean
  hide_planned_commands: boolean
  hide_spam_commands: number
  command_type_toggle: any
  filter_order: string
  filter_text: string
  filter_town: any
  filter_player: any
  filter_uploader: any
  filter_town_type: string
  filter_player_type: string
  filter_uploader_type: string
}

// TODO: minify object
