import { Component } from '@angular/core';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterService } from '../Service/register.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  result:any;

  constructor(private _dialog:MatDialog,private _service:RegisterService){}

  openAddForm(){
    const dialogRef=this._dialog.open(UserRegisterComponent);
    dialogRef.afterClosed().subscribe(response=>{
      if(response){
        this.getUserData();
      }
    });
  }

  getUserData(){
    this._service.getUserData().subscribe(res=>{
      console.log("data1", res);
        if (Array.isArray(res) && res.length > 0) {
          this.result = res[res.length - 1]; // Assigning the last item of the array 
        }
    })
  }
}
