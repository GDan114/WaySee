import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RotaGpsPage } from './rota-gps.page';

describe('RotaGpsPage', () => {
  let component: RotaGpsPage;
  let fixture: ComponentFixture<RotaGpsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RotaGpsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
