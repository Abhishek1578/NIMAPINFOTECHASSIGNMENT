import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { RegisterService } from '../Service/register.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit{

  registerForm!:FormGroup
  imageUrl!: string;
  selectedField!:string;
  imgPreview!:string;
  imageError!:string;
  defaultImage:string='assets/th.jpeg';
  result:any;



  constructor(private _fb:FormBuilder,
    private _service:RegisterService,
    @Inject(MAT_DIALOG_DATA)public data:any,
    private _dialodRef:MatDialogRef<UserRegisterComponent>,
    private _router:Router,
    private snackbar:MatSnackBar,
    private _http:HttpClient,
  ){
    // validation used for inputfield

    this.registerForm=_fb.group({
      image:['',[Validators.required]],
      dimensionsValid: [false],
      firstname:['',[Validators.required,Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]],
      lastname:['',[Validators.required,Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]+$/)]],
      email:['',[Validators.required,Validators.email]],
      phonenumber:['',[Validators.required, Validators.pattern(/^(\+\d{1,2}\s?)?((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/)]],
      age:['',[Validators.required]],
      country:['',[Validators.required]],
      state:['',[Validators.required]],
      address:['',Validators.required],
      add1:['',[Validators.required]],
      add2:['',[Validators.required]],
      tag:['',[Validators.required]],
      subscribe:['',[Validators.required]]
    });
  }

  ngOnInit(): void {

    // automatically fetch data in input field
      this.registerForm.patchValue(this.data);
        this.fetchImage(this.data.image);  
  }

  // this is for image to fetch data in input frame with specific width and height we are gave
  fetchImage(imageUrl: string): void {
    this._http.get(imageUrl, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imgPreview = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      (error) => {
        console.error('Error fetching image:', error);
      }
    );
  }

  // get All data from jsonserver file 
  getUserData(){
    this._service.getUserData().subscribe(res=>{
      console.log("data1", res);
        if (Array.isArray(res) && res.length > 0) {
          this.result = res[res.length - 1]; // Assigning the last item of the array 
        }
    },error=>{
      console.error("error during get data from json file",error);
    });
  }
  
  // this is submit button in this button have two button one is update and second is register button
  onFormSubmit(){
    if(this.registerForm.valid){
      // updated button
      if(this.data){
        this._service.updateUserData(this.data.id,this.registerForm.value).subscribe(response=>{
          console.log(response);
          this.snackbar.open("Updated Successfull...!",'ok',{
            duration:3000,
            verticalPosition:'top',
          })
          this._dialodRef.close(true);
        
        },error=>{
          console.error("error during adding value in json file",error);
        });
      }else{
        // register button
        this._service.addUserData(this.registerForm.value).subscribe(response=>{
          console.log(response);
          this.snackbar.open("Registration Successfull...!",'ok',{
            duration:3000,
            verticalPosition:'top',
          })
          this._router.navigate(['/profile']);
          this._dialodRef.close(true);
        },error=>{
          console.error("error during adding value in json file",error);
        });
      }
    }
  }


  //  this is matchips and we can say tags input field
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  edit(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();
    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }
    // Edit existing fruit
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits[index].name = value;
    }
  }


  // this is for input selector dependent
  countries = ['India', 'United States of America','Canada','Australia']; 
  states: { [key: string]: string[] } = {
    'India': ["Andhra Pradesh", "Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur", "Meghalaya","Mizoram", "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura", "Uttar Pradesh","Uttarakhand","West Bengal"],
    'United States of America': ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia","Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland","Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire","New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania","Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington","West Virginia", "Wisconsin", "Wyoming"],
    'Canada': ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario","Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"],
    'Australia': ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia","Tasmania", "Australian Capital Territory", "Northern Territory"],
  };

  // get country value
  get country() {
    return this.registerForm.get('country');
  }
// get state value 
  get state() {
    return this.registerForm.get('state');
  }
  onCountryChange() {
    // Reset state value when country changes
    this.state?.setValue(''); 
  }

  //this is for age 
  formatLabel(value: number):string {
    return value.toString();
  }

  
  // this is all code for image upload as bas64string and it's validation
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.validateImage(file);
  }

  // validation for image 
  validateImage(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        if (img.width === 310 && img.height === 325) {
          this.imgPreview = reader.result as string;
          this.imageError = '';
          this.convertToBase64(file);
        } else {
          this.imageError = 'Image must be 310x325 pixels.';
          this.clearPreview();
        }
      };
    };
  }

  // image converted into base64String 
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      this.registerForm.patchValue({image:reader.result});
      this.imgPreview = reader.result as string;
      console.log('Base64 image:', reader.result);
    };
  }

  clearPreview() {
    this.imgPreview = '';
  }

}
