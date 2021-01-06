import {Component, OnInit} from '@angular/core';
import {OrganizationsService} from '../shared/services/organizations.service';
import {
  CoursCurrency,
  MyChar,
  OrganizationSumm,
  OrganizationYearSumm,
  OrganizationMonthSumm,
  Organization,
  TypeCash
} from '../shared/interfaces';
import {AnalyticsService} from '../shared/services/analytics.service';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements OnInit {

  selectOrganization = new FormControl('-1');
  selectCurrency = new FormControl('-1');

  selectOrganizationMonth = new FormControl('-1');
  selectCurrencyMonth = new FormControl('-1');
  selectMinValue = new FormControl('100000');

  organizations$: Observable<Organization[]>;

  organization: OrganizationSumm[] = [];
  yearSumm: OrganizationYearSumm[] = [];
  coursCurr: CoursCurrency[] = [];
  monthSumm: OrganizationMonthSumm[] = [];
  typeCash: TypeCash[] = [];

  barYears: MyChar = {};
  barMonths: MyChar = {};
  pieAlls: MyChar = {};
  lineCurrs: MyChar = {};
  stackedTypeCash: MyChar = {};

  bdataSet: Array<number> = [];
  bdataLabels: Array<string> = [];

  bmdataSet: Array<number> = [];
  bmdataLabels: Array<string> = [];

  abackgroundColor: Array<string> = [
    '#F7464A',
    '#46BFBD',
    '#FDB45C',
    '#949FB1',
    '#4D5360',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];

  ahoverBackgroundColor: Array<string> = [
    '#FF5A5E',
    '#5AD3D1',
    '#FFC870',
    '#A8B3C5',
    '#616774',
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  constructor(private organizationService: OrganizationsService, private analyticsService: AnalyticsService) {
  }

  allYears(oid: string, cid: string): void {
    this.bdataSet = [];
    this.bdataLabels = [];
    let tVal = 0;
    let nameCur = '';
    this.analyticsService.getAllYear(oid).subscribe(
      year => {
        this.yearSumm = year;
        for (let i = 0; i < this.yearSumm.length; i++) {
          switch (cid) {
            case '1':
              tVal = this.yearSumm[i].usd;
              nameCur = 'usd';
              break;
            case '2':
              tVal = this.yearSumm[i].eur;
              nameCur = 'eur';
              break;
            default:
              tVal = this.yearSumm[i].rub;
              nameCur = 'rub';
          }
          this.bdataSet.push(tVal);
          this.bdataLabels.push(String(this.yearSumm[i].year));
        }
        this.barYears.myDatasets =  [{ data: this.bdataSet, label: `${nameCur}/year` }];
        this.barYears.labels = this.bdataLabels;
      }
    );
  }

  allMonth(oid: string, cid: string, mvalue: string): void {
    this.bmdataSet = [];
    this.bmdataLabels = [];
    let nameCur = '';
    let tVal = 0;
    this.analyticsService.getAllMonth(oid).subscribe(
      month_year => {
        this.monthSumm = month_year;
        for (let i = 0; i < this.monthSumm.length; i++) {
          switch (cid) {
            case '1':
              tVal = this.monthSumm[i].usd;
              nameCur = 'usd';
              break;
            case '2':
              tVal = this.monthSumm[i].eur;
              nameCur = 'eur';
              break;
            default:
              tVal = this.monthSumm[i].rub;
              nameCur = 'rub';
          }
          this.bmdataSet.push(tVal);
          this.bmdataLabels.push(String(this.monthSumm[i].month_year));
        }

        const myMin = Math.min.apply(null, this.bmdataSet);
        const myMax = Math.max.apply(null, this.bmdataSet);
        this.barMonths.myDatasets =  [{ data: this.bmdataSet, label: `${nameCur}/month` }];
        this.barMonths.labels = this.bmdataLabels;
        const backC = [];
        const borderC = [];
        for (let i = 0; i < this.bmdataSet.length; i++) {
          if (this.bmdataSet[i] === myMin) {
            backC.push('#F7464A');
            borderC.push('#FF5A5E');
          } else if (this.bmdataSet[i] === myMax) {
            backC.push('rgba(153, 102, 255, 1)');
            borderC.push('rgba(153, 102, 255, 0.2)');
          } else if (this.bmdataSet[i] < +mvalue) {
            backC.push('#46BFBD');
            borderC.push('#5AD3D1');
          } else {
            backC.push('#FDB45C');
            borderC.push('#FFC870');
          }
        }
        this.barMonths.colors = [
          {
            backgroundColor: backC,
            borderColor: borderC,
            borderWidth: 2,
          }
        ];
      }
    );
  }

  ngOnInit(): void {

    this.organizations$ = this.organizationService.fetch();

    let qpOrgId = '-1';
    let qpCurId = '-1';
    let qpOrgIdMonth = '-1';
    let qpCurIdMonth = '-1';
    let minValue = '10';

    const pdataSet: Array<number> = [];
    const pdataLabels: Array<string> = [];

    const stackDataSetCash: Array<number> = [];
    const stackDataSetCard: Array<number> = [];
    const stackLabels: Array<string> = [];

    const ldataSetF: Array<number> = [];
    const ldataSetS: Array<number> = [];
    const ldataLabels: Array<string> = [];

    this.selectOrganization.valueChanges.subscribe((value: any) => {
      qpOrgId = value;
      this.allYears(qpOrgId, qpCurId);
    });

    this.selectCurrency.valueChanges.subscribe((value: any) => {
      qpCurId = value;
      this.allYears(qpOrgId, qpCurId);
    });

    this.selectOrganizationMonth.valueChanges.subscribe((value: any) => {
      qpOrgIdMonth = value;
      this.allMonth(qpOrgIdMonth, qpCurIdMonth, minValue);
    });

    this.selectCurrencyMonth.valueChanges.subscribe((value: any) => {
      qpCurIdMonth = value;
      this.allMonth(qpOrgIdMonth, qpCurIdMonth, minValue);
    });

    this.selectMinValue.valueChanges.subscribe((value: any) => {
      minValue = value;
      this.allMonth(qpOrgIdMonth, qpCurIdMonth, minValue);
    });

    this.analyticsService.getTypeCash().subscribe(
        tcash => {
            this.typeCash = tcash;
            for (let i = 0; i < this.typeCash.length; i++) {
              stackDataSetCash.push(this.typeCash[i].cash);
              stackDataSetCard.push(this.typeCash[i].card);
              stackLabels.push(String(this.typeCash[i].year));
            }
            this.stackedTypeCash.myDatasets = [
              { data: stackDataSetCash, label: 'cash' },
              { data: stackDataSetCard, label: 'card' }
            ];
            this.stackedTypeCash.labels = stackLabels;
        }
    )

    this.organizationService.getAllOrganizationSumm().subscribe(
        org => {
            this.organization = org;
            for (let i = 0; i < this.organization.length; i++) {
              pdataSet.push(this.organization[i].summa);
              pdataLabels.push(this.organization[i].name);
            }
            this.pieAlls.myDatasets  = [ { data: pdataSet } ];
            this.pieAlls.labels = pdataLabels;
        }
    );

    this.allYears(qpOrgId, qpCurId);

    this.allMonth(qpOrgIdMonth, qpCurIdMonth, '100000');

    this.analyticsService.getAllCurr().subscribe(
        curr => {
          this.coursCurr = curr;
          for (let i = 0; i < this.coursCurr.length; i++) {
            ldataSetF.push(this.coursCurr[i].usd);
            ldataSetS.push(this.coursCurr[i].eur);
            ldataLabels.push(this.coursCurr[i].date);
          }
          this.lineCurrs.myDatasets = [
            {data: ldataSetF, label: 'USD'},
            {data: ldataSetS, label: 'EUR'}
          ];
          this.lineCurrs.labels = ldataLabels;
        }
    );

    this.barYears.myChartType = 'bar';
    this.barMonths.myChartType = 'bar';
    this.pieAlls.myChartType = 'pie';
    this.lineCurrs.myChartType = 'line';
    this.stackedTypeCash.myChartType = 'bar'

    this.barYears.colors = [
      {
        backgroundColor: this.abackgroundColor,
        borderColor: this.ahoverBackgroundColor,
        borderWidth: 2,
      }
    ];

    this.pieAlls.colors = [
      {
        backgroundColor: this.abackgroundColor,
        borderColor: this.ahoverBackgroundColor,
        borderWidth: 2,
      }
    ];

    this.stackedTypeCash.colors = [
      {
        backgroundColor: this.abackgroundColor,
        borderColor: this.ahoverBackgroundColor,
        borderWidth: 2,
      },
      {
        backgroundColor: 'rgba(0, 137, 132, .2)',
        borderColor: 'rgba(0, 10, 130, .7)',
        borderWidth: 2,
      }
    ];

    this.lineCurrs.colors = [
      {
        backgroundColor: 'rgba(105, 0, 132, .2)',
        borderColor: 'rgba(200, 99, 132, .7)',
        borderWidth: 2,
      },
      {
        backgroundColor: 'rgba(0, 137, 132, .2)',
        borderColor: 'rgba(0, 10, 130, .7)',
        borderWidth: 2,
      }
    ];

    this.barYears.options = {
      responsive: true
    };
    this.barMonths.options = {
      responsive: true
    };
    this.pieAlls.options = {
      responsive: true
    };
    this.lineCurrs.options = {
      responsive: true
    };
    this.stackedTypeCash.options = {
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [
          {
            stacked: true
          }
        ]
      }
    };

    this.barYears.legend = true;
    this.barMonths.legend = true;
    this.pieAlls.legend = true;
    this.lineCurrs.legend = true;
    this.stackedTypeCash.legend = true;

  }

}
