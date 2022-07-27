import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, NavController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BackButtonHandlerService {

  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private router: Router,
    private navCtrl: NavController
  ) {}

  init() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      if (url === '/scan' || url === '/login') {
        this.confirmExitApp();
      } else {
        this.navCtrl.back();
      }
    });
  }

  async confirmExitApp() {

    try {
      this.alertCtrl
        .getTop()
        .then((v) => (v ? this.alertCtrl.dismiss() : null));
    } catch (e) {}

    const alert = await this.alertCtrl.create({
      header: 'Exit App',
      message: 'Do you want to exit the app?',
      animated: true,
      translucent: true,
      backdropDismiss: false,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
        },
        {
          text: 'YES',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });

    await alert.present();
  }
}
