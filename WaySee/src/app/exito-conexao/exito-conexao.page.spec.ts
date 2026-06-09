import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExitoConexaoPage } from './exito-conexao.page';

describe('ExitoConexaoPage', () => {
  let component: ExitoConexaoPage;
  let fixture: ComponentFixture<ExitoConexaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitoConexaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
