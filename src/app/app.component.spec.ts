import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`pressNum`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.pressNum('7')
    expect(app.input).toContain('7')
    app.pressNum('.')
    expect(app.input).toContain('.')    
    app.input = ''
    expect(app.input).toEqual('')
    app.pressNum('0')
    app.input = ''
    expect(app.input).toEqual('')
    app.input = '23.5'
    app.pressNum('.')
    expect(app.input).toEqual('23.5')
  });

  it(`getLastOperand`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input = '3/15'
    expect(app.getLastOperand()).toEqual('15')
    app.input = '3-15'
    expect(app.getLastOperand()).toEqual('15')
    app.input = '15*3'
    expect(app.getLastOperand()).toEqual('3')
  });

  it(`pressOperator`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input('2')
    app.pressOperator('-')
    expect(app.input).toEqual('2-')
    app.input('3+')
    app.pressOperator('+')
    expect(app.input).toEqual('3+')
    app.input('50/')
    app.pressOperator('/')
    expect(app.input).toEqual('50/')
    app.input('123')
    app.pressOperator('*')
    expect(app.input).toEqual('123*')
  });

  it(`clear`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.clear()
    expect(app.input).toEqual('0')
    app.input('1')
    app.clear()
    expect(app.input).toEqual('0')
    app.input('2+2')
    app.clear()
    expect(app.input).toEqual('2+')
  });

  it(`allClear `, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.result = '3';
    app.allClear();
    expect(app.result).toEqual('0');
  });

  it(`calcAnswer`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input = '11+2'
    app.calcAnswer()
    expect(app.result.toString()).toEqual('13')
    app.input = '2.5+2.'
    app.calcAnswer()
    expect(app.result.toString()).toEqual('4.5')
    app.input = '1+1-'
    app.calcAnswer()
    expect(app.result.toString()).toEqual('2')
  });

  it(`getAnswer`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.input = '15*10'
    app.getAnswer()
    expect(app.input).toEqual(app.result)
    app.input = '0'
    app.getAnswer()
    expect(app.input).toEqual('')
  });

});
