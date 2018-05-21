import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Contact Manager';


  constructor(private http: HttpClient) {

  }


  ngOnInit() {
    this.http.get('http://google.com')
      .subscribe(res => {
        console.log(res);
      });
  }


}
