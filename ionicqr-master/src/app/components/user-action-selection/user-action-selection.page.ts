import { Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CargadorServiceService } from '../../services/cargador-service.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MapsAPILoader } from '@agm/core';
import { ModalController } from '@ionic/angular';
import { ListaCargadoresComponent } from '../lista-cargadores/lista-cargadores.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-user-action-selection',
  templateUrl: './user-action-selection.page.html',
  styleUrls: ['./user-action-selection.page.scss'],
  providers: [Geolocation]
})
export class UserActionSelectionPage implements OnInit {
  cargadores;

  tokenPayload;
  user_id;
  usuarioNormal;
  scannedData;

  @ViewChild('listaCargadores') listaCargadoresModal;

  //MY LOCATION
  latitude;
  longitude;
  getAddress;
  zoom;
  defaultZoom = 18;
  currentLocation;

  currLat;
  currLon;


  directionOrigin;
  directionDestination;

  keepCentered;

  markerIcon: any = {
    url: "../../assets/img/iconoMapaCargador.png",
    scaledSize: {
      width: 20,
      height: 30
    }
  }

 
  mapStyle: any = [
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]
  constructor(
    private jwtHelper: JwtHelperService,
    private cargadorService: CargadorServiceService,
    private router: Router,
    private auth: AuthService,
    private barcodeScanner: BarcodeScanner,
    private storage: StorageService,
    private apiloader: MapsAPILoader,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private mapsAPILoader: MapsAPILoader,
  ) { }

  async ngOnInit() {
    this.zoom = this.defaultZoom;
    const token: any = localStorage.getItem('access_token');
    this.tokenPayload = this.jwtHelper.decodeToken(token);
    this.user_id = this.tokenPayload.user_id;
    if (this.tokenPayload.user_id == 54 || this.tokenPayload.user_id == 55) {//main user o admin
      this.usuarioNormal = false;
    } else {//usuario normal
      this.usuarioNormal = true;
    }
    this.getCurrentLocation();
    //this.setModal();
    this.getCargadores();


  }
  async showCargadoresModal() {
    const modal = await this.modalCtrl.create({
      component: ListaCargadoresComponent,
    });

    await modal.present();
  }
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('');
  }
  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedData = barcodeData;
      let cargador = this.cargadores.find(x => { return x.id == this.scannedData.text });
      if (cargador) {
        this.router.navigate(['/informacion-cargador'], {
          state: {
            data: cargador
          }
        });
      } else {
        //ver que hacer cuando no ahya un id cargador en el qr
      }
    }).catch(err => {
      console.error('Error', err);
    });
  }
  centerCurrentLocation() {
    this.keepCentered = !this.keepCentered;
    this.zoom = this.defaultZoom;
    if (this.keepCentered) {
      this.keepCenteredFnc();
    }
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
      console.error('Error getting location', error);
    });
  }
  getCurrentLocation() {


    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
      console.error('Error getting location', error);
    });
    this.keepCenteredFnc();
    return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getAddress = (this.latitude, this.longitude)
          this.apiloader.load().then(() => {
            let geocoder = new google.maps.Geocoder;
            let latlng = {
              lat: this.latitude,
              lng: this.longitude
            };
            geocoder.geocode({
              'location': latlng
            }, function (results) {
              if (results[0]) {
                let currentLocation = results[0].formatted_address;
              } else {
                console.error('Not found');
              }
            });
          });
        }
      })
    }
  }
  keepCenteredFnc() {
    let watch = this.geolocation.watchPosition();

    let watchingOBV = watch.subscribe((data: any) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      this.currLat = data.coords.latitude;
      this.currLon = data.coords.longitude;

      if (!this.keepCentered) {
        watchingOBV.unsubscribe();
      }
    });
  }

  getCargadores() {
    this.cargadorService.fullCargadoresPorEmpresa({ empresas_id: this.tokenPayload.empresas_id }).subscribe(result => {
      this.cargadores = result;


    })
  }
  onMapReady(map) {
    console.log('maap',map);
    
    var myStyles = [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];
    map.setOptions({
      zoomControl: 'false',
      /* zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        style: google.maps.ZoomControlStyle.DEFAULT
      }, */
      styles: myStyles
    });

  }
  seleccionCargadores(data) {
    this.router.navigate(['/informacion-cargador'], {
      state: {
        data
      }
    });
  }
}
