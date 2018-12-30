import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IncomeService} from '../../../shared/services/income.service';
import {Income} from '../../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-income-form',
    templateUrl: './income-form.component.html',
    styleUrls: ['./income-form.component.css']
})
export class IncomeFormComponent implements OnInit {

    @Input('organizationId') organizationId: number
    @ViewChild('modal') modalRef: ElementRef
    @ViewChild('bcm') buttonCloseModal: ElementRef

    incomes: Income[] = []
    loading = false
    iform: FormGroup
    incomeId = null
    isE: boolean
    isS: boolean
    aMessage: string

    constructor(private incomeService: IncomeService) {
    }

    ngOnInit() {
        this.isE = false
        this.isS = false
        this.aMessage = ''

        this.iform = new FormGroup({
            currency: new FormControl(null, Validators.required),
            idate: new FormControl(null, Validators.required),
            ivalue: new FormControl(null, [Validators.required, Validators.min(1)]),
            cach: new FormControl(null, Validators.required),
            comments: new FormControl(null)
        })
        this.loading = true
        this.incomeService.fetch(this.organizationId).subscribe(incomes => {
            this.incomes = incomes
            this.loading = false
        })
    }

    onAddPosition() {
        this.incomeId = null
        this.resetForm()
    }

    onSelectIncome(income: Income) {
        this.incomeId = income.id
        this.iform.patchValue({
            currency: income.currency_id,
            cach: !income.cach ? 0 : 1,
            ivalue: income.value,
            idate: income.date,
            comments: income.comments
        })
    }

    resetForm() {
        this.iform.reset({currency_id: '', cach: '', value: '', date: '', comments: ''})
        this.isE = false
        this.isS = false
        this.aMessage = ''
    }

    onComplete() {
        this.isE = false
        this.isS = false
        this.aMessage = ''
    }

    onSubmit() {
        this.iform.disable()
        const newIncome: Income ={
            currency_id: this.iform.value.currency,
            cach: this.iform.value.cach,
            value: this.iform.value.ivalue,
            date: this.iform.value.idate,
            comments: this.iform.value.comments,
            organization_id: this.organizationId
        }

        if (this.incomeId) {
            newIncome.id = this.incomeId
            this.incomeService.update(newIncome).subscribe(
                income => {
                    const idx = this.incomes.findIndex(p => p.id === this.incomeId)
                    this.incomeService.getById(this.incomeId).subscribe(findIncome => {
                        this.incomes[idx] = findIncome
                    })
                    this.incomes.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
                    this.isE = false
                    this.isS = true
                    this.aMessage = 'Income update.'
                    this.iform.enable()
                },
                error => {
                    this.iform.enable()
                    this.isE = true
                    this.isS = false
                    this.aMessage = error.error.message
                },
                () => {
                    this.onComplete()
                }
            )
        } else {
            this.incomeService.create(newIncome).subscribe(
                income => {
                    this.isE = false
                    this.isS = true
                    this.aMessage = 'Income create.'
                    this.incomes.push(income)
                    this.incomes.sort((a, b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0))
                    this.iform.enable()
                },
                error => {
                    this.iform.enable()
                    this.isE = true
                    this.isS = false
                    this.aMessage = error.error.message
                },
                () => {
                    this.onComplete()
                }
            )
        }
    }

    onDeleteIncome(event: Event, income: Income) {
        event.stopPropagation()
        const decision = window.confirm(`You deleted income - "${income.value}"`)
        if (decision) {
            this.incomeService.delete(income).subscribe(
                response => {
                    const idx = this.incomes.findIndex(p => p.id === income.id)
                    this.incomes.splice(idx, 1)
                    this.isE = false
                    this.isS = true
                    this.aMessage = response
                },
                error => {
                    this.isE = true
                    this.isS = false
                    this.aMessage = error.error.message
                }
            )
        }
    }

}
