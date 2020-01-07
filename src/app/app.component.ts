import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Global Constants
  private API = environment.API;

  // Component objects and variables
  public formData: FormData;
  public configForm: FormGroup;
  public slippiData: any;
  public selectedOptions: any;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient) {}

  ngOnInit() {
    this.formData = new FormData();
    this.configForm = this.formBuilder.group({
      options: new FormArray([])
    });
  }

  onFileSelect(event: any) {
    // Clear previously selected files
    this.formData.delete('file');

    // Append new files to formData
    if (event.target.files.length > 0) {
      const files = event.target.files;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < files.length; i++) {
        this.formData.append('file', files[i]);
      }
    }
  }

  onUploadFiles() {
    this.http.post(this.API + '/uploadFiles', this.formData).subscribe(data => {
      this.slippiData = data;
      this.generateCheckboxes();
      this.generateStats();
    });
  }

  generateCheckboxes() {
    // Reset Form
    this.selectedOptions = [];
    this.configForm.controls.options = new FormArray([]);

    // Auto-fill form with defaults
    const defaults = [0, 3, 4, 8, 9, 11];
    this.slippiData.summary.forEach((item, i) => {
      const control = new FormControl(i);
      control.setValue(defaults.includes(i) ? true : false);
      (this.configForm.controls.options as FormArray).push(control);
    });
  }

  generateStats() {
    const selected = [];
    (this.configForm.controls.options as FormArray).controls.forEach((control, i) => {
      if (control.value === true) {
        selected.push(this.slippiData.summary[i]);
      }
    });
    this.selectedOptions = selected;
  }

  getPlayerWins(playerNum: number) {
    return this.slippiData.games.reduce(((numWon, curVal) => {
      console.log(numWon, curVal);
      return curVal.players[playerNum].gameResult === 'winner' ? numWon + 1 : numWon;
    }), 0);
  }
}
