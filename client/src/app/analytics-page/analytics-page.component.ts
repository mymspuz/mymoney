import {Component, OnInit} from '@angular/core';
import {OrganizationsService} from '../shared/services/organizations.service';
import {CoursCurrency, MyChar, OrganizationSumm, OrganizationYearSumm} from '../shared/interfaces';
import {AnalyticsService} from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements OnInit {

  organization: OrganizationSumm[] = []
  yearSumm: OrganizationYearSumm[] = []
  coursCurr: CoursCurrency[] = []

  barYears: MyChar = {}
  pieAlls: MyChar = {}
  lineCurrs: MyChar = {}

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
  ]

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
  ]

  constructor(private organizationService: OrganizationsService, private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {

    let bdataSet: Array<number> = []
    let bdataLabels: Array<string> = []

    let pdataSet: Array<number> = []
    let pdataLabels: Array<string> = []

    let ldataSetF: Array<number> = []
    let ldataSetS: Array<number> = []
    let ldataLabels: Array<string> = []

    this.organizationService.getAllOrganizationSumm().subscribe(
        org => {
            this.organization = org
            for(let i = 0; i < this.organization.length; i++) {
              pdataSet.push(this.organization[i].summa)
              pdataLabels.push(this.organization[i].name)
            }
            this.pieAlls.myDatasets  = [ { data: pdataSet } ]
            this.pieAlls.labels = pdataLabels
        }
    )

    this.analyticsService.getAllYear().subscribe(
        year => {
          this.yearSumm = year
          for (let i = 0; i < this.yearSumm.length; i++) {
            bdataSet.push(this.yearSumm[i].rub)
            bdataLabels.push(String(this.yearSumm[i].year))
          }
          this.barYears.myDatasets =  [{ data: bdataSet, label: 'rub/year' }];
          this.barYears.labels = bdataLabels;
        }
    )

    this.analyticsService.getAllCurr().subscribe(
        curr => {
          this.coursCurr = curr
          for (let i = 0; i < this.coursCurr.length; i++) {
            ldataSetF.push(this.coursCurr[i].usd)
            ldataSetS.push(this.coursCurr[i].eur)
            ldataLabels.push(this.coursCurr[i].date)
          }
          this.lineCurrs.myDatasets = [
            {data: ldataSetF, label: 'USD'},
            {data: ldataSetS, label: 'EUR'}
          ]
          this.lineCurrs.labels = ldataLabels
        }
    )

    this.barYears.myChartType = 'bar'
    this.pieAlls.myChartType = 'pie'
    this.lineCurrs.myChartType = 'line'

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
    this.pieAlls.options = {
      responsive: true
    };
    this.lineCurrs.options = {
      responsive: true
    };

    this.barYears.legend = true;
    this.pieAlls.legend = true;
    this.lineCurrs.legend = true;

  }

}
