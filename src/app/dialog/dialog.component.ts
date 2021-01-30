import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor( private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
  }

  closeDialog(shouldClear: boolean): void {
    this.dialogRef.close(shouldClear);
  }
  

}
