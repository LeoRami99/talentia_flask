import { Component, OnInit } from '@angular/core';
import { CursosPreviewService} from '../../services/cursos-preview.service'

@Component({
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit{
  constructor(private cursos: CursosPreviewService){}

  lista_curso: any[] = []
  ngOnInit(){
    this.cursos.getCursos().subscribe((data:any)=>{
      this.lista_curso = data.cursos
    })
  }

}
