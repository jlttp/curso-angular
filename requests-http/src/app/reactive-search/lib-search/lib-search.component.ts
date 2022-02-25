import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, tap, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-lib-search',
  templateUrl: './lib-search.component.html',
  styleUrls: ['./lib-search.component.scss']
})
export class LibSearchComponent implements OnInit {

  queryField = new FormControl();
  readonly SEARCH_URL = 'https://api.cdnjs.com/libraries';
  results$!: Observable<any>;
  total!: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSearch(){

    const fields = 'name,description,version,homepage';
    let value = this.queryField.value;

    if(value && (value = value.trim()) !== ''){

      const params_ = {
        search: value,
        fields: fields
      };

      //ou

      let params = new HttpParams();
      params = params.set('search', value);
      params = params.set('fields', fields);

      // this.results$ = this.http.get(`${this.SEARCH_URL}?fields=${fields}&search=${value}`)
      // .pipe(
      //   tap((res: any) => this.total = res.total),
      //   map(res => res.results)
      // );

      this.results$ = this.http
      .get(this.SEARCH_URL, { params })
      .pipe(
        tap((res: any) => this.total = res.total),
        map(res => res.results)
      );

    }

  }

}
