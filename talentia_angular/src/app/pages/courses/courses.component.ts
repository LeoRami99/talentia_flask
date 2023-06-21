import { Component, OnInit } from '@angular/core';
import { CursosPreviewService } from '../../services/cursos-preview/cursos-preview.service';
import { CategoriasService } from '../../services/categorias/categorias.service';

interface Curso {
  id: number;
  titulo: string;
  description: string;
  imagen_card: string;
  dificultad: string;
  estado: number;
  categoria: string;
}

@Component({
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  pageData: { [categoria: string]: number } = {}; // Objeto para almacenar las páginas actuales por categoría
  pageSize: number = 8;
  selectedCategory: string = '';
  filterText: string = '';
  lista_curso: Curso[] = [];
  categorias: any[] = [];

  autocompleteSuggestions: string[] = [];
  loadingCursos: boolean = false;

  constructor(
    private cursos: CursosPreviewService,
    private categoria: CategoriasService
  ) {}

  onPageChange(pageNumber: number, categoria: string) {
    this.pageData[categoria] = pageNumber; // Actualizar la página actual para la categoría correspondiente
  }

  ngOnInit() {
    this.categoria.getCategorias().subscribe((data: any) => {
      this.categorias = data.categorias;
      this.initPageData(); // Inicializar las páginas actuales para cada categoría
    });

    this.cursos.getCursos().subscribe((data: any) => {
      this.lista_curso = data.cursos;
    });
  }

  initPageData() {
    for (let categoria of this.categorias) {
      this.pageData[categoria.nombre] = 1; // Inicializar la página actual en 1 para cada categoría
    }
  }

  get filteredCursos() {
    if (this.selectedCategory === '') {
      return this.lista_curso.filter((curso) =>
        curso.titulo.toLowerCase().includes(this.filterText.toLowerCase()) && curso.estado === 1
      );
    } else {
      return this.lista_curso.filter(
        (curso) =>
          curso.categoria === this.selectedCategory &&
          curso.titulo.toLowerCase().includes(this.filterText.toLowerCase()) &&
          curso.estado === 1
      );
    }
  }

  filteredCursosByCategoria(categoria: string) {
    const cursosFiltrados = this.filteredCursos.filter(
      (curso) => curso.categoria === categoria && curso.estado === 1
    );
    return cursosFiltrados;
  }


  generateAutocompleteSuggestions() {
    this.loadingCursos = true;

    // Realizar la lógica de búsqueda y filtrado de cursos aquí
    const searchText = this.filterText.toLowerCase();

    // Filtrar los cursos por texto de búsqueda y categoría seleccionada
    const filteredCursos = this.lista_curso.filter((curso) => {
      const titulo = curso.titulo.toLowerCase();
      const categoria = curso.categoria.toLowerCase();

      // Verificar si el título del curso contiene el texto de búsqueda y si la categoría coincide con la categoría seleccionada
      return (
        titulo.includes(searchText) &&
        (this.selectedCategory === '' ||
          categoria === this.selectedCategory.toLowerCase())
      );
    });

    // Establecer los cursos filtrados en la variable autocompleteSuggestions
    this.autocompleteSuggestions = filteredCursos.map((curso) => curso.titulo);

    // Simular una demora de 1 segundo para mostrar la carga
    setTimeout(() => {
      // Una vez completada la búsqueda y filtrado, establecer loadingCursos a false
      this.loadingCursos = false;
    }, 1000);
  }
}
