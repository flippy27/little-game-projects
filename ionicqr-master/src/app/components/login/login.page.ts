import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { globalApi } from '../../global';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/User';
import { Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers:[ScreenOrientation,AndroidFullScreen]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  tknInfo;
  errrrr;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private platform: Platform,
    private storageS:StorageService,
    private screenOrientation: ScreenOrientation,
    private androidFullScreen: AndroidFullScreen,
  ) {

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.androidFullScreen.isImmersiveModeSupported()
    .then(() => console.log('Immersive mode supported'))
    .catch(err => console.log(err));
   }
  ionViewDidEnter() {
    document.addEventListener("backbutton",function(e) {
      console.log("disable back button")
    }, false);
  }
  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['user_colbun@dhemax.cl', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['colbun.2021', Validators.required]
    });
    if (this.auth.loggedIn()) {

      this.redirectByUser();

    }
  }
  submit(user: User) {
    /* if (this.loginForm.invalid) {

      this.utils.showSnackBar('Credenciales Incorrectas', 'red-snackbar');
      return;
    } */

    //this.reloading = true; // Para esconder el cuadro de login, ya que por alguna razon, se queda pegado mientras recarga ¯\_(ツ)_/¯

    //this.mostrarLoading();
    user.email = user.email.toLowerCase().trim();
    this.auth.login(user.email, user.password)
      .pipe(first())
      .subscribe(

        async (res) => {

          await this.redirectByUser();

          location.reload()
        },
        (err) => {
          console.error(err);
          this.errrrr = err;
          location.reload()
        }
      );
  }
  redirectByUser() {
    
    let token;

   
    token = localStorage.getItem('access_token');
    this.tknInfo = this.auth.jwtHelper.decodeToken(token);
    
    this.router.navigate(['/user-action-selection']);
  }
  registroUsuario(){
    
  }
}
