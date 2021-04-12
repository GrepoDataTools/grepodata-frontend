import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'basic-snack',
  templateUrl: "./basic-snackbar.component.html",
  styleUrls: ['./basic-snackbar.component.scss'],
})
export class BasicSnackbar {

  type = 'success'

  constructor(
    private snackBarRef: MatSnackBarRef<BasicSnackbar>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    if ('type' in data && data.type) {
      switch (data.type) {
        case 'info':
          this.type = 'info';
          break;
        case 'warning':
          this.type = 'warning';
          break;
        case 'error':
          this.type = 'error';
          break;
        case 'success':
        default:
          this.type = 'success';
      }
    }
  }

  hideSnackbar() {
    this.snackBarRef.dismiss();
  }

  selectIcon() {
    switch (this.type) {
      case 'error': return 'error';
      case 'info': return 'info';
      case 'success': return 'verified';
      case 'warning': return 'warning';
      default: return 'verified';
    }
  }

  customAction() {
    this.data.customActionCallback(this.data.customActionData);
  }
}
