import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CardPreviewComponent } from './card-preview.component';
import { CrearProgresoService } from 'src/app/services/crear-progreos/crear-progreso.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { of, throwError } from 'rxjs';

describe('CardPreviewComponent', () => {
  let component: CardPreviewComponent;
  let fixture: ComponentFixture<CardPreviewComponent>;

  let mockCrearProgresoService = {
    verificarProgreso: jasmine.createSpy('verificarProgreso').and.returnValue(of({ data: {} })),
    createProgreso: jasmine.createSpy('createProgreso').and.returnValue(of({}))
  };

  let mockUserDataService = {
    dataUsuario: jasmine.createSpy('dataUsuario').and.returnValue(of({ data: {} }))
  };

  let mockToastrService = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardPreviewComponent],
      providers: [
        { provide: CrearProgresoService, useValue: mockCrearProgresoService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: UserDataService, useValue: mockUserDataService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user data on ngOnInit', () => {
    component.ngOnInit();
    expect(mockUserDataService.dataUsuario).toHaveBeenCalled();
  });

  it('should handle user data error', () => {
    mockUserDataService.dataUsuario.and.returnValue(throwError('error'));
    component.ngOnInit();
    expect(mockToastrService.error).toHaveBeenCalledWith('Error no se puede obtener la información del usuario', 'Error');
  });

  it('should create progress', fakeAsync(() => {
    component.crearProgresoCurso('user-id', 'course-id');
    tick(1000);
    expect(mockCrearProgresoService.createProgreso).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/take-lesson/' + component.id]);
  }));

  it('should handle create progress error', () => {
    mockCrearProgresoService.createProgreso.and.returnValue(throwError('error'));
    component.crearProgresoCurso('user-id', 'course-id');
    expect(mockToastrService.error).toHaveBeenCalledWith('Error no se puede crear tu progreso', 'Error');
  });
});
