import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  studentRecord;

  constructor(private router: Router) {
    if (router.getCurrentNavigation().extras.state) {
      this.studentRecord = this.router.getCurrentNavigation().extras.state?.studentInfo;
    }
  }

  close() {
    this.router.navigate(['/scan'])
  }

  setDefault(ev: any) {
    ev.target.src = '../../assets/default-photo.jpg'
  }

}
