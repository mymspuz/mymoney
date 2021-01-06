import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit, OnDestroy {

  myform: FormGroup
  aSub: Subscription
  isE: boolean
  isS: boolean
  aMessage: String

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
      this.isE = false
      this.isS = false
      this.aMessage = ''
      this.myform = new FormGroup({
          fname: new FormControl(null, [Validators.required]),
          lname: new FormControl(null, [Validators.required]),
          logname: new FormControl(null, [Validators.required]),
          email: new FormControl(null, [Validators.required, Validators.email]),
          gender: new FormControl(null, [Validators.required]),
          password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
          cpassword: new FormControl(null, [Validators.required, Validators.minLength(6), ])
      })

  }
  ngOnDestroy() {
      if (this.aSub) {
          this.aSub.unsubscribe()
      }
  }

  onSubmit() {
      this.myform.disable()

      this.aSub = this.auth.register(this.myform.value).subscribe(
          () => this.router.navigate(['/login'], {
            queryParams: {
              registered: true
            }
          }),
          error => {
              this.isS = false
              this.isE = true
              this.aMessage = error.error.message
              this.myform.enable()
          }
      )
  }

}
