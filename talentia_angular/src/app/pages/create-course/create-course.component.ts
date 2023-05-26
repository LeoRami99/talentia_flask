import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ISection } from "src/app/models/section.model";
@Component({
	selector: "app-create-course",
	templateUrl: "./create-course.component.html",
	styleUrls: ["./create-course.component.css"],
})
export class CreateCourseComponent {
	isAddSection = false;
  hintError = "Este campo es requerido";
  hintErrorLength = "Este campo debe tener al menos 3 caracteres";
	sections: ISection[] = [
		{
			headerTitle: "Course Overview",
			items: [],
		},
		{
			headerTitle: "Getting Started with Angular",
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
			headerTitle: "Creating and Communicating Between Angular Components",
			items: [
				{
					title: "Angular Components",
					url: "#",
					videoTiming: "04:23",
				},
			],
		},
		{
			headerTitle: "Exploring the Angular Template Syntax",
			items: [
				{
					title: "Template Syntax",
					url: "#",
					videoTiming: "04:23",
				},
			],
		},
	];

	newSection: ISection = {
		headerTitle: "",
		items: [],
	};
	titleSectionInput = new FormControl("", [
		Validators.required,
		Validators.minLength(3),
	]);
	newSubsectionForm = new FormGroup({
		title: new FormControl("", [Validators.required, Validators.minLength(3)]),
		url: new FormControl("", [Validators.required, Validators.minLength(3)]),
	});

	currentSubsectionIndex = -1;

	constructor() {

  }

	onAddSection() {
		console.log(this.newSection);
		if (this.titleSectionInput.valid) {
			this.newSection.headerTitle = this.titleSectionInput.value!;
			this.sections.push(this.newSection);
			this.newSection = {
				headerTitle: "",
				items: [],
			};
			this.titleSectionInput.reset();
		}
    document.getElementById("cancelAddNewSectionButton")?.click();
	}

	onAddSubSection() {
		if (this.newSubsectionForm.valid) {
			if (this.currentSubsectionIndex !== -1) {
				this.newSection.items[this.currentSubsectionIndex] = {
					title: this.newSubsectionForm.value.title!,
					url: this.newSubsectionForm.value.url!,
					videoTiming: "00:00",
				};
			} else {
				this.newSection.items.push({
					title: this.newSubsectionForm.value.title!,
					url: this.newSubsectionForm.value.url!,
					videoTiming: "00:00",
				});
			}
			this.newSubsectionForm.reset();
      this.currentSubsectionIndex = -1;
		}
	}

	onEditSubSection(index: number) {
		this.newSubsectionForm.setValue({
			title: this.newSection.items[index].title,
			url: this.newSection.items[index].url,
		});
		// this.newSection.items.splice(index, 1);
		this.currentSubsectionIndex = index;
	}
	onDeleteSubSection(index: number) {
		this.newSection.items.splice(index, 1);
	}
}
