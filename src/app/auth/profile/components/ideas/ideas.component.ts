import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getIdeas() {
    // Get all ideas
    // including dynamic status attributes for current uid: is_creator, vote_status (up, down, blank)
  }

  deleteIdea(id) {
    // deleting is only possible for ideas that were created by the current user in the past week
  }

  newIdea() {
    // Link to idea edit page (id=new)
    // Note: admin must approve the idea before it is visible for others
  }

  editIdea(id) {
    // Link to idea edit page (id=id)
  }

  voteIdea(id, vote=true) {
    // Upvote (vote=true) or downvote (vote=false) the idea
  }

  openIdea(id) {
    // Open the idea details in a new dialog
    // Dialog shows: idea title, description, images, votes, creator, date, feasibility comment from admin
    // Optional: idea dialog allows for comments from other users
  }

  // model: idea
  // id
  // title
  // description
  // images
  // created_by
  // created_on
  // updated_on
  // edited_on
  // is_approved
  // is_deleted

  // model: vote
  // id
  // idea_id
  // user_id
  // vote (true/false)

  // model: comment
  // id
  // idea_id
  // user_id
  // text
  // is_admin_comment

}
