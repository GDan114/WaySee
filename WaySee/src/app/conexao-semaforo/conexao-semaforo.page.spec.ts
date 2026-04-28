import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConexaoSemaforoPage } from './conexao-semaforo.page';

describe('ConexaoSemaforoPage', () => {
  let component: ConexaoSemaforoPage;
  let fixture: ComponentFixture<ConexaoSemaforoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConexaoSemaforoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
