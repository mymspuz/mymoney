import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrganizationsService} from '../../shared/services/organizations.service';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Organization} from '../../shared/interfaces';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css']
})
export class OrganizationFormComponent implements OnInit {

    @ViewChild('input') inputRef: ElementRef
    form: FormGroup
    myimage: File
    imagePreview
    organization: Organization
    isNew = true
    isE: boolean
    isS: boolean
    aMessage: String

  constructor(private route: ActivatedRoute, private organizationService: OrganizationsService, private router: Router) { }

  ngOnInit() {

    this.isE = false
    this.isS = false
    this.aMessage = ''


    this.form = new FormGroup({
        name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params.pipe(

        switchMap(
            (params: Params) => {
                if (params['id']) {
                    this.isNew = false
                    return this.organizationService.getById(params['id'])
                }

                return of(null)
            }
        )
    )
        .subscribe(
            organization => {
                if (organization) {
                    this.organization = organization
                    this.form.patchValue({
                        name: organization.name
                    })
                    this.imagePreview = organization.image
                    this.myimage = organization.image
                }
                this.form.enable()
            },
            error => {
                this.isE = true
                this.isS = false
                this.aMessage = error.error.message
            }
        )
  }

  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {
        obs$ = this.organizationService.create(this.form.value.name, this.myimage)
    } else {
        obs$ = this.organizationService.update(this.organization.id, this.form.value.name, this.myimage)
    }

    obs$.subscribe(
        organization => {
            this.organization = organization
            this.isE = false
            this.isS = true
            this.aMessage = 'Organization saved.'
            this.isNew = false
            this.form.enable()
        },
        error => {
            this.isE = true
            this.isS = false
            this.aMessage = error.error.message
            this.form.enable()
        }
    )
  }

  triggerClick() {
      this.inputRef.nativeElement.click()
  }

  deleteOrganization() {
      const decision = window.confirm(`You deleted organization - "${this.organization.name}"`)
      if (decision) {
          this.organizationService.delete(this.organization.id)
              .subscribe(
                  response => {
                      this.isE = false
                      this.isS = true
                      this.aMessage = response
                  },
                  error => {
                      this.isE = true
                      this.isS = false
                      this.aMessage = error.error.message
                  },
                  () => this.router.navigate(['/organizations'])
              )
      }
  }

  onFileUpload(event: any) {
      const file = event.target.files[0]
      this.myimage = file

      const reader = new FileReader()
      reader.onload = () => {
          this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
  }

}
