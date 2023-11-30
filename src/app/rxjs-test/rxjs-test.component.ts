import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-rxjs-test',
  templateUrl: './rxjs-test.component.html',
  styleUrls: ['./rxjs-test.component.scss']
})
export class RxjsTestComponent {
  a$: BehaviorSubject<any> = new BehaviorSubject(null);
  b$: BehaviorSubject<any> = new BehaviorSubject(null);
  ab$: Observable<any> = combineLatest([
    this.a$,
    this.b$
  ]).pipe(
    map(([a, b]) => {
      console.log(a, b)

      return [a, b];
    })
  )

  @Input({ required:  true }) set a(value: any) {
    this.a$.next(value);
  }

  @Input({ required: true }) set b(value: any) {
    this.b$.next(value);
  }

  ngOnInit() {
    this.a$.subscribe(console.log);
    this.b$.subscribe(console.log);
    this.ab$.subscribe(console.log);
  }
}
