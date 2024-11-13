import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCrudComponent } from './document-crud.component';

describe('DocumentCrudComponent', () => {
  let component: DocumentCrudComponent;
  let fixture: ComponentFixture<DocumentCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
