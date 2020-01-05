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
  title = 'slippi-stats';
  API = environment.API;

  // Form Data
  files: File[];
  formData: FormData;
  configForm: FormGroup;

  slippiData: any;
  selectedOptions: any;

  constructor(private formBuilder: FormBuilder, 
              private http: HttpClient) {}
   
  ngOnInit() {
    this.formData = new FormData();
    this.configForm = this.formBuilder.group({
      options: new FormArray([])
    });
  }

  onFileSelect(event) {
    this.formData.delete('file');
    if (event.target.files.length > 0) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.formData.append('file', files[i]);
      }
    }
  }

  uploadFiles(){    
    this.http.post(this.API + '/uploadFiles', this.formData).subscribe(data => {
      this.slippiData = data;
      this.selectedOptions = [];
      this.addCheckboxes();
      this.generateSelectedOptions();
    });
  }

  addCheckboxes() {
    this.configForm.controls.options = new FormArray([]);

    const defaults = [0,3,4,8,9,11];
    this.slippiData.summary.forEach((item, i) => {
      const control = new FormControl(i);
      control.setValue(defaults.includes(i)? true : false);
      (this.configForm.controls.options as FormArray).push(control);
    });
  }

  generateSelectedOptions() {
    let selected = [];
    (this.configForm.controls.options as FormArray).controls.forEach((control, i) => {
      if (control.value === true) {
        selected.push(this.slippiData.summary[i]);
      }
    });
    this.selectedOptions = selected;
  }
}
