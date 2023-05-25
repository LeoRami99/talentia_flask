import { Component } from "@angular/core";
@Component({
	selector: "app-create-course",
	templateUrl: "./create-course.component.html",
	styleUrls: ["./create-course.component.css"],
})
export class CreateCourseComponent {


  isAddSection = false;

	sections = [
		{
			HeaderTitle: "Course Overview",
			items: [
			],
		},
		{
			HeaderTitle: "Getting Started with Angular",
			items: [
				{
					title: "Introduction to TypeScript",
					url: "#",
					videoTiming: "50m 13s",
				},
				{
					title: "Comparing Angular to AngularJS",
					url: "#",
					videoTiming: "12m 10s",
				},
				{
					title: "Quiz: Getting Started With Angular",
					url: "#",
					videoTiming: "",
				},
			],
		},
		{
			HeaderTitle: "Creating and Communicating Between Angular Components",
			items: [
				{
					title: "Angular Components",
					url: "#",
					videoTiming: "04:23",
				},

			],
		},
		{
			HeaderTitle: "Exploring the Angular Template Syntax",
			items: [
				{
					title: "Template Syntax",
					url: "#",
					videoTiming: "04:23",
				},

			],
		},
	];

	constructor() {
setInterval(() => {
  console.log(this.isAddSection);
}, 2000);
  }
  onAddSectionChange(){
  }
}
