import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../Service/register.service';
import { MatDialog } from '@angular/material/dialog';
import { UserRegisterComponent } from '../user-register/user-register.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  result!:any;
  constructor(private _service:RegisterService,private _dialog:MatDialog){}

ngOnInit(): void {
    this.getUserData();
}
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

  editProfile(data:any){
    const dialogRef=this._dialog.open(UserRegisterComponent,{
      data,
    });
    dialogRef.afterClosed().subscribe(response=>{
      if(response){
        this.getUserData();
      }
    });
  }
}
