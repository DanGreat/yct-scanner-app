import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  paylaod = {
    email: '',
    password: ''
  }

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient) { }

  ngOnInit() {
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Authenticating...',
    });
    
    loading.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 5000
    });

    await toast.present();
  }


  login() {
    if(!this.paylaod.email && !this.paylaod.password) {
      this.presentToast('Please fill in your credentials')
      return
    }

    this.showLoading()
    
    this.http.post(`https://studenthostelapp.herokuapp.com/login/`, this.paylaod)
    .subscribe({
      next: (data: any) => {
        console.log('Login: ', data);
        this.loadingCtrl.dismiss()
        if(data?.token) {
          localStorage.setItem('token', data?.token)
          this.router.navigate(['/scan'])
        }
      },
      error: (err) => {
        console.log('Errr performing verification');
        this.loadingCtrl.dismiss()
      }
    })
  }


}
