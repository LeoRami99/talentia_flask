export interface ISection {
    headerTitle: string;
    descriptionSection: string;
    items: ISubsection[];
}


export interface ISubsection {
    title: string;
    url: string;
    descripcion: string;
    videoTiming?: string;
}
