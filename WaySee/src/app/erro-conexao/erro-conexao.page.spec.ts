import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErroConexaoPage } from './erro-conexao.page';

describe('ErroConexaoPage', () => {
  let component: ErroConexaoPage;
  let fixture: ComponentFixture<ErroConexaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErroConexaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
