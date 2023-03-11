export class Command {
  es_id: number;
  cmd_id: number;
  started_at: number;
  arrival_at: number;
  updated_at: number;
  eta: string;
  type: string;
  arrival_human: string;
  cancel_human: string;
  upload_uid: any;
  upload_n: string;
  src_twn_n: string;
  src_twn_id: string;
  src_ply_n: string;
  src_ply_id: string;
  return: boolean;
  trg_twn_n: string;
  trg_twn_id: string;
  trg_ply_n: string;
  trg_ply_id: string;
  units: any;
  comments: Comment[];
  show_comments: boolean;
  cancelable: boolean;
  hidden: boolean;
  delete_status: string;
}

export class Comment {
  user: string
  time: string
  text: string
}

// TODO: minify object
