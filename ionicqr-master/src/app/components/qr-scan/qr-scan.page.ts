import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router,
    ) { }
  scannedData: any;
  encodedData: '';
  encodeData: any;
  inputData: any;
  ngOnInit() {

  }
  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData;
      if(this.scannedData.user == "colbun@colbun.cl" && this.scannedData.password == "123456"){
        this.router.navigate(['informacion-cargador'])
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

}
