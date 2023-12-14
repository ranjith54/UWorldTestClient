import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss']
})
export class WarningDialogComponent {
  
  constructor(public dialogRef: MatDialogRef<WarningDialogComponent>,
    public dialog: MatDialog,){

  }

  public isWarningAccepted(isAccepted: boolean){
    this.dialogRef.close(isAccepted)
  }
}
