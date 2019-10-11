import{ Injectable } from '@angular/core';
import {HttpClient,HttpResponse } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle} from './vehicle.type';

@Injectable()
export class BaseHttpService {

  constructor(private httpClient: HttpClient) {
  }

  baseUrl: string = "https://swapi.co/api/vehicles";
  nextUrl: string = "";

  getData() : Observable<Vehicle>{

    var url: string;
    if(this.nextUrl=="") url=this.baseUrl;
    else url=this.nextUrl;
    
    console.info("Calling get request at " + url); 

    console.log("Http Service: fetching data from API....");

      return this.httpClient
        .get<Vehicle>(url, { observe: 'response' })
        .pipe( map( 
          (res) => { 

            let map = this.getMappedData(res);

            //Get next URL
            this.nextUrl = map.get("next");
              //console.log("next" + JSON.stringify(next));
            
            //Get results from JSON
            var results = map.get("results");    
            //console.log("Array results " + JSON.stringify(results));
            
            var vehicles: Vehicle[];
            vehicles = new Array();

            for (var v in results ) {                   
              //console.log("Name v:"+  results[v]["name"]);
              var v = new Vehicle(<string>results[v]["name"],<string>results[v]["cost_in_credits"],<string>results[v]["length"]);
              vehicles.push(v); 
            }  

            // size is useful for pagination
            var size = results.size;
            //console.log("results:" + results.size);
          
            return vehicles;
      }));  

  }
/**
 * Extract Json string from response
 */
  getMappedData(res : HttpResponse<any>) {
    //console.log("Body : " +res.body); console.log("Body as headers : " + res.headers);
    //console.log("Body json string: " + JSON.stringify(res.body));

    let jsonObject = res.body;
    let map = new Map<string, any>()
    for (var value in jsonObject) {
      map.set(<string>value, jsonObject[value])
    }
    console.log("map:" + map.size);

    return map;
}

}