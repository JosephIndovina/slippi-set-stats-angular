import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  private API = environment.API;
  public formData: FormData;
  public configForm: FormGroup;

  // Component objects and variables
  public slippiData: any;
  public selectedOptions: any;

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private storageService: StorageService) { }

  ngOnInit() {
    this.formData = new FormData();
    this.configForm = this.formBuilder.group({
      options: new FormArray([])
    });
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

  generateStats() {
    const selected = [];
    (this.configForm.controls.options as FormArray).controls.forEach((control, i) => {
      if (control.value === true) {
        selected.push(this.slippiData.summary[i]);
      }
    });
    this.selectedOptions = selected;
    this.storeItems();
  }

  storeItems() {
    this.storageService.store('slippiData', this.slippiData);
    this.storageService.store('selectedOptions', this.selectedOptions);
  }
}
