import { Component,  ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GetCourseService } from 'src/app/services/get-course/get-course.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
// import toastr
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-take-course',
  templateUrl: './take-course.component.html',
  styleUrls: ['./take-course.component.css']
})
export class TakeCourseComponent implements OnInit{
  constructor(private getCourseService: GetCourseService, private routeActive: ActivatedRoute, private toastr: ToastrService, private renderer: Renderer2, private el: ElementRef) {}
  curso: any = {};
  selectedSection: number = 0;
  onSectionClick(i: number): void {
    this.selectedSection = i;
    const element = this.el.nativeElement.querySelector(`#toc-content-${i+1}`);
    element.scrollIntoView({ behavior: 'smooth' });
  }
  ngOnInit(): void {
    this.routeActive.params.subscribe((params) => {
      this.getCourseService.getCourse(params['id']).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.curso = res.curso;
            // console.log(this.curso);
          } else {
            this.toastr.error('Error', 'Error');
            // console.log('Error');
          }
        },
        (error) => {
          this.toastr.error('Error no se puede obtener la información del curso', 'Error');
          // console.log(error);
        }
      )

    });

  }
//

}
