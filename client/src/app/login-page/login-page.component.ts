import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BootstrapService} from '../shared/classes/bootstrap.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

    myform: FormGroup
    aSub: Subscription
    isE: boolean
    isS: boolean
    aMessage: String

    constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.isE = false
        this.isS = false
        this.aMessage = ''
        this.myform = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.minLength(6)])
        })

        this.route.queryParams.subscribe((params: Params) => {
            if (params['registered']) {
                this.isS = true
                this.isE = false
                this.aMessage = 'You registered.'
            } else if (params['accessDenied']){
                this.isS = false
                this.isE = true
                this.aMessage = 'You unregistered.'
            } else if (params['sessionFailed']) {
                this.isS = false
                this.isE = true
                this.aMessage = 'Session is down.'
            }
        })
    }

    ngOnDestroy() {
        if (this.aSub) {
            this.aSub.unsubscribe()
        }
    }

    onSubmit() {
        this.myform.disable()

        this.aSub = this.auth.login(this.myform.value).subscribe(
            () => this.router.navigate(['/overview']),
            error => {
                this.isS = false
                this.isE = true
                this.aMessage = error.error.message
                this.myform.enable()
            }
        )
    }

}
