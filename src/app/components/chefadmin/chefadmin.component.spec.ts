import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefadminComponent } from './chefadmin.component';

describe('ChefadminComponent', () => {
  let component: ChefadminComponent;
  let fixture: ComponentFixture<ChefadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChefadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
