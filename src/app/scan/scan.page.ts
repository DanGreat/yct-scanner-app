import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { take, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  scanActive: boolean = false;

  constructor(private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private router: Router,
              private http: HttpClient,
              private toastController: ToastController) { }

  ngOnInit() {
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        //The QR content will come out here
        //Handle the data as your heart desires here
        this.verifyStudent(result.content)
      } else {
        this.presentAlert('Empty!', 'No data found from your scan')
      }
    } else {
      this.presentAlert('Permission!', 'You do not have the permission to perform a scan')
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    this.stopScanner()
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        // {
        //   text: 'Cancel',
        //   role: 'cancel',
        // },
        {
          text: 'OK',
          role: 'confirm',
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 5000
    });

    await toast.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Verifying Student...',
    });
    
    loading.present();
  }


  verifyStudent(matricNo) {
    const pattern = new RegExp('([a-zA-Z]{1}/[a-zA-Z]{2}/[0-9]{2}/[0-9]{7})$');

    if(!pattern.test(matricNo)) {
      this.presentToast('Cannot verify, Invalid Format of Matric No')
      return
    }
    
    this.showLoading()

    const token = localStorage.getItem('token');
    this.http.get(`https://studenthostelapp.herokuapp.com/student/?search=${matricNo}`,
      { 
        headers: new HttpHeaders({
                  Authorization: `Token ${token}`,
                })
      })
      .pipe(
        distinctUntilChanged(),
        take(1)
      )
    .subscribe({
      next: (data: any) => {
        this.loadingCtrl.dismiss()

        const studentInfo = data?.results[0];
        this.presentToast('Student Verified')
        this.router.navigate(['/home'], {
          state: { studentInfo }
        })
      },
      error: (err) => {
        console.log('Errr performing verification');
        this.loadingCtrl.dismiss()
      }
    })
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/login'])
  }

}
